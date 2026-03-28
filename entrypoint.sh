#!/bin/sh
set -e

# ── PostgreSQL ────────────────────────────────────────────────────────────────

echo "[*] Initializing PostgreSQL..."
if [ ! -f /var/lib/postgresql/data/PG_VERSION ]; then
    su -s /bin/sh postgres -c "initdb -D /var/lib/postgresql/data"
fi

su -s /bin/sh postgres -c \
  "pg_ctl -D /var/lib/postgresql/data \
           -o '-c config_file=/etc/postgresql/postgresql.conf' \
           -l /var/lib/postgresql/logfile start"

echo "[*] Waiting for PostgreSQL to be ready..."
until su -s /bin/sh postgres -c "pg_isready -h 127.0.0.1 -p 5432" >/dev/null 2>&1; do
    sleep 1
done

# ── Provisioning DB ───────────────────────────────────────────────────────────

echo "[*] Provisioning database..."
su -s /bin/sh postgres -c "psql -tc \
  \"SELECT 1 FROM pg_roles WHERE rolname='aether'\" | grep -q 1 \
  || psql -c \"CREATE USER aether WITH PASSWORD '${DB_PASSWORD}' SUPERUSER;\""

su -s /bin/sh postgres -c "psql -tc \
  \"SELECT 1 FROM pg_database WHERE datname='etheria_account'\" | grep -q 1 \
  || psql -c \"CREATE DATABASE etheria_account OWNER aether;\""

# ── Migrations Prisma ─────────────────────────────────────────────────────────

echo "[*] Running Prisma migrations..."
# On utilise le CLI copié depuis node_modules — pas besoin de npm/npx global
DATABASE_URL="postgresql://aether:${DB_PASSWORD}@127.0.0.1:5432/etheria_account" \
  node /app/node_modules/prisma/build/index.js migrate deploy \
    --schema=/app/prisma/schema.prisma

echo "[+] Migrations applied."

# ── Go API ────────────────────────────────────────────────────────────────────

echo "[*] Starting Go API on :8080..."
cd /app/server
./etheriatimes-api &
API_PID=$!

# ── Next.js ───────────────────────────────────────────────────────────────────

echo "[*] Starting Next.js on :3000..."
cd /app
PORT=3000 node server.js &
NEXT_PID=$!

echo "[+] All services running — PG | API($API_PID) | Next($NEXT_PID)"

# ── Graceful shutdown ─────────────────────────────────────────────────────────

cleanup() {
    echo "[*] Shutting down gracefully..."
    kill "$API_PID" "$NEXT_PID" 2>/dev/null
    su -s /bin/sh postgres -c \
      "pg_ctl -D /var/lib/postgresql/data stop -m fast" 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

wait "$API_PID" "$NEXT_PID"