import '../../../../core/database/app_database.dart';

/// Simplified Clean Architecture per PRD: no separate entity layer, the
/// Drift-generated model (`Assignment`/`AssignmentsCompanion`) is reused
/// directly across domain and presentation.
abstract class AssignmentRepository {
  Stream<List<Assignment>> watchAll();
  Future<Assignment?> getById(int id);
  Future<int> create(AssignmentsCompanion entry);
  Future<bool> update(AssignmentsCompanion entry);
  Future<void> delete(int id);
}
