import 'package:drift/drift.dart';
import '../app_database.dart';

part 'assignment_dao.g.dart';

@DriftAccessor(tables: [Assignments])
class AssignmentDao extends DatabaseAccessor<AppDatabase> with _$AssignmentDaoMixin {
  AssignmentDao(super.db);

  Stream<List<Assignment>> watchAll() =>
      (select(assignments)..orderBy([(t) => OrderingTerm.asc(t.deadline)])).watch();

  Future<Assignment?> getById(int id) =>
      (select(assignments)..where((t) => t.id.equals(id))).getSingleOrNull();

  Future<int> insertAssignment(AssignmentsCompanion entry) => into(assignments).insert(entry);

  Future<bool> updateAssignment(AssignmentsCompanion entry) => update(assignments).replace(entry);

  Future<int> deleteAssignment(int id) =>
      (delete(assignments)..where((t) => t.id.equals(id))).go();
}
