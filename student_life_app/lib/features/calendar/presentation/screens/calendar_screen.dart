import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../shared/theme/app_colors.dart';
import '../../../assignment/presentation/providers/assignment_list_provider.dart';
import '../../../assignment/presentation/widgets/deadline_chip.dart';
import '../../../assignment/presentation/widgets/priority_badge.dart';
import '../widgets/month_grid.dart';

class CalendarScreen extends ConsumerStatefulWidget {
  const CalendarScreen({super.key});

  @override
  ConsumerState<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends ConsumerState<CalendarScreen> {
  late DateTime _month;
  late DateTime _selectedDay;

  static const _months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _month = DateTime(now.year, now.month);
    _selectedDay = DateTime(now.year, now.month, now.day);
  }

  void _changeMonth(int delta) {
    setState(() => _month = DateTime(_month.year, _month.month + delta));
  }

  @override
  Widget build(BuildContext context) {
    final assignments = ref.watch(assignmentListProvider).valueOrNull ?? const [];
    final markedDays = assignments.map((a) => a.deadline.toLocal()).toSet();
    final dayAssignments = assignments.where((a) {
      final d = a.deadline.toLocal();
      return d.year == _selectedDay.year && d.month == _selectedDay.month && d.day == _selectedDay.day;
    }).toList()
      ..sort((a, b) => a.deadline.compareTo(b.deadline));

    return Scaffold(
      appBar: AppBar(title: const Text('Agenda')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 96),
          children: [
            Container(
              padding: const EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.glassBorder),
              ),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        '${_months[_month.month - 1]} ${_month.year}',
                        style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: AppColors.onSurface),
                      ),
                      Row(
                        children: [
                          IconButton(icon: const Icon(Icons.chevron_left), onPressed: () => _changeMonth(-1)),
                          IconButton(icon: const Icon(Icons.chevron_right), onPressed: () => _changeMonth(1)),
                        ],
                      ),
                    ],
                  ),
                  MonthGrid(
                    month: _month,
                    selectedDay: _selectedDay,
                    markedDays: markedDays,
                    onSelectDay: (d) => setState(() => _selectedDay = d),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            const Text("TODAY'S FOCUS",
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.onSurface)),
            const SizedBox(height: 4),
            Text(
              '${_selectedDay.day} ${_months[_selectedDay.month - 1]} ${_selectedDay.year}',
              style: const TextStyle(fontSize: 12, color: AppColors.onSurfaceVariant),
            ),
            const SizedBox(height: 12),
            if (dayAssignments.isEmpty)
              const Text('No missions on this day', style: TextStyle(color: AppColors.onSurfaceVariant))
            else
              for (final a in dayAssignments)
                Container(
                  padding: const EdgeInsets.all(14),
                  margin: const EdgeInsets.only(bottom: 10),
                  decoration: BoxDecoration(
                    color: AppColors.surfaceContainerLow,
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: AppColors.glassBorder),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(a.title, style: const TextStyle(fontWeight: FontWeight.bold, color: AppColors.onSurface)),
                      Text(a.course, style: const TextStyle(color: AppColors.onSurfaceVariant, fontSize: 12)),
                      const SizedBox(height: 8),
                      Wrap(spacing: 8, children: [
                        PriorityBadge(priority: a.priority),
                        DeadlineChip(deadlineUtc: a.deadline),
                      ]),
                    ],
                  ),
                ),
          ],
        ),
      ),
    );
  }
}
