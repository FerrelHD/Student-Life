import 'package:flutter/material.dart';
import '../../../../core/database/app_database.dart';
import '../../../../shared/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';
import 'deadline_chip.dart';
import 'priority_badge.dart';

class AssignmentCard extends StatelessWidget {
  const AssignmentCard({
    super.key,
    required this.assignment,
    required this.onToggle,
    required this.onTap,
  });

  final Assignment assignment;
  final VoidCallback onToggle;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    final completed = assignment.status == AssignmentStatus.completed;

    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(16),
      child: Opacity(
        opacity: completed ? 0.6 : 1,
        child: GlassCard(
          borderColor: assignment.priority == AssignmentPriority.high
              ? AppColors.primary.withOpacity(0.4)
              : null,
          child: Row(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      assignment.title,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: AppColors.onSurface,
                        decoration: completed ? TextDecoration.lineThrough : null,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      assignment.course,
                      style: TextStyle(fontSize: 13, color: AppColors.onSurfaceVariant.withOpacity(0.7)),
                    ),
                    const SizedBox(height: 10),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        PriorityBadge(priority: assignment.priority),
                        DeadlineChip(deadlineUtc: assignment.deadline),
                      ],
                    ),
                  ],
                ),
              ),
              Checkbox(
                value: completed,
                onChanged: (_) => onToggle(),
                activeColor: AppColors.primary,
              ),
            ],
          ),
        ),
      ),
    );
  }
}
