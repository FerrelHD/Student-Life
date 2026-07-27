# Student Life

Operative Life & Academic Companion — a gamified dashboard for tracking missions (assignments/deadlines), finances, study streaks, and badges. Built with React + Vite, ships as a web app, an Android/iOS app (Capacitor), or an Electron desktop app.

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
- Capacitor (Android/iOS packaging)
- Electron (desktop packaging)
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

### Run (desktop / Electron)

```bash
npm run electron:dev
```

### Run (Android / iOS)

```bash
npm run cap:sync      # builds the web app and copies it into android/ and ios/
npm run android:open  # opens the project in Android Studio
npm run ios:open      # opens the project in Xcode (macOS only)
```

Requires Android Studio (with an Android SDK) for Android, or a full Xcode install (not just Command Line Tools) for iOS. From there, run the app on an emulator/device like any native project.

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Production web build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Type-check with `tsc --noEmit` |
| `npm run test` | Run unit tests (Vitest) |
| `npm run cap:sync` | Build and sync the web app into the native Android/iOS projects |
| `npm run android:open` | Open the Android project in Android Studio |
| `npm run ios:open` | Open the iOS project in Xcode |
| `npm run electron:dev` | Run the Electron desktop app in dev mode |
| `npm run electron:build` | Build the packaged Electron app |
| `npm run clean` | Remove build output directories |

## Project Structure

```
src/
  components/   UI views and modals (Dashboard, Missions, Vault, Agenda, Hero, etc.)
  lib/           Supabase client and local DB/persistence helpers
  utils/         i18n, gamification logic, and other utilities
  types.ts       Shared domain types
android/         Capacitor Android native project
ios/             Capacitor iOS native project
capacitor.config.ts  Capacitor app config (appId, appName, webDir)
electron/        Electron main process
supabase/        DB schema and edge functions (generate-quiz)
```

## Releasing

### Version bump (do this for every release)

Three places need to match before a release build:

1. `package.json` → `"version"`
2. `android/app/build.gradle` → `versionCode` (increment every release) and `versionName`
3. iOS target's General tab in Xcode (or `ios/App/App.xcodeproj/project.pbxproj`) → `CURRENT_PROJECT_VERSION` (build number) and `MARKETING_VERSION`

### Android release signing

1. Generate a release keystore once (needs a JDK installed): `keytool -genkeypair -v -keystore student-life-release.jks -alias studentlife -keyalg RSA -keysize 2048 -validity 10000`
2. Copy `android/keystore.properties.example` to `android/keystore.properties` and fill in the real path/passwords. This file is git-ignored — never commit it.
3. `npm run cap:sync && npm run android:open`, then build a signed release APK/AAB from Android Studio (Build → Generate Signed Bundle/APK).

### iOS release signing

Requires an enrolled [Apple Developer Program](https://developer.apple.com/programs/) account ($99/year). In Xcode: select the App target → Signing & Capabilities → choose your Team. Xcode handles provisioning automatically once a team is selected.

### App icon

No custom icon exists yet — both platforms currently ship Capacitor's default placeholder icon. Once you have a 1024×1024 source PNG, run `npx @capacitor/assets generate` to produce all required icon/splash sizes for both platforms.

### Store submission checklist

- Privacy policy: see [`PRIVACY.md`](./PRIVACY.md), host it somewhere with a stable URL (e.g. GitHub Pages) — both stores require this link since the app collects account/profile data.
- **Google Play Console**: create the app, fill out the content rating questionnaire and Data Safety form (references the privacy policy), upload screenshots, upload the signed AAB.
- **App Store Connect**: create the app record, fill out the App Privacy / data-collection disclosure, upload screenshots, submit the signed build via Xcode or Transporter.
