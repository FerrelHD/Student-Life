import React from 'react';
import { UserProfile, TabType } from '../types';
import { getTranslation } from '../utils/i18n';

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
  const t = getTranslation(profile.language);

  return (
    <>
      {/* Backdrop — mobile-only, only while the drawer is toggled open */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity md:hidden"
          onClick={onClose}
        />
      )}

      {/* Rail: slide-in overlay on mobile, permanent pinned sidebar on desktop */}
      <div
        className={`fixed top-0 left-0 z-50 md:z-30 w-80 max-w-[80vw] md:w-72 md:max-w-none bg-[#fcf8fb] dark:bg-[#121214] text-[#1b1b1d] dark:text-[#f3f0f2] border-r border-black/5 dark:border-white/10 h-screen p-6 flex flex-col justify-between overflow-y-auto shadow-2xl md:shadow-[8px_0_24px_rgba(20,10,30,0.06)] dark:md:shadow-[8px_0_24px_rgba(0,0,0,0.3)] transition-transform duration-300 md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pb-5 border-b border-black/5 dark:border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d1c4e9] text-[#1f1732] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl">school</span>
              </div>
              <div>
                <h2 className="font-jakarta font-black text-lg text-[#1b1b1d] dark:text-[#f3f0f2]">
                  Student Life
                </h2>
                <p className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5]">
                  {t.academicSchedule}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              aria-label={profile.language === 'id' ? 'Tutup' : 'Close'}
              className="md:hidden w-11 h-11 rounded-full bg-black/5 dark:bg-white/10 flex items-center justify-center text-[#1b1b1d] dark:text-[#f3f0f2]"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>

          {/* User profile card */}
          <div className="mt-6 expressive-card expressive-card-lavender p-4 shadow-sm text-[#1f1732]">
            <div className="flex items-center gap-3">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div>
                <h3 className="font-jakarta font-extrabold text-sm text-[#1f1732]">{profile.name}</h3>
                <p className="font-jakarta text-xs font-bold opacity-80">{profile.role}</p>
                <p className="font-jakarta text-[11px] font-semibold opacity-75">{profile.university}</p>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-black/10 flex justify-between font-jakarta text-xs">
              {(() => {
                const locale = profile.language === 'id' ? 'id-ID' : 'en-US';
                const xp = profile.currentXP?.toLocaleString(locale) ?? '0';
                const gpa = (typeof profile.gpa === 'number')
                  ? profile.gpa.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
                  : profile.gpa;

                return (
                  <>
                      <div className="text-left">
                        <span className="block text-[10px] opacity-75">{t.totalXpLabel}</span>
                        <span className="block font-extrabold text-sm mt-1">{xp}</span>
                    </div>
                    <div className="text-center">
                       <span className="block text-[10px] opacity-75">{t.streakLabel}</span>
                       <span className="block font-extrabold text-sm mt-1">🔥 {profile.streakDays} {t.days}</span>
                    </div>
                    <div className="text-right">
                       <span className="block text-[10px] opacity-75">{t.gpaLabel}</span>
                       <span className="block font-extrabold text-sm mt-1">{gpa}</span>
                    </div>
                  </>
                );
              })()}
            </div>
          </div>

          {/* Navigation items */}
          <div className="mt-6 space-y-1.5">
            <p className="font-jakarta text-[11px] font-extrabold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 mb-2">
              {profile.language === 'id' ? 'MENU NAVIGASI' : 'NAVIGATION MENU'}
            </p>

            <button
              onClick={() => {
                onSelectTab('dashboard');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left cursor-pointer font-jakarta font-extrabold text-sm"
            >
              <span className="material-symbols-outlined text-xl">home</span>
              <span>{t.dashboard}</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('missions');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left cursor-pointer font-jakarta font-extrabold text-sm"
            >
              <span className="material-symbols-outlined text-xl">assignment</span>
              <span>{t.missions}</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('vault');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left cursor-pointer font-jakarta font-extrabold text-sm"
            >
              <span className="material-symbols-outlined text-xl">account_balance_wallet</span>
              <span>{t.vault}</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('agenda');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left cursor-pointer font-jakarta font-extrabold text-sm"
            >
              <span className="material-symbols-outlined text-xl">calendar_today</span>
              <span>{t.agenda}</span>
            </button>

            <button
              onClick={() => {
                onSelectTab('hero');
                onClose();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors text-left cursor-pointer font-jakarta font-extrabold text-sm"
            >
              <span className="material-symbols-outlined text-xl">sports_esports</span>
              <span>{t.profile}</span>
            </button>
          </div>
        </div>

        {/* Footer info & Manual Refresh button */}
        <div className="pt-6 border-t border-black/5 dark:border-white/10 text-center font-jakarta text-xs text-gray-500 dark:text-gray-400 font-semibold space-y-2">
          <button
            type="button"
            onClick={async () => {
              try {
                if ('serviceWorker' in navigator) {
                  const registrations = await navigator.serviceWorker.getRegistrations();
                  for (const r of registrations) {
                    await r.unregister();
                  }
                }
                if ('caches' in window) {
                  const keys = await caches.keys();
                  for (const key of keys) {
                    await caches.delete(key);
                  }
                }
              } catch (e) {
                console.error('[PWA-Purge]', e);
              }
              const cleanUrl = window.location.origin + window.location.pathname;
              window.location.href = `${cleanUrl}?v=${Date.now()}`;
            }}
            className="w-full py-2.5 px-3 rounded-full bg-[#1b1b1d] text-white dark:bg-[#d1c4e9] dark:text-[#1b1b1d] hover:opacity-90 text-xs font-extrabold flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
            <span>{profile.language === 'id' ? '🔄 Paksa Load Versi Terbaru' : '🔄 Force Load Latest Version'}</span>
          </button>

          <div>
            <p className="font-extrabold text-[#635979] dark:text-[#cdc1e5]">Student Life</p>
            <p>© 2026 Academic Companion Engine</p>
          </div>
        </div>
      </div>
    </>
  );
};
