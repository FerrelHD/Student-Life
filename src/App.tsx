import React, { useState, useEffect } from 'react';
import type { Session } from '@supabase/supabase-js';
import {
  TabType,
  Mission,
  Transaction,
  UserProfile,
  Badge,
  WeeklySpend,
  TransactionType,
  SavingsGoal,
  NotificationItem,
} from './types';
import { initialBadges } from './data/initialData';
import { supabase } from './lib/supabaseClient';
import {
  fetchProfile,
  updateProfile,
  fetchMissions,
  insertMission,
  updateMission,
  deleteMission,
  setMissionCompleted,
  fetchTransactions,
  insertTransaction,
  updateTransaction,
  deleteTransaction,
  fetchSavingsGoal,
  upsertSavingsGoal,
  fetchNotifications,
  markAllNotificationsRead,
  fetchUnlockedBadgeIds,
  unlockBadge,
  fetchWeeklySpend,
  fetchMonthlySpend,
} from './lib/db';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SideDrawer } from './components/SideDrawer';
import { AddMissionModal } from './components/AddMissionModal';
import { AddTransactionModal } from './components/AddTransactionModal';
import { EditProfileModal } from './components/EditProfileModal';
import { DailyQuizModal } from './components/DailyQuizModal';
import { SavingsGoalModal } from './components/SavingsGoalModal';
import { NotificationsModal } from './components/NotificationsModal';
import { BadgesModal } from './components/BadgesModal';
import { FocusTimerModal } from './components/FocusTimerModal';
import { GpaCalculatorModal } from './components/GpaCalculatorModal';
import { triggerConfetti } from './utils/confetti';
import { addXP, checkBadgeThresholds } from './utils/gamification';
import { getDueRecurringTransactions } from './utils/recurringTransactions';
import { getTranslation, formatTimeNow } from './utils/i18n';
import { subscribeToPush, unsubscribeFromPush } from './utils/push';
import { checkUpcomingAgendaReminders } from './utils/notificationEngine';

import { DashboardView } from './components/DashboardView';
import { MissionsView } from './components/MissionsView';
import { VaultView } from './components/VaultView';
import { AgendaView } from './components/AgendaView';
import { HeroView } from './components/HeroView';
import { AuthView } from './components/AuthView';

const FALLBACK_SAVINGS_GOAL: SavingsGoal = {
  title: '',
  savedAmount: 0,
  targetAmount: 0,
};

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#f7f3f9] dark:bg-[#0f0e13] pt-24 pb-32 px-5 max-w-md md:max-w-4xl mx-auto space-y-6 animate-pulse">
      <div className="h-28 rounded-3xl bg-black/5 dark:bg-white/5" />
      <div className="grid grid-cols-2 gap-4">
        <div className="h-32 rounded-3xl bg-black/5 dark:bg-white/5" />
        <div className="h-32 rounded-3xl bg-black/5 dark:bg-white/5" />
      </div>
      <div className="h-36 rounded-3xl bg-black/5 dark:bg-white/5" />
    </div>
  );
}

function fallbackProfile(session: Session): UserProfile {
  const meta = session.user.user_metadata as { name?: string; university?: string };
  return {
    name: meta.name || 'New Scholar',
    handle: '',
    level: 1,
    role: 'Level 1 Scholar',
    university: meta.university || '',
    classOf: '',
    currentXP: 0,
    gpa: 0,
    rank: '-',
    walks: 0,
    streakDays: 0,
    avatarUrl: '',
    darkMode: false,
    notifications: true,
    language: 'id',
    lastQuizDate: null,
    lastStreakDate: null,
    lastStreakBonusDate: null,
  };
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddMissionOpen, setIsAddMissionOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isDailyQuizOpen, setIsDailyQuizOpen] = useState(false);
  const [isSavingsModalOpen, setIsSavingsModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isFocusTimerOpen, setIsFocusTimerOpen] = useState(false);
  const [isGpaCalculatorOpen, setIsGpaCalculatorOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<TransactionType>('expense');
  const [toast, setToast] = useState<{ visible: boolean; message: string; icon: string }>({
    visible: false,
    message: '',
    icon: '🔥',
  });

  // ── Auth/session ──
  const [session, setSession] = useState<Session | null>(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);
  const [dataLoading, setDataLoading] = useState(false);
  const userId = session?.user.id;

  // ── Remote-backed state (populated after login, see load effect below) ──
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [missions, setMissions] = useState<Mission[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [savingsGoal, setSavingsGoal] = useState<SavingsGoal>(FALLBACK_SAVINGS_GOAL);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [weeklySpend, setWeeklySpend] = useState<WeeklySpend[]>([]);
  const [monthlySpend, setMonthlySpend] = useState(0);
  const [badges, setBadges] = useState<Badge[]>(initialBadges);
  const [editingMission, setEditingMission] = useState<Mission | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const showToast = (message: string, icon = '✅') => {
    setToast({ visible: true, message, icon });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  };

  // Shared handler for background Supabase syncs (optimistic UI already applied
  // locally) so a failed write is surfaced to the user instead of only logged.
  const onSyncError = (err: unknown) => {
    console.error('[sync] failed:', err);
    showToast(
      profile?.language === 'en' ? 'Sync failed — change may not be saved' : 'Gagal sinkron — perubahan mungkin tidak tersimpan',
      '⚠️'
    );
  };

  // Track auth session
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash.includes('type=recovery')) {
      setPasswordRecovery(true);
    }

    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      // Clicking the emailed reset link auto-establishes a session — flag it so we
      // force a new-password screen instead of dropping straight into dashboard.
      if (event === 'PASSWORD_RECOVERY' || (typeof window !== 'undefined' && window.location.hash.includes('type=recovery'))) {
        setPasswordRecovery(true);
      }
      setSession(newSession);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  // Load this user's data whenever a session appears
  useEffect(() => {
    if (!session) {
      setProfile(null);
      setMissions([]);
      setTransactions([]);
      setSavingsGoal(FALLBACK_SAVINGS_GOAL);
      setNotifications([]);
      setWeeklySpend([]);
      setMonthlySpend(0);
      setBadges(initialBadges);
      return;
    }

    let cancelled = false;
    setDataLoading(true);

    (async () => {
      const uid = session.user.id;
      const [profileResult, missionsResult, txResult, goalResult, notifResult, badgeIdsResult, spendResult, monthlySpendResult] =
        await Promise.allSettled([
          fetchProfile(uid),
          fetchMissions(uid),
          fetchTransactions(uid),
          fetchSavingsGoal(uid),
          fetchNotifications(uid),
          fetchUnlockedBadgeIds(uid),
          fetchWeeklySpend(uid),
          fetchMonthlySpend(uid),
        ]);
      if (cancelled) return;

      const resolvedProfile = profileResult.status === 'fulfilled' ? profileResult.value : fallbackProfile(session);
      setProfile(resolvedProfile);
      setMissions(missionsResult.status === 'fulfilled' ? missionsResult.value : []);
      const resolvedTransactions = txResult.status === 'fulfilled' ? txResult.value : [];
      setTransactions(resolvedTransactions);

      // Recurring transactions (rent, monthly allowance, etc): if a series' last
      // instance was created in a prior month, roll a fresh copy in for this month.
      const due = getDueRecurringTransactions(resolvedTransactions, new Date());
      if (due.length > 0) {
        const tr = getTranslation(resolvedProfile.language);
        const timeStr = formatTimeNow(resolvedProfile.language);
        due.forEach((tx) => {
          insertTransaction(uid, {
            title: tx.title,
            category: tx.category,
            amount: tx.amount,
            type: tx.type,
            recurrence: tx.recurrence,
            date: `${tr.today}, ${timeStr}`,
          })
            .then((newTx) => setTransactions((prev) => [newTx, ...prev]))
            .catch((err) => console.error('[recurring-transaction] rollover failed:', err));
        });
      }
      setSavingsGoal(
        goalResult.status === 'fulfilled' && goalResult.value ? goalResult.value : FALLBACK_SAVINGS_GOAL
      );
      setNotifications(notifResult.status === 'fulfilled' ? notifResult.value : []);
      // b1-b4 are seed badges that ship pre-unlocked in the catalog (no
      // trackable condition in-app); b5-b8 are only unlocked via user_badges.
      const unlockedIds = badgeIdsResult.status === 'fulfilled' ? badgeIdsResult.value : new Set<string>();
      setBadges(initialBadges.map((b) => ({ ...b, unlocked: b.unlocked || unlockedIds.has(b.id) })));
      setWeeklySpend(spendResult.status === 'fulfilled' ? spendResult.value : []);
      setMonthlySpend(monthlySpendResult.status === 'fulfilled' ? monthlySpendResult.value : 0);

      setDataLoading(false);
    })();

    return () => {
      cancelled = true;
    };
  }, [session]);

  // Apply dark mode to DOM whenever the profile's preference changes
  useEffect(() => {
    if (!profile) return;
    if (profile.darkMode) {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [profile?.darkMode]);

  // Periodic background check for 15-30 min upcoming agenda alarms
  useEffect(() => {
    if (!missions.length) return;
    checkUpcomingAgendaReminders(missions, profile?.language);
    const alarmInterval = setInterval(() => {
      checkUpcomingAgendaReminders(missions, profile?.language);
    }, 60_000);
    return () => clearInterval(alarmInterval);
  }, [missions, profile?.language]);

  // Threshold-based badge unlocks (b5-b7): react to whatever crosses the line.
  useEffect(() => {
    if (!profile || !userId) return;
    const completedCount = missions.filter((m) => m.completed).length;
    const earned = checkBadgeThresholds(profile.streakDays, profile.currentXP, completedCount);
    const toUnlock = Object.entries(earned)
      .filter(([id, isEarned]) => isEarned && !badges.find((b) => b.id === id)?.unlocked)
      .map(([id]) => id);
    if (toUnlock.length === 0) return;

    setBadges((prev) => prev.map((b) => (toUnlock.includes(b.id) ? { ...b, unlocked: true } : b)));
    toUnlock.forEach((id) => unlockBadge(userId, id).catch(onSyncError));
  }, [profile?.streakDays, profile?.currentXP, missions, userId]);

  // Persist a partial profile patch: update local state immediately, sync to Supabase in background
  const persistProfile = (patch: Partial<UserProfile>) => {
    setProfile((p) => (p ? { ...p, ...patch } : p));
    if (userId) updateProfile(userId, patch).catch(onSyncError);
  };

  const handleAddXP = (amount: number) => {
    if (!profile) return;
    const { xp, level } = addXP(profile.currentXP, profile.level, amount);
    persistProfile({ currentXP: xp, level });
  };

  const handleToggleMission = (id: string) => {
    const mission = missions.find((m) => m.id === id);
    if (!mission || !profile) return;
    const newCompleted = !mission.completed;

    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, completed: newCompleted } : m)));
    setMissionCompleted(id, newCompleted).catch(onSyncError);

    if (newCompleted) {
      handleAddXP(mission.xpReward);
      triggerConfetti();

      // Night Owl badge (b8): completing a mission late at night.
      const hour = new Date().getHours();
      if ((hour >= 22 || hour < 4) && userId && !badges.find((b) => b.id === 'b8')?.unlocked) {
        setBadges((prev) => prev.map((b) => (b.id === 'b8' ? { ...b, unlocked: true } : b)));
        unlockBadge(userId, 'b8').catch(onSyncError);
      }
    } else {
      persistProfile({ currentXP: Math.max(0, profile.currentXP - mission.xpReward) });
    }
  };

  const handleAddMission = async (newMissionData: Omit<Mission, 'id' | 'completed'>) => {
    if (!userId) return;
    try {
      const newMission = await insertMission(userId, newMissionData);
      setMissions((prev) => [newMission, ...prev]);
    } catch (err) {
      console.error('[mission] add failed:', err);
      showToast(profile?.language === 'en' ? 'Failed to add mission' : 'Gagal menambah misi', '⚠️');
    }
  };

  const handleAddTransaction = async (newTxData: Omit<Transaction, 'id' | 'createdAt'>) => {
    if (!userId) return;
    try {
      const newTx = await insertTransaction(userId, newTxData);
      setTransactions((prev) => [newTx, ...prev]);
    } catch (err) {
      console.error('[transaction] add failed:', err);
      showToast(profile?.language === 'en' ? 'Failed to add transaction' : 'Gagal menambah transaksi', '⚠️');
    }
  };

  const handleEditMission = (id: string, patch: Omit<Mission, 'id' | 'completed'>) => {
    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, ...patch } : m)));
    updateMission(id, patch).catch(onSyncError);
  };

  const handleDeleteMission = (id: string) => {
    setMissions((prev) => prev.filter((m) => m.id !== id));
    deleteMission(id).catch(onSyncError);
  };

  const handleEditTransaction = (id: string, patch: Omit<Transaction, 'id' | 'createdAt'>) => {
    setTransactions((prev) => prev.map((tx) => (tx.id === id ? { ...tx, ...patch } : tx)));
    updateTransaction(id, patch).catch(onSyncError);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((tx) => tx.id !== id));
    deleteTransaction(id).catch(onSyncError);
  };

  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    persistProfile(updated);
  };

  const handleUpdateSavings = (newSaved: number, newGoal?: Partial<SavingsGoal>) => {
    setSavingsGoal((prev) => {
      const updated = { ...prev, savedAmount: newSaved, ...(newGoal || {}) };
      if (userId) upsertSavingsGoal(userId, updated).catch(onSyncError);
      return updated;
    });
  };

  const handleUpdateStreak = () => {
    if (!profile) return;
    const today = new Date().toISOString().slice(0, 10);
    if (profile.lastStreakDate === today) {
      showToast(profile.language === 'id' ? 'Streak sudah diperbarui hari ini' : 'Streak already updated today', '🔥');
      return;
    }
    persistProfile({ streakDays: profile.streakDays + 1, lastStreakDate: today });
    handleAddXP(25);
  };

  const handleClaimStreakBonus = () => {
    if (!profile) return;
    const today = new Date().toISOString().slice(0, 10);
    if (profile.streakDays < 5) {
      showToast(profile.language === 'id' ? 'Butuh streak 5 hari untuk klaim bonus' : 'Need a 5-day streak to claim this bonus', '🔒');
      return;
    }
    if (profile.lastStreakBonusDate === today) {
      showToast(profile.language === 'id' ? 'Bonus streak sudah diklaim hari ini' : 'Streak bonus already claimed today', '🔥');
      return;
    }
    persistProfile({ lastStreakBonusDate: today });
    handleAddXP(100);
    const msg = profile.language === 'id'
      ? '🔥 Bonus Streak 5-Hari Diklaim! +100 XP ditambahkan!'
      : '🔥 5-Day Streak Bonus Claimed! +100 XP added!';
    showToast(msg, '🔥');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (userId) markAllNotificationsRead(userId).catch(onSyncError);
  };

  const handleToggleDarkMode = () => {
    if (profile) persistProfile({ darkMode: !profile.darkMode });
  };

  const handleToggleNotifications = async () => {
    if (!profile || !userId) return;
    const turningOn = !profile.notifications;
    try {
      if (turningOn) {
        await subscribeToPush(userId);
      } else {
        await unsubscribeFromPush();
      }
      persistProfile({ notifications: turningOn });
    } catch (err) {
      console.error('[push] subscribe toggle failed:', err);
      const notSupported = err instanceof Error && err.message.includes('not supported');
      const msg = profile.language === 'id'
        ? notSupported
          ? 'Push notification butuh iOS 16.4+ dan situs dibuka dari ikon Home Screen (bukan tab Safari biasa)'
          : 'Gagal mengaktifkan notifikasi push'
        : notSupported
          ? 'Push notifications need iOS 16.4+ and the site opened from its Home Screen icon (not a Safari tab)'
          : 'Failed to enable push notifications';
      showToast(msg, '⚠️');
    }
  };

  const handleToggleLanguage = () => {
    setProfile((p) => {
      if (!p) return p;
      const nextLang = p.language === 'id' ? 'en' : 'id';
      if (userId) updateProfile(userId, { language: nextLang }).catch(onSyncError);
      return { ...p, language: nextLang };
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleToggleSubtask = (missionId: string, subtaskId: string) => {
    setMissions((prev) =>
      prev.map((m) => {
        if (m.id !== missionId || !m.subtasks) return m;
        const updatedSubtasks = m.subtasks.map((st) =>
          st.id === subtaskId ? { ...st, completed: !st.completed } : st
        );
        const allDone = updatedSubtasks.length > 0 && updatedSubtasks.every((st) => st.completed);
        return { ...m, subtasks: updatedSubtasks, completed: allDone };
      })
    );
  };

  const handleExportData = () => {
    const exportPayload = {
      version: '1.0.0',
      exportDate: new Date().toISOString(),
      profile,
      missions,
      transactions,
      savingsGoal,
    };
    const blob = new Blob([JSON.stringify(exportPayload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `student-life-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportData = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.profile) setProfile(data.profile);
        if (Array.isArray(data.missions)) setMissions(data.missions);
        if (Array.isArray(data.transactions)) setTransactions(data.transactions);
        if (data.savingsGoal) setSavingsGoal(data.savingsGoal);
        alert(profile?.language === 'id' ? '✅ Data berhasil di-restore!' : '✅ Data restored!');
      } catch {
        alert(profile?.language === 'id' ? '⚠️ Format JSON tidak valid.' : '⚠️ Invalid JSON format.');
      }
    };
    reader.readAsText(file);
  };

  const totalCredits = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (checkingSession) {
    return <DashboardSkeleton />;
  }

  if (passwordRecovery) {
    return (
      <AuthView
        language={profile?.language ?? 'id'}
        onLoginSuccess={() => {}}
        onToggleLanguage={handleToggleLanguage}
        recoverySession
        onRecoveryDone={() => {
          setPasswordRecovery(false);
          supabase.auth.signOut();
        }}
      />
    );
  }

  if (!session) {
    return (
      <AuthView
        language={profile?.language ?? 'id'}
        onLoginSuccess={() => {}}
        onToggleLanguage={handleToggleLanguage}
      />
    );
  }

  if (dataLoading || !profile) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-[#f7f3f9] dark:bg-[#0f0e13] text-[#1b1b1d] dark:text-[#f3f0f2] transition-colors duration-300 relative overflow-hidden">
      {/* Header */}
      <Header
        activeTab={activeTab}
        profile={profile}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setActiveTab('hero')}
        onOpenDrawer={() => setIsDrawerOpen(true)}
      />

      {/* Main Content Area */}
      <main className="relative z-10 md:pl-72">
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            missions={missions}
            badges={badges}
            monthlySpend={monthlySpend}
            onOpenAddMission={() => setIsAddMissionOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onUpdateStreak={handleUpdateStreak}
            onOpenFocusTimer={() => setIsFocusTimerOpen(true)}
            onOpenGpaCalculator={() => setIsGpaCalculatorOpen(true)}
          />
        )}

        {activeTab === 'missions' && (
          <MissionsView
            missions={missions}
            language={profile.language}
            onToggleMission={handleToggleMission}
            onOpenAddMission={() => setIsAddMissionOpen(true)}
            onOpenDailyQuiz={() => setIsDailyQuizOpen(true)}
            onClaimStreakBonus={handleClaimStreakBonus}
            onEditMission={(mission) => {
              setEditingMission(mission);
              setIsAddMissionOpen(true);
            }}
            onDeleteMission={handleDeleteMission}
            onToggleSubtask={handleToggleSubtask}
          />
        )}

        {activeTab === 'vault' && (
          <VaultView
            transactions={transactions}
            totalCredits={totalCredits}
            weeklySpend={weeklySpend}
            savingsGoal={savingsGoal}
            language={profile.language}
            onOpenAddTransaction={(type = 'expense') => {
              setTxModalType(type);
              setIsAddTxOpen(true);
            }}
            onOpenManageSavings={() => setIsSavingsModalOpen(true)}
            onEditTransaction={(tx) => {
              setEditingTransaction(tx);
              setTxModalType(tx.type);
              setIsAddTxOpen(true);
            }}
            onDeleteTransaction={handleDeleteTransaction}
          />
        )}

        {activeTab === 'agenda' && (
          <AgendaView
            missions={missions}
            language={profile.language}
            onOpenAddMission={() => setIsAddMissionOpen(true)}
            onToggleMission={handleToggleMission}
          />
        )}

        {activeTab === 'hero' && (
          <HeroView
            profile={profile}
            badges={badges}
            onOpenEditProfile={() => setIsEditProfileOpen(true)}
            onOpenBadges={() => setIsBadgesModalOpen(true)}
            onToggleDarkMode={handleToggleDarkMode}
            onToggleNotifications={handleToggleNotifications}
            onToggleLanguage={handleToggleLanguage}
            onLogout={handleLogout}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav
        activeTab={activeTab}
        language={profile.language}
        darkMode={profile.darkMode}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Side Drawer Menu */}
      <SideDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        profile={profile}
        onSelectTab={(tab) => setActiveTab(tab)}
      />

      {/* Add Mission Modal */}
      <AddMissionModal
        isOpen={isAddMissionOpen}
        onClose={() => {
          setIsAddMissionOpen(false);
          setEditingMission(null);
        }}
        onAddMission={handleAddMission}
        editingMission={editingMission}
        onEditMission={handleEditMission}
        language={profile.language}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => {
          setIsAddTxOpen(false);
          setEditingTransaction(null);
        }}
        defaultType={txModalType}
        onAddTransaction={handleAddTransaction}
        editingTransaction={editingTransaction}
        onEditTransaction={handleEditTransaction}
        language={profile.language}
      />

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        profile={profile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Daily Quiz Modal */}
      <DailyQuizModal
        isOpen={isDailyQuizOpen}
        onClose={() => setIsDailyQuizOpen(false)}
        onRewardXP={handleAddXP}
        onQuizCompleted={() => persistProfile({ lastQuizDate: new Date().toISOString().slice(0, 10) })}
        language={profile.language}
        university={profile.university}
        lastQuizDate={profile.lastQuizDate}
      />

      {/* Savings Goal Modal */}
      <SavingsGoalModal
        isOpen={isSavingsModalOpen}
        onClose={() => setIsSavingsModalOpen(false)}
        savingsGoal={savingsGoal}
        onUpdateSavings={handleUpdateSavings}
        language={profile.language}
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
        language={profile.language}
      />
      {/* Heroic Badges Showcase Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        badges={badges}
        language={profile.language}
      />
      {/* Focus Timer Modal (Pomodoro + Ambient Sound + XP) */}
      <FocusTimerModal
        isOpen={isFocusTimerOpen}
        onClose={() => setIsFocusTimerOpen(false)}
        onRewardXP={handleAddXP}
        lang={profile.language}
      />
      {/* GPA Calculator & Target Simulator Modal */}
      <GpaCalculatorModal
        isOpen={isGpaCalculatorOpen}
        onClose={() => setIsGpaCalculatorOpen(false)}
        currentGpa={profile.gpa || 0}
        onUpdateGpa={(newGpa) => persistProfile({ gpa: newGpa })}
        lang={profile.language}
      />
      {/* Global Toast Notification */}
      <div
        className="fixed top-24 inset-x-0 z-[9999] pointer-events-none flex justify-center"
        style={{
          transform: `translateY(${toast.visible ? '0px' : '-20px'})`,
          opacity: toast.visible ? 1 : 0,
          transition: 'opacity 350ms ease, transform 400ms cubic-bezier(0.34,1.45,0.64,1)',
        }}
      >
        <div
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full font-jakarta font-extrabold text-sm text-white border border-white/20"
          style={{
            background: 'rgba(30,28,40,0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            boxShadow:
              '-5px -5px 12px rgba(255,255,255,0.05), 6px 6px 16px rgba(0,0,0,0.45), inset 1px 1px 1px rgba(255,255,255,0.08)',
          }}
        >
          <span className="text-lg">{toast.icon}</span>
          <span>{toast.message}</span>
        </div>
      </div>
    </div>
  );
}
