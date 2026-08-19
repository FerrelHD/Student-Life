import React, { useEffect, useState } from 'react';
import { Badge, UserProfile, Mission } from '../types';
import { getTranslation } from '../utils/i18n';
import { formatDeadlineLabel } from '../utils/deadline';

import { QuickNotesWidget } from './QuickNotesWidget';

interface DashboardViewProps {
  profile: UserProfile;
  missions: Mission[];
  badges: Badge[];
  monthlySpend: number;
  onOpenAddMission: () => void;
  onNavigateTab: (tab: 'missions' | 'vault' | 'agenda' | 'hero') => void;
  onUpdateStreak: () => void;
  onOpenFocusTimer: () => void;
  onOpenGpaCalculator: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  missions,
  badges,
  monthlySpend,
  onOpenAddMission,
  onNavigateTab,
  onUpdateStreak,
  onOpenFocusTimer,
  onOpenGpaCalculator,
}) => {
  const t = getTranslation(profile.language);

  // Deadline label is day-granularity now, so an hourly re-render is enough
  // to catch the midnight rollover for a tab left open.
  const [, forceTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => forceTick((n) => n + 1), 3_600_000);
    return () => clearInterval(timer);
  }, []);

  const urgentMission = missions.find((m) => m.priority === 'high' && !m.completed) || missions.find((m) => !m.completed);

  const deadlineLabel = !urgentMission
    ? t.noDeadline
    : formatDeadlineLabel(urgentMission.dateStr, t, urgentMission.time) || urgentMission.dueDate;

  const recentBadges = badges.filter((b) => b.unlocked).slice(-2).reverse();

  // Dynamic Level & XP calculations
  const xpInLevel = profile.currentXP % 1000;
  const xpPct = Math.min(100, Math.round((xpInLevel / 1000) * 100));
  const xpRemaining = 1000 - xpInLevel;

  return (
    <div className="pt-24 pb-32 md:pb-16 px-4 sm:px-6 max-w-md md:max-w-4xl lg:max-w-5xl mx-auto space-y-6">
      {/* XP Mastery / Next Reward Progress Card (Pastel Lavender) */}
      <section className="expressive-card expressive-card-lavender p-6 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 font-jakarta font-black text-sm tracking-tight">
            <span className="material-symbols-outlined text-xl">bolt</span>
            <span>{t.nextReward.replace('{level}', String(profile.level + 1))}</span>
          </div>
          <span className="font-jakarta font-black text-sm">{xpPct}%</span>
        </div>

        {/* Thick Rounded Progress Bar */}
        <div className="w-full bg-black/15 h-4 rounded-full overflow-hidden p-0.5 mb-3">
          <div
            className="bg-[#1b1b1d] h-full rounded-full transition-all duration-700"
            style={{ width: `${xpPct}%` }}
          />
        </div>

        {(() => {
          const locale = profile.language === 'id' ? 'id-ID' : 'en-US';
          const xp = profile.currentXP?.toLocaleString(locale) ?? '0';
          const xpRem = xpRemaining.toLocaleString(locale);

          return (
            <div className="flex justify-between items-center font-jakarta text-xs opacity-85">
                    <div>
                <span className="block text-[10px] opacity-75">{t.totalXpLabel}</span>
                <span className="block font-extrabold text-sm mt-1">{xp}</span>
              </div>
              <span className="text-[11px] font-bold">{t.xpUntilNext.replace('{xp}', xpRem)}</span>
            </div>
          );
        })()}
      </section>

      {/* Unified Quick Actions & Stat Cards Grid: 2 cols on mobile, 4 cols on desktop */}
      <section className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Next Deadline Card (Butter Yellow) */}
        <div
          onClick={() => onNavigateTab('missions')}
          className="expressive-card expressive-card-butter p-4 sm:p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:scale-[1.02] transition-all min-h-[140px]"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg sm:text-xl">schedule</span>
            </div>
            <span className="material-symbols-outlined text-base sm:text-lg opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              north_east
            </span>
          </div>

          <div>
            <p className="font-jakarta text-[11px] sm:text-xs font-black opacity-75 mb-0.5 sm:mb-1">{t.nextDeadline}</p>
            <h3 className="font-jakarta font-black text-xl sm:text-2xl tracking-tight mb-0.5">
              {deadlineLabel}
            </h3>
            <p className="font-jakarta text-[11px] sm:text-xs font-bold opacity-85 truncate">
              {urgentMission?.title ?? ''}
            </p>
          </div>
        </div>

        {/* Study Streak Card (Lavender/Purple) */}
        <div
          onClick={onUpdateStreak}
          className="expressive-card expressive-card-lavender p-4 sm:p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:scale-[1.02] transition-all min-h-[140px]"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-black/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-lg sm:text-xl text-[#b81d27] material-symbols-filled">
                local_fire_department
              </span>
            </div>
            <span className="material-symbols-outlined text-base sm:text-lg opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              north_east
            </span>
          </div>

          <div>
            <p className="font-jakarta text-[11px] sm:text-xs font-black opacity-75 mb-0.5 sm:mb-1">{t.studyStreak}</p>
            <h3 className="font-jakarta font-black text-xl sm:text-2xl tracking-tight mb-0.5">
              {profile.streakDays} {t.days}
            </h3>
            <p className="font-jakarta text-[11px] sm:text-xs font-bold opacity-85">
              {t.tapToIncrement}
            </p>
          </div>
        </div>

        {/* Focus Timer Card */}
        <div
          onClick={onOpenFocusTimer}
          className="expressive-card expressive-card-onyx p-4 sm:p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:scale-[1.02] transition-all text-white border border-white/10 min-h-[140px]"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-[#d1c4e9]">
              <span className="material-symbols-outlined text-lg sm:text-xl">timer</span>
            </div>
            <span className="material-symbols-outlined text-base sm:text-lg text-gray-400 group-hover:text-white transition-colors">
              play_circle
            </span>
          </div>
          <div>
            <p className="font-jakarta text-[11px] sm:text-xs font-black text-[#d1c4e9] mb-0.5">Focus Mode</p>
            <h4 className="font-jakarta font-black text-base sm:text-lg text-white">Pomodoro ⏱️</h4>
            <p className="font-jakarta text-[10px] sm:text-[11px] text-gray-400 font-bold mt-0.5">
              {profile.language === 'id' ? '25 Min (+25 XP)' : '25 Min (+25 XP)'}
            </p>
          </div>
        </div>

        {/* GPA Calculator Card */}
        <div
          onClick={onOpenGpaCalculator}
          className="expressive-card expressive-card-onyx p-4 sm:p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:scale-[1.02] transition-all text-white border border-white/10 min-h-[140px]"
        >
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-emerald-300">
              <span className="material-symbols-outlined text-lg sm:text-xl">calculate</span>
            </div>
            <span className="material-symbols-outlined text-base sm:text-lg text-gray-400 group-hover:text-white transition-colors">
              equalizer
            </span>
          </div>
          <div>
            <p className="font-jakarta text-[11px] sm:text-xs font-black text-emerald-300 mb-0.5">Academic</p>
            <h4 className="font-jakarta font-black text-base sm:text-lg text-white">Target IPK 📊</h4>
            <p className="font-jakarta text-[10px] sm:text-[11px] text-gray-400 font-bold mt-0.5">
              {profile.language === 'id' ? 'Simulasi Nilai & SKS' : 'Simulate Grades'}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Notes & Academic Link Vault */}
      <QuickNotesWidget lang={profile.language} />

      {/* Recent Achievements */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-jakarta font-black text-lg text-[#1b1b1d] dark:text-[#f3f0f2]">
            {t.recentAchievements}
          </h3>
          <button
            onClick={() => onNavigateTab('hero')}
            className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5] hover:underline cursor-pointer"
          >
            {t.seeAll}
          </button>
        </div>

        {recentBadges.length > 0 ? (
          <div className="grid grid-cols-2 gap-4">
            {recentBadges.map((badge, idx) => (
              <div key={badge.id} className="expressive-card expressive-card-onyx p-4 flex items-center gap-3 text-white">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    idx === 0 ? 'bg-[#ffb8b3] text-[#410004]' : 'bg-[#ece28c] text-[#1f1c00]'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl material-symbols-filled">{badge.icon}</span>
                </div>
                <div>
                  <p className="font-jakarta font-black text-sm text-white">{badge.title}</p>
                  <p className={`font-jakarta text-xs font-bold ${idx === 0 ? 'text-[#ffb8b3]' : 'text-[#ece28c]'}`}>
                    {badge.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5] px-1">{t.noAchievements}</p>
        )}
      </section>

      {/* Floating Add Mission Button */}
      <button
        onClick={onOpenAddMission}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#1b1b1d] text-white dark:bg-[#d1c4e9] dark:text-[#1b1b1d] flex items-center justify-center clay-raised z-40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        title="Add Mission"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};
