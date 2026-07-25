import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../shared/theme/app_colors.dart';
import '../providers/saving_goal_provider.dart';

Future<void> showAddSavingGoalSheet(BuildContext context) {
  return showModalBottomSheet(
    context: context,
    isScrollControlled: true,
    backgroundColor: AppColors.surfaceContainer,
    shape: const RoundedRectangleBorder(borderRadius: BorderRadius.vertical(top: Radius.circular(20))),
    builder: (_) => const AddSavingGoalSheet(),
  );
}

class AddSavingGoalSheet extends ConsumerStatefulWidget {
  const AddSavingGoalSheet({super.key});

  @override
  ConsumerState<AddSavingGoalSheet> createState() => _AddSavingGoalSheetState();
}

class _AddSavingGoalSheetState extends ConsumerState<AddSavingGoalSheet> {
  final _formKey = GlobalKey<FormState>();
  final _titleCtrl = TextEditingController();
  final _targetCtrl = TextEditingController();
  DateTime? _deadline;
  bool _saving = false;

  @override
  void dispose() {
    _titleCtrl.dispose();
    _targetCtrl.dispose();
    super.dispose();
  }

  Future<void> _pickDeadline() async {
    final date = await showDatePicker(
      context: context,
      initialDate: DateTime.now().add(const Duration(days: 30)),
      firstDate: DateTime.now(),
      lastDate: DateTime.now().add(const Duration(days: 365 * 5)),
    );
    if (date != null) setState(() => _deadline = date);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      await ref.read(savingGoalControllerProvider).create(
            title: _titleCtrl.text.trim(),
            targetAmount: double.parse(_targetCtrl.text),
            deadline: _deadline,
          );
      if (mounted) Navigator.of(context).pop();
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.fromLTRB(20, 20, 20, MediaQuery.of(context).viewInsets.bottom + 20),
      child: Form(
        key: _formKey,
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            const Text('New Saving Goal',
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppColors.onSurface)),
            const SizedBox(height: 16),
            TextFormField(
              controller: _titleCtrl,
              decoration: const InputDecoration(labelText: 'Goal name (e.g. Laptop, Motor)'),
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _targetCtrl,
              keyboardType: const TextInputType.numberWithOptions(decimal: true),
              decoration: const InputDecoration(labelText: 'Target amount (\$)'),
              validator: (v) {
                final n = double.tryParse(v ?? '');
                if (n == null || n <= 0) return 'Enter a valid amount';
                return null;
              },
            ),
            const SizedBox(height: 8),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Deadline (optional)'),
              subtitle: Text(_deadline == null ? 'Not set' : _deadline!.toString().split(' ').first),
              trailing: const Icon(Icons.calendar_today),
              onTap: _pickDeadline,
            ),
            const SizedBox(height: 12),
            FilledButton(
              onPressed: _saving ? null : _submit,
              style: FilledButton.styleFrom(backgroundColor: AppColors.primary),
              child: Text(_saving ? 'Saving...' : 'Create Goal'),
            ),
          ],
        ),
      ),
    );
  }
}
