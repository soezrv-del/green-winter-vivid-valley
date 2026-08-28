/**
 * Database bootstrap shim.
 *
 * Auth/DB stack is not required for the client RV app. Vite's configureServer
 * plugin still loads this module and awaits `ensureDbReady` before accepting
 * traffic — keep a no-op export so the live preview can start.
 */

let ready: Promise<void> | null = null;

export function ensureDbReady(): Promise<void> {
  if (!ready) {
    ready = Promise.resolve();
  }
  return ready;
}

// Kick on import (production path mentioned in vite.config).
void ensureDbReady();
