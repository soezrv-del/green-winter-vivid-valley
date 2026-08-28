#!/usr/bin/env node
/**
 * Deploy-time database migrator (optional).
 *
 * Auth/DB stack was removed from the client app; this remains for future
 * DATABASE_URL deploys. Without `pg` installed or DATABASE_URL, it no-ops.
 */
import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.log(
    "[migrate] DATABASE_URL not set — skipping (no DB in this build).",
  );
  process.exit(0);
}

let pg;
try {
  pg = (await import("pg")).default;
} catch {
  console.log(
    "[migrate] `pg` package not installed — skipping migrations.",
  );
  process.exit(0);
}

const migrationsDir = join(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  "migrations",
);

async function main() {
  const pool = new pg.Pool({ connectionString: databaseUrl, max: 1 });
  const client = await pool.connect();
  try {
    await client.query(
      "CREATE TABLE IF NOT EXISTS _migrations (name TEXT PRIMARY KEY, applied_at TIMESTAMPTZ NOT NULL DEFAULT now())",
    );
    const applied = new Set(
      (await client.query("SELECT name FROM _migrations")).rows.map(
        (r) => r.name,
      ),
    );

    let files;
    try {
      files = (await readdir(migrationsDir))
        .filter((f) => f.endsWith(".sql"))
        .sort();
    } catch {
      console.log("[migrate] no migrations/ directory — done.");
      return;
    }

    for (const name of files) {
      if (applied.has(name)) continue;
      const sql = await readFile(join(migrationsDir, name), "utf8");
      await client.query("BEGIN");
      try {
        await client.query(sql);
        await client.query("INSERT INTO _migrations (name) VALUES ($1)", [
          name,
        ]);
        await client.query("COMMIT");
        console.log("[migrate] applied", name);
      } catch (e) {
        await client.query("ROLLBACK");
        throw e;
      }
    }
    console.log("[migrate] up to date");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((err) => {
  console.error("[migrate] failed:", err);
  process.exit(1);
});
