import 'dart:io';
import 'package:drift/drift.dart';
import 'package:drift/native.dart';
import 'package:path/path.dart' as p;
import 'package:path_provider/path_provider.dart';

import 'tables/assignments_table.dart';
import 'tables/transactions_table.dart';
import 'tables/saving_goals_table.dart';
import 'daos/assignment_dao.dart';
import 'daos/transaction_dao.dart';
import 'daos/saving_goal_dao.dart';

export 'tables/assignments_table.dart';
export 'tables/transactions_table.dart';
export 'tables/saving_goals_table.dart';

part 'app_database.g.dart';

@DriftDatabase(
  tables: [Assignments, Transactions, SavingGoals],
  daos: [AssignmentDao, TransactionDao, SavingGoalDao],
)
class AppDatabase extends _$AppDatabase {
  AppDatabase([QueryExecutor? executor]) : super(executor ?? _openConnection());

  @override
  int get schemaVersion => 1;

  static QueryExecutor _openConnection() {
    return LazyDatabase(() async {
      final dbFolder = await getApplicationDocumentsDirectory();
      final file = File(p.join(dbFolder.path, 'student_life.sqlite'));
      return NativeDatabase.createInBackground(file);
    });
  }
}
