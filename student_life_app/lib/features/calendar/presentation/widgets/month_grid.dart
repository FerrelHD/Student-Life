import 'package:flutter/material.dart';
import '../../../../shared/theme/app_colors.dart';

class MonthGrid extends StatelessWidget {
  const MonthGrid({
    super.key,
    required this.month,
    required this.selectedDay,
    required this.markedDays,
    required this.onSelectDay,
  });

  /// First day of the displayed month.
  final DateTime month;
  final DateTime selectedDay;
  final Set<DateTime> markedDays;
  final ValueChanged<DateTime> onSelectDay;

  static const _weekdayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  bool _isSameDay(DateTime a, DateTime b) => a.year == b.year && a.month == b.month && a.day == b.day;

  @override
  Widget build(BuildContext context) {
    final daysInMonth = DateTime(month.year, month.month + 1, 0).day;
    final leadingBlanks = month.weekday % 7; // Sunday-first offset
    final today = DateTime.now();

    return Column(
      children: [
        Row(
          children: [
            for (final label in _weekdayLabels)
              Expanded(
                child: Center(
                  child: Text(label, style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceVariant)),
                ),
              ),
          ],
        ),
        const SizedBox(height: 4),
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 7),
          itemCount: leadingBlanks + daysInMonth,
          itemBuilder: (context, index) {
            if (index < leadingBlanks) return const SizedBox.shrink();
            final day = DateTime(month.year, month.month, index - leadingBlanks + 1);
            final isSelected = _isSameDay(day, selectedDay);
            final isToday = _isSameDay(day, today);
            final hasDot = markedDays.any((d) => _isSameDay(d, day));

            return InkWell(
              onTap: () => onSelectDay(day),
              borderRadius: BorderRadius.circular(10),
              child: Container(
                margin: const EdgeInsets.all(2),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.primary.withOpacity(0.15) : null,
                  border: isSelected ? Border.all(color: AppColors.primary.withOpacity(0.6)) : null,
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      '${day.day}',
                      style: TextStyle(
                        color: isSelected
                            ? AppColors.primary
                            : (isToday ? AppColors.primaryLight : AppColors.onSurface),
                        fontWeight: isSelected || isToday ? FontWeight.bold : FontWeight.normal,
                      ),
                    ),
                    if (hasDot)
                      Container(
                        width: 4,
                        height: 4,
                        margin: const EdgeInsets.only(top: 2),
                        decoration: const BoxDecoration(color: AppColors.primary, shape: BoxShape.circle),
                      ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }
}
