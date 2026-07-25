import 'package:drift/drift.dart';
import '../app_database.dart';

part 'saving_goal_dao.g.dart';

@DriftAccessor(tables: [SavingGoals])
class SavingGoalDao extends DatabaseAccessor<AppDatabase> with _$SavingGoalDaoMixin {
  SavingGoalDao(super.db);

  Stream<List<SavingGoal>> watchAll() =>
      (select(savingGoals)..orderBy([(t) => OrderingTerm.asc(t.createdAt)])).watch();

  Future<int> insertGoal(SavingGoalsCompanion entry) => into(savingGoals).insert(entry);

  Future<bool> updateGoal(SavingGoalsCompanion entry) => update(savingGoals).replace(entry);

  Future<int> deleteGoal(int id) => (delete(savingGoals)..where((t) => t.id.equals(id))).go();
}
