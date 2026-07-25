import 'package:drift/drift.dart' show Value;
import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_life_app/core/database/app_database.dart';

void main() {
  late AppDatabase db;

  setUp(() => db = AppDatabase(NativeDatabase.memory()));
  tearDown(() => db.close());

  test('transaction CRUD roundtrip and balance math', () async {
    final now = DateTime.now().toUtc();
    await db.transactionDao.insertTransaction(TransactionsCompanion.insert(
      title: 'Internship Stipend',
      type: TransactionType.income,
      amount: 850,
      date: now,
      createdAt: now,
    ));
    final expenseId = await db.transactionDao.insertTransaction(TransactionsCompanion.insert(
      title: 'Cyber Cafe Brunch',
      type: TransactionType.expense,
      category: const Value(TransactionCategory.food),
      amount: 18.5,
      date: now,
      createdAt: now,
    ));

    final all = await db.transactionDao.watchAll().first;
    expect(all.length, 2);

    await db.transactionDao.deleteTransaction(expenseId);
    expect((await db.transactionDao.watchAll().first).length, 1);
  });

  test('saving goal CRUD roundtrip', () async {
    final id = await db.savingGoalDao.insertGoal(SavingGoalsCompanion.insert(
      title: 'New MacBook Pro',
      targetAmount: 2000,
      createdAt: DateTime.now().toUtc(),
    ));

    final goals = await db.savingGoalDao.watchAll().first;
    final goal = goals.firstWhere((g) => g.id == id);
    expect(goal.currentAmount, 0);

    await db.savingGoalDao.updateGoal(goal.copyWith(currentAmount: 1300).toCompanion(true));
    final updated = (await db.savingGoalDao.watchAll().first).firstWhere((g) => g.id == id);
    expect(updated.currentAmount, 1300);

    await db.savingGoalDao.deleteGoal(id);
    expect(await db.savingGoalDao.watchAll().first, isEmpty);
  });
}
