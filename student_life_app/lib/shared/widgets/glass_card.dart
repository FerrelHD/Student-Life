import 'dart:ui';
import 'package:flutter/material.dart';
import '../theme/app_colors.dart';
import '../theme/app_typography.dart';

/// The "Glass Card" component from PRD Section 9.
///
/// ponytail: BackdropFilter is kept off by default — it's costly in long
/// scrolling lists. Pass [blur: true] only for large/fixed cards (hero
/// sections, nav), per the PRD's own performance note.
class GlassCard extends StatelessWidget {
  const GlassCard({
    super.key,
    required this.child,
    this.padding = const EdgeInsets.all(16),
    this.blur = false,
    this.borderColor,
  });

  final Widget child;
  final EdgeInsetsGeometry padding;
  final bool blur;
  final Color? borderColor;

  @override
  Widget build(BuildContext context) {
    final content = Container(
      padding: padding,
      decoration: BoxDecoration(
        color: AppColors.glassFill,
        borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
        border: Border.all(color: borderColor ?? AppColors.glassBorder),
      ),
      child: child,
    );

    if (!blur) return content;

    return ClipRRect(
      borderRadius: BorderRadius.circular(AppSpacing.radiusXl),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 16, sigmaY: 16),
        child: content,
      ),
    );
  }
}
