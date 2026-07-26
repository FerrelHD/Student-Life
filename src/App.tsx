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
  setMissionCompleted,
  fetchTransactions,
  insertTransaction,
  fetchSavingsGoal,
  upsertSavingsGoal,
  fetchNotifications,
  markAllNotificationsRead,
  fetchUnlockedBadgeIds,
  fetchWeeklySpend,
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
import { triggerConfetti } from './utils/confetti';

import { DashboardView } from './components/DashboardView';
import { MissionsView } from './components/MissionsView';
import { VaultView } from './components/VaultView';
import { AgendaView } from './components/AgendaView';
import { HeroView } from './components/HeroView';
import { AuthView } from './components/AuthView';

const FALLBACK_SAVINGS_GOAL: SavingsGoal = {
  title: 'New MacBook Pro M3',
  savedAmount: 0,
  targetAmount: 28000000,
};

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
    nextLevelXP: 1000,
    gpa: 0,
    rank: '-',
    walks: 0,
    streakDays: 0,
    avatarUrl: '',
    darkMode: false,
    notifications: true,
    language: 'id',
    lastQuizDate: null,
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
  const [badges, setBadges] = useState<Badge[]>(initialBadges);

  const showToast = (message: string, icon = '✅') => {
    setToast({ visible: true, message, icon });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3500);
  };

  // Track auth session
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setCheckingSession(false);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((event, newSession) => {
      // Clicking the emailed reset link auto-establishes a session (Supabase's
      // detectSessionInUrl) — flag it so we force a new-password screen instead
      // of dropping the user straight into the dashboard with the old password.
      if (event === 'PASSWORD_RECOVERY') setPasswordRecovery(true);
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
      setBadges(initialBadges);
      return;
    }

    let cancelled = false;
    setDataLoading(true);

    (async () => {
      const uid = session.user.id;
      const [profileResult, missionsResult, txResult, goalResult, notifResult, badgeIdsResult, spendResult] =
        await Promise.allSettled([
          fetchProfile(uid),
          fetchMissions(uid),
          fetchTransactions(uid),
          fetchSavingsGoal(uid),
          fetchNotifications(uid),
          fetchUnlockedBadgeIds(uid),
          fetchWeeklySpend(uid),
        ]);
      if (cancelled) return;

      setProfile(profileResult.status === 'fulfilled' ? profileResult.value : fallbackProfile(session));
      setMissions(missionsResult.status === 'fulfilled' ? missionsResult.value : []);
      setTransactions(txResult.status === 'fulfilled' ? txResult.value : []);
      setSavingsGoal(
        goalResult.status === 'fulfilled' && goalResult.value ? goalResult.value : FALLBACK_SAVINGS_GOAL
      );
      setNotifications(notifResult.status === 'fulfilled' ? notifResult.value : []);
      const unlockedIds = badgeIdsResult.status === 'fulfilled' ? badgeIdsResult.value : new Set<string>();
      setBadges(initialBadges.map((b) => ({ ...b, unlocked: unlockedIds.has(b.id) })));
      setWeeklySpend(spendResult.status === 'fulfilled' ? spendResult.value : []);

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

  // Persist a partial profile patch: update local state immediately, sync to Supabase in background
  const persistProfile = (patch: Partial<UserProfile>) => {
    setProfile((p) => (p ? { ...p, ...patch } : p));
    if (userId) updateProfile(userId, patch).catch((err) => console.error('[profile] update failed:', err));
  };

  const handleAddXP = (amount: number) => {
    if (!profile) return;
    const newXP = profile.currentXP + amount;
    const newLevel = Math.max(profile.level, Math.floor(newXP / 1000) + 1);
    persistProfile({ currentXP: newXP, level: newLevel });
  };

  const handleToggleMission = (id: string) => {
    const mission = missions.find((m) => m.id === id);
    if (!mission || !profile) return;
    const newCompleted = !mission.completed;

    setMissions((prev) => prev.map((m) => (m.id === id ? { ...m, completed: newCompleted } : m)));
    setMissionCompleted(id, newCompleted).catch((err) => console.error('[mission] update failed:', err));

    if (newCompleted) {
      handleAddXP(mission.xpReward);
      triggerConfetti();
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

  const handleAddTransaction = async (newTxData: Omit<Transaction, 'id'>) => {
    if (!userId) return;
    try {
      const newTx = await insertTransaction(userId, newTxData);
      setTransactions((prev) => [newTx, ...prev]);
    } catch (err) {
      console.error('[transaction] add failed:', err);
      showToast(profile?.language === 'en' ? 'Failed to add transaction' : 'Gagal menambah transaksi', '⚠️');
    }
  };

  const handleSaveProfile = (updated: Partial<UserProfile>) => {
    persistProfile(updated);
  };

  const handleUpdateSavings = (newSaved: number, newGoal?: Partial<SavingsGoal>) => {
    setSavingsGoal((prev) => {
      const updated = { ...prev, savedAmount: newSaved, ...(newGoal || {}) };
      if (userId) upsertSavingsGoal(userId, updated).catch((err) => console.error('[savings] update failed:', err));
      return updated;
    });
  };

  const handleClaimStreakBonus = () => {
    if (!profile) return;
    handleAddXP(100);
    const msg = profile.language === 'id'
      ? '🔥 Bonus Streak 5-Hari Diklaim! +100 XP ditambahkan!'
      : '🔥 5-Day Streak Bonus Claimed! +100 XP added!';
    showToast(msg, '🔥');
  };

  const handleMarkAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    if (userId) markAllNotificationsRead(userId).catch((err) => console.error('[notifications] update failed:', err));
  };

  const handleToggleDarkMode = () => {
    if (profile) persistProfile({ darkMode: !profile.darkMode });
  };

  const handleToggleNotifications = () => {
    if (profile) persistProfile({ notifications: !profile.notifications });
  };

  const handleToggleLanguage = () => {
    setProfile((p) => {
      if (!p) return p;
      const nextLang = p.language === 'id' ? 'en' : 'id';
      if (userId) updateProfile(userId, { language: nextLang }).catch((err) => console.error('[profile] update failed:', err));
      return { ...p, language: nextLang };
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const totalCredits = transactions.reduce((acc, curr) => {
    return curr.type === 'income' ? acc + curr.amount : acc - curr.amount;
  }, 0);

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (checkingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f3f9] dark:bg-[#0f0e13]">
        <div className="w-10 h-10 border-4 border-[#d1c4e9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
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
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f3f9] dark:bg-[#0f0e13]">
        <div className="w-10 h-10 border-4 border-[#d1c4e9] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f3f9] dark:bg-[#0f0e13] text-[#1b1b1d] dark:text-[#f3f0f2] transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Ambient Expressive Mesh Orbs */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-60 dark:opacity-35 transition-opacity duration-700">
        <div
          className={`absolute -top-24 -left-24 w-96 h-96 rounded-full blur-3xl animate-orb-1 transition-all duration-700 ${
            activeTab === 'dashboard'
              ? 'bg-[#d1c4e9] dark:bg-[#6b5096] opacity-90 scale-110'
              : activeTab === 'missions'
              ? 'bg-[#ffb8b3] dark:bg-[#853935] opacity-70'
              : 'bg-[#d1c4e9] dark:bg-[#523d75] opacity-60'
          }`}
        />

        <div
          className={`absolute top-1/3 -right-24 w-96 h-96 rounded-full blur-3xl animate-orb-2 transition-all duration-700 ${
            activeTab === 'vault'
              ? 'bg-[#ece28c] dark:bg-[#807727] opacity-90 scale-125'
              : activeTab === 'dashboard'
              ? 'bg-[#ece28c] dark:bg-[#736a1c] opacity-80'
              : 'bg-[#f5eeab] dark:bg-[#5c5417] opacity-50'
          }`}
        />

        <div
          className={`absolute bottom-20 left-10 w-80 h-80 rounded-full blur-3xl animate-orb-3 transition-all duration-700 ${
            activeTab === 'missions'
              ? 'bg-[#ffb8b3] dark:bg-[#8a3331] opacity-90 scale-110'
              : activeTab === 'hero'
              ? 'bg-[#d8e6c7] dark:bg-[#3d612e] opacity-80'
              : 'bg-[#ffd5d2] dark:bg-[#5c2423] opacity-60'
          }`}
        />

        <div
          className={`absolute top-2/3 right-1/4 w-80 h-80 rounded-full blur-3xl animate-orb-1 transition-all duration-700 ${
            activeTab === 'agenda'
              ? 'bg-[#cce5ff] dark:bg-[#254b73] opacity-90 scale-125'
              : 'bg-[#e2d7f5] dark:bg-[#3a285c] opacity-40'
          }`}
        />
      </div>

      {/* Header */}
      <Header
        activeTab={activeTab}
        profile={profile}
        unreadCount={unreadCount}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenProfile={() => setActiveTab('hero')}
      />

      {/* Main Content Area */}
      <main className="relative z-10">
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            missions={missions}
            onOpenAddMission={() => setIsAddMissionOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onUpdateStreak={() => {
              persistProfile({ streakDays: profile.streakDays + 1 });
              handleAddXP(25);
            }}
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
        onClose={() => setIsAddMissionOpen(false)}
        onAddMission={handleAddMission}
      />

      {/* Add Transaction Modal */}
      <AddTransactionModal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        defaultType={txModalType}
        onAddTransaction={handleAddTransaction}
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
      />

      {/* Notifications Modal */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllAsRead={handleMarkAllNotificationsRead}
      />
      {/* Heroic Badges Showcase Modal */}
      <BadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        badges={badges}
        language={profile.language}
      />
      {/* Global Toast Notification */}
      <div
        className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[9999] pointer-events-none"
        style={{
          transform: `translateX(-50%) translateY(${toast.visible ? '0px' : '20px'})`,
          opacity: toast.visible ? 1 : 0,
          transition: 'opacity 350ms ease, transform 400ms cubic-bezier(0.34,1.45,0.64,1)',
        }}
      >
        <div
          className="flex items-center gap-2.5 px-5 py-3.5 rounded-full shadow-2xl font-jakarta font-extrabold text-sm text-white border border-white/20"
          style={{
            background: 'rgba(30,28,40,0.88)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <span className="text-lg">{toast.icon}</span>
          <span>{toast.message}</span>
        </div>
      </div>
    </div>
  );
}
