#!/usr/bin/env bash
set -Eeuo pipefail
umask 077
APP_DIR=${APP_DIR:?Set APP_DIR to the deployed work-orders checkout}
BACKUP_DIR=${BACKUP_DIR:?Set BACKUP_DIR to a private backup filesystem}
RETENTION_DAYS=${RETENTION_DAYS:-30}
if [[ ! "$RETENTION_DAYS" =~ ^[0-9]+$ ]] || (( RETENTION_DAYS < 7 || RETENTION_DAYS > 3650 )); then echo "Invalid RETENTION_DAYS" >&2; exit 2; fi
if [[ ! -f "$APP_DIR/compose.yaml" ]]; then echo "Deployment directory missing compose.yaml" >&2; exit 2; fi
mkdir -p "$BACKUP_DIR"
BACKUP_DIR=$(realpath "$BACKUP_DIR")
if [[ "$BACKUP_DIR" == "$APP_DIR/public" || "$BACKUP_DIR" == "$APP_DIR/public/"* ]]; then echo "Never store backups below public/" >&2; exit 2; fi
cd "$APP_DIR"
exec 9>"$BACKUP_DIR/.backup.lock"
flock -n 9 || { echo "Another backup is running"; exit 0; }
stamp=$(date -u +%Y%m%dT%H%M%SZ)
file="work-orders-$stamp.sqlite"
container_path="/data/backups/$file"
temp="$BACKUP_DIR/.$file.partial"
cleanup(){ rm -f "$temp"; docker compose exec -T app node -e "require('fs').rmSync(process.argv[1],{force:true})" "$container_path" >/dev/null 2>&1 || true; }
trap cleanup EXIT
docker compose exec -T app node scripts/backup.cjs --out "$container_path"
docker compose cp "app:$container_path" "$temp"
test -s "$temp"
chmod 600 "$temp"
mv "$temp" "$BACKUP_DIR/$file"
sha256sum "$BACKUP_DIR/$file" > "$BACKUP_DIR/$file.sha256"
chmod 600 "$BACKUP_DIR/$file.sha256"
find "$BACKUP_DIR" -maxdepth 1 -type f -name 'work-orders-????????T??????Z.sqlite' -mtime +"$RETENTION_DAYS" -delete
find "$BACKUP_DIR" -maxdepth 1 -type f -name 'work-orders-????????T??????Z.sqlite.sha256' -mtime +"$RETENTION_DAYS" -delete
echo "Backup verified and copied to a private directory: $file"
