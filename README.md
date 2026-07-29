# Student Life

Operative Life & Academic Companion — a gamified dashboard for tracking missions (assignments/deadlines), finances, study streaks, and badges. Built with React + Vite, ships as a web app with a claymorphism design system.

## Features

- **Dashboard** — XP progress, next deadline (auto-switches from days to hours as it approaches), study streak, monthly spending at a glance
- **Missions** — assignments/tasks with priority, target date, tags, and XP rewards
- **Vault** — income/expense tracking with categories and savings goals
- **Agenda** — calendar view of upcoming deadlines
- **Hero** — profile, level, badges, and daily quiz (AI-generated via Supabase Edge Function + Gemini)
- Responsive layout — pinned sidebar navigation on desktop, bottom nav on mobile
- Auth and data sync via Supabase (including email-link password reset), with local persistence fallback
- English/Indonesian i18n

## Tech Stack

- React 19 + TypeScript + Vite
- Tailwind CSS
- Supabase (Auth, Postgres, Edge Functions)
- Vitest (unit tests)

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

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production web build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run test` | Run unit tests (Vitest) |
| `npm run clean` | Remove build output directory |

## Project Structure

```
src/
  components/   UI views and modals (Dashboard, Missions, Vault, Agenda, Hero, etc.)
  lib/           Supabase client and local DB/persistence helpers
  utils/         i18n, gamification logic, and other utilities
  types.ts       Shared domain types
supabase/        DB schema and edge functions (generate-quiz)
```

## Deploy

Deployed to [Netlify](https://netlify.com), configured via `netlify.toml` (build command `npm run build`, publish directory `dist`):

1. Push this repo to GitHub/GitLab/Bitbucket.
2. In Netlify: **Add new site → Import an existing project**, pick the repo. Build settings are auto-detected from `netlify.toml`.
3. Add the `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` env vars in Netlify's site settings (Site configuration → Environment variables) — same values as your local `.env`.
4. Deploy. Every push to the connected branch triggers a rebuild.
