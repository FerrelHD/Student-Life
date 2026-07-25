import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../shared/theme/app_colors.dart';
import '../../../achievement/presentation/screens/achievement_screen.dart';
import '../providers/profile_provider.dart';
import 'profile_edit_screen.dart';

class ProfileScreen extends ConsumerWidget {
  const ProfileScreen({super.key});

  Future<void> _confirmLogout(BuildContext context, WidgetRef ref) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        backgroundColor: AppColors.surfaceContainer,
        title: const Text('Log out?'),
        content: const Text(
          'Your profile info will be cleared and you\'ll go through setup again. '
          'Missions, finances, and saving goals stay untouched.',
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancel')),
          TextButton(onPressed: () => Navigator.pop(ctx, true), child: const Text('Log out')),
        ],
      ),
    );
    if (confirmed == true) {
      await ref.read(profileProvider.notifier).resetToDefault();
    }
  }

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profile = ref.watch(profileProvider).valueOrNull;

    return Scaffold(
      appBar: AppBar(title: const Text('Hero')),
      body: SafeArea(
        child: ListView(
          padding: const EdgeInsets.fromLTRB(16, 12, 16, 96),
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: AppColors.glassBorder),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 40,
                    backgroundColor: AppColors.primary.withOpacity(0.15),
                    child: const Icon(Icons.person, size: 40, color: AppColors.primary),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    (profile?.name.isNotEmpty ?? false) ? profile!.name : 'Student',
                    style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: AppColors.onSurface),
                  ),
                  if ((profile?.university ?? '').isNotEmpty)
                    Text(
                      profile!.semester.isNotEmpty
                          ? '${profile.university} • Semester ${profile.semester}'
                          : profile.university,
                      style: const TextStyle(color: AppColors.onSurfaceVariant),
                    ),
                  if ((profile?.programStudy ?? '').isNotEmpty)
                    Text(profile!.programStudy,
                        style: const TextStyle(color: AppColors.onSurfaceVariant, fontSize: 12)),
                  const SizedBox(height: 12),
                  OutlinedButton(
                    onPressed: () => Navigator.of(context)
                        .push(MaterialPageRoute(builder: (_) => const ProfileEditScreen())),
                    child: const Text('Edit Profile'),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 20),
            _SettingsTile(
              icon: Icons.military_tech_outlined,
              title: 'Achievements',
              onTap: () =>
                  Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AchievementScreen())),
            ),
            const SizedBox(height: 12),
            Container(
              decoration: BoxDecoration(
                color: AppColors.surfaceContainerLow,
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: AppColors.glassBorder),
              ),
              child: Column(
                children: [
                  SwitchListTile(
                    title: const Text('Dark Mode', style: TextStyle(color: AppColors.onSurface)),
                    value: profile?.darkMode ?? true,
                    activeColor: AppColors.primary,
                    onChanged: (v) =>
                        ref.read(profileProvider.notifier).updateProfile((p) => p.copyWith(darkMode: v)),
                  ),
                  SwitchListTile(
                    title: const Text('Notifications', style: TextStyle(color: AppColors.onSurface)),
                    value: profile?.notificationsEnabled ?? true,
                    activeColor: AppColors.primary,
                    onChanged: (v) => ref
                        .read(profileProvider.notifier)
                        .updateProfile((p) => p.copyWith(notificationsEnabled: v)),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 12),
            _SettingsTile(
              icon: Icons.logout,
              title: 'Logout',
              destructive: true,
              onTap: () => _confirmLogout(context, ref),
            ),
          ],
        ),
      ),
    );
  }
}

class _SettingsTile extends StatelessWidget {
  const _SettingsTile({
    required this.icon,
    required this.title,
    required this.onTap,
    this.destructive = false,
  });

  final IconData icon;
  final String title;
  final VoidCallback onTap;
  final bool destructive;

  @override
  Widget build(BuildContext context) {
    final color = destructive ? AppColors.error : AppColors.onSurface;
    return Material(
      color: AppColors.surfaceContainerLow,
      borderRadius: BorderRadius.circular(16),
      child: InkWell(
        borderRadius: BorderRadius.circular(16),
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration:
              BoxDecoration(borderRadius: BorderRadius.circular(16), border: Border.all(color: AppColors.glassBorder)),
          child: Row(
            children: [
              Icon(icon, color: color),
              const SizedBox(width: 12),
              Text(title, style: TextStyle(color: color, fontWeight: FontWeight.w600)),
              const Spacer(),
              const Icon(Icons.chevron_right, color: AppColors.onSurfaceVariant),
            ],
          ),
        ),
      ),
    );
  }
}
