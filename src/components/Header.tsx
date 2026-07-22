import React from 'react';
import { TabType } from '../types';
import { AVATARS } from '../data/initialData';

interface HeaderProps {
  activeTab: TabType;
  onOpenMenu: () => void;
  onOpenProfile: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, onOpenMenu, onOpenProfile }) => {
  const getTitleAndSubtitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return {
          title: 'STUDENT LIFE',
          status: '[ MISSION STATUS: ACTIVE ]',
          avatar: AVATARS.dashboard,
        };
      case 'missions':
        return {
          title: 'MISSIONS',
          status: null,
          avatar: AVATARS.missions,
        };
      case 'vault':
        return {
          title: 'THE VAULT',
          status: null,
          avatar: AVATARS.vault,
        };
      case 'agenda':
        return {
          title: 'AGENDA',
          status: null,
          avatar: AVATARS.agenda,
        };
      case 'hero':
        return {
          title: 'STUDENT LIFE',
          status: null,
          avatar: AVATARS.heroHeader,
        };
      default:
        return {
          title: 'STUDENT LIFE',
          status: null,
          avatar: AVATARS.dashboard,
        };
    }
  };

  const info = getTitleAndSubtitle();

  return (
    <header className="fixed top-0 w-full z-40 bg-[#131313]/80 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-5 h-16 transition-all duration-200">
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenMenu}
          className="p-1 rounded-lg hover:bg-white/5 active:scale-95 transition-transform text-[#ff544c]"
          title="Open Menu"
        >
          <span className="material-symbols-outlined text-2xl leading-none">menu</span>
        </button>
        <h1 className="font-jakarta font-black tracking-tighter text-2xl text-[#ff544c] uppercase">
          {info.title}
        </h1>
      </div>

      <div className="flex items-center gap-3">
        {info.status && (
          <span className="font-mono-code text-xs text-[#e4beb9] hidden md:block uppercase tracking-widest">
            {info.status}
          </span>
        )}
        
        {activeTab === 'missions' && (
          <button 
            onClick={() => {}} 
            className="p-2 rounded-full hover:bg-white/5 text-[#e4beb9] transition-colors"
            title="Search missions"
          >
            <span className="material-symbols-outlined text-xl">search</span>
          </button>
        )}

        <button
          onClick={onOpenProfile}
          className="w-10 h-10 rounded-full border-2 border-[#ff544c]/40 overflow-hidden hover:opacity-80 active:scale-95 transition-all shadow-[0_0_10px_rgba(255,84,76,0.2)]"
        >
          <img
            src={info.avatar}
            alt="Profile Avatar"
            className="w-full h-full object-cover"
          />
        </button>
      </div>
    </header>
  );
};
