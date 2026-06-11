# Changelog

## 2026-06-11 — Production readiness hardening
- Added Vercel deployment configuration and switched Nitro to the Vercel preset.
- Added static production readiness tests.
- Hardened first-admin provisioning to use environment variables only.
- Removed hardcoded admin credentials from bootstrap SQL and scripts.
- Added a database hardening migration for constraints, indexes, and RLS/storage policy alignment.
- Fixed user payment submission so payments are pending rather than self-approved.
- Fixed resource authorization to match active/completed enrollment statuses.
- Fixed Supabase auth listener cleanup in the root route.
- Added production, security, database, and environment checklist documentation.
