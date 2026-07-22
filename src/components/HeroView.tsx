import React, { useState } from 'react';
import { UserProfile, Badge } from '../types';

interface HeroViewProps {
  profile: UserProfile;
  badges: Badge[];
  onToggleDarkMode: () => void;
  onToggleNotifications: () => void;
  onLogout: () => void;
}

export const HeroView: React.FC<HeroViewProps> = ({
  profile,
  badges,
  onToggleDarkMode,
  onToggleNotifications,
  onLogout,
}) => {
  const [showUnivInfo, setShowUnivInfo] = useState(false);

  return (
    <div className="pt-24 pb-28 px-5 max-w-6xl mx-auto space-y-6 min-h-screen">
      {/* Profile Header Section */}
      <section className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#ff544c] to-transparent opacity-50" />

        {/* Hero Level Indicator */}
        <div className="absolute top-4 right-4 bg-[#ff544c] text-[#5c0005] font-mono-code text-xs px-3 py-1 rounded-full animate-pulse-red font-bold shadow-lg shadow-[#ff544c]/30">
          LVL {profile.level}
        </div>

        <div className="relative mb-4 mt-2">
          <div className="w-24 h-24 rounded-full border-4 border-[#ff544c] hero-glow p-1">
            <div className="w-full h-full rounded-full overflow-hidden border border-white/20">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="absolute -bottom-1 -right-1 bg-[#131313] border border-white/10 rounded-full p-1 shadow">
            <span className="material-symbols-outlined text-[#ff544c] text-lg material-symbols-filled">
              verified
            </span>
          </div>
        </div>

        <h2 className="font-jakarta text-2xl font-bold text-white">{profile.name}</h2>
        <p className="font-mono-code text-xs text-[#ff544c] mt-1 font-semibold">{profile.role}</p>
        <p className="font-inter text-sm text-[#e4beb9] mt-2">
          {profile.university} • {profile.classOf}
        </p>

        {/* Progress Bar */}
        <div className="w-full mt-6 space-y-2">
          <div className="flex justify-between items-end">
            <span className="font-mono-code text-xs text-[#e4beb9]/70">XP TO NEXT MISSION</span>
            <span className="font-mono-code text-xs text-[#ff544c] font-bold">
              7,450 / 10,000
            </span>
          </div>
          <div className="h-2.5 w-full bg-[#353534] rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff544c] to-[#bb171c] rounded-full shadow-[0_0_10px_rgba(255,84,76,0.5)] transition-all duration-500"
              style={{ width: '74.5%' }}
            />
          </div>
        </div>
      </section>

      {/* Heroic Badges Bento Grid */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-jakarta font-bold text-base text-white flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff544c]">military_tech</span>
            Heroic Badges
          </h3>
          <span className="font-mono-code text-xs text-[#e4beb9]/60">VIEW ALL</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`glass-panel p-4 rounded-xl flex flex-col items-center gap-2 hover:scale-[1.03] transition-all cursor-pointer ${
                badge.tier ? 'border-[#ff544c]/40 shadow-[0_0_15px_rgba(255,84,76,0.1)]' : ''
              }`}
            >
              <div className="w-12 h-12 flex items-center justify-center bg-[#ff544c]/15 rounded-full border border-[#ff544c]/30">
                <span className="material-symbols-outlined text-[#ff544c] material-symbols-filled text-2xl">
                  {badge.icon}
                </span>
              </div>
              <span className="font-mono-code text-xs text-white text-center font-bold">
                {badge.title}
              </span>
              <span
                className={`font-mono-code text-[10px] ${
                  badge.tier ? 'text-[#ff544c] font-bold' : 'text-[#e4beb9]/60'
                }`}
              >
                {badge.subtitle}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Settings Section */}
      <section className="space-y-3">
        <h3 className="font-jakarta font-bold text-base text-white flex items-center gap-2 px-1">
          <span className="material-symbols-outlined text-[#ff544c]">settings</span>
          System Config
        </h3>

        <div className="glass-panel rounded-2xl divide-y divide-white/5 overflow-hidden">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#e4beb9]">dark_mode</span>
              <div>
                <p className="font-inter font-medium text-sm text-white">Dark Mode</p>
                <p className="font-mono-code text-[11px] text-[#e4beb9]/60">
                  High-contrast gaming interface
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.darkMode}
                onChange={onToggleDarkMode}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#353534] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff544c]" />
            </label>
          </div>

          {/* University Info */}
          <button
            onClick={() => setShowUnivInfo(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#e4beb9]">account_balance</span>
              <div className="text-left">
                <p className="font-inter font-medium text-sm text-white">University Info</p>
                <p className="font-mono-code text-[11px] text-[#e4beb9]/60">
                  Academic records and credentials
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-[#e4beb9] group-hover:translate-x-1 transition-transform">
              chevron_right
            </span>
          </button>

          {/* Notifications */}
          <div className="flex items-center justify-between p-4 hover:bg-white/5 transition-colors">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#e4beb9]">
                notifications_active
              </span>
              <div className="text-left">
                <p className="font-inter font-medium text-sm text-white">Notifications</p>
                <p className="font-mono-code text-[11px] text-[#e4beb9]/60">
                  Mission alerts and updates
                </p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={profile.notifications}
                onChange={onToggleNotifications}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-[#353534] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#ff544c]" />
            </label>
          </div>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="w-full flex items-center p-4 hover:bg-[#93000a]/10 transition-colors group cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-[#ffb4ab]">logout</span>
              <div className="text-left">
                <p className="font-inter font-medium text-sm text-[#ffb4ab]">Logout</p>
                <p className="font-mono-code text-[11px] text-[#ffdad6]/60">
                  End current mission session
                </p>
              </div>
            </div>
          </button>
        </div>
      </section>

      {/* Stats Footer Grid */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="font-mono-code text-xs text-[#e4beb9]">GP SCORE</p>
          <p className="font-jakarta font-bold text-lg text-[#ff544c]">{profile.gpa}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="font-mono-code text-xs text-[#e4beb9]">WALKS</p>
          <p className="font-jakarta font-bold text-lg text-[#ff544c]">{profile.walks}</p>
        </div>
        <div className="glass-panel p-4 rounded-xl text-center">
          <p className="font-mono-code text-xs text-[#e4beb9]">RANK</p>
          <p className="font-jakarta font-bold text-lg text-[#ff544c]">{profile.rank}</p>
        </div>
      </div>

      {/* University Info Modal */}
      {showUnivInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-[#ff544c]/30 shadow-2xl relative space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[#ff544c]">account_balance</span>
                <h3 className="font-jakarta font-bold text-lg text-white">Academic Record</h3>
              </div>
              <button
                onClick={() => setShowUnivInfo(false)}
                className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="space-y-3 font-mono-code text-xs">
              <div className="p-3 bg-[#1c1b1b] rounded-xl border border-white/5 space-y-1">
                <p className="text-white/50 text-[10px]">INSTITUTION</p>
                <p className="text-white font-bold text-sm">Stanford University</p>
                <p className="text-[#ff544c]">Department of Computer Science</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-[#1c1b1b] rounded-xl border border-white/5">
                  <p className="text-white/50 text-[10px]">MAJOR</p>
                  <p className="text-white font-bold">B.S. Computer Science</p>
                </div>
                <div className="p-3 bg-[#1c1b1b] rounded-xl border border-white/5">
                  <p className="text-white/50 text-[10px]">EXPECTED GRADUATION</p>
                  <p className="text-white font-bold">Class of 2024</p>
                </div>
              </div>

              <div className="p-3 bg-[#1c1b1b] rounded-xl border border-white/5 space-y-1">
                <p className="text-white/50 text-[10px]">OPERATIVE VERIFICATION HASH</p>
                <p className="text-[#a2c9ff] text-[11px] break-all">
                  0x8F92A...4B1C90 (ENCRYPTED)
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowUnivInfo(false)}
              className="w-full bg-[#ff544c] text-[#5c0005] font-bold py-2.5 rounded-xl transition-colors cursor-pointer"
            >
              Close Credentials
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
