import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../shared/theme/app_colors.dart';
import '../providers/assignment_filter_provider.dart';
import '../providers/assignment_form_provider.dart';
import '../providers/assignment_list_provider.dart';
import '../widgets/assignment_card.dart';
import '../widgets/filter_chip_bar.dart';
import 'assignment_detail_screen.dart';
import 'assignment_form_screen.dart';

class AssignmentListScreen extends ConsumerWidget {
  const AssignmentListScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final filtered = ref.watch(filteredAssignmentsProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Missions')),
      floatingActionButton: FloatingActionButton(
        backgroundColor: AppColors.primary,
        onPressed: () => Navigator.of(context).push(
          MaterialPageRoute(builder: (_) => const AssignmentFormScreen()),
        ),
        child: const Icon(Icons.add),
      ),
      body: SafeArea(
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(16, 12, 16, 12),
              child: TextField(
                onChanged: (v) => ref.read(assignmentSearchProvider.notifier).state = v,
                decoration: InputDecoration(
                  hintText: 'Scan for active missions...',
                  prefixIcon: const Icon(Icons.search),
                  filled: true,
                  fillColor: AppColors.surfaceContainerLow,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide.none,
                  ),
                ),
              ),
            ),
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 16),
              child: FilterChipBar(),
            ),
            const SizedBox(height: 8),
            Expanded(
              child: filtered.when(
                data: (list) {
                  if (list.isEmpty) {
                    return const Center(
                      child: Text('No missions yet', style: TextStyle(color: AppColors.onSurfaceVariant)),
                    );
                  }
                  return ListView.separated(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 96),
                    itemCount: list.length,
                    separatorBuilder: (_, __) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final assignment = list[index];
                      return AssignmentCard(
                        assignment: assignment,
                        onToggle: () =>
                            ref.read(assignmentFormControllerProvider).toggleComplete(assignment),
                        onTap: () => Navigator.of(context).push(
                          MaterialPageRoute(
                            builder: (_) => AssignmentDetailScreen(assignment: assignment),
                          ),
                        ),
                      );
                    },
                  );
                },
                loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary)),
                error: (e, _) => Center(
                  child: Text('Error: $e', style: const TextStyle(color: AppColors.error)),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
