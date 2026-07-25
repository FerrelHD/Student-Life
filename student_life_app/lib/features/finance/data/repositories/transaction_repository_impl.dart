import '../../../../core/database/app_database.dart';
import '../../../../core/database/daos/transaction_dao.dart';
import '../../domain/repositories/transaction_repository.dart';

class TransactionRepositoryImpl implements TransactionRepository {
  TransactionRepositoryImpl(this._dao);
  final TransactionDao _dao;

  @override
  Stream<List<Transaction>> watchAll() => _dao.watchAll();

  @override
  Future<int> create(TransactionsCompanion entry) => _dao.insertTransaction(entry);

  @override
  Future<bool> update(TransactionsCompanion entry) => _dao.updateTransaction(entry);

  @override
  Future<void> delete(int id) => _dao.deleteTransaction(id);
}
