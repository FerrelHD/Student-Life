import 'package:flutter/material.dart';
import '../../../../core/database/app_database.dart';
import '../../../../shared/theme/app_colors.dart';

class TransactionTile extends StatelessWidget {
  const TransactionTile({super.key, required this.transaction, required this.onDelete});
  final Transaction transaction;
  final VoidCallback onDelete;

  IconData get _icon {
    if (transaction.type == TransactionType.income) return Icons.work_outline;
    switch (transaction.category) {
      case TransactionCategory.food:
        return Icons.lunch_dining;
      case TransactionCategory.transport:
        return Icons.train;
      case TransactionCategory.entertainment:
        return Icons.movie_outlined;
      case TransactionCategory.education:
        return Icons.school_outlined;
      case TransactionCategory.shopping:
        return Icons.shopping_bag_outlined;
      case TransactionCategory.other:
      case null:
        return Icons.payments_outlined;
    }
  }

  @override
  Widget build(BuildContext context) {
    final isIncome = transaction.type == TransactionType.income;
    return Dismissible(
      key: ValueKey(transaction.id),
      direction: DismissDirection.endToStart,
      onDismissed: (_) => onDelete(),
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        decoration:
            BoxDecoration(color: AppColors.errorContainer, borderRadius: BorderRadius.circular(16)),
        child: const Icon(Icons.delete_outline, color: Colors.white),
      ),
      child: Container(
        padding: const EdgeInsets.all(14),
        decoration: BoxDecoration(
          color: AppColors.surfaceContainerLow,
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: AppColors.glassBorder),
        ),
        child: Row(
          children: [
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerHigh,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(_icon, color: isIncome ? AppColors.primaryLight : AppColors.onSurface, size: 20),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(transaction.title,
                      style: const TextStyle(fontWeight: FontWeight.w600, color: AppColors.onSurface)),
                  Text(
                    isIncome ? 'INCOME' : (transaction.category?.name.toUpperCase() ?? 'OTHER'),
                    style: TextStyle(fontSize: 11, color: AppColors.onSurfaceVariant.withOpacity(0.7)),
                  ),
                ],
              ),
            ),
            Text(
              '${isIncome ? '+' : '-'}\$${transaction.amount.toStringAsFixed(2)}',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                color: isIncome ? AppColors.primaryLight : AppColors.onSurface,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
