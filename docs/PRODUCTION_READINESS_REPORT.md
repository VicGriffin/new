# AMTMTI Production Readiness Report

## Audit Summary
- Architecture: TanStack Start file routes are organized by public pages, `_authenticated` protected routes, and `admin/login`. Admin tab UI remains large and should be split further, but route-level code splitting is active in the production build.
- TypeScript: `npm run typecheck` passes with `strict` enabled. Existing `any` usage remains in UI-heavy admin screens and generated route code; it is tracked as a remaining hardening item rather than a build blocker.
- React: Fixed the root auth listener cleanup so the Supabase auth subscription is unsubscribed on unmount. Lint still reports hook dependency warnings in the portal learning route that should be addressed in a follow-up.
- TanStack Start: Protected route guards remain in `_authenticated`, admin role checks remain before admin rendering, and server functions enforce bearer-token authentication plus admin role checks for privileged mutations.
- Vercel: Nitro now targets the Vercel preset, `vercel.json` is present, and `npm run build` emits `.vercel/output` successfully.

## Fixed Issues
1. Switched Nitro from the Netlify preset to the Vercel preset.
2. Added `vercel.json` with Vercel build/install/output settings.
3. Restricted lint to source/config/script files and ignored generated/build/vendor artifacts.
4. Added a static production readiness audit test.
5. Removed hardcoded admin credentials from provisioning scripts and SQL bootstrap flow.
6. Made database admin provisioning consume `ADMIN_EMAIL` and `ADMIN_PASSWORD` from environment variables only.
7. Removed legacy fixed-email admin claim behavior in a new hardening migration.
8. Added constraints and indexes for profile status, enrollment status, payment status, payment amount, notifications, resources, and enrollment lookups.
9. Prevented users from auto-approving submitted payments.
10. Fixed protected resource download checks to match actual active/completed enrollment statuses.
11. Fixed root Supabase auth subscription cleanup.

## Validation Results
- `npm test`: passed static production readiness checks.
- `npm run lint`: passed with warnings only.
- `npm run typecheck`: passed.
- `npm run build`: passed and generated Vercel output.
- `npm run preview -- --host 127.0.0.1 --port 4173`: Vite preview returned 500 because the preview plugin looked for `dist/server/server.js` while the Vercel preset emitted `.vercel/output`. Treat as local preview tooling mismatch; deploy/preview should use Vercel output.

## Remaining Risks
- Admin dashboard CRUD has not been validated against a live Supabase project in this environment because production Supabase credentials were not available.
- Public route smoke checks could not be completed with `vite preview` after switching to Vercel output.
- Bundle warning remains for the primary client chunk; further manual chunking or dependency-level lazy loading is recommended.
- Admin UI files are large and should be split by tab for maintainability.
- Existing UI `any` usage should be gradually replaced with generated Supabase table types.
- Portal learning route has hook dependency warnings to fix.

## Deployment Checklist
1. Push all Supabase migrations, including `20260612000000_core_features.sql` and `20260611120000_production_security_hardening.sql`.
2. Confirm `profiles.status` exists and has the `pending|approved|rejected|suspended` constraint.
3. Confirm all protected tables have RLS enabled.
4. Configure all Vercel environment variables from `docs/ENVIRONMENT_VARIABLE_CHECKLIST.md`.
5. Run `npm run setup:admin` once with production admin env variables.
6. Run `npm test`, `npm run lint`, `npm run typecheck`, and `npm run build` before deployment.
7. Deploy to Vercel and smoke-test public routes, `/auth`, `/portal`, `/admin/login`, and `/admin`.
8. Validate CRUD in the admin dashboard using a real admin account.

## Vercel Configuration
- `vercel.json` uses `npm ci` and `npm run build`; the Nitro Vercel preset emits Vercel Build Output API files under `.vercel/output`.
- `vite.config.ts` configures Nitro with the Vercel preset.
