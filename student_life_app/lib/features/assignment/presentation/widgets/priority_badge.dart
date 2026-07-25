import 'package:flutter/material.dart';
import '../../../../core/database/app_database.dart';
import '../../../../shared/theme/app_colors.dart';

class PriorityBadge extends StatelessWidget {
  const PriorityBadge({super.key, required this.priority});
  final AssignmentPriority priority;

  @override
  Widget build(BuildContext context) {
    late final String label;
    late final Color color;
    switch (priority) {
      case AssignmentPriority.high:
        label = 'High Priority';
        color = AppColors.priorityHigh;
        break;
      case AssignmentPriority.medium:
        label = 'Medium Priority';
        color = AppColors.priorityMedium;
        break;
      case AssignmentPriority.low:
        label = 'Low Priority';
        color = AppColors.priorityLow;
        break;
    }

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Text(
        label,
        style: TextStyle(fontSize: 11, color: color, fontWeight: FontWeight.w600),
      ),
    );
  }
}
