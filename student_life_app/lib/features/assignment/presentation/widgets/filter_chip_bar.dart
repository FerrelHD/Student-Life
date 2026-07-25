import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../shared/theme/app_colors.dart';
import '../providers/assignment_filter_provider.dart';

class FilterChipBar extends ConsumerWidget {
  const FilterChipBar({super.key});

  static const _labels = {
    AssignmentFilter.all: 'All',
    AssignmentFilter.pending: 'Pending',
    AssignmentFilter.priority: 'Priority',
    AssignmentFilter.done: 'Done',
  };

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final active = ref.watch(assignmentFilterProvider);
    return SizedBox(
      height: 36,
      child: ListView.separated(
        scrollDirection: Axis.horizontal,
        itemCount: AssignmentFilter.values.length,
        separatorBuilder: (_, __) => const SizedBox(width: 8),
        itemBuilder: (context, index) {
          final filter = AssignmentFilter.values[index];
          final isActive = active == filter;
          return ChoiceChip(
            label: Text(_labels[filter]!),
            selected: isActive,
            onSelected: (_) => ref.read(assignmentFilterProvider.notifier).state = filter,
            selectedColor: AppColors.primary,
            backgroundColor: AppColors.surfaceContainerLow,
            side: const BorderSide(color: AppColors.glassBorder),
            labelStyle: TextStyle(
              color: isActive ? AppColors.errorContainer : AppColors.onSurfaceVariant,
              fontWeight: FontWeight.w600,
              fontSize: 12,
            ),
          );
        },
      ),
    );
  }
}
