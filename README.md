# DevPulse

Developer Health & Burnout Radar — a SaaS tool that helps engineering teams detect and prevent developer burnout by surfacing behavioral signals from Git repos and issue trackers.

Built with [Next.js](https://nextjs.org) 16, React 19, PostgreSQL, Prisma, and Auth.js.

---

## Prerequisites

- [Node.js](https://nodejs.org) v20+
- [pnpm](https://pnpm.io)
- PostgreSQL 16 (via [Docker](https://www.docker.com/get-started) **or** a local install)

---

## Local Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Then fill in the required values in `.env`:

```env
# Database — local Postgres
DATABASE_URL="postgresql://devpulse:devpulse123@localhost:5432/devpulse"

# Auth.js secret — generate with: openssl rand -base64 32
AUTH_SECRET="your-random-32-char-secret"
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth App
# Create at: https://github.com/settings/developers
# Homepage URL: http://localhost:3000
# Callback URL: http://localhost:3000/api/auth/callback/github
GITHUB_CLIENT_ID=""
GITHUB_CLIENT_SECRET=""

# Resend (email for invitations)
RESEND_API_KEY=""
```

### 3. Start the database

**Option A — Docker (recommended):**
```bash
docker compose up -d
```

This starts a PostgreSQL 16 container with:

| Setting  | Value       |
| -------- | ----------- |
| Host     | localhost   |
| Port     | 5432        |
| User     | devpulse    |
| Password | devpulse123 |
| Database | devpulse    |

Data persists in a Docker volume (`pgdata`) across restarts.

**Option B — Local Postgres:**

Create the database and user manually:
```sql
CREATE USER devpulse WITH PASSWORD 'devpulse123';
CREATE DATABASE devpulse OWNER devpulse;
```

### 4. Run database migrations

```bash
pnpm prisma migrate deploy
```

> **Note:** When making schema changes during development, run `pnpm prisma migrate dev --name <description>` in your own terminal (it requires an interactive shell).

### 5. Start the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Auth Setup

DevPulse uses [Auth.js v5](https://authjs.dev) with two providers:

- **Email + Password** — for credentials-based signup/login
- **GitHub OAuth** — for one-click login

### GitHub OAuth App

1. Go to [github.com/settings/developers](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set **Homepage URL**: `http://localhost:3000`
4. Set **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
5. Copy **Client ID** and **Client Secret** into `.env`

### Sign-up Flow

| Role | How |
|------|-----|
| **Team Lead (owner)** | Go to `/signup` → fill name, email, password, team name |
| **Team Member** | Click invitation link sent by team lead → `/signup?invite=TOKEN` |

- Teams are limited to **10 members**
- The first user who creates a team becomes the **owner**
- Owners can invite members from the dashboard

---

## Project Structure

```
devpulse/
├── prisma/
│   ├── schema.prisma               # Full DB schema
│   └── migrations/
│       └── 20260218000000_init/    # Initial migration
│           └── migration.sql
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/     # Auth.js route handler
│   │   ├── signup/                 # POST — create account
│   │   └── invitations/            # POST — create invite | GET — validate token
│   ├── dashboard/
│   │   ├── layout.tsx              # Dashboard shell with sidebar
│   │   └── page.tsx                # Team overview
│   ├── login/
│   │   └── page.tsx                # Login page
│   ├── signup/
│   │   └── page.tsx                # Signup page (team lead + invite flow)
│   ├── layout.tsx                  # Root layout with SessionProvider
│   ├── page.tsx                    # Landing page
│   └── globals.css                 # Tailwind v4 + custom theme
├── components/
│   ├── ui/                         # Shared UI (button, input, card, field…)
│   ├── layout/                     # Navbar, footer
│   ├── sections/                   # Landing page sections
│   ├── dashboard/
│   │   ├── sidebar.tsx             # Dashboard sidebar nav
│   │   └── invite-button.tsx       # Invite member modal
│   ├── login-form.tsx
│   ├── signup-form.tsx
│   └── session-provider.tsx        # Auth.js SessionProvider wrapper
├── lib/
│   ├── db.ts                       # Prisma singleton client
│   └── utils.ts                    # cn() helper
├── types/
│   └── next-auth.d.ts              # Session type augmentation
├── auth.ts                         # Auth.js config (root)
├── proxy.ts                        # Route protection (Next.js 16 middleware)
└── .env                            # Environment variables
```

---

## Useful Commands

| Command | Description |
| ------- | ----------- |
| `pnpm dev` | Start the Next.js dev server |
| `pnpm build` | Build for production |
| `pnpm start` | Start the production server |
| `docker compose up -d` | Start the database (Docker) |
| `docker compose down` | Stop the database |
| `docker compose down -v` | Stop and delete all data |
| `pnpm prisma migrate dev --name <name>` | Create + apply a new migration (interactive) |
| `pnpm prisma migrate deploy` | Apply pending migrations (CI/production) |
| `pnpm prisma migrate status` | Check migration status |
| `pnpm prisma studio` | Open Prisma Studio (DB GUI) |
| `pnpm prisma generate` | Regenerate Prisma client after schema changes |
| `pnpm prisma db push` | Sync schema without migrations (prototyping only) |

---

## Build Progress

| Module | Status | Description |
|--------|--------|-------------|
| **1 — Setup & Auth** | ✅ Done | Project setup, Prisma schema, Auth.js, signup/login, invitations, dashboard shell |
| **2 — Integrations** | 🔜 Next | GitHub OAuth, repo selection, webhook setup |
| **3 — Data Ingestion** | ⬜ Pending | Cron + webhook event processor |
| **4 — Score Engine** | ⬜ Pending | Burnout signal scoring |
| **5 — Dashboard UI** | ⬜ Pending | Charts, heatmaps, member views |
| **6 — Alerts** | ⬜ Pending | Slack + email notifications |
| **7 — Privacy Layer** | ⬜ Pending | Anonymization, opt-in controls |
| **8 — Reports** | ⬜ Pending | Weekly/monthly digests |
| **9 — Landing & Onboarding** | ⬜ Pending | Onboarding wizard |

---

*Built with ❤️ to keep developers healthy and sustainable.*
