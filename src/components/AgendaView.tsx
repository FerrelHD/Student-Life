import React, { useState } from 'react';
import { Mission, LanguageType } from '../types';
import { getTranslation } from '../utils/i18n';

interface AgendaViewProps {
  missions: Mission[];
  language?: LanguageType;
  onOpenAddMission: () => void;
  onToggleMission: (id: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  missions,
  language = 'id',
  onOpenAddMission,
  onToggleMission,
}) => {
  const langKey = (language as LanguageType) || 'id';
  const t = getTranslation(langKey);
  const [selectedDay, setSelectedDay] = useState(26);
  const [currentMonth, setCurrentMonth] = useState(language === 'id' ? 'Juli 2026' : 'July 2026');

  // Calendar days setup matching July 2026
  const prevDays = [28, 29, 30];
  const monthDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const daysWithDots = [12, 16, 26, 27, 28];

  const priorityColorMap: Record<number, string> = {
    12: 'bg-[#ece28c]', // Lab / Medium
    16: 'bg-[#ffb8b3]', // Exam / High
    26: 'bg-[#ffb8b3]', // Critical Deadline / High
    27: 'bg-[#ece28c]', // Quiz / Medium
    28: 'bg-[#d1c4e9]', // Paper / Low
  };

  // Filter missions based on selected day (or fallback if all pending shown)
  // dateStr is "YYYY-MM-DD" — compare the day number directly, not a substring
  // match (which wrongly matched e.g. day "2" against "...-12", "...-26", etc.)
  const dayMissions = missions.filter((m) => {
    if (!m.dateStr) return true;
    return Number(m.dateStr.split('-')[2]) === selectedDay;
  });

  const displayedMissions = dayMissions.length > 0 ? dayMissions : missions.slice(0, 3);

  return (
    <div className="pt-24 pb-32 px-5 max-w-md md:max-w-4xl mx-auto space-y-6">
      {/* Calendar Section */}
      <section className="expressive-card expressive-card-onyx p-6 shadow-md text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-jakarta font-black text-lg text-white">{currentMonth}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentMonth(language === 'id' ? 'Juni 2026' : 'June 2026')}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              onClick={() => setCurrentMonth(language === 'id' ? 'Agustus 2026' : 'August 2026')}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayLabel, idx) => (
            <span key={idx} className="font-jakarta text-xs font-black text-gray-300">
              {dayLabel}
            </span>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {/* Preceding placeholder days */}
          {prevDays.map((d) => (
            <div
              key={`prev-${d}`}
              className="h-10 flex items-center justify-center font-jakarta text-sm text-gray-500 font-bold"
            >
              {d}
            </div>
          ))}

          {/* Current month days */}
          {monthDays.map((d) => {
            const isSelected = d === selectedDay;
            const hasDot = daysWithDots.includes(d);

            return (
              <button
                key={`day-${d}`}
                onClick={() => setSelectedDay(d)}
                className="h-10 flex flex-col items-center justify-center relative rounded-full hover:bg-white/10 transition-all cursor-pointer"
              >
                {isSelected && (
                  <div className="absolute inset-1 rounded-full bg-[#d1c4e9]" />
                )}

                <span
                  className={`font-jakarta text-sm font-black z-10 ${
                    isSelected ? 'text-[#1f1732]' : 'text-white'
                  }`}
                >
                  {d}
                </span>

                {hasDot && !isSelected && (
                  <div className={`w-2 h-2 rounded-full mt-0.5 shadow-sm ${priorityColorMap[d] || 'bg-[#d1c4e9]'}`} />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Today's Schedule Filtered Section */}
      <section className="space-y-4">
        <div className="flex items-end justify-between px-1">
          <h2 className="font-jakarta font-black text-xl text-[#1b1b1d] dark:text-[#f3f0f2]">
            {t.scheduleFor} JUL {selectedDay}
          </h2>
          <span className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5]">
            {displayedMissions.length} {t.events}
          </span>
        </div>

        <div className="space-y-3">
          {displayedMissions.map((mission) => (
            <div
              key={mission.id}
              onClick={() => onToggleMission(mission.id)}
              className={`expressive-card p-5 cursor-pointer shadow-sm ${
                mission.priority === 'high'
                  ? 'expressive-card-coral'
                  : mission.priority === 'medium'
                  ? 'expressive-card-butter'
                  : 'expressive-card-lavender'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="px-2.5 py-0.5 rounded-full bg-black/10 font-jakarta font-black text-[10px] uppercase">
                  {mission.priority === 'high' ? t.urgent : mission.priority === 'medium' ? t.normal : t.later}
                </span>
                <span className="font-jakarta text-xs font-bold opacity-80">{mission.dueDate}</span>
              </div>

              <h3 className={`font-jakarta font-black text-lg ${mission.completed ? 'line-through opacity-70' : ''}`}>
                {mission.title}
              </h3>
              <p className="font-jakarta text-xs font-bold opacity-80 mt-0.5">{mission.course}</p>

              {mission.time && (
                <div className="flex items-center gap-1.5 mt-3 text-xs font-bold opacity-90">
                  <span className="material-symbols-outlined text-sm">schedule</span>
                  <span>{mission.time}</span>
                  {mission.location && <span>• {mission.location}</span>}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Floating Add Mission Button */}
      <button
        onClick={onOpenAddMission}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#1b1b1d] text-white dark:bg-[#d1c4e9] dark:text-[#1b1b1d] flex items-center justify-center shadow-2xl z-40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        title="Add New Event"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};
