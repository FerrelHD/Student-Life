import 'package:drift/drift.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../../../core/database/app_database.dart';
import '../../../../core/services/notification_service.dart';
import 'assignment_list_provider.dart';

class AssignmentFormController {
  AssignmentFormController(this._ref);
  final Ref _ref;

  Future<int> create({
    required String title,
    required String course,
    String? description,
    required DateTime deadline,
    required AssignmentPriority priority,
    String? attachmentPath,
    DateTime? reminderTime,
  }) async {
    final now = DateTime.now().toUtc();
    final id = await _ref.read(assignmentRepositoryProvider).create(
          AssignmentsCompanion.insert(
            title: title,
            course: course,
            description: Value(description),
            deadline: deadline.toUtc(),
            priority: priority,
            status: AssignmentStatus.pending,
            attachmentPath: Value(attachmentPath),
            reminderTime: Value(reminderTime?.toUtc()),
            createdAt: now,
            updatedAt: now,
          ),
        );

    if (reminderTime != null) {
      await _ref.read(notificationServiceProvider).scheduleReminder(
            id: id,
            title: title,
            body: 'Deadline: $course',
            scheduledTime: reminderTime,
          );
    }
    return id;
  }

  Future<void> update(
    Assignment existing, {
    required String title,
    required String course,
    String? description,
    required DateTime deadline,
    required AssignmentPriority priority,
    String? attachmentPath,
    DateTime? reminderTime,
  }) async {
    final updated = existing.copyWith(
      title: title,
      course: course,
      description: Value(description),
      deadline: deadline.toUtc(),
      priority: priority,
      attachmentPath: Value(attachmentPath),
      reminderTime: Value(reminderTime?.toUtc()),
      updatedAt: DateTime.now().toUtc(),
    );
    await _ref.read(assignmentRepositoryProvider).update(updated.toCompanion(true));

    final notifier = _ref.read(notificationServiceProvider);
    await notifier.cancelReminder(existing.id);
    if (reminderTime != null) {
      await notifier.scheduleReminder(
        id: existing.id,
        title: title,
        body: 'Deadline: $course',
        scheduledTime: reminderTime,
      );
    }
  }

  Future<void> toggleComplete(Assignment assignment) async {
    final newStatus = assignment.status == AssignmentStatus.completed
        ? AssignmentStatus.pending
        : AssignmentStatus.completed;
    await _ref.read(assignmentRepositoryProvider).update(
          assignment.copyWith(status: newStatus, updatedAt: DateTime.now().toUtc()).toCompanion(true),
        );
  }

  Future<void> delete(Assignment assignment) async {
    await _ref.read(assignmentRepositoryProvider).delete(assignment.id);
    await _ref.read(notificationServiceProvider).cancelReminder(assignment.id);
  }
}

final assignmentFormControllerProvider = Provider((ref) => AssignmentFormController(ref));
