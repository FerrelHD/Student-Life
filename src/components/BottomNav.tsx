import React from 'react';
import { TabType, LanguageType } from '../types';
import { getTranslation } from '../utils/i18n';

interface BottomNavProps {
  activeTab: TabType;
  language?: LanguageType;
  onSelectTab: (tab: TabType) => void;
  darkMode?: boolean;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  language = 'id',
  onSelectTab,
  darkMode = false,
}) => {
  const langKey = (language as LanguageType) || 'id';
  const t = getTranslation(langKey);

  const tabs: { id: TabType; label: string; icon: string }[] = [
    { id: 'dashboard', label: t.dashboard, icon: 'home' },
    { id: 'missions', label: t.missions, icon: 'assignment' },
    { id: 'vault', label: t.vault, icon: 'account_balance_wallet' },
    { id: 'agenda', label: t.agenda, icon: 'calendar_today' },
    { id: 'hero', label: t.profile, icon: 'sports_esports' },
  ];

  // iOS spring cubic-bezier
  const spring = 'cubic-bezier(0.34, 1.45, 0.64, 1)';
  const ease   = 'cubic-bezier(0.4, 0, 0.2, 1)';

  // Glass colours per mode
  const navBg      = darkMode ? 'rgba(28,26,38,0.58)'  : 'rgba(255,255,255,0.22)';
  const navBorder  = darkMode ? 'rgba(255,255,255,0.13)' : 'rgba(255,255,255,0.45)';
  const navShadow  = darkMode
    ? '0 8px 40px rgba(0,0,0,0.40), inset 0 1.5px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.28)'
    : '0 8px 40px rgba(0,0,0,0.10), inset 0 1.5px 0 rgba(255,255,255,0.70), inset 0 -1px 0 rgba(0,0,0,0.05)';

  const activeBg     = darkMode ? 'rgba(255,255,255,0.16)' : 'rgba(255,255,255,0.58)';
  const activeShadow = darkMode
    ? '0 2px 14px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.28)'
    : '0 2px 14px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.85)';
  const activeBorder = darkMode ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.62)';
  const activeColor  = darkMode ? '#f3f0f2' : '#1b1b1d';
  const inactiveColor = darkMode ? 'rgba(255,255,255,0.46)' : 'rgba(0,0,0,0.42)';
  const specular = darkMode
    ? 'linear-gradient(90deg, transparent, rgba(255,255,255,0.26), transparent)'
    : 'linear-gradient(90deg, transparent, rgba(255,255,255,0.90), transparent)';

  return (
    <div className="md:hidden fixed bottom-6 left-0 right-0 z-40 px-5 flex justify-center pointer-events-none">
      <nav
        className="pointer-events-auto relative flex items-center gap-0.5 px-2 py-2 rounded-full max-w-sm w-full justify-between overflow-hidden"
        style={{
          background: navBg,
          backdropFilter: 'blur(36px) saturate(200%)',
          WebkitBackdropFilter: 'blur(36px) saturate(200%)',
          border: `1px solid ${navBorder}`,
          boxShadow: navShadow,
          // Smooth nav-level colour transition (e.g. dark mode toggle)
          transition: `background 500ms ${ease}, border-color 500ms ${ease}, box-shadow 500ms ${ease}`,
        }}
      >
        {/* Top specular highlight */}
        <div
          className="absolute inset-x-6 top-0 h-px rounded-full pointer-events-none"
          style={{ background: specular, transition: `background 500ms ${ease}` }}
        />

        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className="relative flex items-center justify-center gap-1 rounded-full font-jakarta font-extrabold text-xs select-none"
              style={{
                // Pill sizing — smooth width expansion via padding transition
                paddingTop: '10px',
                paddingBottom: '10px',
                paddingLeft: isActive ? '14px' : '12px',
                paddingRight: isActive ? '14px' : '12px',

                // Glass surface
                background: isActive ? activeBg : 'transparent',
                backdropFilter: isActive ? 'blur(20px)' : 'none',
                WebkitBackdropFilter: isActive ? 'blur(20px)' : 'none',
                boxShadow: isActive ? activeShadow : 'none',
                border: `1px solid ${isActive ? activeBorder : 'transparent'}`,

                // Text / icon colour
                color: isActive ? activeColor : inactiveColor,

                // Smooth spring transition on ALL properties
                transition: [
                  `padding 420ms ${spring}`,
                  `background 360ms ${ease}`,
                  `box-shadow 360ms ${ease}`,
                  `border-color 360ms ${ease}`,
                  `color 300ms ${ease}`,
                  `transform 200ms ${spring}`,
                ].join(', '),

                willChange: 'transform, background, padding',
                cursor: 'pointer',
                flexShrink: 0,
                minWidth: 0,
              }}
              // Subtle press scale
              onMouseDown={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.90)'; }}
              onMouseUp={(e)   => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
              onTouchStart={(e) => { (e.currentTarget as HTMLElement).style.transform = 'scale(0.90)'; }}
              onTouchEnd={(e)   => { (e.currentTarget as HTMLElement).style.transform = 'scale(1)'; }}
            >
              {/* Icon */}
              <span
                className={`material-symbols-outlined flex-shrink-0 ${isActive ? 'material-symbols-filled' : ''}`}
                style={{
                  fontSize: '21px',
                  transition: `font-variation-settings 300ms ${ease}, color 300ms ${ease}`,
                }}
              >
                {tab.icon}
              </span>

              {/* Label — slides in with clip + opacity */}
              <span
                style={{
                  maxWidth: isActive ? '64px' : '0px',
                  opacity: isActive ? 1 : 0,
                  overflow: 'hidden',
                  whiteSpace: 'nowrap',
                  display: 'inline-block',
                  transition: [
                    `max-width 420ms ${spring}`,
                    `opacity 280ms ${ease}`,
                  ].join(', '),
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
};
