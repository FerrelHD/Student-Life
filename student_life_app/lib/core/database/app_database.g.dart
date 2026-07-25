// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'app_database.dart';

// ignore_for_file: type=lint
class $AssignmentsTable extends Assignments
    with TableInfo<$AssignmentsTable, Assignment> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $AssignmentsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
      'title', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _courseMeta = const VerificationMeta('course');
  @override
  late final GeneratedColumn<String> course = GeneratedColumn<String>(
      'course', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _descriptionMeta =
      const VerificationMeta('description');
  @override
  late final GeneratedColumn<String> description = GeneratedColumn<String>(
      'description', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _deadlineMeta =
      const VerificationMeta('deadline');
  @override
  late final GeneratedColumn<DateTime> deadline = GeneratedColumn<DateTime>(
      'deadline', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _priorityMeta =
      const VerificationMeta('priority');
  @override
  late final GeneratedColumnWithTypeConverter<AssignmentPriority, int>
      priority = GeneratedColumn<int>('priority', aliasedName, false,
              type: DriftSqlType.int, requiredDuringInsert: true)
          .withConverter<AssignmentPriority>(
              $AssignmentsTable.$converterpriority);
  static const VerificationMeta _statusMeta = const VerificationMeta('status');
  @override
  late final GeneratedColumnWithTypeConverter<AssignmentStatus, int> status =
      GeneratedColumn<int>('status', aliasedName, false,
              type: DriftSqlType.int, requiredDuringInsert: true)
          .withConverter<AssignmentStatus>($AssignmentsTable.$converterstatus);
  static const VerificationMeta _attachmentPathMeta =
      const VerificationMeta('attachmentPath');
  @override
  late final GeneratedColumn<String> attachmentPath = GeneratedColumn<String>(
      'attachment_path', aliasedName, true,
      type: DriftSqlType.string, requiredDuringInsert: false);
  static const VerificationMeta _reminderTimeMeta =
      const VerificationMeta('reminderTime');
  @override
  late final GeneratedColumn<DateTime> reminderTime = GeneratedColumn<DateTime>(
      'reminder_time', aliasedName, true,
      type: DriftSqlType.dateTime, requiredDuringInsert: false);
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _updatedAtMeta =
      const VerificationMeta('updatedAt');
  @override
  late final GeneratedColumn<DateTime> updatedAt = GeneratedColumn<DateTime>(
      'updated_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns => [
        id,
        title,
        course,
        description,
        deadline,
        priority,
        status,
        attachmentPath,
        reminderTime,
        createdAt,
        updatedAt
      ];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'assignments';
  @override
  VerificationContext validateIntegrity(Insertable<Assignment> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title']!, _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('course')) {
      context.handle(_courseMeta,
          course.isAcceptableOrUnknown(data['course']!, _courseMeta));
    } else if (isInserting) {
      context.missing(_courseMeta);
    }
    if (data.containsKey('description')) {
      context.handle(
          _descriptionMeta,
          description.isAcceptableOrUnknown(
              data['description']!, _descriptionMeta));
    }
    if (data.containsKey('deadline')) {
      context.handle(_deadlineMeta,
          deadline.isAcceptableOrUnknown(data['deadline']!, _deadlineMeta));
    } else if (isInserting) {
      context.missing(_deadlineMeta);
    }
    context.handle(_priorityMeta, const VerificationResult.success());
    context.handle(_statusMeta, const VerificationResult.success());
    if (data.containsKey('attachment_path')) {
      context.handle(
          _attachmentPathMeta,
          attachmentPath.isAcceptableOrUnknown(
              data['attachment_path']!, _attachmentPathMeta));
    }
    if (data.containsKey('reminder_time')) {
      context.handle(
          _reminderTimeMeta,
          reminderTime.isAcceptableOrUnknown(
              data['reminder_time']!, _reminderTimeMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    if (data.containsKey('updated_at')) {
      context.handle(_updatedAtMeta,
          updatedAt.isAcceptableOrUnknown(data['updated_at']!, _updatedAtMeta));
    } else if (isInserting) {
      context.missing(_updatedAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Assignment map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Assignment(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      title: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}title'])!,
      course: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}course'])!,
      description: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}description']),
      deadline: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deadline'])!,
      priority: $AssignmentsTable.$converterpriority.fromSql(attachedDatabase
          .typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}priority'])!),
      status: $AssignmentsTable.$converterstatus.fromSql(attachedDatabase
          .typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}status'])!),
      attachmentPath: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}attachment_path']),
      reminderTime: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}reminder_time']),
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
      updatedAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}updated_at'])!,
    );
  }

  @override
  $AssignmentsTable createAlias(String alias) {
    return $AssignmentsTable(attachedDatabase, alias);
  }

  static JsonTypeConverter2<AssignmentPriority, int, int> $converterpriority =
      const EnumIndexConverter<AssignmentPriority>(AssignmentPriority.values);
  static JsonTypeConverter2<AssignmentStatus, int, int> $converterstatus =
      const EnumIndexConverter<AssignmentStatus>(AssignmentStatus.values);
}

class Assignment extends DataClass implements Insertable<Assignment> {
  final int id;
  final String title;
  final String course;
  final String? description;
  final DateTime deadline;
  final AssignmentPriority priority;
  final AssignmentStatus status;
  final String? attachmentPath;
  final DateTime? reminderTime;
  final DateTime createdAt;
  final DateTime updatedAt;
  const Assignment(
      {required this.id,
      required this.title,
      required this.course,
      this.description,
      required this.deadline,
      required this.priority,
      required this.status,
      this.attachmentPath,
      this.reminderTime,
      required this.createdAt,
      required this.updatedAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['title'] = Variable<String>(title);
    map['course'] = Variable<String>(course);
    if (!nullToAbsent || description != null) {
      map['description'] = Variable<String>(description);
    }
    map['deadline'] = Variable<DateTime>(deadline);
    {
      map['priority'] =
          Variable<int>($AssignmentsTable.$converterpriority.toSql(priority));
    }
    {
      map['status'] =
          Variable<int>($AssignmentsTable.$converterstatus.toSql(status));
    }
    if (!nullToAbsent || attachmentPath != null) {
      map['attachment_path'] = Variable<String>(attachmentPath);
    }
    if (!nullToAbsent || reminderTime != null) {
      map['reminder_time'] = Variable<DateTime>(reminderTime);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    map['updated_at'] = Variable<DateTime>(updatedAt);
    return map;
  }

  AssignmentsCompanion toCompanion(bool nullToAbsent) {
    return AssignmentsCompanion(
      id: Value(id),
      title: Value(title),
      course: Value(course),
      description: description == null && nullToAbsent
          ? const Value.absent()
          : Value(description),
      deadline: Value(deadline),
      priority: Value(priority),
      status: Value(status),
      attachmentPath: attachmentPath == null && nullToAbsent
          ? const Value.absent()
          : Value(attachmentPath),
      reminderTime: reminderTime == null && nullToAbsent
          ? const Value.absent()
          : Value(reminderTime),
      createdAt: Value(createdAt),
      updatedAt: Value(updatedAt),
    );
  }

  factory Assignment.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Assignment(
      id: serializer.fromJson<int>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      course: serializer.fromJson<String>(json['course']),
      description: serializer.fromJson<String?>(json['description']),
      deadline: serializer.fromJson<DateTime>(json['deadline']),
      priority: $AssignmentsTable.$converterpriority
          .fromJson(serializer.fromJson<int>(json['priority'])),
      status: $AssignmentsTable.$converterstatus
          .fromJson(serializer.fromJson<int>(json['status'])),
      attachmentPath: serializer.fromJson<String?>(json['attachmentPath']),
      reminderTime: serializer.fromJson<DateTime?>(json['reminderTime']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
      updatedAt: serializer.fromJson<DateTime>(json['updatedAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'title': serializer.toJson<String>(title),
      'course': serializer.toJson<String>(course),
      'description': serializer.toJson<String?>(description),
      'deadline': serializer.toJson<DateTime>(deadline),
      'priority': serializer
          .toJson<int>($AssignmentsTable.$converterpriority.toJson(priority)),
      'status': serializer
          .toJson<int>($AssignmentsTable.$converterstatus.toJson(status)),
      'attachmentPath': serializer.toJson<String?>(attachmentPath),
      'reminderTime': serializer.toJson<DateTime?>(reminderTime),
      'createdAt': serializer.toJson<DateTime>(createdAt),
      'updatedAt': serializer.toJson<DateTime>(updatedAt),
    };
  }

  Assignment copyWith(
          {int? id,
          String? title,
          String? course,
          Value<String?> description = const Value.absent(),
          DateTime? deadline,
          AssignmentPriority? priority,
          AssignmentStatus? status,
          Value<String?> attachmentPath = const Value.absent(),
          Value<DateTime?> reminderTime = const Value.absent(),
          DateTime? createdAt,
          DateTime? updatedAt}) =>
      Assignment(
        id: id ?? this.id,
        title: title ?? this.title,
        course: course ?? this.course,
        description: description.present ? description.value : this.description,
        deadline: deadline ?? this.deadline,
        priority: priority ?? this.priority,
        status: status ?? this.status,
        attachmentPath:
            attachmentPath.present ? attachmentPath.value : this.attachmentPath,
        reminderTime:
            reminderTime.present ? reminderTime.value : this.reminderTime,
        createdAt: createdAt ?? this.createdAt,
        updatedAt: updatedAt ?? this.updatedAt,
      );
  Assignment copyWithCompanion(AssignmentsCompanion data) {
    return Assignment(
      id: data.id.present ? data.id.value : this.id,
      title: data.title.present ? data.title.value : this.title,
      course: data.course.present ? data.course.value : this.course,
      description:
          data.description.present ? data.description.value : this.description,
      deadline: data.deadline.present ? data.deadline.value : this.deadline,
      priority: data.priority.present ? data.priority.value : this.priority,
      status: data.status.present ? data.status.value : this.status,
      attachmentPath: data.attachmentPath.present
          ? data.attachmentPath.value
          : this.attachmentPath,
      reminderTime: data.reminderTime.present
          ? data.reminderTime.value
          : this.reminderTime,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
      updatedAt: data.updatedAt.present ? data.updatedAt.value : this.updatedAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Assignment(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('course: $course, ')
          ..write('description: $description, ')
          ..write('deadline: $deadline, ')
          ..write('priority: $priority, ')
          ..write('status: $status, ')
          ..write('attachmentPath: $attachmentPath, ')
          ..write('reminderTime: $reminderTime, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode => Object.hash(id, title, course, description, deadline,
      priority, status, attachmentPath, reminderTime, createdAt, updatedAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Assignment &&
          other.id == this.id &&
          other.title == this.title &&
          other.course == this.course &&
          other.description == this.description &&
          other.deadline == this.deadline &&
          other.priority == this.priority &&
          other.status == this.status &&
          other.attachmentPath == this.attachmentPath &&
          other.reminderTime == this.reminderTime &&
          other.createdAt == this.createdAt &&
          other.updatedAt == this.updatedAt);
}

class AssignmentsCompanion extends UpdateCompanion<Assignment> {
  final Value<int> id;
  final Value<String> title;
  final Value<String> course;
  final Value<String?> description;
  final Value<DateTime> deadline;
  final Value<AssignmentPriority> priority;
  final Value<AssignmentStatus> status;
  final Value<String?> attachmentPath;
  final Value<DateTime?> reminderTime;
  final Value<DateTime> createdAt;
  final Value<DateTime> updatedAt;
  const AssignmentsCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.course = const Value.absent(),
    this.description = const Value.absent(),
    this.deadline = const Value.absent(),
    this.priority = const Value.absent(),
    this.status = const Value.absent(),
    this.attachmentPath = const Value.absent(),
    this.reminderTime = const Value.absent(),
    this.createdAt = const Value.absent(),
    this.updatedAt = const Value.absent(),
  });
  AssignmentsCompanion.insert({
    this.id = const Value.absent(),
    required String title,
    required String course,
    this.description = const Value.absent(),
    required DateTime deadline,
    required AssignmentPriority priority,
    required AssignmentStatus status,
    this.attachmentPath = const Value.absent(),
    this.reminderTime = const Value.absent(),
    required DateTime createdAt,
    required DateTime updatedAt,
  })  : title = Value(title),
        course = Value(course),
        deadline = Value(deadline),
        priority = Value(priority),
        status = Value(status),
        createdAt = Value(createdAt),
        updatedAt = Value(updatedAt);
  static Insertable<Assignment> custom({
    Expression<int>? id,
    Expression<String>? title,
    Expression<String>? course,
    Expression<String>? description,
    Expression<DateTime>? deadline,
    Expression<int>? priority,
    Expression<int>? status,
    Expression<String>? attachmentPath,
    Expression<DateTime>? reminderTime,
    Expression<DateTime>? createdAt,
    Expression<DateTime>? updatedAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (course != null) 'course': course,
      if (description != null) 'description': description,
      if (deadline != null) 'deadline': deadline,
      if (priority != null) 'priority': priority,
      if (status != null) 'status': status,
      if (attachmentPath != null) 'attachment_path': attachmentPath,
      if (reminderTime != null) 'reminder_time': reminderTime,
      if (createdAt != null) 'created_at': createdAt,
      if (updatedAt != null) 'updated_at': updatedAt,
    });
  }

  AssignmentsCompanion copyWith(
      {Value<int>? id,
      Value<String>? title,
      Value<String>? course,
      Value<String?>? description,
      Value<DateTime>? deadline,
      Value<AssignmentPriority>? priority,
      Value<AssignmentStatus>? status,
      Value<String?>? attachmentPath,
      Value<DateTime?>? reminderTime,
      Value<DateTime>? createdAt,
      Value<DateTime>? updatedAt}) {
    return AssignmentsCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      course: course ?? this.course,
      description: description ?? this.description,
      deadline: deadline ?? this.deadline,
      priority: priority ?? this.priority,
      status: status ?? this.status,
      attachmentPath: attachmentPath ?? this.attachmentPath,
      reminderTime: reminderTime ?? this.reminderTime,
      createdAt: createdAt ?? this.createdAt,
      updatedAt: updatedAt ?? this.updatedAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (course.present) {
      map['course'] = Variable<String>(course.value);
    }
    if (description.present) {
      map['description'] = Variable<String>(description.value);
    }
    if (deadline.present) {
      map['deadline'] = Variable<DateTime>(deadline.value);
    }
    if (priority.present) {
      map['priority'] = Variable<int>(
          $AssignmentsTable.$converterpriority.toSql(priority.value));
    }
    if (status.present) {
      map['status'] =
          Variable<int>($AssignmentsTable.$converterstatus.toSql(status.value));
    }
    if (attachmentPath.present) {
      map['attachment_path'] = Variable<String>(attachmentPath.value);
    }
    if (reminderTime.present) {
      map['reminder_time'] = Variable<DateTime>(reminderTime.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    if (updatedAt.present) {
      map['updated_at'] = Variable<DateTime>(updatedAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('AssignmentsCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('course: $course, ')
          ..write('description: $description, ')
          ..write('deadline: $deadline, ')
          ..write('priority: $priority, ')
          ..write('status: $status, ')
          ..write('attachmentPath: $attachmentPath, ')
          ..write('reminderTime: $reminderTime, ')
          ..write('createdAt: $createdAt, ')
          ..write('updatedAt: $updatedAt')
          ..write(')'))
        .toString();
  }
}

class $TransactionsTable extends Transactions
    with TableInfo<$TransactionsTable, Transaction> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $TransactionsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
      'title', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _typeMeta = const VerificationMeta('type');
  @override
  late final GeneratedColumnWithTypeConverter<TransactionType, int> type =
      GeneratedColumn<int>('type', aliasedName, false,
              type: DriftSqlType.int, requiredDuringInsert: true)
          .withConverter<TransactionType>($TransactionsTable.$convertertype);
  static const VerificationMeta _categoryMeta =
      const VerificationMeta('category');
  @override
  late final GeneratedColumnWithTypeConverter<TransactionCategory?, int>
      category = GeneratedColumn<int>('category', aliasedName, true,
              type: DriftSqlType.int, requiredDuringInsert: false)
          .withConverter<TransactionCategory?>(
              $TransactionsTable.$convertercategoryn);
  static const VerificationMeta _amountMeta = const VerificationMeta('amount');
  @override
  late final GeneratedColumn<double> amount = GeneratedColumn<double>(
      'amount', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _dateMeta = const VerificationMeta('date');
  @override
  late final GeneratedColumn<DateTime> date = GeneratedColumn<DateTime>(
      'date', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns =>
      [id, title, type, category, amount, date, createdAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'transactions';
  @override
  VerificationContext validateIntegrity(Insertable<Transaction> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title']!, _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    context.handle(_typeMeta, const VerificationResult.success());
    context.handle(_categoryMeta, const VerificationResult.success());
    if (data.containsKey('amount')) {
      context.handle(_amountMeta,
          amount.isAcceptableOrUnknown(data['amount']!, _amountMeta));
    } else if (isInserting) {
      context.missing(_amountMeta);
    }
    if (data.containsKey('date')) {
      context.handle(
          _dateMeta, date.isAcceptableOrUnknown(data['date']!, _dateMeta));
    } else if (isInserting) {
      context.missing(_dateMeta);
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  Transaction map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return Transaction(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      title: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}title'])!,
      type: $TransactionsTable.$convertertype.fromSql(attachedDatabase
          .typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}type'])!),
      category: $TransactionsTable.$convertercategoryn.fromSql(attachedDatabase
          .typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}category'])),
      amount: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}amount'])!,
      date: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}date'])!,
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $TransactionsTable createAlias(String alias) {
    return $TransactionsTable(attachedDatabase, alias);
  }

  static JsonTypeConverter2<TransactionType, int, int> $convertertype =
      const EnumIndexConverter<TransactionType>(TransactionType.values);
  static JsonTypeConverter2<TransactionCategory, int, int> $convertercategory =
      const EnumIndexConverter<TransactionCategory>(TransactionCategory.values);
  static JsonTypeConverter2<TransactionCategory?, int?, int?>
      $convertercategoryn = JsonTypeConverter2.asNullable($convertercategory);
}

class Transaction extends DataClass implements Insertable<Transaction> {
  final int id;
  final String title;
  final TransactionType type;
  final TransactionCategory? category;
  final double amount;
  final DateTime date;
  final DateTime createdAt;
  const Transaction(
      {required this.id,
      required this.title,
      required this.type,
      this.category,
      required this.amount,
      required this.date,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['title'] = Variable<String>(title);
    {
      map['type'] =
          Variable<int>($TransactionsTable.$convertertype.toSql(type));
    }
    if (!nullToAbsent || category != null) {
      map['category'] =
          Variable<int>($TransactionsTable.$convertercategoryn.toSql(category));
    }
    map['amount'] = Variable<double>(amount);
    map['date'] = Variable<DateTime>(date);
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  TransactionsCompanion toCompanion(bool nullToAbsent) {
    return TransactionsCompanion(
      id: Value(id),
      title: Value(title),
      type: Value(type),
      category: category == null && nullToAbsent
          ? const Value.absent()
          : Value(category),
      amount: Value(amount),
      date: Value(date),
      createdAt: Value(createdAt),
    );
  }

  factory Transaction.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return Transaction(
      id: serializer.fromJson<int>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      type: $TransactionsTable.$convertertype
          .fromJson(serializer.fromJson<int>(json['type'])),
      category: $TransactionsTable.$convertercategoryn
          .fromJson(serializer.fromJson<int?>(json['category'])),
      amount: serializer.fromJson<double>(json['amount']),
      date: serializer.fromJson<DateTime>(json['date']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'title': serializer.toJson<String>(title),
      'type': serializer
          .toJson<int>($TransactionsTable.$convertertype.toJson(type)),
      'category': serializer.toJson<int?>(
          $TransactionsTable.$convertercategoryn.toJson(category)),
      'amount': serializer.toJson<double>(amount),
      'date': serializer.toJson<DateTime>(date),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  Transaction copyWith(
          {int? id,
          String? title,
          TransactionType? type,
          Value<TransactionCategory?> category = const Value.absent(),
          double? amount,
          DateTime? date,
          DateTime? createdAt}) =>
      Transaction(
        id: id ?? this.id,
        title: title ?? this.title,
        type: type ?? this.type,
        category: category.present ? category.value : this.category,
        amount: amount ?? this.amount,
        date: date ?? this.date,
        createdAt: createdAt ?? this.createdAt,
      );
  Transaction copyWithCompanion(TransactionsCompanion data) {
    return Transaction(
      id: data.id.present ? data.id.value : this.id,
      title: data.title.present ? data.title.value : this.title,
      type: data.type.present ? data.type.value : this.type,
      category: data.category.present ? data.category.value : this.category,
      amount: data.amount.present ? data.amount.value : this.amount,
      date: data.date.present ? data.date.value : this.date,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('Transaction(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('type: $type, ')
          ..write('category: $category, ')
          ..write('amount: $amount, ')
          ..write('date: $date, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, title, type, category, amount, date, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is Transaction &&
          other.id == this.id &&
          other.title == this.title &&
          other.type == this.type &&
          other.category == this.category &&
          other.amount == this.amount &&
          other.date == this.date &&
          other.createdAt == this.createdAt);
}

class TransactionsCompanion extends UpdateCompanion<Transaction> {
  final Value<int> id;
  final Value<String> title;
  final Value<TransactionType> type;
  final Value<TransactionCategory?> category;
  final Value<double> amount;
  final Value<DateTime> date;
  final Value<DateTime> createdAt;
  const TransactionsCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.type = const Value.absent(),
    this.category = const Value.absent(),
    this.amount = const Value.absent(),
    this.date = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  TransactionsCompanion.insert({
    this.id = const Value.absent(),
    required String title,
    required TransactionType type,
    this.category = const Value.absent(),
    required double amount,
    required DateTime date,
    required DateTime createdAt,
  })  : title = Value(title),
        type = Value(type),
        amount = Value(amount),
        date = Value(date),
        createdAt = Value(createdAt);
  static Insertable<Transaction> custom({
    Expression<int>? id,
    Expression<String>? title,
    Expression<int>? type,
    Expression<int>? category,
    Expression<double>? amount,
    Expression<DateTime>? date,
    Expression<DateTime>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (type != null) 'type': type,
      if (category != null) 'category': category,
      if (amount != null) 'amount': amount,
      if (date != null) 'date': date,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  TransactionsCompanion copyWith(
      {Value<int>? id,
      Value<String>? title,
      Value<TransactionType>? type,
      Value<TransactionCategory?>? category,
      Value<double>? amount,
      Value<DateTime>? date,
      Value<DateTime>? createdAt}) {
    return TransactionsCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      type: type ?? this.type,
      category: category ?? this.category,
      amount: amount ?? this.amount,
      date: date ?? this.date,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (type.present) {
      map['type'] =
          Variable<int>($TransactionsTable.$convertertype.toSql(type.value));
    }
    if (category.present) {
      map['category'] = Variable<int>(
          $TransactionsTable.$convertercategoryn.toSql(category.value));
    }
    if (amount.present) {
      map['amount'] = Variable<double>(amount.value);
    }
    if (date.present) {
      map['date'] = Variable<DateTime>(date.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('TransactionsCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('type: $type, ')
          ..write('category: $category, ')
          ..write('amount: $amount, ')
          ..write('date: $date, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }
}

class $SavingGoalsTable extends SavingGoals
    with TableInfo<$SavingGoalsTable, SavingGoal> {
  @override
  final GeneratedDatabase attachedDatabase;
  final String? _alias;
  $SavingGoalsTable(this.attachedDatabase, [this._alias]);
  static const VerificationMeta _idMeta = const VerificationMeta('id');
  @override
  late final GeneratedColumn<int> id = GeneratedColumn<int>(
      'id', aliasedName, false,
      hasAutoIncrement: true,
      type: DriftSqlType.int,
      requiredDuringInsert: false,
      defaultConstraints:
          GeneratedColumn.constraintIsAlways('PRIMARY KEY AUTOINCREMENT'));
  static const VerificationMeta _titleMeta = const VerificationMeta('title');
  @override
  late final GeneratedColumn<String> title = GeneratedColumn<String>(
      'title', aliasedName, false,
      type: DriftSqlType.string, requiredDuringInsert: true);
  static const VerificationMeta _targetAmountMeta =
      const VerificationMeta('targetAmount');
  @override
  late final GeneratedColumn<double> targetAmount = GeneratedColumn<double>(
      'target_amount', aliasedName, false,
      type: DriftSqlType.double, requiredDuringInsert: true);
  static const VerificationMeta _currentAmountMeta =
      const VerificationMeta('currentAmount');
  @override
  late final GeneratedColumn<double> currentAmount = GeneratedColumn<double>(
      'current_amount', aliasedName, false,
      type: DriftSqlType.double,
      requiredDuringInsert: false,
      defaultValue: const Constant(0));
  static const VerificationMeta _deadlineMeta =
      const VerificationMeta('deadline');
  @override
  late final GeneratedColumn<DateTime> deadline = GeneratedColumn<DateTime>(
      'deadline', aliasedName, true,
      type: DriftSqlType.dateTime, requiredDuringInsert: false);
  static const VerificationMeta _createdAtMeta =
      const VerificationMeta('createdAt');
  @override
  late final GeneratedColumn<DateTime> createdAt = GeneratedColumn<DateTime>(
      'created_at', aliasedName, false,
      type: DriftSqlType.dateTime, requiredDuringInsert: true);
  @override
  List<GeneratedColumn> get $columns =>
      [id, title, targetAmount, currentAmount, deadline, createdAt];
  @override
  String get aliasedName => _alias ?? actualTableName;
  @override
  String get actualTableName => $name;
  static const String $name = 'saving_goals';
  @override
  VerificationContext validateIntegrity(Insertable<SavingGoal> instance,
      {bool isInserting = false}) {
    final context = VerificationContext();
    final data = instance.toColumns(true);
    if (data.containsKey('id')) {
      context.handle(_idMeta, id.isAcceptableOrUnknown(data['id']!, _idMeta));
    }
    if (data.containsKey('title')) {
      context.handle(
          _titleMeta, title.isAcceptableOrUnknown(data['title']!, _titleMeta));
    } else if (isInserting) {
      context.missing(_titleMeta);
    }
    if (data.containsKey('target_amount')) {
      context.handle(
          _targetAmountMeta,
          targetAmount.isAcceptableOrUnknown(
              data['target_amount']!, _targetAmountMeta));
    } else if (isInserting) {
      context.missing(_targetAmountMeta);
    }
    if (data.containsKey('current_amount')) {
      context.handle(
          _currentAmountMeta,
          currentAmount.isAcceptableOrUnknown(
              data['current_amount']!, _currentAmountMeta));
    }
    if (data.containsKey('deadline')) {
      context.handle(_deadlineMeta,
          deadline.isAcceptableOrUnknown(data['deadline']!, _deadlineMeta));
    }
    if (data.containsKey('created_at')) {
      context.handle(_createdAtMeta,
          createdAt.isAcceptableOrUnknown(data['created_at']!, _createdAtMeta));
    } else if (isInserting) {
      context.missing(_createdAtMeta);
    }
    return context;
  }

  @override
  Set<GeneratedColumn> get $primaryKey => {id};
  @override
  SavingGoal map(Map<String, dynamic> data, {String? tablePrefix}) {
    final effectivePrefix = tablePrefix != null ? '$tablePrefix.' : '';
    return SavingGoal(
      id: attachedDatabase.typeMapping
          .read(DriftSqlType.int, data['${effectivePrefix}id'])!,
      title: attachedDatabase.typeMapping
          .read(DriftSqlType.string, data['${effectivePrefix}title'])!,
      targetAmount: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}target_amount'])!,
      currentAmount: attachedDatabase.typeMapping
          .read(DriftSqlType.double, data['${effectivePrefix}current_amount'])!,
      deadline: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}deadline']),
      createdAt: attachedDatabase.typeMapping
          .read(DriftSqlType.dateTime, data['${effectivePrefix}created_at'])!,
    );
  }

  @override
  $SavingGoalsTable createAlias(String alias) {
    return $SavingGoalsTable(attachedDatabase, alias);
  }
}

class SavingGoal extends DataClass implements Insertable<SavingGoal> {
  final int id;
  final String title;
  final double targetAmount;
  final double currentAmount;
  final DateTime? deadline;
  final DateTime createdAt;
  const SavingGoal(
      {required this.id,
      required this.title,
      required this.targetAmount,
      required this.currentAmount,
      this.deadline,
      required this.createdAt});
  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    map['id'] = Variable<int>(id);
    map['title'] = Variable<String>(title);
    map['target_amount'] = Variable<double>(targetAmount);
    map['current_amount'] = Variable<double>(currentAmount);
    if (!nullToAbsent || deadline != null) {
      map['deadline'] = Variable<DateTime>(deadline);
    }
    map['created_at'] = Variable<DateTime>(createdAt);
    return map;
  }

  SavingGoalsCompanion toCompanion(bool nullToAbsent) {
    return SavingGoalsCompanion(
      id: Value(id),
      title: Value(title),
      targetAmount: Value(targetAmount),
      currentAmount: Value(currentAmount),
      deadline: deadline == null && nullToAbsent
          ? const Value.absent()
          : Value(deadline),
      createdAt: Value(createdAt),
    );
  }

  factory SavingGoal.fromJson(Map<String, dynamic> json,
      {ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return SavingGoal(
      id: serializer.fromJson<int>(json['id']),
      title: serializer.fromJson<String>(json['title']),
      targetAmount: serializer.fromJson<double>(json['targetAmount']),
      currentAmount: serializer.fromJson<double>(json['currentAmount']),
      deadline: serializer.fromJson<DateTime?>(json['deadline']),
      createdAt: serializer.fromJson<DateTime>(json['createdAt']),
    );
  }
  @override
  Map<String, dynamic> toJson({ValueSerializer? serializer}) {
    serializer ??= driftRuntimeOptions.defaultSerializer;
    return <String, dynamic>{
      'id': serializer.toJson<int>(id),
      'title': serializer.toJson<String>(title),
      'targetAmount': serializer.toJson<double>(targetAmount),
      'currentAmount': serializer.toJson<double>(currentAmount),
      'deadline': serializer.toJson<DateTime?>(deadline),
      'createdAt': serializer.toJson<DateTime>(createdAt),
    };
  }

  SavingGoal copyWith(
          {int? id,
          String? title,
          double? targetAmount,
          double? currentAmount,
          Value<DateTime?> deadline = const Value.absent(),
          DateTime? createdAt}) =>
      SavingGoal(
        id: id ?? this.id,
        title: title ?? this.title,
        targetAmount: targetAmount ?? this.targetAmount,
        currentAmount: currentAmount ?? this.currentAmount,
        deadline: deadline.present ? deadline.value : this.deadline,
        createdAt: createdAt ?? this.createdAt,
      );
  SavingGoal copyWithCompanion(SavingGoalsCompanion data) {
    return SavingGoal(
      id: data.id.present ? data.id.value : this.id,
      title: data.title.present ? data.title.value : this.title,
      targetAmount: data.targetAmount.present
          ? data.targetAmount.value
          : this.targetAmount,
      currentAmount: data.currentAmount.present
          ? data.currentAmount.value
          : this.currentAmount,
      deadline: data.deadline.present ? data.deadline.value : this.deadline,
      createdAt: data.createdAt.present ? data.createdAt.value : this.createdAt,
    );
  }

  @override
  String toString() {
    return (StringBuffer('SavingGoal(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('targetAmount: $targetAmount, ')
          ..write('currentAmount: $currentAmount, ')
          ..write('deadline: $deadline, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }

  @override
  int get hashCode =>
      Object.hash(id, title, targetAmount, currentAmount, deadline, createdAt);
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      (other is SavingGoal &&
          other.id == this.id &&
          other.title == this.title &&
          other.targetAmount == this.targetAmount &&
          other.currentAmount == this.currentAmount &&
          other.deadline == this.deadline &&
          other.createdAt == this.createdAt);
}

class SavingGoalsCompanion extends UpdateCompanion<SavingGoal> {
  final Value<int> id;
  final Value<String> title;
  final Value<double> targetAmount;
  final Value<double> currentAmount;
  final Value<DateTime?> deadline;
  final Value<DateTime> createdAt;
  const SavingGoalsCompanion({
    this.id = const Value.absent(),
    this.title = const Value.absent(),
    this.targetAmount = const Value.absent(),
    this.currentAmount = const Value.absent(),
    this.deadline = const Value.absent(),
    this.createdAt = const Value.absent(),
  });
  SavingGoalsCompanion.insert({
    this.id = const Value.absent(),
    required String title,
    required double targetAmount,
    this.currentAmount = const Value.absent(),
    this.deadline = const Value.absent(),
    required DateTime createdAt,
  })  : title = Value(title),
        targetAmount = Value(targetAmount),
        createdAt = Value(createdAt);
  static Insertable<SavingGoal> custom({
    Expression<int>? id,
    Expression<String>? title,
    Expression<double>? targetAmount,
    Expression<double>? currentAmount,
    Expression<DateTime>? deadline,
    Expression<DateTime>? createdAt,
  }) {
    return RawValuesInsertable({
      if (id != null) 'id': id,
      if (title != null) 'title': title,
      if (targetAmount != null) 'target_amount': targetAmount,
      if (currentAmount != null) 'current_amount': currentAmount,
      if (deadline != null) 'deadline': deadline,
      if (createdAt != null) 'created_at': createdAt,
    });
  }

  SavingGoalsCompanion copyWith(
      {Value<int>? id,
      Value<String>? title,
      Value<double>? targetAmount,
      Value<double>? currentAmount,
      Value<DateTime?>? deadline,
      Value<DateTime>? createdAt}) {
    return SavingGoalsCompanion(
      id: id ?? this.id,
      title: title ?? this.title,
      targetAmount: targetAmount ?? this.targetAmount,
      currentAmount: currentAmount ?? this.currentAmount,
      deadline: deadline ?? this.deadline,
      createdAt: createdAt ?? this.createdAt,
    );
  }

  @override
  Map<String, Expression> toColumns(bool nullToAbsent) {
    final map = <String, Expression>{};
    if (id.present) {
      map['id'] = Variable<int>(id.value);
    }
    if (title.present) {
      map['title'] = Variable<String>(title.value);
    }
    if (targetAmount.present) {
      map['target_amount'] = Variable<double>(targetAmount.value);
    }
    if (currentAmount.present) {
      map['current_amount'] = Variable<double>(currentAmount.value);
    }
    if (deadline.present) {
      map['deadline'] = Variable<DateTime>(deadline.value);
    }
    if (createdAt.present) {
      map['created_at'] = Variable<DateTime>(createdAt.value);
    }
    return map;
  }

  @override
  String toString() {
    return (StringBuffer('SavingGoalsCompanion(')
          ..write('id: $id, ')
          ..write('title: $title, ')
          ..write('targetAmount: $targetAmount, ')
          ..write('currentAmount: $currentAmount, ')
          ..write('deadline: $deadline, ')
          ..write('createdAt: $createdAt')
          ..write(')'))
        .toString();
  }
}

abstract class _$AppDatabase extends GeneratedDatabase {
  _$AppDatabase(QueryExecutor e) : super(e);
  $AppDatabaseManager get managers => $AppDatabaseManager(this);
  late final $AssignmentsTable assignments = $AssignmentsTable(this);
  late final $TransactionsTable transactions = $TransactionsTable(this);
  late final $SavingGoalsTable savingGoals = $SavingGoalsTable(this);
  late final AssignmentDao assignmentDao = AssignmentDao(this as AppDatabase);
  late final TransactionDao transactionDao =
      TransactionDao(this as AppDatabase);
  late final SavingGoalDao savingGoalDao = SavingGoalDao(this as AppDatabase);
  @override
  Iterable<TableInfo<Table, Object?>> get allTables =>
      allSchemaEntities.whereType<TableInfo<Table, Object?>>();
  @override
  List<DatabaseSchemaEntity> get allSchemaEntities =>
      [assignments, transactions, savingGoals];
}

typedef $$AssignmentsTableCreateCompanionBuilder = AssignmentsCompanion
    Function({
  Value<int> id,
  required String title,
  required String course,
  Value<String?> description,
  required DateTime deadline,
  required AssignmentPriority priority,
  required AssignmentStatus status,
  Value<String?> attachmentPath,
  Value<DateTime?> reminderTime,
  required DateTime createdAt,
  required DateTime updatedAt,
});
typedef $$AssignmentsTableUpdateCompanionBuilder = AssignmentsCompanion
    Function({
  Value<int> id,
  Value<String> title,
  Value<String> course,
  Value<String?> description,
  Value<DateTime> deadline,
  Value<AssignmentPriority> priority,
  Value<AssignmentStatus> status,
  Value<String?> attachmentPath,
  Value<DateTime?> reminderTime,
  Value<DateTime> createdAt,
  Value<DateTime> updatedAt,
});

class $$AssignmentsTableFilterComposer
    extends FilterComposer<_$AppDatabase, $AssignmentsTable> {
  $$AssignmentsTableFilterComposer(super.$state);
  ColumnFilters<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get title => $state.composableBuilder(
      column: $state.table.title,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get course => $state.composableBuilder(
      column: $state.table.course,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get description => $state.composableBuilder(
      column: $state.table.description,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get deadline => $state.composableBuilder(
      column: $state.table.deadline,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnWithTypeConverterFilters<AssignmentPriority, AssignmentPriority, int>
      get priority => $state.composableBuilder(
          column: $state.table.priority,
          builder: (column, joinBuilders) => ColumnWithTypeConverterFilters(
              column,
              joinBuilders: joinBuilders));

  ColumnWithTypeConverterFilters<AssignmentStatus, AssignmentStatus, int>
      get status => $state.composableBuilder(
          column: $state.table.status,
          builder: (column, joinBuilders) => ColumnWithTypeConverterFilters(
              column,
              joinBuilders: joinBuilders));

  ColumnFilters<String> get attachmentPath => $state.composableBuilder(
      column: $state.table.attachmentPath,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get reminderTime => $state.composableBuilder(
      column: $state.table.reminderTime,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get createdAt => $state.composableBuilder(
      column: $state.table.createdAt,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get updatedAt => $state.composableBuilder(
      column: $state.table.updatedAt,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$AssignmentsTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $AssignmentsTable> {
  $$AssignmentsTableOrderingComposer(super.$state);
  ColumnOrderings<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get title => $state.composableBuilder(
      column: $state.table.title,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get course => $state.composableBuilder(
      column: $state.table.course,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get description => $state.composableBuilder(
      column: $state.table.description,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get deadline => $state.composableBuilder(
      column: $state.table.deadline,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get priority => $state.composableBuilder(
      column: $state.table.priority,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get status => $state.composableBuilder(
      column: $state.table.status,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get attachmentPath => $state.composableBuilder(
      column: $state.table.attachmentPath,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get reminderTime => $state.composableBuilder(
      column: $state.table.reminderTime,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get createdAt => $state.composableBuilder(
      column: $state.table.createdAt,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get updatedAt => $state.composableBuilder(
      column: $state.table.updatedAt,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

class $$AssignmentsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $AssignmentsTable,
    Assignment,
    $$AssignmentsTableFilterComposer,
    $$AssignmentsTableOrderingComposer,
    $$AssignmentsTableCreateCompanionBuilder,
    $$AssignmentsTableUpdateCompanionBuilder,
    (Assignment, BaseReferences<_$AppDatabase, $AssignmentsTable, Assignment>),
    Assignment,
    PrefetchHooks Function()> {
  $$AssignmentsTableTableManager(_$AppDatabase db, $AssignmentsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$AssignmentsTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$AssignmentsTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> title = const Value.absent(),
            Value<String> course = const Value.absent(),
            Value<String?> description = const Value.absent(),
            Value<DateTime> deadline = const Value.absent(),
            Value<AssignmentPriority> priority = const Value.absent(),
            Value<AssignmentStatus> status = const Value.absent(),
            Value<String?> attachmentPath = const Value.absent(),
            Value<DateTime?> reminderTime = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
            Value<DateTime> updatedAt = const Value.absent(),
          }) =>
              AssignmentsCompanion(
            id: id,
            title: title,
            course: course,
            description: description,
            deadline: deadline,
            priority: priority,
            status: status,
            attachmentPath: attachmentPath,
            reminderTime: reminderTime,
            createdAt: createdAt,
            updatedAt: updatedAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String title,
            required String course,
            Value<String?> description = const Value.absent(),
            required DateTime deadline,
            required AssignmentPriority priority,
            required AssignmentStatus status,
            Value<String?> attachmentPath = const Value.absent(),
            Value<DateTime?> reminderTime = const Value.absent(),
            required DateTime createdAt,
            required DateTime updatedAt,
          }) =>
              AssignmentsCompanion.insert(
            id: id,
            title: title,
            course: course,
            description: description,
            deadline: deadline,
            priority: priority,
            status: status,
            attachmentPath: attachmentPath,
            reminderTime: reminderTime,
            createdAt: createdAt,
            updatedAt: updatedAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$AssignmentsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $AssignmentsTable,
    Assignment,
    $$AssignmentsTableFilterComposer,
    $$AssignmentsTableOrderingComposer,
    $$AssignmentsTableCreateCompanionBuilder,
    $$AssignmentsTableUpdateCompanionBuilder,
    (Assignment, BaseReferences<_$AppDatabase, $AssignmentsTable, Assignment>),
    Assignment,
    PrefetchHooks Function()>;
typedef $$TransactionsTableCreateCompanionBuilder = TransactionsCompanion
    Function({
  Value<int> id,
  required String title,
  required TransactionType type,
  Value<TransactionCategory?> category,
  required double amount,
  required DateTime date,
  required DateTime createdAt,
});
typedef $$TransactionsTableUpdateCompanionBuilder = TransactionsCompanion
    Function({
  Value<int> id,
  Value<String> title,
  Value<TransactionType> type,
  Value<TransactionCategory?> category,
  Value<double> amount,
  Value<DateTime> date,
  Value<DateTime> createdAt,
});

class $$TransactionsTableFilterComposer
    extends FilterComposer<_$AppDatabase, $TransactionsTable> {
  $$TransactionsTableFilterComposer(super.$state);
  ColumnFilters<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get title => $state.composableBuilder(
      column: $state.table.title,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnWithTypeConverterFilters<TransactionType, TransactionType, int>
      get type => $state.composableBuilder(
          column: $state.table.type,
          builder: (column, joinBuilders) => ColumnWithTypeConverterFilters(
              column,
              joinBuilders: joinBuilders));

  ColumnWithTypeConverterFilters<TransactionCategory?, TransactionCategory, int>
      get category => $state.composableBuilder(
          column: $state.table.category,
          builder: (column, joinBuilders) => ColumnWithTypeConverterFilters(
              column,
              joinBuilders: joinBuilders));

  ColumnFilters<double> get amount => $state.composableBuilder(
      column: $state.table.amount,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get date => $state.composableBuilder(
      column: $state.table.date,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get createdAt => $state.composableBuilder(
      column: $state.table.createdAt,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$TransactionsTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $TransactionsTable> {
  $$TransactionsTableOrderingComposer(super.$state);
  ColumnOrderings<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get title => $state.composableBuilder(
      column: $state.table.title,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get type => $state.composableBuilder(
      column: $state.table.type,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<int> get category => $state.composableBuilder(
      column: $state.table.category,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<double> get amount => $state.composableBuilder(
      column: $state.table.amount,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get date => $state.composableBuilder(
      column: $state.table.date,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get createdAt => $state.composableBuilder(
      column: $state.table.createdAt,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

class $$TransactionsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $TransactionsTable,
    Transaction,
    $$TransactionsTableFilterComposer,
    $$TransactionsTableOrderingComposer,
    $$TransactionsTableCreateCompanionBuilder,
    $$TransactionsTableUpdateCompanionBuilder,
    (
      Transaction,
      BaseReferences<_$AppDatabase, $TransactionsTable, Transaction>
    ),
    Transaction,
    PrefetchHooks Function()> {
  $$TransactionsTableTableManager(_$AppDatabase db, $TransactionsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$TransactionsTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$TransactionsTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> title = const Value.absent(),
            Value<TransactionType> type = const Value.absent(),
            Value<TransactionCategory?> category = const Value.absent(),
            Value<double> amount = const Value.absent(),
            Value<DateTime> date = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              TransactionsCompanion(
            id: id,
            title: title,
            type: type,
            category: category,
            amount: amount,
            date: date,
            createdAt: createdAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String title,
            required TransactionType type,
            Value<TransactionCategory?> category = const Value.absent(),
            required double amount,
            required DateTime date,
            required DateTime createdAt,
          }) =>
              TransactionsCompanion.insert(
            id: id,
            title: title,
            type: type,
            category: category,
            amount: amount,
            date: date,
            createdAt: createdAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$TransactionsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $TransactionsTable,
    Transaction,
    $$TransactionsTableFilterComposer,
    $$TransactionsTableOrderingComposer,
    $$TransactionsTableCreateCompanionBuilder,
    $$TransactionsTableUpdateCompanionBuilder,
    (
      Transaction,
      BaseReferences<_$AppDatabase, $TransactionsTable, Transaction>
    ),
    Transaction,
    PrefetchHooks Function()>;
typedef $$SavingGoalsTableCreateCompanionBuilder = SavingGoalsCompanion
    Function({
  Value<int> id,
  required String title,
  required double targetAmount,
  Value<double> currentAmount,
  Value<DateTime?> deadline,
  required DateTime createdAt,
});
typedef $$SavingGoalsTableUpdateCompanionBuilder = SavingGoalsCompanion
    Function({
  Value<int> id,
  Value<String> title,
  Value<double> targetAmount,
  Value<double> currentAmount,
  Value<DateTime?> deadline,
  Value<DateTime> createdAt,
});

class $$SavingGoalsTableFilterComposer
    extends FilterComposer<_$AppDatabase, $SavingGoalsTable> {
  $$SavingGoalsTableFilterComposer(super.$state);
  ColumnFilters<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<String> get title => $state.composableBuilder(
      column: $state.table.title,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<double> get targetAmount => $state.composableBuilder(
      column: $state.table.targetAmount,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<double> get currentAmount => $state.composableBuilder(
      column: $state.table.currentAmount,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get deadline => $state.composableBuilder(
      column: $state.table.deadline,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));

  ColumnFilters<DateTime> get createdAt => $state.composableBuilder(
      column: $state.table.createdAt,
      builder: (column, joinBuilders) =>
          ColumnFilters(column, joinBuilders: joinBuilders));
}

class $$SavingGoalsTableOrderingComposer
    extends OrderingComposer<_$AppDatabase, $SavingGoalsTable> {
  $$SavingGoalsTableOrderingComposer(super.$state);
  ColumnOrderings<int> get id => $state.composableBuilder(
      column: $state.table.id,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<String> get title => $state.composableBuilder(
      column: $state.table.title,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<double> get targetAmount => $state.composableBuilder(
      column: $state.table.targetAmount,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<double> get currentAmount => $state.composableBuilder(
      column: $state.table.currentAmount,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get deadline => $state.composableBuilder(
      column: $state.table.deadline,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));

  ColumnOrderings<DateTime> get createdAt => $state.composableBuilder(
      column: $state.table.createdAt,
      builder: (column, joinBuilders) =>
          ColumnOrderings(column, joinBuilders: joinBuilders));
}

class $$SavingGoalsTableTableManager extends RootTableManager<
    _$AppDatabase,
    $SavingGoalsTable,
    SavingGoal,
    $$SavingGoalsTableFilterComposer,
    $$SavingGoalsTableOrderingComposer,
    $$SavingGoalsTableCreateCompanionBuilder,
    $$SavingGoalsTableUpdateCompanionBuilder,
    (SavingGoal, BaseReferences<_$AppDatabase, $SavingGoalsTable, SavingGoal>),
    SavingGoal,
    PrefetchHooks Function()> {
  $$SavingGoalsTableTableManager(_$AppDatabase db, $SavingGoalsTable table)
      : super(TableManagerState(
          db: db,
          table: table,
          filteringComposer:
              $$SavingGoalsTableFilterComposer(ComposerState(db, table)),
          orderingComposer:
              $$SavingGoalsTableOrderingComposer(ComposerState(db, table)),
          updateCompanionCallback: ({
            Value<int> id = const Value.absent(),
            Value<String> title = const Value.absent(),
            Value<double> targetAmount = const Value.absent(),
            Value<double> currentAmount = const Value.absent(),
            Value<DateTime?> deadline = const Value.absent(),
            Value<DateTime> createdAt = const Value.absent(),
          }) =>
              SavingGoalsCompanion(
            id: id,
            title: title,
            targetAmount: targetAmount,
            currentAmount: currentAmount,
            deadline: deadline,
            createdAt: createdAt,
          ),
          createCompanionCallback: ({
            Value<int> id = const Value.absent(),
            required String title,
            required double targetAmount,
            Value<double> currentAmount = const Value.absent(),
            Value<DateTime?> deadline = const Value.absent(),
            required DateTime createdAt,
          }) =>
              SavingGoalsCompanion.insert(
            id: id,
            title: title,
            targetAmount: targetAmount,
            currentAmount: currentAmount,
            deadline: deadline,
            createdAt: createdAt,
          ),
          withReferenceMapper: (p0) => p0
              .map((e) => (e.readTable(table), BaseReferences(db, table, e)))
              .toList(),
          prefetchHooksCallback: null,
        ));
}

typedef $$SavingGoalsTableProcessedTableManager = ProcessedTableManager<
    _$AppDatabase,
    $SavingGoalsTable,
    SavingGoal,
    $$SavingGoalsTableFilterComposer,
    $$SavingGoalsTableOrderingComposer,
    $$SavingGoalsTableCreateCompanionBuilder,
    $$SavingGoalsTableUpdateCompanionBuilder,
    (SavingGoal, BaseReferences<_$AppDatabase, $SavingGoalsTable, SavingGoal>),
    SavingGoal,
    PrefetchHooks Function()>;

class $AppDatabaseManager {
  final _$AppDatabase _db;
  $AppDatabaseManager(this._db);
  $$AssignmentsTableTableManager get assignments =>
      $$AssignmentsTableTableManager(_db, _db.assignments);
  $$TransactionsTableTableManager get transactions =>
      $$TransactionsTableTableManager(_db, _db.transactions);
  $$SavingGoalsTableTableManager get savingGoals =>
      $$SavingGoalsTableTableManager(_db, _db.savingGoals);
}
