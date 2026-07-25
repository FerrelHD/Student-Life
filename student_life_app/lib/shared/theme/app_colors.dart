import 'package:flutter/material.dart';

/// Color tokens from PRD Section 9 (Design Style — Hero/Mission theme).
class AppColors {
  AppColors._();

  static const primary = Color(0xFFFF544C);
  static const primaryContainer = Color(0xFFFF544C);
  static const primaryLight = Color(0xFFFFB4AC);
  static const inversePrimary = Color(0xFFBB171C);

  static const background = Color(0xFF131313);
  static const surface = Color(0xFF131313);
  static const surfaceContainer = Color(0xFF201F1F);
  static const surfaceContainerLow = Color(0xFF1C1B1B);
  static const surfaceContainerHigh = Color(0xFF2A2A2A);
  static const surfaceContainerHighest = Color(0xFF353534);

  static const onSurface = Color(0xFFE5E2E1);
  static const onSurfaceVariant = Color(0xFFE4BEB9);

  static const secondary = Color(0xFFA2C9FF);

  static const error = Color(0xFFFFB4AB);
  static const errorContainer = Color(0xFF93000A);

  static const bodyBackground = Color(0xFF0A0A0B);

  // Semantic: task priority
  static const priorityHigh = error;
  static const priorityHighContainer = errorContainer;
  static const priorityMedium = secondary;
  static const priorityMediumContainer = Color(0xFF3394F1);
  static const priorityLow = Color(0x99E4BEB9); // on-surface-variant/60

  // Semantic: finance
  static const income = primaryLight;
  static const expense = onSurface;

  static const glassFill = Color(0x08FFFFFF); // white/3%
  static const glassBorder = Color(0x1AFFFFFF); // white/10%
}
