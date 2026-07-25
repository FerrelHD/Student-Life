import 'dart:convert';

import 'package:drift/native.dart';
import 'package:flutter/widgets.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';

import 'package:student_life_app/core/database/app_database.dart';
import 'package:student_life_app/core/database/database_provider.dart';
import 'package:student_life_app/features/profile/domain/models/user_profile.dart';
import 'package:student_life_app/main.dart';

void main() {
  testWidgets('Empty profile shows the first-run setup screen', (tester) async {
    SharedPreferences.setMockInitialValues({});

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          databaseProvider.overrideWithValue(AppDatabase(NativeDatabase.memory())),
        ],
        child: const StudentLifeApp(),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Set up your profile to get started'), findsOneWidget);
    expect(find.text('Get Started'), findsOneWidget);

    await tester.pumpWidget(const SizedBox.shrink());
    await tester.pump(const Duration(milliseconds: 10));
  });

  testWidgets('Setup-complete profile boots straight to Dashboard, bottom nav switches tabs', (tester) async {
    SharedPreferences.setMockInitialValues({
      'user_profile_v1': jsonEncode(const UserProfile(name: 'Test Student').toJson()),
    });

    await tester.pumpWidget(
      ProviderScope(
        overrides: [
          databaseProvider.overrideWithValue(AppDatabase(NativeDatabase.memory())),
        ],
        child: const StudentLifeApp(),
      ),
    );
    await tester.pumpAndSettle();

    expect(find.text('Dashboard'), findsWidgets);

    await tester.tap(find.text('Missions'));
    await tester.pumpAndSettle();
    expect(find.text('Missions'), findsWidgets);

    // Dispose within the test body so Drift's stream-cancel timer fires
    // before flutter_test's pending-timer teardown check.
    await tester.pumpWidget(const SizedBox.shrink());
    await tester.pump(const Duration(milliseconds: 10));
  });
}
