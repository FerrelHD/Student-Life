import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/database/database_provider.dart';
import '../../data/repositories/saving_goal_repository_impl.dart';
import '../../domain/repositories/saving_goal_repository.dart';

final savingGoalRepositoryProvider = Provider<SavingGoalRepository>((ref) {
  final db = ref.watch(databaseProvider);
  return SavingGoalRepositoryImpl(db.savingGoalDao);
});

final savingGoalListProvider = StreamProvider<List<SavingGoal>>((ref) {
  return ref.watch(savingGoalRepositoryProvider).watchAll();
});

class SavingGoalController {
  SavingGoalController(this._ref);
  final Ref _ref;

  Future<void> create({
    required String title,
    required double targetAmount,
    double currentAmount = 0,
    DateTime? deadline,
  }) {
    return _ref.read(savingGoalRepositoryProvider).create(
          SavingGoalsCompanion.insert(
            title: title,
            targetAmount: targetAmount,
            currentAmount: Value(currentAmount),
            deadline: Value(deadline?.toUtc()),
            createdAt: DateTime.now().toUtc(),
          ),
        );
  }

  Future<void> addContribution(SavingGoal goal, double amount) {
    return _ref.read(savingGoalRepositoryProvider).update(
          goal.copyWith(currentAmount: goal.currentAmount + amount).toCompanion(true),
        );
  }

  Future<void> delete(SavingGoal goal) {
    return _ref.read(savingGoalRepositoryProvider).delete(goal.id);
  }
}

final savingGoalControllerProvider = Provider((ref) => SavingGoalController(ref));
