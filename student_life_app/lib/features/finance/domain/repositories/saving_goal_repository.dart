import '../../../../core/database/app_database.dart';

abstract class SavingGoalRepository {
  Stream<List<SavingGoal>> watchAll();
  Future<int> create(SavingGoalsCompanion entry);
  Future<bool> update(SavingGoalsCompanion entry);
  Future<void> delete(int id);
}
