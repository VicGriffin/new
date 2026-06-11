# AMTMTI Environment Variable Checklist

## Public Browser Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Server Variables
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

## Admin Bootstrap Variables
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD` (minimum 12 characters)
- `ADMIN_DISPLAY_NAME` (optional)

## Alternative Database Provisioning
- `SUPABASE_DB_PASSWORD`
- `SUPABASE_PROJECT_ID` (optional if it can be derived from `SUPABASE_URL`)

## Security Rules
- Never prefix service role or database credentials with `VITE_`.
- Never commit real `.env` files.
- Rotate `ADMIN_PASSWORD` after bootstrap if it was shared during deployment.
