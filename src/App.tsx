/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TabType, Mission, Transaction, UserProfile, Badge, WeeklySpend, TransactionType } from './types';
import {
  initialProfile,
  initialMissions,
  initialTransactions,
  initialWeeklySpend,
  initialBadges,
} from './data/initialData';

import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SideDrawer } from './components/SideDrawer';
import { AddMissionModal } from './components/AddMissionModal';
import { AddTransactionModal } from './components/AddTransactionModal';

import { DashboardView } from './components/DashboardView';
import { MissionsView } from './components/MissionsView';
import { VaultView } from './components/VaultView';
import { AgendaView } from './components/AgendaView';
import { HeroView } from './components/HeroView';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddMissionOpen, setIsAddMissionOpen] = useState(false);
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<TransactionType>('expense');

  // Persisted state in localStorage
  const [profile, setProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('sl_profile');
    return saved ? JSON.parse(saved) : initialProfile;
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('sl_missions');
    return saved ? JSON.parse(saved) : initialMissions;
  });

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('sl_transactions');
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [weeklySpend] = useState<WeeklySpend[]>(initialWeeklySpend);
  const [badges] = useState<Badge[]>(initialBadges);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('sl_profile', JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem('sl_missions', JSON.stringify(missions));
  }, [missions]);

  useEffect(() => {
    localStorage.setItem('sl_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Handle mission completion toggle
  const handleToggleMission = (id: string) => {
    setMissions((prevMissions) =>
      prevMissions.map((mission) => {
        if (mission.id === id) {
          const newCompleted = !mission.completed;
          // Award XP on completion
          if (newCompleted) {
            setProfile((p) => ({
              ...p,
              currentXP: p.currentXP + mission.xpReward,
            }));
          } else {
            setProfile((p) => ({
              ...p,
              currentXP: Math.max(0, p.currentXP - mission.xpReward),
            }));
          }
          return { ...mission, completed: newCompleted };
        }
        return mission;
      })
    );
  };

  // Handle adding new mission
  const handleAddMission = (newMissionData: Omit<Mission, 'id' | 'completed'>) => {
    const newMission: Mission = {
      ...newMissionData,
      id: `m_${Date.now()}`,
      completed: false,
    };
    setMissions((prev) => [newMission, ...prev]);
  };

  // Handle adding new transaction
  const handleAddTransaction = (newTxData: Omit<Transaction, 'id'>) => {
    const newTx: Transaction = {
      ...newTxData,
      id: `t_${Date.now()}`,
    };
    setTransactions((prev) => [newTx, ...prev]);
  };

  // Calculate current total credits from transactions
  const totalCredits = transactions.reduce((acc, tx) => {
    if (tx.type === 'income') return acc + tx.amount;
    return acc - tx.amount;
  }, 3500.00);

  // Handlers for profile settings
  const handleToggleDarkMode = () => {
    setProfile((p) => ({ ...p, darkMode: !p.darkMode }));
  };

  const handleToggleNotifications = () => {
    setProfile((p) => ({ ...p, notifications: !p.notifications }));
  };

  const handleUpdateStreak = () => {
    setProfile((p) => ({ ...p, streakDays: p.streakDays + 1 }));
  };

  const handleLogout = () => {
    if (window.confirm('End mission session? Resetting to initial data state.')) {
      localStorage.clear();
      setProfile(initialProfile);
      setMissions(initialMissions);
      setTransactions(initialTransactions);
      setActiveTab('dashboard');
    }
  };

  return (
    <div className={`min-h-screen bg-[#0A0A0B] text-[#e5e2e1] font-inter selection:bg-[#ff544c] selection:text-[#5c0005]`}>
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        onOpenMenu={() => setIsDrawerOpen(true)}
        onOpenProfile={() => setActiveTab('hero')}
      />

      {/* Main Tab Content */}
      <main className="animate-in fade-in duration-300">
        {activeTab === 'dashboard' && (
          <DashboardView
            profile={profile}
            missions={missions}
            onOpenAddMission={() => setIsAddMissionOpen(true)}
            onNavigateTab={(tab) => setActiveTab(tab)}
            onUpdateStreak={handleUpdateStreak}
          />
        )}

        {activeTab === 'missions' && (
          <MissionsView
            missions={missions}
            onToggleMission={handleToggleMission}
            onOpenAddMission={() => setIsAddMissionOpen(true)}
          />
        )}

        {activeTab === 'vault' && (
          <VaultView
            transactions={transactions}
            totalCredits={totalCredits}
            weeklySpend={weeklySpend}
            onOpenAddTransaction={(type = 'expense') => {
              setTxModalType(type);
              setIsAddTxOpen(true);
            }}
          />
        )}

        {activeTab === 'agenda' && (
          <AgendaView
            missions={missions}
            onOpenAddMission={() => setIsAddMissionOpen(true)}
            onToggleMission={handleToggleMission}
          />
        )}

        {activeTab === 'hero' && (
          <HeroView
            profile={profile}
            badges={badges}
            onToggleDarkMode={handleToggleDarkMode}
            onToggleNotifications={handleToggleNotifications}
            onLogout={handleLogout}
          />
        )}
      </main>

      {/* Bottom Nav */}
      <BottomNav activeTab={activeTab} onSelectTab={(tab) => setActiveTab(tab)} />

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
    </div>
  );
}
