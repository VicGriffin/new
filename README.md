# AMTMTI Platform

This repository powers the public marketing website, student portal, and admin dashboard for the Africa Medication Therapy Management Institute (AMTMTI).

It is built with:
- **Supabase** for authentication, Postgres storage, and row-level security.
- **TanStack Start** for React + server-side rendering, routing, and server functions.
- **Vite** for frontend bundling and development.
- **Lovable Cloud Auth** for Google OAuth.

## What this project is

- A **public site** with programs, research, news, events, membership, and contact pages.
- An **authenticated student portal** at `/portal` for profile management, enrollments, resources, and notifications.
- An **admin console** at `/admin` for managing users, content, and portal data.
- A **Supabase-backed** app that uses functional server-side API routes, auth middleware, and RLS-protected data.

## Key directories

### `src/routes/`
Contains page and route files for TanStack Router.

- Public pages: `index.tsx`, `about.tsx`, `programs.tsx`, `news.tsx`, `events.tsx`, `membership.tsx`, `contact.tsx`, `privacy.tsx`, and detail pages like `programs.$slug.tsx` and `news.$slug.tsx`.
- `auth.tsx`: sign in, sign up, password reset.
- `admin/login.tsx`: admin login page.
- `_authenticated/`: protected application routes and route guards.

### `src/components/`
Reusable UI and layout components.

- `site/` contains the public site layout, header, footer, page shell, and shared page blocks.
- `admin/` contains admin dashboard UI and tabbed admin pages.
- `ui/` contains generic UI primitives used across the app.

### `src/integrations/supabase/`
Supabase client setup and integration helpers.

- `client.ts`: browser Supabase client.
- `client.server.ts`: server-side Supabase client with service role key.
- `auth-attacher.ts`: attaches auth tokens to server functions.
- `types.ts`: generated Supabase database types.

### `src/lib/`
Application logic and server helpers.

- `auth/roles.ts`: app role/status helpers.
- `api/`: server functions for admin actions and protected operations.
- `config.server.ts`: server-only configuration.

### `supabase/`
Database migrations and seed/setup SQL.

- `config.toml`: Supabase CLI configuration.
- `migrations/`: Postgres schema and RLS migrations.
- `seed_admin_complete.sql`: seed admin user SQL.
- `bootstrap_first_admin.sql`: initial admin bootstrap SQL.

### `scripts/`
Local setup scripts.

- `setup-admin.mjs`: runs admin provisioning automatically.
- `seed-admin.mjs`: seed the initial admin user.
- `provision-admin-db.mjs`: provision admin data via Postgres.
- `ensure-dev-admin.mjs`: fallback signup / role claim logic.

## Project structure

```
pharmacy-site-clone/
├── scripts/
├── supabase/
│   ├── migrations/
│   ├── config.toml
│   ├── seed_admin_complete.sql
│   └── bootstrap_first_admin.sql
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── site/
│   │   └── ui/
│   ├── integrations/
│   │   ├── supabase/
│   │   └── lovable/
│   ├── lib/
│   │   ├── api/
│   │   └── auth/
│   ├── hooks/
│   ├── routes/
│   ├── router.tsx
│   ├── server.ts
│   ├── start.ts
│   ├── styles.css
│   └── routeTree.gen.ts
├── .env.example
├── package.json
├── tsconfig.json
├── vite.config.ts
├── bunfig.toml
├── netlify.toml
└── README.md
```

## Routes overview

| Path | Access | Purpose |
| --- | --- | --- |
| `/` | Public | Homepage and marketing content |
| `/about` | Public | Organization details |
| `/programs` | Public | Program catalog |
| `/programs/:slug` | Public | Program detail page |
| `/research` | Public | Published research articles |
| `/news` | Public | News feed |
| `/news/:slug` | Public | News detail |
| `/events` | Public | Events listing |
| `/membership` | Public | Membership application page |
| `/contact` | Public | Contact form |
| `/privacy` | Public | Privacy policy |
| `/auth` | Public | Email auth and OAuth login |
| `/portal` | Authenticated | Student portal |
| `/admin/login` | Public | Admin login |
| `/admin` | Admin-only | Admin dashboard |

## Getting started

### Prerequisites

- Node.js 24.x (recommended)
- npm (or compatible package manager)
- A Supabase project (for auth, database, and storage)

### Quick start (local development)

1. Install dependencies

```bash
cd pharmacy-site-clone
npm install
```

2. Configure environment

```bash
cp .env.example .env
# Edit .env and fill in your Supabase project values and any secrets
```

3. Run the development server

```bash
npm run dev
```

Open http://localhost:5173 (or the port printed by Vite) to view the site.

### Common scripts

- `npm run dev` — start Vite + SSR dev server
- `npm run build` — produce the SSR build (Vercel/Nitro output)
- `npm run preview` — serve the built output locally
- `npm run typecheck` — run `tsc --noEmit` to validate TypeScript
- `npm run lint` — run project linters
- `npm run test` — run unit/integration tests (if present)

Note: `npm run build` emits the Vercel/Nitro build output under `.vercel/output`. Use `npm run preview` to serve that same output locally; do not rely on `vite preview` for SSR output produced by the Vercel preset.

### Deployment notes

- Vercel is the recommended host for the SSR build output. Keep Node version pinned to 24.x in your Vercel project settings.
- Set these environment variables in your deployment platform (Production and Preview):
	- `VITE_SUPABASE_URL`
	- `VITE_SUPABASE_ANON_KEY`
	- `SUPABASE_URL`
	- `SUPABASE_ANON_KEY`
	- `SUPABASE_SERVICE_ROLE_KEY`
- Do not commit `.vercel/output`; it is generated during build.

## Environment variables

Copy `.env.example` to `.env` and set the following values:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (used by server-side scripts)
- `SUPABASE_DB_PASSWORD` (optional, for CLI/DB provisioning)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (optional, used by provisioning scripts)

## Database & Supabase

- This project stores schema and RLS migrations under `supabase/migrations/`.
- To apply migrations locally or in CI, use the Supabase CLI configured with `supabase/config.toml`.

Example: applying migrations with the Supabase CLI

```bash
supabase db push --project-ref <your-project-ref>
```

Important migration notes:

- The project uses a `payments` table and `course_enrollments` with status enums. If you see errors around missing statuses (for example `pending_payment_review`), ensure you have applied the latest migration files in `supabase/migrations/`.
- If `profiles.status` is missing, apply `supabase/migrations/20260612000000_core_features.sql`.

## Project notes

- `src/routes/` holds page routes.
- `src/components/` holds UI and layout components.
- `src/integrations/supabase/` holds Supabase clients and auth helpers.
- `supabase/migrations/` holds database schema and RLS rules.
- `src/lib/api/` holds server functions used by the frontend and admin console.
- `src/lib/auth/roles.ts` contains role and status helper functions.

## Contributing

- Run `npm run typecheck` and `npm run lint` before opening a PR.
- Keep migrations additive and sequenced; do not modify already-published migration files for existing environments.
- Use the `scripts/` utilities (`seed-admin.mjs`, `setup-admin.mjs`, etc.) for local provisioning and seeding.

If you need help setting up Supabase locally or applying migrations, tell me which environment (local/CI/Vercel) you want to configure and I can provide step-by-step commands.
