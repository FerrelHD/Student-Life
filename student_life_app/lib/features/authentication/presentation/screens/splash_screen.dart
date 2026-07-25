import 'package:flutter/material.dart';
import '../../../../shared/theme/app_colors.dart';

class SplashScreen extends StatelessWidget {
  const SplashScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      backgroundColor: AppColors.background,
      body: Center(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            Text(
              'STUDENT LIFE',
              style: TextStyle(color: AppColors.primary, fontWeight: FontWeight.w900, fontSize: 28, letterSpacing: 1),
            ),
            SizedBox(height: 16),
            CircularProgressIndicator(color: AppColors.primary),
          ],
        ),
      ),
    );
  }
}
