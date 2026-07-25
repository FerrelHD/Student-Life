import '../../../../core/database/app_database.dart';
import '../../../../core/database/daos/saving_goal_dao.dart';
import '../../domain/repositories/saving_goal_repository.dart';

class SavingGoalRepositoryImpl implements SavingGoalRepository {
  SavingGoalRepositoryImpl(this._dao);
  final SavingGoalDao _dao;

  @override
  Stream<List<SavingGoal>> watchAll() => _dao.watchAll();

  @override
  Future<int> create(SavingGoalsCompanion entry) => _dao.insertGoal(entry);

  @override
  Future<bool> update(SavingGoalsCompanion entry) => _dao.updateGoal(entry);

  @override
  Future<void> delete(int id) => _dao.deleteGoal(id);
}
