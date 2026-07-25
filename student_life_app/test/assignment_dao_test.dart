import 'package:drift/native.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:student_life_app/core/database/app_database.dart';

void main() {
  late AppDatabase db;

  setUp(() => db = AppDatabase(NativeDatabase.memory()));
  tearDown(() => db.close());

  test('assignment CRUD roundtrip', () async {
    final now = DateTime.now().toUtc();
    final id = await db.assignmentDao.insertAssignment(AssignmentsCompanion.insert(
      title: 'Quantum Mechanics Review',
      course: 'Physics 402',
      deadline: now.add(const Duration(hours: 2)),
      priority: AssignmentPriority.high,
      status: AssignmentStatus.pending,
      createdAt: now,
      updatedAt: now,
    ));

    final created = await db.assignmentDao.getById(id);
    expect(created, isNotNull);
    expect(created!.title, 'Quantum Mechanics Review');
    expect(created.status, AssignmentStatus.pending);

    final updated = await db.assignmentDao.updateAssignment(
      created.copyWith(status: AssignmentStatus.completed).toCompanion(true),
    );
    expect(updated, isTrue);
    expect((await db.assignmentDao.getById(id))!.status, AssignmentStatus.completed);

    await db.assignmentDao.deleteAssignment(id);
    expect(await db.assignmentDao.getById(id), isNull);
  });
}
