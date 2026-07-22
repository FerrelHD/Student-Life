export type TabType = 'dashboard' | 'missions' | 'vault' | 'agenda' | 'hero';

export type PriorityType = 'high' | 'medium' | 'low';

export type MissionTag = 'EXAM' | 'LAB' | 'PAPER' | 'CODE' | 'READ' | 'PROJECT' | 'OTHER';

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
  dateStr?: string; // e.g. "2023-10-12" or "Oct 12"
}

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 'INCOME' | 'FOOD' | 'TRANSPORT' | 'SUBSCRIPTION' | 'TECH' | 'OTHER';

export interface Transaction {
  id: string;
  title: string;
  category: TransactionCategory;
  amount: number;
  type: TransactionType;
  date: string;
}

export interface UserProfile {
  name: string;
  handle: string;
  level: number;
  role: string;
  university: string;
  classOf: string;
  currentXP: number;
  nextLevelXP: number;
  gpa: number;
  rank: string;
  walks: number;
  streakDays: number;
  avatarUrl: string;
  darkMode: boolean;
  notifications: boolean;
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
