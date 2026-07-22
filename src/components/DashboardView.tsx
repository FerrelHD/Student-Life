import React, { useState, useEffect } from 'react';
import { UserProfile, Mission } from '../types';

interface DashboardViewProps {
  profile: UserProfile;
  missions: Mission[];
  onOpenAddMission: () => void;
  onNavigateTab: (tab: 'missions' | 'vault' | 'agenda' | 'hero') => void;
  onUpdateStreak: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  missions,
  onOpenAddMission,
  onNavigateTab,
  onUpdateStreak,
}) => {
  // Countdown Timer state for Thesis Submission
  const [timeLeft, setTimeLeft] = useState({
    days: 2,
    hours: 14,
    minutes: 55,
    seconds: 40,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="pt-24 pb-32 px-5 max-w-6xl mx-auto space-y-8 min-h-screen">
      {/* Greeting Section */}
      <section className="mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <span className="font-mono-code text-xs text-[#ff544c] mb-1.5 block tracking-widest uppercase">
              WELCOME BACK, OPERATIVE
            </span>
            <h2 className="font-jakarta text-3xl md:text-4xl font-extrabold text-[#e5e2e1]">
              Halo, Peter! 👋
            </h2>
          </div>

          <div className="flex items-center gap-4 bg-[#201f1f]/50 p-3 rounded-xl border border-white/5">
            <div className="text-right">
              <p className="font-mono-code text-[11px] text-[#e4beb9]/70 uppercase">CURRENT XP</p>
              <p className="font-jakarta font-bold text-lg text-[#ffb4ac]">
                {profile.currentXP.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 flex items-center justify-center rounded-lg bg-[#ff544c]/20 border border-[#ff544c]/40">
              <span className="material-symbols-outlined text-[#ff544c] material-symbols-filled text-2xl">
                military_tech
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Next Deadline: Primary Hero Card */}
        <div className="md:col-span-8 glass-card p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4">
            <span className="font-mono-code text-xs text-[#ff544c] bg-[#ff544c]/10 px-3 py-1 rounded-full border border-[#ff544c]/20 font-bold uppercase">
              [URGENT MISSION]
            </span>
          </div>

          <div className="mb-8">
            <h3 className="font-mono-code text-xs text-[#e4beb9]/80 mb-1 uppercase tracking-tighter">
              Next Deadline
            </h3>
            <h4 className="font-jakarta text-2xl md:text-3xl font-bold text-white group-hover:text-[#ffb4ac] transition-colors">
              Advanced Neural Networks
            </h4>
            <p className="font-inter text-sm text-[#e4beb9]/70 mt-1">
              Final Thesis Submission • Module 7
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:gap-4 items-center">
            <div className="flex flex-col items-center justify-center w-20 h-20 bg-[#353534]/50 rounded-xl border border-white/5">
              <span className="font-jakarta text-2xl font-bold text-[#ff544c]">
                {String(timeLeft.days).padStart(2, '0')}
              </span>
              <span className="font-mono-code text-[10px] opacity-50 uppercase mt-0.5">Days</span>
            </div>

            <div className="flex flex-col items-center justify-center w-20 h-20 bg-[#353534]/50 rounded-xl border border-white/5">
              <span className="font-jakarta text-2xl font-bold text-[#ff544c]">
                {String(timeLeft.hours).padStart(2, '0')}
              </span>
              <span className="font-mono-code text-[10px] opacity-50 uppercase mt-0.5">Hrs</span>
            </div>

            <div className="flex flex-col items-center justify-center w-20 h-20 bg-[#353534]/50 rounded-xl border border-white/5">
              <span className="font-jakarta text-2xl font-bold text-[#ff544c]">
                {String(timeLeft.minutes).padStart(2, '0')}
              </span>
              <span className="font-mono-code text-[10px] opacity-50 uppercase mt-0.5">Min</span>
            </div>

            <button
              onClick={() => onNavigateTab('missions')}
              className="ml-auto bg-[#ff544c] text-[#5c0005] px-6 py-3 rounded-xl font-jakarta font-bold text-sm hover:scale-105 active:scale-95 transition-all spider-glow cursor-pointer"
            >
              START MISSION
            </button>
          </div>

          {/* Background decorative watermark */}
          <div className="absolute -bottom-10 -right-10 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            <span className="material-symbols-outlined text-[180px]">assignment_late</span>
          </div>
        </div>

        {/* Study Streak Card */}
        <div className="md:col-span-4 glass-card p-6 rounded-2xl flex flex-col items-center justify-center text-center">
          <div className="w-20 h-20 bg-[#ff544c]/10 rounded-full flex items-center justify-center mb-4 active-pulse">
            <span className="material-symbols-outlined text-[#ff544c] material-symbols-filled text-5xl">
              local_fire_department
            </span>
          </div>
          <h3 className="font-mono-code text-xs text-[#e4beb9]/80 mb-1 uppercase">Study Streak</h3>
          <p className="font-jakarta text-2xl md:text-3xl font-bold text-white">
            🔥 {profile.streakDays} Days
          </p>

          <div className="mt-6 w-full flex justify-between px-2">
            {[1, 2, 3, 4, 5, 6, 7].map((dayNum) => (
              <div
                key={dayNum}
                className={`w-2.5 h-8 rounded-full transition-colors ${
                  dayNum <= 5 ? 'bg-[#ff544c]' : 'bg-white/10'
                }`}
              />
            ))}
          </div>

          <button
            onClick={onUpdateStreak}
            className="mt-4 font-mono-code text-xs text-[#e4beb9] hover:text-[#ff544c] transition-colors cursor-pointer underline decoration-[#ff544c]/50"
          >
            Keep it up! Click to log study session.
          </button>
        </div>

        {/* Semester Progress Card */}
        <div className="md:col-span-5 glass-card p-6 rounded-2xl flex items-center gap-6">
          <div className="relative w-32 h-32 flex items-center justify-center flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                className="text-white/5"
                cx="64"
                cy="64"
                r="52"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
              />
              <circle
                className="text-[#ff544c] transition-all duration-1000 ease-out"
                cx="64"
                cy="64"
                r="52"
                fill="transparent"
                stroke="currentColor"
                strokeWidth="8"
                strokeDasharray="326.7"
                strokeDashoffset={326.7 * (1 - 0.7)}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="font-jakarta text-2xl font-extrabold text-white">70%</span>
              <span className="font-mono-code text-[10px] opacity-50 uppercase">Sem-2</span>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-jakarta font-bold text-lg text-white mb-1">Semester Progress</h3>
            <p className="font-inter text-xs text-[#e4beb9]/80 mb-4">
              You've completed 14 out of 20 units this term.
            </p>
            <div className="flex gap-2">
              <span className="font-mono-code text-xs bg-white/5 px-2.5 py-1 rounded border border-white/10 text-white">
                GPA: {profile.gpa}
              </span>
              <span className="font-mono-code text-xs bg-white/5 px-2.5 py-1 rounded border border-white/10 text-white">
                RANK: {profile.rank}
              </span>
            </div>
          </div>
        </div>

        {/* Budget Status Card */}
        <div
          onClick={() => onNavigateTab('vault')}
          className="md:col-span-7 glass-card p-6 rounded-2xl cursor-pointer group hover:border-[#ff544c]/40 transition-colors"
        >
          <div className="flex justify-between items-center mb-5">
            <div>
              <h3 className="font-jakarta font-bold text-lg text-white">Budget Status</h3>
              <p className="font-inter text-xs text-[#e4beb9]/70">Monthly allowance tracker</p>
            </div>
            <div className="text-right">
              <p className="font-jakarta text-2xl font-extrabold text-[#ffb4ac]">$450.00</p>
              <p className="font-mono-code text-[10px] opacity-50 uppercase">REMAINING</p>
            </div>
          </div>

          <div className="w-full bg-white/5 h-3.5 rounded-full overflow-hidden mb-3 border border-white/5">
            <div
              className="bg-gradient-to-r from-[#ff544c] to-[#bb171c] h-full rounded-full transition-all duration-500"
              style={{ width: '65%' }}
            />
          </div>

          <div className="flex justify-between font-mono-code text-xs text-[#e4beb9]/80 mb-4">
            <span>SPENT: $850.00</span>
            <span>LIMIT: $1,300.00</span>
          </div>

          <div className="flex items-center gap-3 p-3 bg-[#1c1b1b] rounded-xl border-l-4 border-[#ff544c]">
            <span className="material-symbols-outlined text-[#ff544c]">warning</span>
            <p className="font-mono-code text-xs text-[#e5e2e1]">
              High spending in 'Food & Drinks' this week.
            </p>
          </div>
        </div>

        {/* Recent Achievements */}
        <div className="md:col-span-12 glass-card p-6 rounded-2xl overflow-hidden">
          <h3 className="font-jakarta font-bold text-lg text-white mb-5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff544c]">stars</span>
            Recent Achievements
          </h3>

          <div className="flex overflow-x-auto gap-4 pb-2 no-scrollbar">
            <div className="min-w-[200px] bg-white/5 p-4 rounded-xl border border-white/10 hover:border-[#ff544c]/30 transition-colors">
              <div className="w-10 h-10 bg-[#ff544c]/20 rounded-lg flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[#ff544c]">history_edu</span>
              </div>
              <p className="font-jakarta font-bold text-sm text-white mb-1">Scholar King</p>
              <p className="font-mono-code text-xs text-[#e4beb9]/70">Top 5% in AI Research</p>
            </div>

            <div className="min-w-[200px] bg-white/5 p-4 rounded-xl border border-white/10 hover:border-[#ff544c]/30 transition-colors">
              <div className="w-10 h-10 bg-[#ff544c]/20 rounded-lg flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[#ff544c]">schedule</span>
              </div>
              <p className="font-jakarta font-bold text-sm text-white mb-1">Early Bird</p>
              <p className="font-mono-code text-xs text-[#e4beb9]/70">Logged in before 8AM (5x)</p>
            </div>

            <div className="min-w-[200px] bg-white/5 p-4 rounded-xl border border-white/10 hover:border-[#ff544c]/30 transition-colors">
              <div className="w-10 h-10 bg-[#ff544c]/20 rounded-lg flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-[#ff544c]">rocket_launch</span>
              </div>
              <p className="font-jakarta font-bold text-sm text-white mb-1">Sprint Finish</p>
              <p className="font-mono-code text-xs text-[#e4beb9]/70">Completed Lab 4 in 1hr</p>
            </div>

            <div className="min-w-[200px] bg-white/5 p-4 rounded-xl border border-white/10 hover:border-[#ff544c]/30 transition-colors opacity-50">
              <div className="w-10 h-10 bg-white/5 rounded-lg flex items-center justify-center mb-3">
                <span className="material-symbols-outlined text-white/50">lock</span>
              </div>
              <p className="font-jakarta font-bold text-sm text-white/70 mb-1">Locked</p>
              <p className="font-mono-code text-xs text-[#e4beb9]/50">Next: 30 Day Streak</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={onOpenAddMission}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-2xl bg-[#ff544c] text-[#5c0005] flex items-center justify-center shadow-2xl z-40 spider-red-pulse active:scale-90 transition-transform cursor-pointer"
        title="Add New Mission"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>
    </div>
  );
};
