import 'package:flutter/material.dart';

/// Bottom nav tabs. Gamified label vs actual module, per PRD Section 9 nav table.
enum AppTab {
  dashboard('Dashboard', Icons.dashboard_outlined, Icons.dashboard, '/dashboard'),
  missions('Missions', Icons.assignment_turned_in_outlined, Icons.assignment_turned_in, '/missions'),
  vault('Vault', Icons.payments_outlined, Icons.payments, '/vault'),
  agenda('Agenda', Icons.calendar_month_outlined, Icons.calendar_month, '/agenda'),
  hero('Hero', Icons.person_outline, Icons.person, '/hero');

  const AppTab(this.label, this.icon, this.activeIcon, this.path);

  final String label;
  final IconData icon;
  final IconData activeIcon;
  final String path;
}
