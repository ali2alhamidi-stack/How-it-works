# تحديث وجهة العمل

الوجهة النهائية التي أكدها المستخدم: GitHub في ali2alhamidi-stack/How-it-works. راجع docs/DEPLOYMENT-TARGET.md. يعمل هذا التسليم على استكمال الخطة التالية بعد التحقق المحلي.

# Central Operations Release Implementation Plan

> **For agentic workers:** Use subagent-driven development for independent backend/material/visual modules; root integrates and verifies the complete app.

**Goal:** Deliver the enhanced unified PWA and platform-owner account console into the user-specified empty GitHub repository after local verification.

**Architecture:** Reuse the existing domain model and calculators. Add a Node 24 SQLite server for authenticated multi-tenant commands, a material operations engine, a premium interface and a persisted client outbox with explicit revision conflicts.

**Tech Stack:** Node.js 24 built-ins, SQLite, plain browser JS/CSS, IndexedDB, service worker, Python build utility.

**Spec:** docs/V2-ARCHITECTURE.md

## Constraints and review focus

- Preserve the previous working artifact and all 85 baseline tests.
- Business operations are not accounting entries; no tax or unsupported profit claims.
- Tenant/branch authorization is enforced server-side, including direct API attempts.
- Password operations never enter the client outbox or diagnostics.
- No public default production account; deployment origin and TLS explicitly configured.
- Remote repository writes begin only after the implementation and local tests are complete.
- Check incomplete batches, duplicate retries, stale revisions, expired sessions, reservations held by another order, and inactive tenants.

## Tasks

- [x] Inspect repository and retained source; establish isolated checkout and passing baseline.
- [x] Research original manufacturer sources and define material invariants.
- [x] Backend agent: implement/test SQLite, accounts, sessions, provisioning, scoped snapshots, transactional commands and public reviews.
- [x] Materials agent: implement/test SKU/units/templates/reservations/issue/receiving/adjustment/transfer and calculator presets.
- [x] Visual agent: premium responsive styles and API-driven platform-owner console.
- [x] Root: client session/transport/outbox, command capture, material UI and calculator integration, login/public reviews, PWA build.
- [x] Root + reviewer: HTTP integration tests of tenant/role boundaries, shared jobs, stock, retries, reviews and suspension; projected-state UI rendering and browser fixture checks. Authenticated browser end-to-end and device installation remain outside the verified scope.
- [x] Root: deploy configuration, startup/backup scripts, documentation, artifact and secret checks.
- [ ] Root: upload completed source without overwriting concurrent repository changes; verify remote files and CI result.

## Verification commands

`node --test tests/*.test.cjs`

`python3 build.py`

`node --check server/main.cjs` and all source modules.

Managed preview runs `scripts/dev.cjs` at the supported preview port. Browser results must distinguish actual tested viewport/device from CSS responsiveness or unexecuted native-device claims.
