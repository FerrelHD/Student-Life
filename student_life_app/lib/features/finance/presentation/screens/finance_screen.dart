import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../shared/theme/app_colors.dart';
import '../../../../shared/widgets/glass_card.dart';
import '../providers/saving_goal_provider.dart';
import '../providers/transaction_form_provider.dart';
import '../providers/transaction_list_provider.dart';
import '../widgets/add_saving_goal_sheet.dart';
import '../widgets/add_transaction_sheet.dart';
import '../widgets/saving_goal_card.dart';
import '../widgets/transaction_tile.dart';
import '../widgets/weekly_expense_chart.dart';

class FinanceScreen extends ConsumerWidget {
  const FinanceScreen({super.key});

  Future<void> _addFunds(BuildContext context, WidgetRef ref, SavingGoal goal) async {
    final ctrl = TextEditingController();
    final amount = await showDialog<double>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surfaceContainer,
        title: Text('Add funds to "${goal.title}"'),
        content: TextField(
          controller: ctrl,
          autofocus: true,
          keyboardType: const TextInputType.numberWithOptions(decimal: true),
          decoration: const InputDecoration(labelText: 'Amount (\$)'),
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx), child: const Text('Cancel')),
          TextButton(
            onPressed: () => Navigator.pop(ctx, double.tryParse(ctrl.text)),
            child: const Text('Add'),
          ),
        ],
      ),
    );
    if (amount != null && amount > 0) {
      await ref.read(savingGoalControllerProvider).addContribution(goal, amount);
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final balance = ref.watch(totalBalanceProvider);
    final transactions = ref.watch(transactionListProvider);
    final goals = ref.watch(savingGoalListProvider);

    return Scaffold(
      appBar: AppBar(title: const Text('Vault')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 96),
          children: [
            GlassCard(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text('TOTAL AVAILABLE CREDITS',
                      style: TextStyle(fontSize: 11, color: AppColors.onSurfaceVariant, letterSpacing: 1)),
                  const SizedBox(height: 4),
                  balance.when(
                    data: (v) => Text(
                      '\$${v.toStringAsFixed(2)}',
                      style: const TextStyle(fontSize: 28, fontWeight: FontWeight.bold, color: AppColors.onSurface),
                    ),
                    loading: () => const SizedBox(
                      height: 28,
                      child: CircularProgressIndicator(strokeWidth: 2, color: AppColors.primary),
                    ),
                    error: (e, _) => Text('Error: $e', style: const TextStyle(color: AppColors.error)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            Row(
              children: [
                Expanded(
                  child: FilledButton.icon(
                    onPressed: () => showAddTransactionSheet(context, initialType: TransactionType.income),
                    style: FilledButton.styleFrom(backgroundColor: AppColors.primary),
                    icon: const Icon(Icons.add_circle_outline),
                    label: const Text('Deposit'),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: OutlinedButton.icon(
                    onPressed: () => showAddTransactionSheet(context, initialType: TransactionType.expense),
                    icon: const Icon(Icons.payments_outlined),
                    label: const Text('Expense'),
                  ),
                ),
              ],
            ),
            const SizedBox(height: 24),
            const Text('Weekly Burn',
                style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.onSurface)),
            const SizedBox(height: 8),
            transactions.maybeWhen(
              data: (list) => GlassCard(child: WeeklyExpenseChart(transactions: list)),
              orElse: () => const SizedBox(
                height: 140,
                child: Center(child: CircularProgressIndicator(color: AppColors.primary)),
              ),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Saving Goals',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.onSurface)),
                TextButton(
                  onPressed: () => showAddSavingGoalSheet(context),
                  child: const Text('+ New Goal'),
                ),
              ],
            ),
            const SizedBox(height: 8),
            goals.when(
              data: (list) {
                if (list.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12),
                    child: Text('No saving goals yet', style: TextStyle(color: AppColors.onSurfaceVariant)),
                  );
                }
                return Column(
                  children: [
                    for (final goal in list) ...[
                      SavingGoalCard(
                        goal: goal,
                        onAddFunds: () => _addFunds(context, ref, goal),
                        onDelete: () => ref.read(savingGoalControllerProvider).delete(goal),
                      ),
                      const SizedBox(height: 12),
                    ],
                  ],
                );
              },
              loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary)),
              error: (e, _) => Text('Error: $e', style: const TextStyle(color: AppColors.error)),
            ),
            const SizedBox(height: 24),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text('Recent Transactions',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.onSurface)),
                transactions.maybeWhen(
                  data: (list) => Text('${list.length} Total',
                      style: const TextStyle(fontSize: 12, color: AppColors.primary)),
                  orElse: () => const SizedBox.shrink(),
                ),
              ],
            ),
            const SizedBox(height: 8),
            transactions.when(
              data: (list) {
                if (list.isEmpty) {
                  return const Padding(
                    padding: EdgeInsets.symmetric(vertical: 12),
                    child: Text('No transactions yet', style: TextStyle(color: AppColors.onSurfaceVariant)),
                  );
                }
                return Column(
                  children: [
                    for (final t in list) ...[
                      TransactionTile(
                        transaction: t,
                        onDelete: () => ref.read(transactionFormControllerProvider).delete(t),
                      ),
                      const SizedBox(height: 10),
                    ],
                  ],
                );
              },
              loading: () => const Center(child: CircularProgressIndicator(color: AppColors.primary)),
              error: (e, _) => Text('Error: $e', style: const TextStyle(color: AppColors.error)),
            ),
          ],
        ),
      ),
    );
  }
}
