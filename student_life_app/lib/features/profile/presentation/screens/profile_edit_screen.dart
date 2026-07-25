import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../domain/models/user_profile.dart';
import '../providers/profile_provider.dart';
import '../widgets/profile_form.dart';

class ProfileEditScreen extends ConsumerWidget {
  const ProfileEditScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(profileProvider).valueOrNull;

    return Scaffold(
      appBar: AppBar(title: const Text('Edit Profile')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: ProfileForm(
          initial: profile ?? const UserProfile(),
          submitLabel: 'Save Changes',
          onSubmit: (name, university, semester, programStudy) async {
            await ref.read(profileProvider.notifier).updateProfile(
                  (p) => p.copyWith(
                    name: name,
                    university: university,
                    semester: semester,
                    programStudy: programStudy,
                  ),
                );
            if (context.mounted) Navigator.of(context).pop();
          },
        ),
      ),
    );
  }
}
