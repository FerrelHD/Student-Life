import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../shared/theme/app_colors.dart';
import '../../../profile/domain/models/user_profile.dart';
import '../../../profile/presentation/providers/profile_provider.dart';
import '../../../profile/presentation/widgets/profile_form.dart';

class SetupProfileScreen extends ConsumerWidget {
  const SetupProfileScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return Scaffold(
      backgroundColor: AppColors.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              const Text(
                'STUDENT LIFE',
                style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w900, fontSize: 24, letterSpacing: 1),
              ),
              const SizedBox(height: 4),
              const Text('Set up your profile to get started', style: TextStyle(color: AppColors.onSurfaceVariant)),
              const SizedBox(height: 24),
              ProfileForm(
                initial: const UserProfile(),
                submitLabel: 'Get Started',
                onSubmit: (name, university, semester, programStudy) {
                  return ref.read(profileProvider.notifier).updateProfile(
                        (p) => p.copyWith(
                          name: name,
                          university: university,
                          semester: semester,
                          programStudy: programStudy,
                        ),
                      );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
