import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../shared/theme/app_colors.dart';
import '../providers/assignment_form_provider.dart';
import '../widgets/deadline_chip.dart';
import '../widgets/priority_badge.dart';
import 'assignment_form_screen.dart';

class AssignmentDetailScreen extends ConsumerWidget {
  const AssignmentDetailScreen({super.key, required this.assignment});
  final Assignment assignment;

  Future<void> _confirmDelete(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surfaceContainer,
        title: const Text('Delete mission?'),
        content: Text('"${assignment.title}" will be permanently removed.'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Delete')),
        ],
      ),
    );
    if (confirmed == true) {
      await ref.read(assignmentFormControllerProvider).delete(assignment);
      if (context.mounted) Navigator.of(context).pop();
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Mission Detail'),
        actions: [
          IconButton(
            icon: const Icon(Icons.edit_outlined),
            onPressed: () => Navigator.of(context).push(
              MaterialPageRoute(builder: (_) => AssignmentFormScreen(existing: assignment)),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.delete_outline, color: AppColors.error),
            onPressed: () => _confirmDelete(context, ref),
          ),
        ],
      ),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              assignment.title,
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold, color: AppColors.onSurface),
            ),
            const SizedBox(height: 4),
            Text(assignment.course, style: const TextStyle(color: AppColors.onSurfaceVariant)),
            const SizedBox(height: 16),
            Wrap(spacing: 8, children: [
              PriorityBadge(priority: assignment.priority),
              DeadlineChip(deadlineUtc: assignment.deadline),
            ]),
            if ((assignment.description ?? '').isNotEmpty) ...[
              const SizedBox(height: 16),
              Text(assignment.description!, style: const TextStyle(color: AppColors.onSurface)),
            ],
            const SizedBox(height: 16),
            Text(
              'Deadline: ${assignment.deadline.toLocal()}',
              style: const TextStyle(color: AppColors.onSurfaceVariant, fontSize: 12),
            ),
            if (assignment.reminderTime != null)
              Text(
                'Reminder: ${assignment.reminderTime!.toLocal()}',
                style: const TextStyle(color: AppColors.onSurfaceVariant, fontSize: 12),
              ),
            if (assignment.attachmentPath != null) ...[
              const SizedBox(height: 8),
              Row(children: [
                const Icon(Icons.attach_file, size: 16, color: AppColors.onSurfaceVariant),
                const SizedBox(width: 4),
                Expanded(
                  child: Text(
                    assignment.attachmentPath!,
                    style: const TextStyle(color: AppColors.onSurfaceVariant, fontSize: 12),
                    overflow: TextOverflow.ellipsis,
                  ),
                ),
              ]),
            ],
          ],
        ),
      ),
    );
  }
}
