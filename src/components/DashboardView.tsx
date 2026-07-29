import React, { useEffect, useState } from 'react';
import { Badge, UserProfile, Mission } from '../types';
import { getTranslation } from '../utils/i18n';

interface DashboardViewProps {
  profile: UserProfile;
  missions: Mission[];
  badges: Badge[];
  monthlySpend: number;
  onOpenAddMission: () => void;
  onNavigateTab: (tab: 'missions' | 'vault' | 'agenda' | 'hero') => void;
  onUpdateStreak: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  missions,
  badges,
  monthlySpend,
  onOpenAddMission,
  onNavigateTab,
  onUpdateStreak,
}) => {
  const t = getTranslation(profile.language);

  // Re-render once a minute so the countdown below stays roughly live without
  // recomputing on every tick (it's derived straight from Date.now() each render).
  const [, forceTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => forceTick((n) => n + 1), 60_000);
    return () => clearInterval(timer);
  }, []);

  const urgentMission = missions.find((m) => m.priority === 'high' && !m.completed) || missions.find((m) => !m.completed);

  const deadlineLabel = (() => {
    if (!urgentMission) return t.noDeadline;
    if (!urgentMission.dateStr) return urgentMission.dueDate;
    const target = new Date(`${urgentMission.dateStr}T${urgentMission.time || '23:59'}`);
    const diffMs = target.getTime() - Date.now();
    if (diffMs <= 0) return t.overdue;
    const hoursLeft = Math.floor(diffMs / 3_600_000);
    const minutesLeft = Math.floor((diffMs % 3_600_000) / 60_000);
    return `${String(hoursLeft).padStart(2, '0')}${t.hours} ${String(minutesLeft).padStart(2, '0')}${t.minutes}`;
  })();

  const recentBadges = badges.filter((b) => b.unlocked).slice(-2).reverse();

  // Dynamic Level & XP calculations
  const xpInLevel = profile.currentXP % 1000;
  const xpPct = Math.min(100, Math.round((xpInLevel / 1000) * 100));
  const xpRemaining = 1000 - xpInLevel;

  return (
    <div className="pt-24 pb-32 md:pb-16 px-5 max-w-md md:max-w-4xl mx-auto space-y-6">
      {/* XP Mastery / Next Reward Progress Card (Pastel Lavender) */}
      <section className="expressive-card expressive-card-lavender expressive-shimmer p-6 shadow-sm">
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

        <div className="flex justify-between items-center font-jakarta text-xs font-extrabold opacity-85">
          <span>{profile.currentXP.toLocaleString('id-ID')} Total XP</span>
          <span>{t.xpUntilNext.replace('{xp}', String(xpRemaining))}</span>
        </div>
      </section>

      {/* Grid: Next Deadline & Study Streak */}
      <section className="grid grid-cols-2 gap-4">
        {/* Next Deadline Card (Butter Yellow) */}
        <div
          onClick={() => onNavigateTab('missions')}
          className="expressive-card expressive-card-butter p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl">schedule</span>
            </div>
            <span className="material-symbols-outlined text-lg opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              north_east
            </span>
          </div>

          <div>
            <p className="font-jakarta text-xs font-black opacity-75 mb-1">{t.nextDeadline}</p>
            <h3 className="font-jakarta font-black text-2xl tracking-tight mb-1">
              {deadlineLabel}
            </h3>
            <p className="font-jakarta text-xs font-bold opacity-85 truncate">
              {urgentMission?.title ?? ''}
            </p>
          </div>
        </div>

        {/* Study Streak Card (Lavender/Purple) */}
        <div
          onClick={onUpdateStreak}
          className="expressive-card expressive-card-lavender p-5 flex flex-col justify-between cursor-pointer group shadow-sm hover:scale-[1.02] transition-all"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="w-10 h-10 rounded-full bg-black/10 flex items-center justify-center">
              <span className="material-symbols-outlined text-xl text-[#b81d27] material-symbols-filled">
                local_fire_department
              </span>
            </div>
            <span className="material-symbols-outlined text-lg opacity-70 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform">
              north_east
            </span>
          </div>

          <div>
            <p className="font-jakarta text-xs font-black opacity-75 mb-1">{t.studyStreak}</p>
            <h3 className="font-jakarta font-black text-2xl tracking-tight mb-1">
              {profile.streakDays} {t.days}
            </h3>
            <p className="font-jakarta text-xs font-bold opacity-85">
              {t.tapToIncrement}
            </p>
          </div>
        </div>
      </section>

      {/* Monthly Spend Card (Deep Onyx - Always Rupiah) */}
      <section
        onClick={() => onNavigateTab('vault')}
        className="expressive-card expressive-card-onyx expressive-shimmer p-6 cursor-pointer relative overflow-hidden group shadow-lg text-white"
      >
        <div className="flex justify-between items-start">
          <div>
            <p className="font-jakarta text-xs font-bold text-gray-300 mb-1">{t.monthlyBudget}</p>
            <h3 className="font-jakarta font-black text-3xl tracking-tight text-white">
              Rp {monthlySpend.toLocaleString('id-ID')}
            </h3>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl text-[#ece28c]">account_balance_wallet</span>
          </div>
        </div>
      </section>

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
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#1b1b1d] text-white dark:bg-[#d1c4e9] dark:text-[#1b1b1d] flex items-center justify-center shadow-2xl z-40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        title="Add Mission"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};
