import 'package:drift/drift.dart';

enum TransactionType { income, expense }

/// Categories per PRD Section 5 Module 4. Only meaningful for expenses —
/// income entries leave this null (PRD doesn't define income categories).
enum TransactionCategory { food, transport, entertainment, education, shopping, other }

@DataClassName('Transaction')
class Transactions extends Table {
  IntColumn get id => integer().autoIncrement()();
  TextColumn get title => text()();
  IntColumn get type => intEnum<TransactionType>()();
  IntColumn get category => intEnum<TransactionCategory>().nullable()();
  RealColumn get amount => real()();
  // Stored as UTC; convert to local time only in the UI layer.
  DateTimeColumn get date => dateTime()();
  DateTimeColumn get createdAt => dateTime()();
}
