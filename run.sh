#!/bin/bash
set -euxo pipefail

# Restore the database if it does not already exist.
if [ -f /app/codex.sqlite ]; then
    echo "Database already exists, skipping restore"
else
    echo "No database found, restoring from replica if exists"
    litestream restore
fi

if [ -f /app/codex.sqlite ]; then
    sqlite3 /app/codex.sqlite
fi

# Run litestream with your app as the subprocess.
exec litestream replicate
