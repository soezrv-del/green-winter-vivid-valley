#!/bin/sh
set -eu
cd /workspace
LOG=/tmp/app-startup.log
PORT=8080
HEALTH="http://127.0.0.1:${PORT}/"

if curl -sf -o /dev/null --max-time 2 "$HEALTH"; then
  exit 0
fi

if [ -f /workspace/.env ]; then
  set -a
  . /workspace/.env
  set +a
fi

echo "---- $(date -u +%Y-%m-%dT%H:%M:%SZ) starting npm run dev ----" >>"$LOG"
npm run dev >>"$LOG" 2>&1 &
i=0
while [ "$i" -lt 40 ]; do
  if curl -sf -o /dev/null --max-time 2 "$HEALTH"; then
    exit 0
  fi
  i=$((i + 1))
  sleep 0.5
done
exit 0
