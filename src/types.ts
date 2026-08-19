export type TabType = 'dashboard' | 'missions' | 'vault' | 'agenda' | 'hero';

export type LanguageType = 'id' | 'en';

export type Translations = { [key: string]: string };

export type PriorityType = 'high' | 'medium' | 'low';

export type MissionTag = 'EXAM' | 'LAB' | 'PAPER' | 'CODE' | 'READ' | 'PROJECT' | 'CLASS' | 'ORGANIZATION' | 'PERSONAL' | 'OTHER';

export interface Mission {
  id: string;
  title: string;
  course: string;
  priority: PriorityType;
  dueDate: string;
  tag: MissionTag;
  completed: boolean;
  xpReward: number;
  time?: string;
  location?: string;
  focusPriority?: 'CRITICAL' | 'URGENT' | 'ROUTINE';
  dateStr?: string; // e.g. "2026-07-26"
}

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 'INCOME' | 'FOOD' | 'TRANSPORT' | 'SUBSCRIPTION' | 'TECH' | 'OTHER';

export type RecurrenceType = 'none' | 'monthly';

export interface Transaction {
  id: string;
  title: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
  date: string;
  recurrence: RecurrenceType;
  createdAt: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  level: number;
  role: string;
  university: string;
  classOf: string;
  currentXP: number;
  gpa: number;
  rank: string;
  walks: number;
  streakDays: number;
  avatarUrl: string;
  darkMode: boolean;
  notifications: boolean;
  language: LanguageType;
  lastQuizDate?: string | null;
  lastStreakDate?: string | null;
  lastStreakBonusDate?: string | null;
}

export interface Badge {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  tier?: string;
  unlocked: boolean;
}

export interface WeeklySpend {
  day: string;
  shortDay: string;
  amount: number;
  isToday?: boolean;
}

export interface SavingsGoal {
  title: string;
  savedAmount: number;
  targetAmount: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'deadline' | 'achievement' | 'streak' | 'system';
}
