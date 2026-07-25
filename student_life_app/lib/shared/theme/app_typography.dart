import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'app_colors.dart';

/// Typography roles from PRD Section 9.
class AppTypography {
  AppTypography._();

  static TextStyle headlineXl = GoogleFonts.plusJakartaSans(
    fontSize: 40,
    fontWeight: FontWeight.w800,
    color: AppColors.onSurface,
  );

  static TextStyle headlineLg = GoogleFonts.plusJakartaSans(
    fontSize: 32,
    fontWeight: FontWeight.w700,
    color: AppColors.onSurface,
  );

  static TextStyle headlineLgMobile = GoogleFonts.plusJakartaSans(
    fontSize: 28,
    fontWeight: FontWeight.w700,
    color: AppColors.onSurface,
  );

  static TextStyle titleMd = GoogleFonts.plusJakartaSans(
    fontSize: 20,
    fontWeight: FontWeight.w600,
    color: AppColors.onSurface,
  );

  static TextStyle bodyLg = GoogleFonts.inter(
    fontSize: 18,
    fontWeight: FontWeight.w400,
    color: AppColors.onSurface,
  );

  static TextStyle bodyMd = GoogleFonts.inter(
    fontSize: 16,
    fontWeight: FontWeight.w400,
    color: AppColors.onSurface,
  );

  static TextStyle labelMd = GoogleFonts.jetBrainsMono(
    fontSize: 14,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.05 * 14,
    color: AppColors.onSurfaceVariant,
  );

  static TextStyle labelSm = GoogleFonts.jetBrainsMono(
    fontSize: 12,
    fontWeight: FontWeight.w500,
    letterSpacing: 0.05 * 12,
    color: AppColors.onSurfaceVariant,
  );
}

/// Spacing scale from PRD Section 9.
class AppSpacing {
  AppSpacing._();

  static const xs = 4.0;
  static const base = 8.0;
  static const sm = 12.0;
  static const md = 24.0;
  static const gutter = 20.0;
  static const lg = 40.0;
  static const xl = 64.0;

  static const radiusXl = 16.0;
}
