import React from 'react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'missions', label: 'Missions', icon: 'assignment_turned_in' },
    { id: 'vault', label: 'Vault', icon: 'payments' },
    { id: 'agenda', label: 'Agenda', icon: 'calendar_month' },
    { id: 'hero', label: 'Hero', icon: 'person' },
  ];

  return (
    <nav className="fixed bottom-0 w-full z-40 bg-[#201f1f]/90 backdrop-blur-md border-t border-white/10 rounded-t-xl h-20 px-2 pb-safe flex justify-around items-center shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`flex flex-col items-center justify-center transition-all duration-200 active:scale-90 px-3 py-1.5 rounded-xl ${
              isActive
                ? 'text-[#ff544c] bg-[#ff544c]/10 shadow-[0_0_12px_rgba(255,84,76,0.15)]'
                : 'text-[#e4beb9]/60 hover:text-[#e5e2e1] hover:bg-white/5'
            }`}
          >
            <span
              className={`material-symbols-outlined text-2xl ${
                isActive ? 'material-symbols-filled text-[#ff544c]' : ''
              }`}
            >
              {tab.icon}
            </span>
            <span className="font-mono-code text-[11px] font-medium tracking-tight mt-0.5">
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
