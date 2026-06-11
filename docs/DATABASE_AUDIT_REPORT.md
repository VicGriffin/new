# AMTMTI Database Audit Report

## Schema Verification
- `profiles.status` is added by `20260612000000_core_features.sql`.
- Payment, progress, resource storage, audit log, and admin policy migrations are present.
- A new production hardening migration adds constraints, indexes, storage policy alignment, and removes fixed-email bootstrap claims.

## RLS Coverage Reviewed
Protected application tables reviewed in migrations include:
- `profiles`
- `user_roles`
- `program_categories`
- `programs`
- `research_articles`
- `news`
- `events`
- `resources`
- `course_enrollments`
- `membership_applications`
- `contacts`
- `notifications`
- `partners`
- `testimonials`
- `audit_logs`
- `payments`

## Integrity Improvements Added
- `chk_profiles_status`
- `chk_course_enrollments_status`
- `chk_payments_status`
- `chk_payments_amount_positive`

## Index Improvements Added
- `idx_profiles_status`
- `idx_course_enrollments_user_status`
- `idx_course_enrollments_program_status`
- `idx_resources_program_public`
- `idx_notifications_user_read`
- `idx_payments_enrollment_status`

## Migration Notes
- Run migrations in timestamp order.
- If `profiles.status` is missing in an existing environment, apply `supabase/migrations/20260612000000_core_features.sql` before the production hardening migration.
- Validate policy behavior in staging with both admin and student accounts.
