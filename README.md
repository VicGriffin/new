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

- Node.js 24.x
- npm
- Supabase project

### Setup

```bash
cd pharmacy-site-clone
npm install
cp .env.example .env
# Fill in Supabase environment values
npm run dev
```

### Build and preview

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

`npm run build` emits Nitro's Vercel Build Output API bundle under `.vercel/output`.
Use `npm run preview` after a build to serve that same Vercel/Nitro output locally; do not use `vite preview` for this TanStack Start SSR build because it looks for a `dist/server/server.js` file that the Vercel preset does not emit.

### Vercel deployment notes

- Keep the project on Node.js 24.x (the version is pinned in `package.json`).
- The Vercel build command should be `npm run build`.
- Configure these environment variables in Vercel for Production, Preview, and Development as needed: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`, `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY`.
- Do not commit `.vercel/output`; it is generated during each Vercel build.

## Environment variables

Copy `.env.example` to `.env` and configure:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_DB_PASSWORD` (optional)
- `ADMIN_EMAIL` / `ADMIN_PASSWORD` (optional)

## Notes

- `src/routes/` holds page routes.
- `src/components/` holds UI and layout components.
- `src/integrations/supabase/` holds Supabase clients and auth helpers.
- `supabase/migrations/` holds the database schema and RLS rules.
- `src/lib/api/` holds server functions.
- `src/lib/auth/roles.ts` handles role and status checks.

If `profiles.status` is missing, apply `supabase/migrations/20260612000000_core_features.sql` to add the column.
