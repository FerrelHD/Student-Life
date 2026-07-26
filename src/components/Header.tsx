import React from 'react';
import { TabType, UserProfile } from '../types';
import { getTranslation } from '../utils/i18n';

interface HeaderProps {
  activeTab: TabType;
  profile: UserProfile;
  unreadCount: number;
  onOpenNotifications: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  profile,
  unreadCount,
  onOpenNotifications,
  onOpenProfile,
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
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/40 dark:bg-[#0f0e13]/60 backdrop-blur-xl border-b border-black/5 dark:border-white/5 transition-colors duration-200">
      <div className="max-w-md md:max-w-4xl mx-auto px-5 h-20 flex items-center justify-between">
        {/* Left Profile Summary */}
        <button
          onClick={onOpenProfile}
          className="flex items-center gap-3 group text-left cursor-pointer"
        >
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-[#d1c4e9] shadow-sm group-hover:scale-105 transition-transform">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
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

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenNotifications}
            className="relative w-10 h-10 rounded-full bg-[#f0edef] dark:bg-[#1e1e22] text-[#1b1b1d] dark:text-[#f3f0f2] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-sm"
            title="Open Notifications"
          >
            <span className="material-symbols-outlined text-xl">notifications</span>
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#ff544c] text-white font-jakarta font-black text-[9px] flex items-center justify-center border-2 border-white dark:border-[#121214]">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
