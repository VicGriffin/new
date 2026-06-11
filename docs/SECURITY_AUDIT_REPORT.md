# AMTMTI Security Audit Report

## Authentication and Sessions
- Email/password, password reset, Google OAuth, logout, protected route redirects, and admin route redirects were reviewed.
- `/portal` and `/admin` remain behind the `_authenticated` route guard and admin-specific `isAdmin` check.
- Server functions use bearer-token middleware and re-check admin role server-side before privileged mutations.

## Authorization
- Admin role enforcement exists in admin server functions for users, enrollments, and resource file operations.
- Client-side admin checks are not the only control for privileged server functions.
- A legacy fixed-email bootstrap path was disabled in the production hardening migration to prevent role escalation by signing up with a known email.

## Secrets
- Service role usage remains isolated to server-only clients and Node provisioning scripts.
- Provisioning scripts now require `ADMIN_EMAIL` and `ADMIN_PASSWORD` from environment variables and enforce a minimum password length.
- SQL bootstrap no longer contains a hardcoded email or password.

## Data Access Controls
- Resource download authorization now permits non-admin users only for public resources or resources tied to active/completed enrollments.
- Submitted payments are no longer auto-approved by users.
- Storage resource object policies were aligned with active/completed enrollment statuses.

## Web Attack Surface
- No broad `dangerouslySetInnerHTML` use was found outside the chart style helper.
- Open redirects were not found in auth redirects; redirects are based on `window.location.origin` and internal routes.
- Server functions use Zod validators for request payloads.

## Follow-up Recommendations
- Add CSRF-oriented tests around server function invocation once the production auth transport is finalized.
- Replace UI `any` types with concrete Supabase table types.
- Add live integration tests for Google OAuth and admin CRUD against a staging Supabase project.
