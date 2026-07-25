import 'package:flutter_riverpod/flutter_riverpod.dart';

enum AssignmentFilter { all, pending, priority, done }

final assignmentSearchProvider = StateProvider<String>((ref) => '');
final assignmentFilterProvider = StateProvider<AssignmentFilter>((ref) => AssignmentFilter.all);
