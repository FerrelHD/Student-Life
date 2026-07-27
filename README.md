# Student Life

Operative Life & Academic Companion — a gamified dashboard for tracking missions (assignments/deadlines), finances, study streaks, and badges. Built with React + Vite, ships as a web app or an Electron desktop app.

## Features

- **Dashboard** — XP progress, next deadline, study streak, monthly spending at a glance
- **Missions** — assignments/tasks with priority, due dates, tags, and XP rewards
- **Vault** — income/expense tracking with categories and savings goals
- **Agenda** — calendar view of upcoming deadlines
- **Hero** — profile, level, badges, and daily quiz (AI-generated via Supabase Edge Function + Gemini)
- Auth and data sync via Supabase, with local persistence fallback
- English/Indonesian i18n

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Supabase (Auth, Postgres, Edge Functions)
- Electron (desktop packaging)

## Getting Started

### Prerequisites

- Node.js 18+
- A [Supabase](https://supabase.com) project (for auth/sync and the daily quiz feature)

### Setup

```bash
npm install
cp .env.example .env
```

Fill in `.env` with your Supabase project URL and anon key (Supabase dashboard → Settings → API). Then apply the schema in `supabase/schema.sql` to your project.

The daily quiz feature calls a Supabase Edge Function backed by Gemini. Set the key as a Supabase secret (never a client env var):

```bash
supabase secrets set GEMINI_API_KEY="your-gemini-api-key"
```

### Run (web)

```bash
npm run dev
```

Opens at `http://localhost:3000`.

### Run (desktop / Electron)

```bash
npm run electron:dev
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production web build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run electron:dev` | Run the Electron desktop app in dev mode |
| `npm run electron:build` | Build the packaged Electron app |
| `npm run clean` | Remove build output directories |

## Project Structure

```
src/
  components/   UI views and modals (Dashboard, Missions, Vault, Agenda, Hero, etc.)
  lib/           Supabase client and local DB/persistence helpers
  utils/         i18n and other utilities
  types.ts       Shared domain types
electron/        Electron main process
supabase/        DB schema and edge functions (generate-quiz)
```
