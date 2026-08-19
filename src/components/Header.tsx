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
      <div className="max-w-full md:max-w-4xl mx-auto px-3 md:px-5 h-16 md:h-20 flex items-center justify-between gap-2">
        {/* Left: Drawer (mobile only) + Profile Summary */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={onOpenDrawer}
            aria-label={profile.language === 'id' ? 'Buka menu' : 'Open menu'}
            className="md:hidden w-9 h-9 rounded-full flex items-center justify-center text-[#1b1b1d] dark:text-[#f3f0f2] hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer flex-shrink-0"
          >
            <span className="material-symbols-outlined text-xl" aria-hidden="true">menu</span>
          </button>
          <button
            onClick={onOpenProfile}
            className="flex items-center gap-2 group text-left cursor-pointer min-w-0"
          >
            <div className="relative w-9 h-9 md:w-12 md:h-12 group-hover:scale-105 transition-transform flex-shrink-0">
              <div className="w-9 h-9 md:w-12 md:h-12 rounded-full overflow-hidden border-2 border-[#d1c4e9] shadow-sm">
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 md:w-5 md:h-5 rounded-full bg-[#1b1b1d] dark:bg-[#d1c4e9] text-white dark:text-[#1b1b1d] font-jakarta font-black text-[8px] md:text-[9px] flex items-center justify-center border-2 border-white dark:border-[#121214]">
                {profile.level}
              </span>
            </div>
            <div className="min-w-0">
              <h1 className="font-jakarta font-extrabold text-base md:text-xl leading-tight text-[#1b1b1d] dark:text-[#f3f0f2] truncate max-w-[110px] sm:max-w-[200px] md:max-w-none">
                {info.title}
              </h1>
              <p className="font-jakarta text-[11px] md:text-xs font-semibold text-[#49454d] dark:text-[#cac4cd] hidden sm:block truncate">
                {info.subtitle}
              </p>
            </div>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 md:gap-2 flex-shrink-0">
          {profile.streakDays > 0 && (
            <div className="flex items-center gap-1 md:gap-2 bg-[#f0edef] dark:bg-[#1e1e22] text-[#1b1b1d] dark:text-[#f3f0f2] px-2 md:px-3 h-9 md:h-11 rounded-full font-jakarta clay-chip">
              <span className="text-sm md:text-lg">🔥</span>
              {/* Mobile: compact (number only), Desktop: full label */}
              <span className="font-extrabold text-xs md:hidden">{profile.streakDays}</span>
              <div className="text-left leading-tight min-w-0 hidden md:block">
                <span className="block text-[10px] opacity-75">{t.streakLabel}</span>
                <span className="block font-extrabold text-sm">{profile.streakDays} {t.days}</span>
              </div>
            </div>
          )}
          <button
            onClick={onOpenNotifications}
            aria-label={t.notificationsTitle}
            className="relative w-9 h-9 md:w-11 md:h-11 rounded-full bg-[#f0edef] dark:bg-[#1e1e22] text-[#1b1b1d] dark:text-[#f3f0f2] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
          >
            <span className="material-symbols-outlined text-[18px] md:text-xl" aria-hidden="true">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-[16px] md:min-w-[18px] md:h-[18px] px-1 rounded-full bg-[#ff544c] text-white font-jakarta font-black text-[8px] md:text-[9px] flex items-center justify-center border-2 border-white dark:border-[#121214] animate-pulse">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
