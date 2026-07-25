import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';
import '../../features/authentication/presentation/screens/auth_gate_screen.dart';
import '../../features/dashboard/presentation/screens/dashboard_screen.dart';
import '../../features/assignment/presentation/screens/assignment_list_screen.dart';
import '../../features/finance/presentation/screens/finance_screen.dart';
import '../../features/calendar/presentation/screens/calendar_screen.dart';
import '../../features/profile/presentation/screens/profile_screen.dart';
import '../../shared/widgets/app_bottom_nav.dart';
import 'app_tab.dart';

final appRouter = GoRouter(
  initialLocation: '/',
  routes: [
    GoRoute(path: '/', builder: (_, __) => const AuthGateScreen()),
    StatefulShellRoute.indexedStack(
      builder: (context, state, navigationShell) => _AppShell(navigationShell: navigationShell),
      branches: [
        StatefulShellBranch(routes: [
          GoRoute(path: AppTab.dashboard.path, builder: (_, __) => const DashboardScreen()),
        ]),
        StatefulShellBranch(routes: [
          GoRoute(path: AppTab.missions.path, builder: (_, __) => const AssignmentListScreen()),
        ]),
        StatefulShellBranch(routes: [
          GoRoute(path: AppTab.vault.path, builder: (_, __) => const FinanceScreen()),
        ]),
        StatefulShellBranch(routes: [
          GoRoute(path: AppTab.agenda.path, builder: (_, __) => const CalendarScreen()),
        ]),
        StatefulShellBranch(routes: [
          GoRoute(path: AppTab.hero.path, builder: (_, __) => const ProfileScreen()),
        ]),
      ],
    ),
  ],
);

class _AppShell extends StatelessWidget {
  const _AppShell({required this.navigationShell});

  final StatefulNavigationShell navigationShell;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: navigationShell,
      bottomNavigationBar: AppBottomNav(
        currentIndex: navigationShell.currentIndex,
        onTap: (index) => navigationShell.goBranch(
          index,
          initialLocation: index == navigationShell.currentIndex,
        ),
      ),
    );
  }
}
