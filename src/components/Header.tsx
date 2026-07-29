import React from 'react';
import { TabType, UserProfile } from '../types';
import { getTranslation } from '../utils/i18n';

interface HeaderProps {
  activeTab: TabType;
  profile: UserProfile;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
  onOpenDrawer: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  profile,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
  onOpenDrawer,
}) => {
  const t = getTranslation(profile.language);

  const getTitleAndSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: `${t.greeting}, ${profile.name.split(' ')[0]}`,
          subtitle: profile.role,
        };
      case 'missions':
        return { title: t.missions, subtitle: t.activeToday.replace('{count}', '4') };
      case 'vault':
        return { title: t.vault, subtitle: t.financialTracker };
      case 'agenda':
        return { title: t.agenda, subtitle: t.academicSchedule };
      case 'hero':
        return { title: t.profile, subtitle: profile.name };
      default:
        return {
          title: `${t.greeting}, ${profile.name.split(' ')[0]}`,
          subtitle: profile.role,
        };
    }
  };

  const info = getTitleAndSubtitle();

  return (
    <header className="fixed top-0 left-0 right-0 md:left-72 z-40 bg-white/40 dark:bg-[#0f0e13]/60 backdrop-blur-xl border-b border-black/5 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-md md:max-w-4xl mx-auto px-5 h-20 flex items-center justify-between">
        {/* Left: Drawer (mobile only, desktop uses the sidebar) + Profile Summary */}
        <div className="flex items-center gap-3">
        <button
          onClick={onOpenDrawer}
          aria-label={profile.language === 'id' ? 'Buka menu' : 'Open menu'}
          className="md:hidden w-11 h-11 rounded-full flex items-center justify-center text-[#1b1b1d] dark:text-[#f3f0f2] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
        >
          <span className="material-symbols-outlined text-2xl">menu</span>
        </button>
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="relative w-12 h-12 group-hover:scale-105 transition-transform">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-[#d1c4e9] shadow-sm">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#1b1b1d] dark:bg-[#d1c4e9] text-white dark:text-[#1b1b1d] font-jakarta font-black text-[9px] flex items-center justify-center border-2 border-white dark:border-[#121214]">
              {profile.level}
            </span>
          </div>
          <div>
            <h1 className="font-jakarta font-extrabold text-xl leading-tight text-[#1b1b1d] dark:text-[#f3f0f2]">
              {info.title}
            </h1>
            <p className="font-jakarta text-xs font-semibold text-[#49454d] dark:text-[#cac4cd]">
              {info.subtitle}
            </p>
          </div>
        </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {profile.streakDays > 0 && (
            <div className="flex items-center gap-1 bg-[#f0edef] dark:bg-[#1e1e22] text-[#1b1b1d] dark:text-[#f3f0f2] px-2.5 h-11 rounded-full font-jakarta font-black text-xs clay-chip">
              <span>🔥</span>
              <span>{profile.streakDays}</span>
            </div>
          )}
          <button
            onClick={onOpenNotifications}
            aria-label={t.notificationsTitle}
            className="relative w-11 h-11 rounded-full bg-[#f0edef] dark:bg-[#1e1e22] text-[#1b1b1d] dark:text-[#f3f0f2] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-[#ff544c] text-white font-jakarta font-black text-[9px] flex items-center justify-center border-2 border-white dark:border-[#121214] animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
