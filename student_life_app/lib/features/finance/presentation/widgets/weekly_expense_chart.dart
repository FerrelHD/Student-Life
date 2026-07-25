import 'package:fl_chart/fl_chart.dart';
import 'package:flutter/material.dart';
import '../../../../core/database/app_database.dart';
import '../../../../shared/theme/app_colors.dart';

class WeeklyExpenseChart extends StatelessWidget {
  const WeeklyExpenseChart({super.key, required this.transactions});
  final List<Transaction> transactions;

  static const _labels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

  List<double> _weeklyTotals() {
    final now = DateTime.now();
    final startOfWeek = DateTime(now.year, now.month, now.day).subtract(Duration(days: now.weekday - 1));
    final totals = List<double>.filled(7, 0);
    for (final t in transactions) {
      if (t.type != TransactionType.expense) continue;
      final date = t.date.toLocal();
      final dayOnly = DateTime(date.year, date.month, date.day);
      final offset = dayOnly.difference(startOfWeek).inDays;
      if (offset >= 0 && offset < 7) totals[offset] += t.amount;
    }
    return totals;
  }

  @override
  Widget build(BuildContext context) {
    final totals = _weeklyTotals();
    final highest = totals.reduce((a, b) => a > b ? a : b);
    final maxY = highest <= 0 ? 10.0 : highest * 1.2;
    final today = DateTime.now().weekday - 1;

    return SizedBox(
      height: 140,
      child: BarChart(
        BarChartData(
          maxY: maxY,
          gridData: const FlGridData(show: false),
          borderData: FlBorderData(show: false),
          titlesData: FlTitlesData(
            leftTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            rightTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            topTitles: const AxisTitles(sideTitles: SideTitles(showTitles: false)),
            bottomTitles: AxisTitles(
              sideTitles: SideTitles(
                showTitles: true,
                getTitlesWidget: (value, meta) => Padding(
                  padding: const EdgeInsets.only(top: 6),
                  child: Text(
                    _labels[value.toInt()],
                    style: TextStyle(
                      fontSize: 11,
                      color: value.toInt() == today ? AppColors.primary : AppColors.onSurfaceVariant,
                    ),
                  ),
                ),
              ),
            ),
          ),
          barGroups: [
            for (var i = 0; i < 7; i++)
              BarChartGroupData(x: i, barRods: [
                BarChartRodData(
                  toY: totals[i],
                  color: i == today ? AppColors.primary : Colors.white.withOpacity(0.15),
                  width: 16,
                  borderRadius: BorderRadius.circular(4),
                ),
              ]),
          ],
        ),
      ),
    );
  }
}
