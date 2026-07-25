import 'package:drift/drift.dart';

/// ponytail: enum order is locked from day one (PRD "Aturan hindar bug") —
/// new values must always be appended at the end, never inserted/reordered,
/// since Drift's intEnum() persists the numeric index.
enum AssignmentPriority { low, medium, high }

enum AssignmentStatus { pending, completed }

@DataClassName('Assignment')
class Assignments extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  TextColumn get course => text()();
  TextColumn get description => text().nullable()();
  // Stored as UTC; convert to local time only in the UI layer.
  DateTimeColumn get deadline => dateTime()();
  IntColumn get priority => intEnum<AssignmentPriority>()();
  IntColumn get status => intEnum<AssignmentStatus>()();
  TextColumn get attachmentPath => text().nullable()();
  DateTimeColumn get reminderTime => dateTime().nullable()();
  DateTimeColumn get createdAt => dateTime()();
  DateTimeColumn get updatedAt => dateTime()();
}
