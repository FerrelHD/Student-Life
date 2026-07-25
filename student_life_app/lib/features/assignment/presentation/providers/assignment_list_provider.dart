import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/database/database_provider.dart';
import '../../data/repositories/assignment_repository_impl.dart';
import '../../domain/repositories/assignment_repository.dart';
import 'assignment_filter_provider.dart';

final assignmentRepositoryProvider = Provider<AssignmentRepository>((ref) {
  final db = ref.watch(databaseProvider);
  return AssignmentRepositoryImpl(db.assignmentDao);
});

final assignmentListProvider = StreamProvider<List<Assignment>>((ref) {
  return ref.watch(assignmentRepositoryProvider).watchAll();
});

final filteredAssignmentsProvider = Provider<AsyncValue<List<Assignment>>>((ref) {
  final search = ref.watch(assignmentSearchProvider).trim().toLowerCase();
  final filter = ref.watch(assignmentFilterProvider);
  final asyncList = ref.watch(assignmentListProvider);

  return asyncList.whenData((list) {
    return list.where((a) {
      final matchesSearch = search.isEmpty ||
          a.title.toLowerCase().contains(search) ||
          a.course.toLowerCase().contains(search);
      if (!matchesSearch) return false;

      switch (filter) {
        case AssignmentFilter.pending:
          return a.status == AssignmentStatus.pending;
        case AssignmentFilter.done:
          return a.status == AssignmentStatus.completed;
        case AssignmentFilter.priority:
          return a.priority == AssignmentPriority.high && a.status == AssignmentStatus.pending;
        case AssignmentFilter.all:
          return true;
      }
    }).toList();
  });
});
