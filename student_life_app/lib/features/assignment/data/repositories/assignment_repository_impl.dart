import '../../../../core/database/app_database.dart';
import '../../../../core/database/daos/assignment_dao.dart';
import '../../domain/repositories/assignment_repository.dart';

class AssignmentRepositoryImpl implements AssignmentRepository {
  AssignmentRepositoryImpl(this._dao);
  final AssignmentDao _dao;

  @override
  Stream<List<Assignment>> watchAll() => _dao.watchAll();

  @override
  Future<Assignment?> getById(int id) => _dao.getById(id);

  @override
  Future<int> create(AssignmentsCompanion entry) => _dao.insertAssignment(entry);

  @override
  Future<bool> update(AssignmentsCompanion entry) => _dao.updateAssignment(entry);

  @override
  Future<void> delete(int id) => _dao.deleteAssignment(id);
}
