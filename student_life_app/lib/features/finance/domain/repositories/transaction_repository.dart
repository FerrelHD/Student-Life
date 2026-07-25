import '../../../../core/database/app_database.dart';

abstract class TransactionRepository {
  Stream<List<Transaction>> watchAll();
  Future<int> create(TransactionsCompanion entry);
  Future<bool> update(TransactionsCompanion entry);
  Future<void> delete(int id);
}
