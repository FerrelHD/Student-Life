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
  const today = new Date();
  const [selectedDay, setSelectedDay] = useState(today.getDate());
  const [viewDate, setViewDate] = useState(() => new Date(today.getFullYear(), today.getMonth(), 1));

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const pad2 = (n: number) => String(n).padStart(2, '0');
  const monthKey = `${year}-${pad2(month + 1)}`;

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();
  const startWeekday = new Date(year, month, 1).getDay();
  const prevDays = Array.from({ length: startWeekday }, (_, i) => daysInPrevMonth - startWeekday + i + 1);
  const monthDays = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const locale = langKey === 'id' ? 'id-ID' : 'en-US';
  const monthLabel = viewDate.toLocaleDateString(locale, { month: 'long', year: 'numeric' });
  const monthShortLabel = viewDate.toLocaleDateString(locale, { month: 'short' }).toUpperCase();

  // Dot color per day of the displayed month, derived from real missions
  // (highest priority wins if more than one mission lands on the same day).
  const dotColorForDay: Record<number, string> = {};
  missions.forEach((m) => {
    if (!m.dateStr?.startsWith(monthKey)) return;
    const day = Number(m.dateStr.split('-')[2]);
    const color = m.priority === 'high' ? 'bg-[#ffb8b3]' : m.priority === 'medium' ? 'bg-[#ece28c]' : 'bg-[#d1c4e9]';
    if (!dotColorForDay[day] || m.priority === 'high') dotColorForDay[day] = color;
  });

  const isRealCurrentMonth = (y: number, m: number) => y === today.getFullYear() && m === today.getMonth();
  const goToMonth = (next: Date) => {
    setViewDate(next);
    setSelectedDay(isRealCurrentMonth(next.getFullYear(), next.getMonth()) ? today.getDate() : 1);
  };

  // Filter missions based on selected day (or fallback if all pending shown)
  // dateStr is "YYYY-MM-DD" — missions without one always show (no fixed date yet).
  const dayMissions = missions.filter((m) => {
    if (!m.dateStr) return true;
    return m.dateStr === `${monthKey}-${pad2(selectedDay)}`;
  });

  const displayedMissions = dayMissions.length > 0 ? dayMissions : missions.slice(0, 3);

  const [viewMode, setViewMode] = useState<'calendar' | 'timetable'>('calendar');

  const daysOfWeekNames = langKey === 'id' 
    ? ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']
    : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  return (
    <div className="pt-24 pb-32 md:pb-16 px-4 sm:px-6 max-w-md md:max-w-4xl lg:max-w-5xl mx-auto space-y-6">
      {/* View Switcher: Kalender Bulanan vs Jadwal Matkul Mingguan */}
      <div className="flex bg-white dark:bg-[#1e1e22] p-1.5 rounded-full border border-black/10 dark:border-white/10 font-jakarta text-xs font-bold shadow-sm">
        <button
          type="button"
          onClick={() => setViewMode('calendar')}
          className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewMode === 'calendar'
              ? 'bg-[#1b1b1d] text-white dark:bg-[#d1c4e9] dark:text-[#1b1b1d] shadow-sm'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">calendar_month</span>
          <span>{langKey === 'id' ? 'Kalender Agenda' : 'Calendar View'}</span>
        </button>
        <button
          type="button"
          onClick={() => setViewMode('timetable')}
          className={`flex-1 py-2 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            viewMode === 'timetable'
              ? 'bg-[#1b1b1d] text-white dark:bg-[#d1c4e9] dark:text-[#1b1b1d] shadow-sm'
              : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white'
          }`}
        >
          <span className="material-symbols-outlined text-base">view_week</span>
          <span>{langKey === 'id' ? 'Jadwal Matkul Mingguan' : 'Weekly Timetable'}</span>
        </button>
      </div>

      {viewMode === 'timetable' ? (
        /* Weekly Timetable View */
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h2 className="font-jakarta font-black text-xl text-[#1b1b1d] dark:text-[#f3f0f2]">
              {langKey === 'id' ? 'Jadwal Kuliah Mingguan' : 'Weekly Schedule'}
            </h2>
            <span className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5]">
              {langKey === 'id' ? 'Senin - Minggu' : 'Mon - Sun'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {daysOfWeekNames.map((dayName, index) => {
              const dayNum = index + 1;
              const dayClasses = missions.filter(
                (m) => m.dayOfWeek === dayNum || (m.tag === 'CLASS' && (m.dateStr ? new Date(m.dateStr).getDay() === (dayNum % 7) : false))
              );

              return (
                <div key={dayName} className="expressive-card expressive-card-onyx p-4 text-white border border-white/10">
                  <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
                    <h3 className="font-jakarta font-black text-base text-[#d1c4e9]">{dayName}</h3>
                    <span className="font-jakarta text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white/10">
                      {dayClasses.length} {langKey === 'id' ? 'Kelas' : 'Classes'}
                    </span>
                  </div>

                  {dayClasses.length > 0 ? (
                    <div className="space-y-2">
                      {dayClasses.map((c) => (
                        <div key={c.id} className="p-2.5 rounded-xl bg-white/10 text-xs font-jakarta space-y-0.5 border border-white/5">
                          <p className="font-black text-white text-sm">{c.title}</p>
                          <p className="font-bold text-gray-300">{c.course}</p>
                          <div className="flex justify-between text-[11px] text-[#d1c4e9] font-bold pt-1">
                            <span>🕒 {c.time || '08:00 WIB'}</span>
                            <span>📍 {c.location || 'R. Lecture'}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="font-jakarta text-xs text-gray-400 italic py-2">
                      {langKey === 'id' ? 'Tidak ada jadwal kelas' : 'No classes scheduled'}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <>
          {/* Calendar Section */}
          <section className="expressive-card expressive-card-onyx p-6 shadow-md text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-jakarta font-black text-lg text-white">{monthLabel}</h2>
          <div className="flex gap-2">
            <button
              onClick={() => goToMonth(new Date(year, month - 1, 1))}
              aria-label={langKey === 'id' ? 'Bulan sebelumnya' : 'Previous month'}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              onClick={() => goToMonth(new Date(year, month + 1, 1))}
              aria-label={langKey === 'id' ? 'Bulan berikutnya' : 'Next month'}
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
              className="aspect-square flex items-center justify-center font-jakarta text-sm text-gray-500 font-bold"
            >
              {d}
            </div>
          ))}

          {/* Current month days */}
          {monthDays.map((d) => {
            const isSelected = d === selectedDay;
            const dotColor = dotColorForDay[d];

            return (
              <button
                key={`day-${d}`}
                onClick={() => setSelectedDay(d)}
                className="aspect-square flex flex-col items-center justify-center relative rounded-full hover:bg-white/10 transition-all cursor-pointer"
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

                {dotColor && !isSelected && (
                  <div className={`w-2 h-2 rounded-full mt-0.5 shadow-sm ${dotColor}`} />
                )}
              </button>
            );
          })}
        </div>
      </section>

      {/* Today's Schedule Filtered Section */}
      <section className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div>
            <h2 className="font-jakarta font-black text-xl text-[#1b1b1d] dark:text-[#f3f0f2]">
              {t.scheduleFor} {monthShortLabel} {selectedDay}
            </h2>
            <span className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5]">
              {displayedMissions.length} {t.events}
            </span>
          </div>

          {/* Alarm Permission Trigger */}
          <button
            onClick={async () => {
              const { requestNotificationPermission } = await import('../utils/notificationEngine');
              const granted = await requestNotificationPermission();
              alert(granted
                ? (langKey === 'id' ? '✅ Reminder Notifikasi Aktif! Kamu akan dapat alarm 15-30 menit sebelum event.' : '✅ Notification Reminder Active!')
                : (langKey === 'id' ? '⚠️ Izin notifikasi ditolak/tidak didukung.' : '⚠️ Notification permission denied.')
              );
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 dark:bg-white/10 text-xs font-extrabold text-[#1b1b1d] dark:text-[#f3f0f2] hover:scale-105 transition-all cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm text-amber-500">notifications_active</span>
            <span>{langKey === 'id' ? 'Aktifkan Reminder Alarm' : 'Enable Reminder Alarm'}</span>
          </button>
        </div>

        <div className="space-y-3">
          {displayedMissions.map((mission) => (
            <div
              key={mission.id}
              className={`expressive-card p-5 shadow-sm relative group ${
                mission.priority === 'high'
                  ? 'expressive-card-coral'
                  : mission.priority === 'medium'
                  ? 'expressive-card-butter'
                  : 'expressive-card-lavender'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-black/10 font-jakarta font-black text-[10px] uppercase">
                    {mission.tag || (mission.priority === 'high' ? t.urgent : mission.priority === 'medium' ? t.normal : t.later)}
                  </span>
                  {mission.completed && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 font-jakarta font-black text-[9px]">
                      COMPLETED
                    </span>
                  )}
                </div>

                {/* Export Calendar Dropdown / Actions */}
                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    title={langKey === 'id' ? 'Export ke iCal (.ics)' : 'Export to iCal (.ics)'}
                    onClick={(e) => {
                      e.stopPropagation();
                      import('../utils/calendarExport').then((m) => m.downloadIcsFile(mission));
                    }}
                    className="p-1.5 rounded-full bg-black/5 hover:bg-black/15 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">calendar_add_on</span>
                    <span className="hidden sm:inline text-[10px]">.ICS</span>
                  </button>

                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      import('../utils/calendarExport').then((m) => {
                        window.open(m.getGoogleCalendarUrl(mission), '_blank');
                      });
                    }}
                    title={langKey === 'id' ? 'Tambah ke Google Calendar' : 'Add to Google Calendar'}
                    className="p-1.5 rounded-full bg-black/5 hover:bg-black/15 transition-colors cursor-pointer text-xs font-bold flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-sm">edit_calendar</span>
                    <span className="hidden sm:inline text-[10px]">Google</span>
                  </a>
                </div>
              </div>

              <div onClick={() => onToggleMission(mission.id)} className="cursor-pointer">
                <h3 className={`font-jakarta font-black text-lg ${mission.completed ? 'line-through opacity-70' : ''}`}>
                  {mission.title}
                </h3>
                <p className="font-jakarta text-xs font-bold opacity-80 mt-0.5">{mission.course}</p>

                <div className="flex flex-wrap items-center justify-between gap-2 mt-3 pt-2 border-t border-black/5 dark:border-white/10 text-xs font-bold opacity-90">
                  <div className="flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-sm">schedule</span>
                    <span>{mission.time || 'All Day'}</span>
                    {mission.location && <span>• 📍 {mission.location}</span>}
                  </div>
                  <span className="text-[11px] opacity-75">{mission.dueDate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
        </>
      )}

      {/* Floating Add Mission Button */}
      <button
        onClick={onOpenAddMission}
        className="fixed bottom-24 right-6 w-14 h-14 rounded-full bg-[#1b1b1d] text-white dark:bg-[#d1c4e9] dark:text-[#1b1b1d] flex items-center justify-center clay-raised z-40 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
        title="Add New Event"
      >
        <span className="material-symbols-outlined text-3xl">add</span>
      </button>
    </div>
  );
};
