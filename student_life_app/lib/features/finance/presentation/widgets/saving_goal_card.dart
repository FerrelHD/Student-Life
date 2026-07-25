import 'package:flutter/material.dart';
import '../../../../core/database/app_database.dart';
import '../../../../shared/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';

class SavingGoalCard extends StatelessWidget {
  const SavingGoalCard({
    super.key,
    required this.goal,
    required this.onAddFunds,
    required this.onDelete,
  });

  final SavingGoal goal;
  final VoidCallback onAddFunds;
  final VoidCallback onDelete;

  @override
  Widget build(BuildContext context) {
    final pct = goal.targetAmount <= 0 ? 0.0 : (goal.currentAmount / goal.targetAmount).clamp(0.0, 1.0);

    return GlassCard(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Expanded(
                child: Text(
                  goal.title,
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16, color: AppColors.onSurface),
                ),
              ),
              Text('${(pct * 100).round()}%',
                  style: const TextStyle(color: AppColors.primary, fontWeight: FontWeight.w800)),
            ],
          ),
          const SizedBox(height: 10),
          ClipRRect(
            borderRadius: BorderRadius.circular(999),
            child: LinearProgressIndicator(
              value: pct,
              minHeight: 8,
              backgroundColor: Colors.white.withOpacity(0.1),
              valueColor: const AlwaysStoppedAnimation(AppColors.primary),
            ),
          ),
          const SizedBox(height: 8),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('\$${goal.currentAmount.toStringAsFixed(2)} saved',
                  style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceVariant)),
              Text('Target: \$${goal.targetAmount.toStringAsFixed(2)}',
                  style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceVariant)),
            ],
          ),
          Row(
            children: [
              TextButton(onPressed: onAddFunds, child: const Text('Add funds')),
              const Spacer(),
              IconButton(
                onPressed: onDelete,
                icon: const Icon(Icons.delete_outline, color: AppColors.error, size: 20),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
