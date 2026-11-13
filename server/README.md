# Central server operations

Requires Node.js 24.22 or later with built-in `node:sqlite`; there are no runtime npm dependencies. Run the build from the repository root before serving `public/`.

## First production owner

The production server never creates default credentials or sample tenants. Create a platform owner explicitly using a password supplied through stdin:

```sh
node scripts/create-owner.cjs --db /private/work-orders.sqlite --email platform@example.com --name 'مالك المنصة' --password-stdin
```

The command reads the password from stdin. Use a password manager or private input source; passwords must contain at least 12 characters. `PLATFORM_OWNER_EMAIL`, `PLATFORM_OWNER_NAME`, `PLATFORM_OWNER_PASSWORD`, and `DB_PATH` are supported for controlled provisioning environments. A duplicate email is rejected and never resets an existing account.

Start behind an HTTPS reverse proxy:

```sh
DB_PATH=/private/work-orders.sqlite APP_ORIGIN=https://orders.example.com HOST=127.0.0.1 PORT=3000 node server/main.cjs
```

`APP_ORIGIN` must match the browser's real origin exactly. `PUBLIC_DIR` defaults to the repository's `public/`. `SECURE_COOKIES=true` forces Secure cookies; an HTTPS origin also enables them. `SESSION_HOURS` defaults to 12. Sessions use opaque random tokens, stored as hashes, with HttpOnly and SameSite=Lax cookies. State-changing requests require a trusted Origin, JSON, and a session CSRF token except login and anonymous review submission. Login and public review submissions are rate limited.

The SQLite database uses WAL, foreign keys and immediate transactions. Store the data directory outside the public document root on durable storage. Run one Node process per database; the API and state updates are synchronous SQLite transactions with optimistic tenant revisions.

## Backup and restore

Use the SQLite backup API instead of copying a live database file alone. It captures a consistent snapshot including committed WAL data while the application continues running:

```sh
node scripts/backup.cjs --db /private/work-orders.sqlite --out /private/backups/work-orders-2026-11-13.sqlite
```

The destination must be new, outside `public/`, and different from the source. The command writes with mode `0600`, runs `PRAGMA integrity_check`, refuses to overwrite an existing backup, and prints no credentials. `DB_PATH` and `BACKUP_PATH` may provide the two paths.

A full database backup contains every tenant, account password hashes, sessions, audit events, revisions and idempotency records. Keep it in private storage with an appropriate retention policy and encrypted off-device copies. This command does not encrypt or schedule backups. Tenant `GET /api/backup` exports only that tenant's domain state and excludes accounts/sessions; it is useful for domain data export but is not a full service recovery backup.

To restore a full snapshot, stop the Node service, preserve the current database for rollback, replace the database at `DB_PATH` with the verified snapshot, and remove any stale `-wal`/`-shm` companions from the stopped database before restarting. Keep the database and directory private. Revoke restored sessions when required by the recovery procedure. Test restoration into a separate database and verify login/state before replacing production.

## Development fixture

```sh
PORT=4173 APP_ORIGIN=http://127.0.0.1:4173 node scripts/dev.cjs
```

This explicitly creates an isolated `data/development.sqlite` database, or `DEV_DB_PATH`. It refuses to use `DB_PATH` or the default production database as its development destination. It creates a sample tenant and the original sample workflow only once; restarting preserves edits.

- Platform: `platform@demo.local` / `PlatformDemo!2026`.
- Tenant owner: `owner@demo.local` / `ArtPlusDemo!2026`.
- Tenant staff: `manager1@demo.local`, `emp1@demo.local`, `emp2@demo.local`, `emp3@demo.local`, `buyer@demo.local`, all using `ArtPlusDemo!2026`.

These are explicit development-only credentials. The production launcher and owner CLI never load them. Set `APP_ORIGIN` to the actual browser origin if using a proxied preview.

## API operational details

`createApplication({dbPath,publicDir,origin,secureCookies,sessionHours,bootstrapOwner})` exports `{handler,close,store}`. `bootstrapOwner` is an explicit test/provisioning hook containing `{email,password,name}`; it is never supplied automatically by production startup.

Command requests are keyed by tenant, account and request ID. Reusing an ID with changed actions or base revision returns 409. Repeating the same request returns current sanitized state and its current `revision`, original sanitized `results`, `appliedRevision` for the first successful transaction, and `replayed:true`. A fresh request returns `replayed:false`. Each successful command batch increments the revision exactly once. Account creation/update and public review submission also change the tenant revision.

State and result projection always uses current account permissions. Employee snapshots contain assigned orders only; financial data is zeroed or removed, management reviews/audit are withheld unless authorized, and current branch scope is applied. A cached result that is now outside the account's scope is `null`. Domain backup validation runs on complete server state, not on these partial projections.

Anonymous review GET returns `{brand:{name,activity,primary,secondary,logo},order:{number,title,deliveredAt},reviewed}`. POST returns `{reviewed:true,id}` with status 201. No account, staff, client contact or pricing data is returned. Tokens are 256-bit random values and reviews are persisted once.

Suspended or expired tenant access returns HTTP 403 with `TENANT_SUSPENDED` or `TENANT_EXPIRED`; public review links for inaccessible tenants return 404. Expired sessions return 401 `UNAUTHENTICATED`. Optimistic conflicts return 409 `REVISION_CONFLICT` and `error.details.currentRevision`.
