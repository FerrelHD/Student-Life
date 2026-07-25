import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../assignment/presentation/providers/assignment_list_provider.dart';
import '../../../finance/presentation/providers/saving_goal_provider.dart';
import '../../../profile/presentation/providers/profile_provider.dart';

class AchievementBadge {
  const AchievementBadge({
    required this.id,
    required this.title,
    required this.subtitle,
    required this.icon,
    required this.unlocked,
  });

  final String id;
  final String title;
  final String subtitle;
  final IconData icon;
  final bool unlocked;
}

/// Badge unlock conditions from PRD Module 6 examples, computed live from
/// Assignment/Finance/Profile state — no separate DB table needed.
final achievementListProvider = Provider<List<AchievementBadge>>((ref) {
  final assignments = ref.watch(assignmentListProvider).valueOrNull ?? const [];
  final goals = ref.watch(savingGoalListProvider).valueOrNull ?? const [];
  final profile = ref.watch(profileProvider).valueOrNull;

  final completedCount = assignments.where((a) => a.status == AssignmentStatus.completed).length;
  final maxSaved =
      goals.isEmpty ? 0.0 : goals.map((g) => g.currentAmount).reduce((a, b) => a > b ? a : b);
  final streak = profile?.streakDays ?? 0;

  final now = DateTime.now();
  final startOfWeek = DateTime(now.year, now.month, now.day).subtract(Duration(days: now.weekday - 1));
  final thisWeek = assignments.where((a) => a.deadline.toLocal().isAfter(startOfWeek)).toList();
  final allThisWeekDone =
      thisWeek.isNotEmpty && thisWeek.every((a) => a.status == AssignmentStatus.completed);

  return [
    AchievementBadge(
      id: 'submit_10',
      title: 'Submit 10 Tugas',
      subtitle: '$completedCount / 10 completed',
      icon: Icons.assignment_turned_in,
      unlocked: completedCount >= 10,
    ),
    AchievementBadge(
      id: 'study_30',
      title: 'Study 30 Hari',
      subtitle: '$streak / 30 day streak',
      icon: Icons.local_fire_department,
      unlocked: streak >= 30,
    ),
    AchievementBadge(
      id: 'nabung_1jt',
      title: 'Nabung 1 Juta',
      subtitle: '\$${maxSaved.toStringAsFixed(0)} / \$1,000,000',
      icon: Icons.savings,
      unlocked: maxSaved >= 1000000,
    ),
    AchievementBadge(
      id: 'week_clear',
      title: 'Semua Tugas Minggu Ini Selesai',
      subtitle: allThisWeekDone ? 'Cleared!' : 'In progress',
      icon: Icons.checklist,
      unlocked: allThisWeekDone,
    ),
  ];
});
