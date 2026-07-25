import 'package:flutter/material.dart';
import '../../../../shared/theme/app_colors.dart';
import '../../domain/models/user_profile.dart';

class ProfileForm extends StatefulWidget {
  const ProfileForm({
    super.key,
    required this.initial,
    required this.submitLabel,
    required this.onSubmit,
  });

  final UserProfile initial;
  final String submitLabel;
  final Future<void> Function(String name, String university, String semester, String programStudy) onSubmit;

  @override
  State<ProfileForm> createState() => _ProfileFormState();
}

class _ProfileFormState extends State<ProfileForm> {
  final _formKey = GlobalKey<FormState>();
  late final TextEditingController _nameCtrl;
  late final TextEditingController _univCtrl;
  late final TextEditingController _semesterCtrl;
  late final TextEditingController _prodiCtrl;
  bool _saving = false;

  @override
  void initState() {
    super.initState();
    _nameCtrl = TextEditingController(text: widget.initial.name);
    _univCtrl = TextEditingController(text: widget.initial.university);
    _semesterCtrl = TextEditingController(text: widget.initial.semester);
    _prodiCtrl = TextEditingController(text: widget.initial.programStudy);
  }

  @override
  void dispose() {
    _nameCtrl.dispose();
    _univCtrl.dispose();
    _semesterCtrl.dispose();
    _prodiCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _saving = true);
    try {
      await widget.onSubmit(
        _nameCtrl.text.trim(),
        _univCtrl.text.trim(),
        _semesterCtrl.text.trim(),
        _prodiCtrl.text.trim(),
      );
    } finally {
      if (mounted) setState(() => _saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Form(
      key: _formKey,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          TextFormField(
            controller: _nameCtrl,
            decoration: const InputDecoration(labelText: 'Full name'),
            validator: (v) => (v == null || v.trim().isEmpty) ? 'Required' : null,
          ),
          const SizedBox(height: 12),
          TextFormField(controller: _univCtrl, decoration: const InputDecoration(labelText: 'University')),
          const SizedBox(height: 12),
          TextFormField(controller: _semesterCtrl, decoration: const InputDecoration(labelText: 'Semester')),
          const SizedBox(height: 12),
          TextFormField(controller: _prodiCtrl, decoration: const InputDecoration(labelText: 'Program studi')),
          const SizedBox(height: 20),
          FilledButton(
            onPressed: _saving ? null : _submit,
            style: FilledButton.styleFrom(backgroundColor: AppColors.primary),
            child: Text(_saving ? 'Saving...' : widget.submitLabel),
          ),
        ],
      ),
    );
  }
}
