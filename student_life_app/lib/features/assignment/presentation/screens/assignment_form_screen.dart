import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../shared/theme/app_colors.dart';
import '../providers/assignment_form_provider.dart';

class AssignmentFormScreen extends ConsumerStatefulWidget {
  const AssignmentFormScreen({super.key, this.existing});
  final Assignment? existing;

  @override
  ConsumerState<AssignmentFormScreen> createState() => _AssignmentFormScreenState();
}

class _AssignmentFormScreenState extends ConsumerState<AssignmentFormScreen> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _titleCtrl;
  late final TextEditingController _courseCtrl;
  late final TextEditingController _descCtrl;
  late DateTime _deadline;
  late AssignmentPriority _priority;
  DateTime? _reminderTime;
  String? _attachmentPath;
  bool _saving = false;

  bool get _isEditing => widget.existing != null;

  @override
  void initState() {
    super.initState();
    final e = widget.existing;
    _titleCtrl = TextEditingController(text: e?.title ?? '');
    _courseCtrl = TextEditingController(text: e?.course ?? '');
    _descCtrl = TextEditingController(text: e?.description ?? '');
    _deadline = e?.deadline.toLocal() ?? DateTime.now().add(const Duration(days: 1));
    _priority = e?.priority ?? AssignmentPriority.medium;
    _reminderTime = e?.reminderTime?.toLocal();
    _attachmentPath = e?.attachmentPath;
  }

  @override
  void dispose() {
    _titleCtrl.dispose();
    _courseCtrl.dispose();
    _descCtrl.dispose();
    super.dispose();
  }

  Future<DateTime?> _pickDateTime(DateTime initial) async {
    final date = await showDatePicker(
      context: context,
      initialDate: initial,
      firstDate: DateTime.now().subtract(const Duration(days: 365)),
      lastDate: DateTime.now().add(const Duration(days: 365 * 3)),
    );
    if (date == null || !mounted) return null;
    final time = await showTimePicker(context: context, initialTime: TimeOfDay.fromDateTime(initial));
    if (time == null) return null;
    return DateTime(date.year, date.month, date.day, time.hour, time.minute);
  }

  Future<void> _pickDeadline() async {
    final picked = await _pickDateTime(_deadline);
    if (picked != null) setState(() => _deadline = picked);
  }

  Future<void> _pickReminder() async {
    final picked = await _pickDateTime(_reminderTime ?? _deadline.subtract(const Duration(hours: 1)));
    if (picked != null) setState(() => _reminderTime = picked);
  }

  Future<void> _pickAttachment() async {
    final result = await FilePicker.pickFiles();
    final path = result?.files.single.path;
    if (path != null) setState(() => _attachmentPath = path);
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    final controller = ref.read(assignmentFormControllerProvider);
    try {
      if (_isEditing) {
        await controller.update(
          widget.existing!,
          title: _titleCtrl.text.trim(),
          course: _courseCtrl.text.trim(),
          description: _descCtrl.text.trim().isEmpty ? null : _descCtrl.text.trim(),
          deadline: _deadline,
          priority: _priority,
          attachmentPath: _attachmentPath,
          reminderTime: _reminderTime,
        );
      } else {
        await controller.create(
          title: _titleCtrl.text.trim(),
          course: _courseCtrl.text.trim(),
          description: _descCtrl.text.trim().isEmpty ? null : _descCtrl.text.trim(),
          deadline: _deadline,
          priority: _priority,
          attachmentPath: _attachmentPath,
          reminderTime: _reminderTime,
        );
      }
      if (mounted) Navigator.of(context).pop();
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(_isEditing ? 'Edit Mission' : 'Create New Mission')),
      body: Form(
        key: _formKey,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            TextFormField(
              controller: _titleCtrl,
              decoration: const InputDecoration(labelText: 'Mission title'),
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _courseCtrl,
              decoration: const InputDecoration(labelText: 'Course / module'),
              validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
            ),
            const SizedBox(height: 12),
            TextFormField(
              controller: _descCtrl,
              decoration: const InputDecoration(labelText: 'Description (optional)'),
              maxLines: 3,
            ),
            const SizedBox(height: 12),
            DropdownButtonFormField<AssignmentPriority>(
              value: _priority,
              decoration: const InputDecoration(labelText: 'Priority'),
              items: AssignmentPriority.values
                  .map((p) => DropdownMenuItem(value: p, child: Text(p.name)))
                  .toList(),
              onChanged: (v) => setState(() => _priority = v ?? _priority),
            ),
            const SizedBox(height: 8),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Deadline'),
              subtitle: Text(_deadline.toString()),
              trailing: const Icon(Icons.calendar_today),
              onTap: _pickDeadline,
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Reminder (optional)'),
              subtitle: Text(_reminderTime?.toString() ?? 'Not set'),
              trailing: _reminderTime != null
                  ? IconButton(
                      icon: const Icon(Icons.clear),
                      onPressed: () => setState(() => _reminderTime = null),
                    )
                  : const Icon(Icons.notifications_outlined),
              onTap: _pickReminder,
            ),
            ListTile(
              contentPadding: EdgeInsets.zero,
              title: const Text('Attachment (optional)'),
              subtitle: Text(_attachmentPath ?? 'None'),
              trailing: const Icon(Icons.attach_file),
              onTap: _pickAttachment,
            ),
            const SizedBox(height: 24),
            FilledButton(
              onPressed: _saving ? null : _submit,
              style: FilledButton.styleFrom(backgroundColor: AppColors.primary),
              child: Text(_saving ? 'Saving...' : (_isEditing ? 'Save Changes' : 'Initialize Mission')),
            ),
          ],
        ),
      ),
    );
  }
}
