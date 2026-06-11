# AMTMTI Platform

Concise overview: this repository powers the public marketing site, student e-learning portal, and admin console for the Africa Medication Therapy Management Institute (AMTMTI). It uses Supabase for auth and data, and TanStack Start (React + Vite) for the frontend and server runtime.

What this project does
- Serves a public marketing site with programs, research, news, and events.
- Provides a student portal (`/portal`) for enrollments, resources, and progress tracking.
- Includes an admin console (`/admin`) for content and user management (requires `admin` role).

Key files & folders (brief)
- `src/routes/` — file-based pages and route handlers (public pages, auth, portal, admin).
- `src/components/site/` — header, footer, page shell and layout components.
- `src/integrations/supabase/` — Supabase client (browser + server), auth middleware, and types.
- `supabase/migrations/` — database schema, RLS policies, triggers, and seed SQL.
- `scripts/` — helper scripts for admin provisioning and resource setup.
- `.env.example` — required environment variables; copy to `.env` for local development.

| Backend / data | Supabase (Auth, Postgres, Row Level Security) |
| Server | Nitro (SSR / production build), server functions via `createServerFn` |
| Auth extras | Lovable Cloud Auth (Google OAuth) |
| Validation | Zod, React Hook Form |
| Tooling | TypeScript, ESLint, Prettier, Vite |

---

## Getting started

### Prerequisites

- Node.js 20+
- npm
- A Supabase project ([supabase.com](https://supabase.com))

### Install and run

```bash
cd pharmacy-site-clone
npm install
cp .env.example .env
# Fill in Supabase URL and publishable key (see Environment variables)
npm run dev
```

Dev server: **http://localhost:8080**

### Build

```bash
npm run typecheck
npm run lint
npm run build
npm run preview
```

---

## Environment variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Purpose |
| --- | --- | --- |
| `VITE_SUPABASE_URL` | Yes | Supabase project URL (browser) |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable / anon key (browser) |
| `SUPABASE_URL` | Yes | Same URL for SSR / scripts |
| `SUPABASE_PUBLISHABLE_KEY` | Yes | Same key for SSR |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin setup | Secret key for admin seed and server user management |
| `SUPABASE_DB_PASSWORD` | Admin setup | Alternative for `npm run setup:admin` via direct Postgres |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Optional | Defaults for admin bootstrap scripts (see `.env.example`) |

---

## Project structure

```
pharmacy-site-clone/
├── scripts/                    # Admin provisioning (not bundled in app)
│   ├── seed-admin.mjs          # Create admin via Supabase service role
│   ├── provision-admin-db.mjs  # Create admin via Postgres SQL
│   ├── ensure-dev-admin.mjs    # Fallback signup + role claim
│   └── setup-admin.mjs         # Runs all provisioning methods in order
├── supabase/
│   ├── config.toml             # Supabase CLI project ref
│   ├── migrations/             # Postgres schema, RLS, triggers
│   ├── seed_admin_complete.sql # One-shot admin setup for SQL Editor
│   └── bootstrap_first_admin.sql
├── src/
│   ├── routes/                 # File-based pages (TanStack Router)
│   │   ├── __root.tsx          # App shell, providers, global layout
│   │   ├── index.tsx           # Homepage
│   │   ├── about.tsx
│   │   ├── programs.tsx
│   │   ├── programs.$slug.tsx
│   │   ├── research.tsx
│   │   ├── news.tsx
│   │   ├── news.$slug.tsx
│   │   ├── events.tsx
│   │   ├── membership.tsx
│   │   ├── contact.tsx
│   │   ├── privacy.tsx
│   │   ├── auth.tsx            # Sign in / sign up / password reset
│   │   ├── admin/
│   │   │   └── login.tsx       # Admin login
│   │   └── _authenticated/     # Requires Supabase session
│   │       ├── route.tsx       # Auth guard for child routes
│   │       ├── portal.tsx      # Student e-learning portal
│   │       └── admin.tsx       # Admin dashboard
│   ├── components/
│   │   ├── site/               # Public layout (header, footer, shell)
│   │   ├── admin/              # Admin tabs (CRUD, overview, users)
│   │   └── ui/                 # Reusable UI primitives (shadcn-style)
│   ├── integrations/
│   │   ├── supabase/           # Client, server client, auth middleware, types
│   │   └── lovable/            # OAuth integration
│   ├── lib/
│   │   ├── auth/roles.ts       # Role helpers (admin, instructor, student, member)
│   │   ├── api/                # Server functions (admin user management)
│   │   └── config.server.ts    # Server-only configuration
│   ├── hooks/
│   ├── router.tsx
│   ├── server.ts               # SSR entry + error handling
│   ├── start.ts
│   ├── styles.css
│   └── routeTree.gen.ts        # Auto-generated route tree (do not edit)
├── .env.example
├── package.json
├── vite.config.ts
└── README.md
```

---

## Application routes

| Path | Access | Description |
| --- | --- | --- |
| `/` | Public | Homepage — hero, stats, programs preview, partners, testimonials |
| `/about` | Public | About AMTMTI |
| `/programs` | Public | Published training programs list |
| `/programs/:slug` | Public | Program detail page |
| `/research` | Public | Published research articles |
| `/news` | Public | News listing |
| `/news/:slug` | Public | News article detail |
| `/events` | Public | Upcoming events |
| `/membership` | Public | Affiliate membership tiers + application form |
| `/contact` | Public | Contact info + inquiry form |
| `/privacy` | Public | Privacy policy |
| `/auth` | Public | Email auth + Google OAuth; redirects to portal when signed in |
| `/portal` | Authenticated | E-learning portal (profile, enrollments, resources, notifications) |
| `/admin/login` | Public | Admin sign-in |
| `/admin` | Admin | Admin dashboard (CRUD for site content and users) |

---

## Functionality

### Public website

- **Marketing pages** with SEO meta tags, Open Graph, and structured data on the homepage.
- **Dynamic content** from Supabase: programs, research, news, events, partners, and testimonials.
- **Membership applications** — users submit tier, organization, and message; stored in `membership_applications`.
- **Contact form** — inquiries saved to `contacts` for admin review.
- **Responsive layout** — shared header/footer via `PageShell`, mobile navigation.

### Authentication

- **Email/password** sign up, sign in, and password reset (`/auth`).
- **Google OAuth** via Lovable Cloud Auth.
- **Profiles** — auto-created on signup with `full_name`; default role `student`.
- **Roles** — `admin`, `instructor`, `student`, `member` stored in `user_roles`.
- **Protected routes** — `_authenticated` layout requires a Supabase session.

### E-learning portal (`/portal`)

- View and edit **user profile** (name, country, profession, bio).
- Browse **published programs** and **enroll** in courses.
- Track **course enrollments** and status.
- Access **resources** linked to enrolled programs.
- View **notifications** and mark them as read.
- Quick link to admin dashboard for users with the admin role.

### Admin dashboard (`/admin`)

Requires the `admin` role in `user_roles`. Tabs:

| Tab | Capabilities |
| --- | --- |
| **Overview** | Dashboard stats, recent activity, quick navigation |
| **Users** | List users, create accounts, assign roles, delete users (server functions) |
| **Programs** | Create, publish/unpublish, delete programs |
| **Enrollments** | View and manage course enrollments |
| **Applications** | Review membership applications, approve status |
| **Messages** | Read contact form submissions, mark read, archive |
| **News** | CRUD for news articles |
| **Events** | CRUD for events |
| **Research** | CRUD for research articles |
| **Resources** | CRUD for downloadable resources |
| **Partners** | CRUD for homepage partner logos |
| **Testimonials** | CRUD for homepage testimonials |

Admin user management uses **server-side functions** (`adminCreateUser`, `adminDeleteUser`, `adminSetUserRoles`) with the Supabase **service role** — never exposed to the browser.

### Server functions

Located in `src/lib/api/`:

- `admin.functions.ts` — privileged user CRUD (requires admin session + service role env).
- `example.functions.ts` — reference pattern for `createServerFn`.

---

## Database (Supabase)

Main tables:

| Table | Purpose |
| --- | --- |
| `profiles` | User profile data |
| `user_roles` | App roles per user |
| `program_categories` | Program taxonomy |
| `programs` | Training programs |
| `course_enrollments` | Student enrollments |
| `research_articles` | Research content |
| `news` | News posts |
| `events` | Events |
| `resources` | Portal resources / downloads |
| `membership_applications` | Membership form submissions |
| `contacts` | Contact form messages |
| `notifications` | User notifications |
| `partners` | Partner logos (homepage) |
| `testimonials` | Testimonials (homepage) |

**Row Level Security (RLS)** is enabled on all tables. Public read access is limited to published content; writes and admin operations require authenticated users with the appropriate role.

Migrations live in `supabase/migrations/`. Apply with the Supabase CLI (`supabase db push`) or run SQL files in the Supabase SQL Editor.

---

## Admin account setup

Admin credentials are configured via environment variables (see `.env.example`). To provision the first admin:

1. Add `SUPABASE_SERVICE_ROLE_KEY` or `SUPABASE_DB_PASSWORD` to `.env`, **or**
2. Run `supabase/seed_admin_complete.sql` in the Supabase SQL Editor.

Then run:

```bash
npm run setup:admin
```

Sign in at `/admin/login` using the credentials from your `.env`.

---

## npm scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start development server (runs soft admin setup first) |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run typecheck` | TypeScript check |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |
| `npm run setup:admin` | Provision admin account (all methods) |
| `npm run seed:admin` | Provision admin via service role API |

---

## Auth and authorization flow

```
Visitor → /auth (sign up) → profile + student role created
         → /portal (authenticated layout)

Admin    → /admin/login → Supabase sign-in
         → isAdmin(userId) checks user_roles
         → /admin dashboard

Server   → createServerFn + requireSupabaseAuth middleware
         → supabaseAdmin (service role) for privileged ops
```

Role helpers: `src/lib/auth/roles.ts` — `isAdmin`, `hasRole`, `getUserRoles`, `requireAdmin`.

---

## Development notes

- Routing follows **TanStack Start** conventions; see `src/routes/README.md`.
- `routeTree.gen.ts` is generated automatically — do not edit manually.
- Supabase types: `src/integrations/supabase/types.ts` (regenerate when schema changes).
- Production builds target **Cloudflare** via Nitro (configured in Lovable TanStack config).
- Never commit `.env` or expose service role keys in client code.

---

## License

Private project — All rights reserved.
