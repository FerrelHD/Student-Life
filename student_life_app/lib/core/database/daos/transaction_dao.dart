import 'package:drift/drift.dart';
import '../app_database.dart';

part 'transaction_dao.g.dart';

@DriftAccessor(tables: [Transactions])
class TransactionDao extends DatabaseAccessor<AppDatabase> with _$TransactionDaoMixin {
  TransactionDao(super.db);

  Stream<List<Transaction>> watchAll() =>
      (select(transactions)..orderBy([(t) => OrderingTerm.desc(t.date)])).watch();

  Future<int> insertTransaction(TransactionsCompanion entry) => into(transactions).insert(entry);

  Future<bool> updateTransaction(TransactionsCompanion entry) => update(transactions).replace(entry);

  Future<int> deleteTransaction(int id) =>
      (delete(transactions)..where((t) => t.id.equals(id))).go();
}
