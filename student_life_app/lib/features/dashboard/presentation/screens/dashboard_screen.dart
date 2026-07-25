import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'package:percent_indicator/percent_indicator.dart';
import '../../../../core/config/app_tab.dart';
import '../../../../core/database/app_database.dart';
import '../../../../shared/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../../../achievement/presentation/providers/achievement_provider.dart';
import '../../../assignment/presentation/providers/assignment_list_provider.dart';
import '../../../assignment/presentation/widgets/deadline_chip.dart';
import '../../../finance/presentation/providers/saving_goal_provider.dart';
import '../../../finance/presentation/providers/transaction_list_provider.dart';
import '../../../profile/presentation/providers/profile_provider.dart';

class DashboardScreen extends ConsumerWidget {
  const DashboardScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(profileProvider).valueOrNull;
    final assignments = ref.watch(assignmentListProvider).valueOrNull ?? const [];
    final balance = ref.watch(totalBalanceProvider).valueOrNull ?? 0;
    final goals = ref.watch(savingGoalListProvider).valueOrNull ?? const [];
    final achievements = ref.watch(achievementListProvider);

    final pending = assignments.where((a) => a.status == AssignmentStatus.pending).toList();
    final nearest = pending.isEmpty
        ? null
        : (pending.toList()..sort((a, b) => a.deadline.compareTo(b.deadline))).first;
    final completedCount = assignments.length - pending.length;
    final completionPct = assignments.isEmpty ? 0.0 : completedCount / assignments.length;
    final primaryGoal = goals.isEmpty ? null : goals.first;

    return Scaffold(
      appBar: AppBar(title: const Text('Student Life')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 96),
          children: [
            Text(
              'Halo, ${profile?.name.isNotEmpty == true ? profile!.name : 'Student'}! \u{1F44B}',
              style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: AppColors.onSurface),
            ),
            const SizedBox(height: 16),

            // Above-the-fold: nearest deadline + streak (PRD review note).
            GlassCard(
              blur: true,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('NEXT DEADLINE',
                      style: TextStyle(fontSize: 11, color: AppColors.primary, letterSpacing: 1)),
                  const SizedBox(height: 6),
                  if (nearest == null)
                    const Text('No active missions', style: TextStyle(color: AppColors.onSurfaceVariant))
                  else ...[
                    Text(nearest.title,
                        style: const TextStyle(
                            fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.onSurface)),
                    const SizedBox(height: 4),
                    Text(nearest.course, style: const TextStyle(color: AppColors.onSurfaceVariant)),
                    const SizedBox(height: 10),
                    DeadlineChip(deadlineUtc: nearest.deadline),
                  ],
                  const SizedBox(height: 12),
                  OutlinedButton(
                    onPressed: () => context.go(AppTab.missions.path),
                    child: const Text('View Missions'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            GlassCard(
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Text('STUDY STREAK',
                          style: TextStyle(fontSize: 11, color: AppColors.onSurfaceVariant, letterSpacing: 1)),
                      const SizedBox(height: 6),
                      Text('\u{1F525} ${profile?.streakDays ?? 0} Days',
                          style: const TextStyle(
                              fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.onSurface)),
                    ],
                  ),
                  FilledButton(
                    onPressed: () => ref.read(profileProvider.notifier).logStudySession(),
                    style: FilledButton.styleFrom(backgroundColor: AppColors.primary),
                    child: const Text('Log session'),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),
            const Text('More', style: TextStyle(fontSize: 12, color: AppColors.onSurfaceVariant, letterSpacing: 1)),
            const SizedBox(height: 8),

            GlassCard(
              child: Row(
                children: [
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('BALANCE',
                            style: TextStyle(fontSize: 11, color: AppColors.onSurfaceVariant, letterSpacing: 1)),
                        const SizedBox(height: 4),
                        Text('\$${balance.toStringAsFixed(2)}',
                            style: const TextStyle(
                                fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.primaryLight)),
                      ],
                    ),
                  ),
                  TextButton(onPressed: () => context.go(AppTab.vault.path), child: const Text('Open Vault')),
                ],
              ),
            ),
            const SizedBox(height: 12),

            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('SAVING GOAL',
                      style: TextStyle(fontSize: 11, color: AppColors.onSurfaceVariant, letterSpacing: 1)),
                  const SizedBox(height: 8),
                  if (primaryGoal == null)
                    const Text('No saving goal yet', style: TextStyle(color: AppColors.onSurfaceVariant))
                  else ...[
                    Text(primaryGoal.title,
                        style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.onSurface)),
                    const SizedBox(height: 6),
                    LinearPercentIndicator(
                      percent: primaryGoal.targetAmount <= 0
                          ? 0
                          : (primaryGoal.currentAmount / primaryGoal.targetAmount).clamp(0, 1),
                      lineHeight: 8,
                      barRadius: const Radius.circular(999),
                      backgroundColor: Colors.white.withOpacity(0.1),
                      progressColor: AppColors.primary,
                      padding: EdgeInsets.zero,
                    ),
                  ],
                ],
              ),
            ),
            const SizedBox(height: 12),

            GlassCard(
              child: Row(
                children: [
                  CircularPercentIndicator(
                    radius: 36,
                    lineWidth: 8,
                    percent: completionPct,
                    progressColor: AppColors.primary,
                    backgroundColor: Colors.white.withOpacity(0.08),
                    center: Text('${(completionPct * 100).round()}%',
                        style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.onSurface)),
                  ),
                  const SizedBox(width: 16),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text('TASK COMPLETION',
                            style: TextStyle(fontSize: 11, color: AppColors.onSurfaceVariant, letterSpacing: 1)),
                        const SizedBox(height: 4),
                        Text('$completedCount of ${assignments.length} missions completed',
                            style: const TextStyle(color: AppColors.onSurface)),
                        if ((profile?.semester ?? '').isNotEmpty)
                          Text('Semester ${profile!.semester}',
                              style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceVariant)),
                      ],
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),

            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('RECENT ACHIEVEMENTS',
                      style: TextStyle(fontSize: 11, color: AppColors.onSurfaceVariant, letterSpacing: 1)),
                  const SizedBox(height: 10),
                  SizedBox(
                    height: 84,
                    child: ListView.separated(
                      scrollDirection: Axis.horizontal,
                      itemCount: achievements.length,
                      separatorBuilder: (_, __) => const SizedBox(width: 10),
                      itemBuilder: (context, index) {
                        final badge = achievements[index];
                        return Opacity(
                          opacity: badge.unlocked ? 1 : 0.4,
                          child: Container(
                            width: 130,
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: AppColors.surfaceContainerLow,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(color: AppColors.glassBorder),
                            ),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Icon(badge.icon, color: AppColors.primary, size: 20),
                                const SizedBox(height: 6),
                                Text(badge.title,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(
                                        fontSize: 12, fontWeight: FontWeight.bold, color: AppColors.onSurface)),
                                Text(badge.subtitle,
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                    style: const TextStyle(fontSize: 10, color: AppColors.onSurfaceVariant)),
                              ],
                            ),
                          ),
                        );
                      },
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
