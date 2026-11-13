#!/bin/sh
set -eu
# Railway mounts its persistent volume at runtime, after image build.
# Fix only this private data directory before dropping root privileges.
if [ "$(id -u)" -eq 0 ]; then
  mkdir -p /data
  chown -R node:node /data
  chmod 700 /data
  exec gosu node "$@"
fi
exec "$@"
