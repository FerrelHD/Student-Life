import 'package:flutter/material.dart';
import '../../../../shared/theme/app_colors.dart';

class DeadlineChip extends StatelessWidget {
  const DeadlineChip({super.key, required this.deadlineUtc});
  final DateTime deadlineUtc;

  String _label() {
    final diff = deadlineUtc.toLocal().difference(DateTime.now());
    if (diff.isNegative) return 'Overdue';
    if (diff.inDays >= 1) return 'Due in ${diff.inDays}d';
    if (diff.inHours >= 1) return 'Due in ${diff.inHours}h';
    if (diff.inMinutes >= 1) return 'Due in ${diff.inMinutes}m';
    return 'Due now';
  }

  @override
  Widget build(BuildContext context) {
    final label = _label();
    final urgent = !label.endsWith('d');

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.05),
        borderRadius: BorderRadius.circular(999),
        border: Border.all(color: AppColors.glassBorder),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 11,
          color: urgent ? AppColors.primary : AppColors.onSurfaceVariant,
        ),
      ),
    );
  }
}
