import React, { useState } from 'react';
import { UserProfile, Badge } from '../types';
import { getTranslation } from '../utils/i18n';

interface HeroViewProps {
  profile: UserProfile;
  badges: Badge[];
  onOpenEditProfile: () => void;
  onOpenBadges: () => void;
  onToggleDarkMode: () => void;
  onToggleNotifications: () => void;
  onToggleLanguage: () => void;
  onLogout: () => void;
}

export const HeroView: React.FC<HeroViewProps> = ({
  profile,
  badges,
  onOpenEditProfile,
  onOpenBadges,
  onToggleDarkMode,
  onToggleNotifications,
  onToggleLanguage,
  onLogout,
}) => {
  const isIndonesian = profile.language === 'id';
  const t = getTranslation(profile.language);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const displayBadges = badges.slice(0, 4);

  return (
    <div className="pt-24 pb-32 md:pb-16 px-4 sm:px-6 max-w-md md:max-w-4xl lg:max-w-5xl mx-auto space-y-6">
      {/* Profile Header (Always Onyx Dark Card with Bright White Text) */}
      <section className="expressive-card expressive-card-onyx p-6 flex flex-col items-center text-center shadow-lg relative text-white">
        <div className="relative mb-3">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#d1c4e9] shadow-md">
            <img
              src={profile.avatarUrl}
              alt={profile.name}
              className="w-full h-full object-cover"
            />
          </div>
          <button
            onClick={onOpenEditProfile}
            aria-label={t.heroEditAvatarLabel}
            className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-[#d1c4e9] text-[#1f1732] flex items-center justify-center clay-raised cursor-pointer hover:scale-110 active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-sm font-bold">edit</span>
          </button>
        </div>

        <h2 className="font-jakarta font-black text-2xl text-white mb-0.5">
          {profile.name}
        </h2>
        <p className="font-jakarta text-xs font-extrabold text-[#d1c4e9] mb-1">
          {profile.role} • Level {profile.level}
        </p>
        {(() => {
          const locale = profile.language === 'id' ? 'id-ID' : 'en-US';
          const gpa = (typeof profile.gpa === 'number')
            ? profile.gpa.toLocaleString(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
            : profile.gpa;

          return (
            <div className="font-jakarta text-[11px] font-bold text-gray-400 mb-4">
              <div>{profile.university}</div>
              <div className="mt-1 text-[10px] opacity-75">{t.gpaLabel}</div>
              <div className="font-extrabold text-sm mt-0.5">{gpa}</div>
            </div>
          );
        })()}

        {/* Edit Profile Button */}
        <button
          onClick={onOpenEditProfile}
          className="bg-white/10 hover:bg-white/20 text-white px-5 py-2.5 rounded-full font-jakarta font-black text-xs flex items-center gap-2 border border-white/15 transition-all cursor-pointer shadow-sm hover:scale-105 active:scale-95"
        >
          <span className="material-symbols-outlined text-base">edit_square</span>
          <span>{t.editProfile}</span>
        </button>
      </section>

      {/* Heroic Badges Grid */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-jakarta font-black text-lg text-[#1b1b1d] dark:text-[#f3f0f2]">
            {t.heroicBadges}
          </h3>
          <button
            onClick={onOpenBadges}
            className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5] hover:underline cursor-pointer"
          >
            {t.seeAll}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {displayBadges.map((badge, idx) => {
            const cardBg =
              idx === 0
                ? 'expressive-card-lavender text-[#1f1732]'
                : idx === 1
                ? 'expressive-card-butter text-[#1f1c00]'
                : idx === 2
                ? 'expressive-card-coral text-[#410004]'
                : 'bg-[#d8e6c7] text-[#1a2d12]';

            return (
              <div
                key={badge.id}
                onClick={onOpenBadges}
                className={`expressive-card p-5 flex flex-col items-center justify-center text-center shadow-sm cursor-pointer hover:scale-[1.02] active:scale-95 transition-all ${cardBg}`}
              >
                <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center mb-3">
                  <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                </div>
                <h4 className="font-jakarta font-black text-sm">{badge.title}</h4>
              </div>
            );
          })}
        </div>
      </section>

      {/* System Config Section (Dark Onyx Card with Pure White & Off-White Text) */}
      <section className="space-y-3">
        <h3 className="font-jakarta font-black text-lg text-[#1b1b1d] dark:text-[#f3f0f2] px-1">
          {t.systemConfig}
        </h3>

        <div className="expressive-card expressive-card-onyx divide-y divide-white/10 overflow-hidden shadow-sm text-white">
          {/* Edit Profile Row */}
          <button
            onClick={onOpenEditProfile}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d1c4e9] text-[#1f1732] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">person_edit</span>
              </div>
              <div>
                <h4 className="font-jakarta font-black text-sm text-white">
                  {t.editProfileDetails}
                </h4>
                <p className="font-jakarta text-xs text-gray-300 font-bold">
                  {t.updateProfileDesc}
                </p>
              </div>
            </div>
            <span className="material-symbols-outlined text-gray-400">chevron_right</span>
          </button>

          {/* Language Switcher Row */}
          <button
            onClick={onToggleLanguage}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#ece28c] text-[#1f1c00] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">language</span>
              </div>
              <div>
                <h4 className="font-jakarta font-black text-sm text-white">
                  {t.appLanguage}
                </h4>
                <p className="font-jakarta text-xs text-gray-300 font-bold">
                  {t.switchLanguage}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full font-jakarta text-xs font-black border border-white/10 text-[#ece28c] clay-chip">
              <span>{isIndonesian ? '🇮🇩 Indonesia' : '🇬🇧 English'}</span>
              <span className="material-symbols-outlined text-sm">sync_alt</span>
            </div>
          </button>

          {/* Dark Mode Toggle */}
          <button
            type="button"
            onClick={onToggleDarkMode}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">dark_mode</span>
              </div>
              <div>
                <h4 className="font-jakarta font-black text-sm text-white">
                  {t.darkMode}
                </h4>
                <p className="font-jakarta text-xs text-gray-300 font-bold">
                  {t.darkModeDesc}
                </p>
              </div>
            </div>

            <div className="relative inline-flex items-center">
              <input
                type="checkbox"
                checked={profile.darkMode}
                readOnly
                className="sr-only peer"
              />
              <div className={`w-11 h-6 rounded-full transition-all relative ${profile.darkMode ? 'bg-[#d1c4e9]' : 'bg-white/20'}`}>
                <div className={`absolute top-[2px] left-[2px] bg-white border border-gray-300 rounded-full h-5 w-5 transition-transform ${profile.darkMode ? 'translate-x-5' : ''}`} />
              </div>
            </div>
          </button>

          {/* Notifications Toggle */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#d1c4e9] text-[#1f1732] flex items-center justify-center">
                <span className="material-symbols-outlined text-xl">notifications</span>
              </div>
              <div>
                <h4 className="font-jakarta font-black text-sm text-white">
                  {t.notificationsTitle}
                </h4>
                <p className="font-jakarta text-xs text-gray-300 font-bold">
                  {t.heroNotificationsDesc}
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
              <div className="w-11 h-6 bg-white/20 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#d1c4e9]" />
            </label>
          </div>
        </div>
      </section>

      {/* Sign Out Button */}
      <button
        id="sign-out-btn"
        onClick={() => setShowLogoutConfirm(true)}
        className="w-full bg-[#ffdad7] text-[#410004] py-4 rounded-full font-jakarta font-black text-sm flex items-center justify-center gap-2 shadow-sm hover:scale-[1.01] active:scale-95 transition-all cursor-pointer"
      >
        <span className="material-symbols-outlined text-xl">logout</span>
        <span>{t.signOut}</span>
      </button>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-5">
          <div className="w-full max-w-sm expressive-card expressive-card-onyx p-6 shadow-2xl border border-white/10 text-white space-y-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#ffdad7] flex items-center justify-center">
                <span className="material-symbols-outlined text-2xl text-[#410004]">logout</span>
              </div>
              <div>
                <h3 className="font-jakarta font-black text-base text-white">
                  {t.confirmSignOutTitle}
                </h3>
                <p className="font-jakarta text-xs text-gray-300 font-bold mt-0.5">
                  {t.confirmSignOutDesc}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                disabled={loggingOut}
                className="flex-1 py-3 rounded-full bg-white/10 hover:bg-white/20 font-jakarta font-black text-sm text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.cancel}
              </button>
              <button
                id="confirm-logout-btn"
                onClick={() => { setLoggingOut(true); onLogout(); }}
                disabled={loggingOut}
                className="flex-1 py-3 rounded-full bg-[#ffdad7] text-[#410004] font-jakarta font-black text-sm clay-raised hover:scale-[1.01] active:scale-95 transition-all cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loggingOut ? t.signingOut : t.confirmSignOutBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
