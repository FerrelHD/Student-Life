import { supabase } from './supabaseClient';
import {
  Mission,
  Transaction,
  UserProfile,
  SavingsGoal,
  NotificationItem,
  WeeklySpend,
} from '../types';

// ─── profiles ───────────────────────────────────────────────
export async function fetchProfile(userId: string): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  if (error) throw error;
  return {
    name: data.name,
    handle: data.handle,
    level: data.level,
    role: data.role,
    university: data.university,
    classOf: data.class_of,
    currentXP: data.current_xp,
    gpa: data.gpa,
    rank: data.rank,
    walks: data.walks,
    streakDays: data.streak_days,
    avatarUrl: data.avatar_url,
    darkMode: data.dark_mode,
    notifications: data.notifications,
    language: data.language,
    lastQuizDate: data.last_quiz_date,
  };
}

export async function updateProfile(userId: string, profile: Partial<UserProfile>) {
  const patch: Record<string, unknown> = {};
  if (profile.name !== undefined) patch.name = profile.name;
  if (profile.handle !== undefined) patch.handle = profile.handle;
  if (profile.level !== undefined) patch.level = profile.level;
  if (profile.role !== undefined) patch.role = profile.role;
  if (profile.university !== undefined) patch.university = profile.university;
  if (profile.classOf !== undefined) patch.class_of = profile.classOf;
  if (profile.currentXP !== undefined) patch.current_xp = profile.currentXP;
  if (profile.gpa !== undefined) patch.gpa = profile.gpa;
  if (profile.rank !== undefined) patch.rank = profile.rank;
  if (profile.walks !== undefined) patch.walks = profile.walks;
  if (profile.streakDays !== undefined) patch.streak_days = profile.streakDays;
  if (profile.avatarUrl !== undefined) patch.avatar_url = profile.avatarUrl;
  if (profile.darkMode !== undefined) patch.dark_mode = profile.darkMode;
  if (profile.notifications !== undefined) patch.notifications = profile.notifications;
  if (profile.language !== undefined) patch.language = profile.language;
  if (profile.lastQuizDate !== undefined) patch.last_quiz_date = profile.lastQuizDate;

  const { error } = await supabase.from('profiles').update(patch).eq('id', userId);
  if (error) throw error;
}

// ─── missions ───────────────────────────────────────────────
export async function fetchMissions(userId: string): Promise<Mission[]> {
  const { data, error } = await supabase
    .from('missions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    course: row.course,
    priority: row.priority,
    dueDate: row.due_date,
    tag: row.tag,
    completed: row.completed,
    xpReward: row.xp_reward,
    time: row.time ?? undefined,
    location: row.location ?? undefined,
    focusPriority: row.focus_priority ?? undefined,
    dateStr: row.date_str ?? undefined,
  }));
}

export async function insertMission(
  userId: string,
  mission: Omit<Mission, 'id' | 'completed'>
): Promise<Mission> {
  const { data, error } = await supabase
    .from('missions')
    .insert({
      user_id: userId,
      title: mission.title,
      course: mission.course,
      priority: mission.priority,
      due_date: mission.dueDate,
      tag: mission.tag,
      xp_reward: mission.xpReward,
      time: mission.time,
      location: mission.location,
      focus_priority: mission.focusPriority,
      date_str: mission.dateStr,
    })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    course: data.course,
    priority: data.priority,
    dueDate: data.due_date,
    tag: data.tag,
    completed: data.completed,
    xpReward: data.xp_reward,
    time: data.time ?? undefined,
    location: data.location ?? undefined,
    focusPriority: data.focus_priority ?? undefined,
    dateStr: data.date_str ?? undefined,
  };
}

export async function setMissionCompleted(missionId: string, completed: boolean) {
  const { error } = await supabase
    .from('missions')
    .update({ completed })
    .eq('id', missionId);
  if (error) throw error;
}

// ─── transactions ───────────────────────────────────────────
export async function fetchTransactions(userId: string): Promise<Transaction[]> {
  const { data, error } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(200);
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    amount: Number(row.amount),
    type: row.type,
    date: row.date,
  }));
}

export async function insertTransaction(
  userId: string,
  tx: Omit<Transaction, 'id'>
): Promise<Transaction> {
  const { data, error } = await supabase
    .from('transactions')
    .insert({
      user_id: userId,
      title: tx.title,
      category: tx.category,
      amount: tx.amount,
      type: tx.type,
      date: tx.date,
    })
    .select()
    .single();
  if (error) throw error;
  return {
    id: data.id,
    title: data.title,
    category: data.category,
    amount: Number(data.amount),
    type: data.type,
    date: data.date,
  };
}

// ─── savings goal ───────────────────────────────────────────
export async function fetchSavingsGoal(userId: string): Promise<SavingsGoal | null> {
  const { data, error } = await supabase
    .from('savings_goals')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    title: data.title,
    savedAmount: Number(data.saved_amount),
    targetAmount: Number(data.target_amount),
  };
}

export async function upsertSavingsGoal(userId: string, goal: SavingsGoal) {
  const { error } = await supabase.from('savings_goals').upsert({
    user_id: userId,
    title: goal.title,
    saved_amount: goal.savedAmount,
    target_amount: goal.targetAmount,
  });
  if (error) throw error;
}

// ─── notifications ──────────────────────────────────────────
export async function fetchNotifications(userId: string): Promise<NotificationItem[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) throw error;
  return data.map((row) => ({
    id: row.id,
    title: row.title,
    message: row.message,
    time: row.time,
    read: row.read,
    type: row.type,
  }));
}

export async function markAllNotificationsRead(userId: string) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId);
  if (error) throw error;
}

// ─── weekly spend (derived from transactions, not stored) ───
const DAY_LABELS = [
  { day: 'M', shortDay: 'Min' }, // getDay() 0 = Sunday
  { day: 'S', shortDay: 'Sen' },
  { day: 'S', shortDay: 'Sel' },
  { day: 'R', shortDay: 'Rab' },
  { day: 'K', shortDay: 'Kam' },
  { day: 'J', shortDay: 'Jum' },
  { day: 'S', shortDay: 'Sab' },
];
const WEEK_STARTING_MONDAY = [1, 2, 3, 4, 5, 6, 0];

export async function fetchWeeklySpend(userId: string): Promise<WeeklySpend[]> {
  const since = new Date();
  since.setDate(since.getDate() - 6);
  since.setHours(0, 0, 0, 0);

  const { data, error } = await supabase
    .from('transactions')
    .select('amount, created_at')
    .eq('user_id', userId)
    .eq('type', 'expense')
    .gte('created_at', since.toISOString());
  if (error) throw error;

  const totals = new Array(7).fill(0);
  data.forEach((row) => {
    totals[new Date(row.created_at).getDay()] += Number(row.amount);
  });

  const todayIdx = new Date().getDay();
  return WEEK_STARTING_MONDAY.map((dow) => ({
    day: DAY_LABELS[dow].day,
    shortDay: DAY_LABELS[dow].shortDay,
    amount: totals[dow],
    isToday: dow === todayIdx,
  }));
}

// ─── badges (unlock state only; catalog stays static on frontend) ──
export async function fetchUnlockedBadgeIds(userId: string): Promise<Set<string>> {
  const { data, error } = await supabase
    .from('user_badges')
    .select('badge_id')
    .eq('user_id', userId);
  if (error) throw error;
  return new Set(data.map((row) => row.badge_id));
}
