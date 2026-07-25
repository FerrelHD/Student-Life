import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import 'transaction_list_provider.dart';

class TransactionFormController {
  TransactionFormController(this._ref);
  final Ref _ref;

  Future<void> create({
    required String title,
    required TransactionType type,
    TransactionCategory? category,
    required double amount,
    required DateTime date,
  }) {
    final now = DateTime.now().toUtc();
    return _ref.read(transactionRepositoryProvider).create(
          TransactionsCompanion.insert(
            title: title,
            type: type,
            category: Value(type == TransactionType.expense ? category : null),
            amount: amount,
            date: date.toUtc(),
            createdAt: now,
          ),
        );
  }

  Future<void> delete(Transaction transaction) {
    return _ref.read(transactionRepositoryProvider).delete(transaction.id);
  }
}

final transactionFormControllerProvider = Provider((ref) => TransactionFormController(ref));
