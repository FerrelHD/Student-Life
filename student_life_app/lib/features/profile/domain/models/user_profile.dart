class UserProfile {
  const UserProfile({
    this.name = '',
    this.university = '',
    this.semester = '',
    this.programStudy = '',
    this.photoPath,
    this.darkMode = true,
    this.notificationsEnabled = true,
    this.streakDays = 0,
    this.lastStudyLogDate,
  });

  final String name;
  final String university;
  final String semester;
  final String programStudy;
  final String? photoPath;
  final bool darkMode;
  final bool notificationsEnabled;
  final int streakDays;
  final DateTime? lastStudyLogDate;

  bool get isSetupComplete => name.trim().isNotEmpty;

  UserProfile copyWith({
    String? name,
    String? university,
    String? semester,
    String? programStudy,
    String? photoPath,
    bool? darkMode,
    bool? notificationsEnabled,
    int? streakDays,
    DateTime? lastStudyLogDate,
  }) {
    return UserProfile(
      name: name ?? this.name,
      university: university ?? this.university,
      semester: semester ?? this.semester,
      programStudy: programStudy ?? this.programStudy,
      photoPath: photoPath ?? this.photoPath,
      darkMode: darkMode ?? this.darkMode,
      notificationsEnabled: notificationsEnabled ?? this.notificationsEnabled,
      streakDays: streakDays ?? this.streakDays,
      lastStudyLogDate: lastStudyLogDate ?? this.lastStudyLogDate,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'university': university,
        'semester': semester,
        'programStudy': programStudy,
        'photoPath': photoPath,
        'darkMode': darkMode,
        'notificationsEnabled': notificationsEnabled,
        'streakDays': streakDays,
        'lastStudyLogDate': lastStudyLogDate?.toIso8601String(),
      };

  factory UserProfile.fromJson(Map<String, dynamic> json) => UserProfile(
        name: json['name'] as String? ?? '',
        university: json['university'] as String? ?? '',
        semester: json['semester'] as String? ?? '',
        programStudy: json['programStudy'] as String? ?? '',
        photoPath: json['photoPath'] as String?,
        darkMode: json['darkMode'] as bool? ?? true,
        notificationsEnabled: json['notificationsEnabled'] as bool? ?? true,
        streakDays: json['streakDays'] as int? ?? 0,
        lastStudyLogDate: json['lastStudyLogDate'] != null
            ? DateTime.tryParse(json['lastStudyLogDate'] as String)
            : null,
      );
}
