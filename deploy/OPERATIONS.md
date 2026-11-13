# Deployment template: one Node process, SQLite and Caddy HTTPS

These files are deployment scaffolding, not evidence of a hosting deployment. The application and SQLite HTTP tests ran on Node 24.22.1. Docker and Caddy are unavailable in the development workspace, so image construction, container volume ownership, Compose startup, DNS, firewall rules, public TLS issuance and a real restart/restore on a deployment host still need verification.

The template uses the official Node 24.22.3 Bookworm slim image and a Python build stage to generate the central PWA from source. The final image contains runtime server code, domain engines and generated public files; it contains no demo database or production credentials. The app runs as the `node` user with a read-only root filesystem and a persistent writable `/data` volume. Only Caddy publishes host ports. The app has one private backend network and no public port.

## Prepare and start on the chosen host

1. Install Docker Engine and the Docker Compose plugin. Point the real hostname's DNS to the host and make TCP ports 80 and 443 available; UDP 443 is optional for HTTP/3. The template expects Caddy to be the first public proxy, without an unconfigured CDN in front of it.
2. Copy `.env.example` to `.env`, set the real `DOMAIN` and `ACME_EMAIL`, and keep `.env` out of Git. `APP_ORIGIN` is built as `https://DOMAIN`; it must match the browser's origin exactly. Review and pin container image digests under the deployment host's update policy.
3. Validate the resolved Compose configuration, build and start:

```sh
docker compose config
docker compose build --pull
docker compose up -d
docker compose ps
docker compose logs --tail=100 app caddy
```

4. Create the initial production platform owner explicitly. The command reads a password from stdin; no default account is created. Supply the password through a private stdin source and do not put it in a shell argument, a checked-in file or `.env`:

```sh
docker compose exec -T app node scripts/create-owner.cjs --email platform@example.com --name 'مالك المنصة' --password-stdin
```

5. Open the HTTPS hostname, sign in, provision a tenant, create a tenant account and confirm a real command and anonymous review. Verify that restarting the app keeps the tenant state and accounts. Verify that direct external connections to port 3000 fail.

Caddy automatically manages HTTPS for a suitable public hostname when its validation requirements are met. Its `/data` and `/config` named volumes preserve certificate and configuration state across container replacement. The `app_data` volume preserves the SQLite database, WAL and idempotency records. Do not use `docker compose down -v` during normal updates; that command deletes these volumes.

## Client addresses and rate limits

`TRUST_PROXY=true` is enabled only inside this template because the app is reachable only by the controlled Caddy proxy. Caddy's default reverse proxy behavior sets forwarded client-address headers and rejects untrusted inbound values. The app uses the last valid `X-Forwarded-For` address for its rate limits only when this setting is explicitly enabled. Outside this isolated topology, leave it false unless an operator has secured and configured the proxy path. Do not publish the app port while trusting arbitrary forwarded headers.

This deployment runs one Node process for the database. Do not scale app replicas or mount the live SQLite volume over network storage. In-process rate-limit counters reset after restart; sessions, tenant status, credentials, state, audit and command idempotency remain in SQLite. This template does not configure email, password recovery, monitoring, a CDN, high availability or a managed backup schedule.

## Back up and update

Use SQLite's backup API while the app is running, then copy the private snapshot off the application volume:

```sh
docker compose exec -T app node scripts/backup.cjs --out /data/backups/work-orders-2026-11-13.sqlite
mkdir -p backups
docker compose cp app:/data/backups/work-orders-2026-11-13.sqlite ./backups/work-orders-2026-11-13.sqlite
chmod 600 ./backups/work-orders-2026-11-13.sqlite
```

The filename is an example; choose a new filename each time. The CLI refuses to overwrite an existing destination, creates a consistent snapshot including committed WAL data, and runs an integrity check. Full snapshots contain all tenants, password hashes and sessions. Keep encrypted off-host copies and test restore separately. The tenant API JSON export is domain data only and does not replace this full backup.

For an update, take and verify a backup, retrieve the reviewed source version, rebuild and recreate the app without deleting volumes. Preserve the old image and source revision until checks pass. Stop the application before restoring a database snapshot, preserve the current database for rollback and remove stale WAL/SHM companions belonging to the stopped database before restarting. Follow the detailed backup and restore procedure in `server/README.md`.

## Official references consulted

- Official Node image and supported variants: https://github.com/nodejs/docker-node and https://github.com/docker-library/official-images/blob/master/library/node .
- Docker Compose service settings: https://docs.docker.com/reference/compose-file/services/ .
- Compose required-variable interpolation: https://docs.docker.com/compose/how-tos/environment-variables/variable-interpolation/ .
- Caddy Compose setup and persistent `/data` and `/config`: https://caddyserver.com/docs/running .
- Caddy automatic HTTPS requirements: https://caddyserver.com/docs/automatic-https .
- Caddy reverse proxy header handling: https://caddyserver.com/docs/caddyfile/directives/reverse_proxy .

## Scheduled backups on a production host

The repository also includes a host-side backup runner, which is **not automatically activated** by checking out the repository. It uses the existing verified SQLite backup API and copies each resulting snapshot out of the container to a private host path.

1. Deploy the app and confirm the SQLite volume persists after restart.
2. Make a private directory on a dedicated backup filesystem; ideally mount a separate off-host storage destination. A directory on the same VPS is not disaster recovery.
3. Store `APP_DIR=/opt/work-orders`, `BACKUP_DIR=/path/to/private/backup/drive`, and `RETENTION_DAYS=30` in `/etc/work-orders/backup.env`; protect the file and directory from public access.
4. Set `deploy/backup-schedule.sh` executable and install the systemd service and timer files into `/etc/systemd/system/`; adjust their paths if your deployment lives elsewhere.
5. Run `sudo systemctl daemon-reload`, `sudo systemctl enable --now work-orders-backup.timer`, then run `sudo systemctl start work-orders-backup.service` and inspect journal logs. Verify the copied SQLite file on an **isolated restoration environment** before accepting it.
6. The job runs daily and prunes named backup files only after a successful new copy, with a seven-day minimum retention. Keep off-site copies and separate encryption at rest.

The separate subscription scanner can be enabled with `deploy/work-orders-subscription-alerts.service` and `deploy/work-orders-subscription-alerts.timer` after setting `DB_PATH=/data/work-orders.sqlite` **only when the scanner runs inside the container**; when running on the host use a private, readable SQLite database snapshot instead. It prints a private operator report and does not send WhatsApp automatically or change subscription dates.

### Public HTTPS pre-launch check

From an external machine, run `node scripts/deployment-smoke.cjs https://your-order-domain`. It checks RTL app, manifest, two customer proof pages and that unauthenticated API state/session calls return 401. It cannot test end-to-end login or restore data.
