import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../../../core/config/app_tab.dart';
import '../../../profile/presentation/providers/profile_provider.dart';
import 'setup_profile_screen.dart';
import 'splash_screen.dart';

/// Splash -> (first run) Setup -> Dashboard, per PRD Section 7 user flow.
class AuthGateScreen extends ConsumerWidget {
  const AuthGateScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final profileAsync = ref.watch(profileProvider);

    return profileAsync.when(
      loading: () => const SplashScreen(),
      error: (e, _) => Scaffold(body: Center(child: Text('Error: $e'))),
      data: (profile) {
        if (!profile.isSetupComplete) return const SetupProfileScreen();
        WidgetsBinding.instance.addPostFrameCallback((_) {
          if (context.mounted) context.go(AppTab.dashboard.path);
        });
        return const SplashScreen();
      },
    );
  }
}
