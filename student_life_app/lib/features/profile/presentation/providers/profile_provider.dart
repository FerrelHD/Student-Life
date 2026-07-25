import 'dart:convert';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../domain/models/user_profile.dart';

const _prefsKey = 'user_profile_v1';

class ProfileNotifier extends AsyncNotifier<UserProfile> {
  @override
  Future<UserProfile> build() async {
    final prefs = await SharedPreferences.getInstance();
    final raw = prefs.getString(_prefsKey);
    if (raw == null) return const UserProfile();
    return UserProfile.fromJson(jsonDecode(raw) as Map<String, dynamic>);
  }

  Future<void> _persist(UserProfile profile) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_prefsKey, jsonEncode(profile.toJson()));
    state = AsyncData(profile);
  }

  Future<void> updateProfile(UserProfile Function(UserProfile current) updater) {
    final current = state.valueOrNull ?? const UserProfile();
    return _persist(updater(current));
  }

  /// Bumps the streak once per calendar day; resets to 1 if a day was missed.
  Future<void> logStudySession() {
    final current = state.valueOrNull ?? const UserProfile();
    final today = DateTime.now();
    final last = current.lastStudyLogDate;

    bool isSameDay(DateTime a, DateTime b) => a.year == b.year && a.month == b.month && a.day == b.day;
    if (last != null && isSameDay(last, today)) return Future.value();

    final isConsecutiveDay =
        last != null && today.difference(DateTime(last.year, last.month, last.day)).inDays == 1;

    return _persist(current.copyWith(
      streakDays: isConsecutiveDay ? current.streakDays + 1 : 1,
      lastStudyLogDate: today,
    ));
  }

  Future<void> resetToDefault() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_prefsKey);
    state = const AsyncData(UserProfile());
  }
}

final profileProvider = AsyncNotifierProvider<ProfileNotifier, UserProfile>(ProfileNotifier.new);
