import React, { useState } from 'react';
import { Mission, LanguageType } from '../types';
import { getTranslation } from '../utils/i18n';

interface MissionsViewProps {
  missions: Mission[];
  language?: LanguageType;
  onToggleMission: (id: string) => void;
  onOpenAddMission: () => void;
  onOpenDailyQuiz: () => void;
  onClaimStreakBonus: () => void;
  onEditMission: (mission: Mission) => void;
  onDeleteMission: (id: string) => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  missions,
  language = 'id',
  onToggleMission,
  onOpenAddMission,
  onOpenDailyQuiz,
  onClaimStreakBonus,
  onEditMission,
  onDeleteMission,
}) => {
  const langKey = (language as LanguageType) || 'id';
  const t = getTranslation(langKey);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMissions = missions.filter((m) =>
    m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.course.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dynamic Weekly Goal calculation
  const completedCount = missions.filter((m) => m.completed).length;
  const totalCount = Math.max(missions.length, 1);
  const goalPct = Math.round((completedCount / totalCount) * 100);

  const getMissionCardStyle = (priority: string, completed: boolean) => {
    if (completed) return 'bg-[#f0edef] text-[#1b1b1d] dark:bg-[#1e1e22] dark:text-[#f3f0f2] opacity-60';
    if (priority === 'high') return 'expressive-card-coral';
    if (priority === 'medium') return 'expressive-card-butter';
    return 'expressive-card-lavender';
  };

  const getTagIcon = (tag: string) => {
    switch (tag) {
      case 'LAB':
        return 'science';
      case 'EXAM':
        return 'quiz';
      case 'PAPER':
        return 'description';
      case 'CODE':
        return 'terminal';
      default:
        return 'assignment';
    }
  };

  return (
    <div className="pt-24 pb-32 md:pb-16 px-5 max-w-md md:max-w-4xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchMissions}
          className="w-full bg-white dark:bg-[#1e1e22] text-[#1b1b1d] dark:text-[#f3f0f2] border border-black/10 dark:border-white/10 rounded-full py-3.5 pl-12 pr-4 font-jakarta text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
        />
      </div>

      {/* Weekly Goal Banner */}
      <section className="expressive-card expressive-card-lavender p-6 relative overflow-hidden shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="inline-block bg-[#1b1b1d] text-white px-3 py-1 rounded-full font-jakarta font-extrabold text-[10px] tracking-wider uppercase mb-2">
              {t.weeklyGoal}
            </span>
            <h2 className="font-jakarta font-black text-2xl tracking-tight">{t.finishMissions}</h2>
            <p className="font-jakarta text-xs font-bold opacity-80 mt-1">
              {t.completedOf.replace('{completed}', String(completedCount)).replace('{total}', String(totalCount))}
            </p>
          </div>

          <div className="text-right flex flex-col items-end">
            <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center mb-1">
              <span className="material-symbols-outlined text-2xl">emoji_events</span>
            </div>
            <span className="font-jakarta font-black text-3xl">{goalPct}%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full bg-black/15 h-3.5 rounded-full overflow-hidden">
          <div className="bg-[#1b1b1d] h-full rounded-full transition-all duration-700" style={{ width: `${goalPct}%` }} />
        </div>
      </section>

      {/* Active Missions Header & List */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-jakarta font-black text-xl text-[#1b1b1d] dark:text-[#f3f0f2]">
            {t.activeMissions}
          </h3>
          <span className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5]">
            {missions.filter((m) => !m.completed).length} {t.pending}
          </span>
        </div>

        {filteredMissions.length === 0 && (
          <div className="text-center py-10 space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#635979] dark:text-[#cdc1e5] opacity-60">assignment</span>
            <p className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5]">{t.noMissions}</p>
            <button
              onClick={onOpenAddMission}
              className="font-jakarta text-xs font-black text-[#1b1b1d] dark:text-[#d1c4e9] underline cursor-pointer"
            >
              {t.addMissionBtn}
            </button>
          </div>
        )}

        <div className="space-y-3">
          {filteredMissions.map((mission) => {
            const cardBgClass = getMissionCardStyle(mission.priority, mission.completed);
            return (
              <div
                key={mission.id}
                className={`expressive-card p-4 flex items-center justify-between shadow-sm cursor-pointer ${cardBgClass}`}
                onClick={() => onToggleMission(mission.id)}
              >
                <div className="flex items-center gap-3.5 flex-1 pr-3">
                  <div className="w-12 h-12 rounded-full bg-black/10 flex items-center justify-center flex-shrink-0">
                    <span className="material-symbols-outlined text-2xl">
                      {getTagIcon(mission.tag)}
                    </span>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="px-2 py-0.5 rounded-full bg-black/10 font-jakarta font-black text-[10px] uppercase">
                        {mission.priority === 'high' ? t.urgent : mission.priority === 'medium' ? t.normal : t.later}
                      </span>
                      <span className="font-jakarta text-xs font-bold opacity-80">{mission.dueDate}</span>
                    </div>
                    <h4 className={`font-jakarta font-extrabold text-base leading-snug ${mission.completed ? 'line-through opacity-70' : ''}`}>
                      {mission.title}
                    </h4>
                    <p className="font-jakarta text-xs font-bold opacity-80">{mission.course}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Edit / Delete */}
                  <button
                    type="button"
                    aria-label={language === 'id' ? 'Edit misi' : 'Edit mission'}
                    onClick={(e) => {
                      e.stopPropagation();
                      onEditMission(mission);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    type="button"
                    aria-label={language === 'id' ? 'Hapus misi' : 'Delete mission'}
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm(t.deleteConfirm)) onDeleteMission(mission.id);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-black/10 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>

                  {/* Round Checkbox */}
                  <div
                    className={`w-8 h-8 rounded-full border-2 border-current flex items-center justify-center flex-shrink-0 transition-transform ${
                      mission.completed ? 'bg-current' : ''
                    }`}
                  >
                    {mission.completed && (
                      <span className="material-symbols-outlined text-sm font-bold text-white">check</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Extra XP Opportunities */}
      <section className="space-y-3 pt-2">
        <h3 className="font-jakarta font-black text-lg text-[#1b1b1d] dark:text-[#f3f0f2]">
          {t.extraXpOpportunities}
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onOpenDailyQuiz}
            className="expressive-card expressive-card-onyx p-5 text-center flex flex-col items-center justify-center text-white cursor-pointer hover:scale-[1.03] active:scale-95 transition-all shadow-md group"
          >
            <div className="w-12 h-12 rounded-full bg-[#ece28c] text-[#1f1c00] flex items-center justify-center mb-3 group-hover:rotate-12 transition-transform">
              <span className="material-symbols-outlined text-2xl font-bold">psychology</span>
            </div>
            <h4 className="font-jakarta font-extrabold text-sm text-white mb-1">{t.dailyQuiz}</h4>
            <p className="font-jakarta text-xs font-extrabold text-[#ece28c]">{t.startQuiz}</p>
          </button>

          <button
            onClick={onClaimStreakBonus}
            className="expressive-card expressive-card-onyx p-5 text-center flex flex-col items-center justify-center text-white cursor-pointer hover:scale-[1.03] active:scale-95 transition-all shadow-md group"
          >
            <div className="w-12 h-12 rounded-full bg-[#ffb8b3] text-[#410004] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <span className="material-symbols-outlined text-2xl font-bold">local_fire_department</span>
            </div>
            <h4 className="font-jakarta font-extrabold text-sm text-white mb-1">{t.streakBonus}</h4>
            <p className="font-jakarta text-xs font-extrabold text-[#ffb8b3]">{t.claimBonus}</p>
          </button>
        </div>
      </section>

      {/* Floating Add Mission Button */}
      <button
        onClick={onOpenAddMission}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#1b1b1d] text-white dark:bg-[#d1c4e9] dark:text-[#1b1b1d] flex items-center justify-center clay-raised z-40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        title="Add Mission"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};
