# Student Life (Flutter)

Flutter rewrite of the Student Life PRD (v1.1) — Assignment, Finance, Dashboard,
Calendar, Statistics, Achievement, and Profile, all backed by a local Drift
(SQLite) database and `shared_preferences`.

## Setup

Flutter SDK: this repo was built against Flutter 3.24.5 (stable) at
`~/development/flutter`. Add it to your `PATH` if it isn't already:

```bash
export PATH="$HOME/development/flutter/bin:$PATH"
```

Then, from `student_life_app/`:

```bash
flutter pub get
dart run build_runner build --delete-conflicting-outputs   # generates Drift .g.dart files
flutter analyze
flutter test
```

## Running the app

```bash
flutter run -d chrome    # or -d macos — no Android SDK is installed in this environment
```

**Android SDK is not installed in this environment.** `flutter doctor` will
show the Android toolchain as missing. To build/run on an Android device or
emulator:

1. Install Android Studio (or just the command-line SDK tools).
2. `flutter doctor --android-licenses` to accept licenses.
3. `flutter run -d <android-device-id>` or `flutter build apk`.

## Regenerating Drift code

Any time a table in `lib/core/database/tables/` changes, re-run:

```bash
dart run build_runner build --delete-conflicting-outputs
```

and bump `AppDatabase.schemaVersion` + add a migration step, per the PRD's
"Aturan hindar bug".

## Tests

- `test/assignment_dao_test.dart`, `test/finance_dao_test.dart` — DAO CRUD
  roundtrips against an in-memory Drift database.
- `test/widget_test.dart` — app boot (setup screen on first run, dashboard +
  bottom nav once a profile exists).
