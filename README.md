# DevPulse

Developer Health & Burnout Radar — a SaaS tool that helps engineering teams detect and prevent developer burnout.

Built with [Next.js](https://nextjs.org), React, and PostgreSQL.

## Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- [pnpm](https://pnpm.io)
- [Docker](https://www.docker.com/get-started)

## Local Setup

### 1. Install dependencies

```bash
pnpm install
```

### 2. Set up environment variables

Copy the example env file and adjust if needed:

```bash
cp .env.example .env
```

The default `DATABASE_URL` points to the local Docker Postgres instance:

```
DATABASE_URL="postgresql://devpulse:devpulse123@localhost:5432/devpulse"
```

### 3. Start the database

```bash
docker compose up -d
```

This starts a PostgreSQL 16 container with:

| Setting  | Value          |
| -------- | -------------- |
| Host     | localhost      |
| Port     | 5432           |
| User     | devpulse       |
| Password | devpulse123    |
| Database | devpulse       |

Data is persisted in a Docker volume (`pgdata`), so it survives container restarts.

### 4. Run the dev server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Useful Commands

| Command                  | Description                        |
| ------------------------ | ---------------------------------- |
| `docker compose up -d`   | Start the database                 |
| `docker compose down`    | Stop the database                  |
| `docker compose down -v` | Stop the database and delete data  |
| `docker compose logs db` | View database logs                 |
| `pnpm dev`               | Start the Next.js dev server       |
| `pnpm build`             | Build for production               |
| `pnpm start`             | Start the production server        |
