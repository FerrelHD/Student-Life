import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/database/database_provider.dart';
import '../../data/repositories/transaction_repository_impl.dart';
import '../../domain/repositories/transaction_repository.dart';

final transactionRepositoryProvider = Provider<TransactionRepository>((ref) {
  final db = ref.watch(databaseProvider);
  return TransactionRepositoryImpl(db.transactionDao);
});

final transactionListProvider = StreamProvider<List<Transaction>>((ref) {
  return ref.watch(transactionRepositoryProvider).watchAll();
});

/// Sum of income minus expenses across all recorded transactions.
final totalBalanceProvider = Provider<AsyncValue<double>>((ref) {
  return ref.watch(transactionListProvider).whenData((list) {
    return list.fold<double>(0, (sum, t) {
      return t.type == TransactionType.income ? sum + t.amount : sum - t.amount;
    });
  });
});
