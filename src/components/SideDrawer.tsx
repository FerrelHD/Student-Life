import React from 'react';
import { UserProfile, TabType } from '../types';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSelectTab: (tab: TabType) => void;
}

export const SideDrawer: React.FC<SideDrawerProps> = ({
  isOpen,
  onClose,
  profile,
  onSelectTab,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer content */}
      <div className="relative w-80 max-w-[80vw] bg-[#131313] border-r border-white/10 h-full p-6 flex flex-col justify-between overflow-y-auto shadow-2xl z-10 animate-in slide-in-from-left duration-300">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-6 border-b border-white/10">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ff544c] text-3xl">
                shield
              </span>
              <div>
                <h2 className="font-jakarta font-black text-xl text-[#ff544c] tracking-tight">
                  OPERATIVE HQ
                </h2>
                <p className="font-mono-code text-xs text-[#e4beb9]/60">v2.4.0 • CLASSIFIED</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-white/70 hover:text-white"
            >
              <span className="material-symbols-outlined text-xl">close</span>
            </button>
          </div>

          {/* User profile card */}
          <div className="mt-6 glass-panel rounded-xl p-4 border border-[#ff544c]/30">
            <div className="flex items-center gap-3">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-[#ff544c]"
              />
              <div>
                <h3 className="font-jakarta font-bold text-sm text-white">{profile.name}</h3>
                <p className="font-mono-code text-xs text-[#ff544c]">{profile.role}</p>
                <p className="font-mono-code text-[11px] text-white/50">{profile.university}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/10 flex justify-between font-mono-code text-xs">
              <div>
                <span className="text-white/40 block text-[10px]">CURRENT XP</span>
                <span className="text-[#ff544c] font-bold">{profile.currentXP.toLocaleString()}</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">STREAK</span>
                <span className="text-amber-400 font-bold">🔥 {profile.streakDays} Days</span>
              </div>
              <div>
                <span className="text-white/40 block text-[10px]">GPA</span>
                <span className="text-emerald-400 font-bold">{profile.gpa}</span>
              </div>
            </div>
          </div>

          {/* Navigation items */}
          <div className="mt-6 space-y-1">
            <p className="font-mono-code text-[10px] text-white/40 uppercase tracking-widest px-3 mb-2">
              Navigation Sector
            </p>

            <button
              onClick={() => {
                onSelectTab('dashboard');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ff544c]/10 text-white hover:text-[#ff544c] transition-colors"
            >
              <span className="material-symbols-outlined text-[#ff544c]">dashboard</span>
              <span className="font-jakarta text-sm font-semibold">Dashboard</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('missions');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ff544c]/10 text-white hover:text-[#ff544c] transition-colors"
            >
              <span className="material-symbols-outlined text-[#ff544c]">assignment_turned_in</span>
              <span className="font-jakarta text-sm font-semibold">Missions</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('vault');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ff544c]/10 text-white hover:text-[#ff544c] transition-colors"
            >
              <span className="material-symbols-outlined text-[#ff544c]">payments</span>
              <span className="font-jakarta text-sm font-semibold">The Vault</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('agenda');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ff544c]/10 text-white hover:text-[#ff544c] transition-colors"
            >
              <span className="material-symbols-outlined text-[#ff544c]">calendar_month</span>
              <span className="font-jakarta text-sm font-semibold">Agenda</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('hero');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[#ff544c]/10 text-white hover:text-[#ff544c] transition-colors"
            >
              <span className="material-symbols-outlined text-[#ff544c]">person</span>
              <span className="font-jakarta text-sm font-semibold">Hero Profile</span>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-6 border-t border-white/10 text-center font-mono-code text-xs text-white/40 space-y-1">
          <p className="text-[#ff544c]">STUDENT LIFE OPERATIVE</p>
          <p>© 2026 Academic Gamification Engine</p>
        </div>
      </div>
    </div>
  );
};
