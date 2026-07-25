import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../shared/theme/app_colors.dart';
import '../providers/achievement_provider.dart';

class AchievementScreen extends ConsumerWidget {
  const AchievementScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final badges = ref.watch(achievementListProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Achievements')),
      body: GridView.builder(
        padding: const EdgeInsets.all(16),
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          mainAxisSpacing: 12,
          crossAxisSpacing: 12,
          childAspectRatio: 1.1,
        ),
        itemCount: badges.length,
        itemBuilder: (context, index) {
          final badge = badges[index];
          return Opacity(
            opacity: badge.unlocked ? 1 : 0.4,
            child: Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: badge.unlocked ? AppColors.primary.withOpacity(0.4) : AppColors.glassBorder,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Icon(badge.icon, color: AppColors.primary, size: 28),
                  const Spacer(),
                  Text(badge.title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.onSurface)),
                  const SizedBox(height: 4),
                  Text(badge.subtitle, style: const TextStyle(fontSize: 11, color: AppColors.onSurfaceVariant)),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
