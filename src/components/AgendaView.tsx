import React, { useState } from 'react';
import { Mission } from '../types';

interface AgendaViewProps {
  missions: Mission[];
  onOpenAddMission: () => void;
  onToggleMission: (id: string) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  missions,
  onOpenAddMission,
  onToggleMission,
}) => {
  const [selectedDay, setSelectedDay] = useState(12);
  const [currentMonth, setCurrentMonth] = useState('October 2023');

  // Calendar days setup matching October 2023
  const prevDays = [26, 27, 28, 29, 30];
  const octDays = Array.from({ length: 31 }, (_, i) => i + 1);
  const daysWithDots = [3, 5, 7, 12, 16, 20];

  return (
    <div className="pt-24 pb-32 px-5 max-w-6xl mx-auto space-y-6 min-h-screen">
      {/* Calendar Section */}
      <section className="mb-6">
        <div className="glass-panel rounded-2xl p-6 spider-glow">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-jakarta font-bold text-lg text-white">{currentMonth}</h2>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentMonth('September 2023')}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-[#e4beb9]"
              >
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button
                onClick={() => setCurrentMonth('November 2023')}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-[#e4beb9]"
              >
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((dayLabel, idx) => (
              <span key={idx} className="font-mono-code text-xs text-[#e4beb9]/60">
                {dayLabel}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {/* Preceding placeholder days */}
            {prevDays.map((d) => (
              <div
                key={`prev-${d}`}
                className="h-10 flex items-center justify-center font-inter text-sm text-[#e4beb9]/20"
              >
                {d}
              </div>
            ))}

            {/* Current month days */}
            {octDays.map((d) => {
              const isSelected = d === selectedDay;
              const hasDot = daysWithDots.includes(d);

              return (
                <button
                  key={`day-${d}`}
                  onClick={() => setSelectedDay(d)}
                  className="h-10 flex flex-col items-center justify-center relative rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                >
                  {isSelected && (
                    <div className="absolute inset-1 rounded-full border border-[#ff544c]/60 bg-[#ff544c]/10" />
                  )}

                  <span
                    className={`font-inter text-sm z-10 ${
                      isSelected ? 'font-bold text-[#ff544c]' : 'text-[#e5e2e1]'
                    }`}
                  >
                    {d}
                  </span>

                  {hasDot && !isSelected && (
                    <div className="w-1 h-1 rounded-full bg-[#ff544c] mt-0.5" />
                  )}
                  {hasDot && isSelected && (
                    <div className="absolute bottom-1 w-1 h-1 rounded-full bg-[#ff544c]" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Today's Focus */}
      <section className="space-y-4">
        <div className="flex items-end justify-between mb-2">
          <h2 className="font-jakarta text-2xl font-bold text-white uppercase">TODAY'S FOCUS</h2>
          <span className="font-mono-code text-xs text-[#e4beb9] uppercase tracking-widest">
            OCT {selectedDay}, 2023
          </span>
        </div>

        <div className="space-y-3">
          {/* Item 1 - Critical Exam */}
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col hover:scale-[1.01] transition-transform duration-200 border-l-4 border-l-[#ff544c]">
            <div className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="font-mono-code text-xs text-[#ff544c] font-semibold">
                  [EXAM]
                </span>
                <span className="font-mono-code text-[11px] text-[#ff544c] font-bold bg-[#ff544c]/10 px-2 py-0.5 rounded uppercase">
                  CRITICAL
                </span>
              </div>

              <div>
                <h3 className="font-jakarta font-bold text-lg text-white">
                  Mid-Term: Applied Neural Networks
                </h3>
                <p className="font-inter text-sm text-[#e4beb9]/70">Computer Science 402</p>
              </div>

              <div className="flex items-center gap-5 mt-2">
                <div className="flex items-center gap-1.5 text-[#e4beb9]/80">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span className="font-mono-code text-xs">14:30 - 16:30</span>
                </div>

                <div className="flex items-center gap-1.5 text-[#e4beb9]/80">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  <span className="font-mono-code text-xs">Hall B-12</span>
                </div>
              </div>
            </div>
          </div>

          {/* Item 2 - Urgent Lab */}
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col hover:scale-[1.01] transition-transform duration-200">
            <div className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="font-mono-code text-xs text-[#a2c9ff] font-semibold">
                  [LAB]
                </span>
                <span className="font-mono-code text-[11px] text-[#a2c9ff] font-bold bg-[#3394f1]/20 px-2 py-0.5 rounded uppercase">
                  URGENT
                </span>
              </div>

              <div>
                <h3 className="font-jakarta font-bold text-lg text-white">
                  Asynchronous Data Analysis
                </h3>
                <p className="font-inter text-sm text-[#e4beb9]/70">Advanced Statistics</p>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-[#e4beb9]/80">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span className="font-mono-code text-xs">18:00 DEADLINE</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden">
                <div className="bg-gradient-to-r from-[#ff544c] to-[#ffb4ac] h-full w-[65%]" />
              </div>
            </div>
          </div>

          {/* Item 3 - Routine Reading */}
          <div className="glass-panel rounded-2xl overflow-hidden flex flex-col hover:scale-[1.01] transition-transform duration-200 opacity-80">
            <div className="p-5 flex flex-col gap-2">
              <div className="flex justify-between items-start">
                <span className="font-mono-code text-xs text-[#e4beb9]/60 font-semibold">
                  [READ]
                </span>
                <span className="font-mono-code text-[11px] text-[#e4beb9]/60 font-bold bg-white/5 px-2 py-0.5 rounded uppercase">
                  ROUTINE
                </span>
              </div>

              <div>
                <h3 className="font-jakarta font-bold text-lg text-white">
                  Psychology of Interface Design
                </h3>
                <p className="font-inter text-sm text-[#e4beb9]/70">UX Foundations</p>
              </div>

              <div className="flex items-center gap-4 mt-2">
                <div className="flex items-center gap-1.5 text-[#e4beb9]/80">
                  <span className="material-symbols-outlined text-base">schedule</span>
                  <span className="font-mono-code text-xs">Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Floating Action Button */}
      <button
        onClick={onOpenAddMission}
        className="fixed bottom-24 right-6 w-14 h-14 bg-[#ff544c] text-[#5c0005] rounded-xl shadow-lg flex items-center justify-center hover:scale-105 active:scale-95 transition-transform z-40 group cursor-pointer"
        title="Add Event / Agenda Item"
      >
        <span className="material-symbols-outlined text-3xl font-bold group-hover:rotate-90 transition-transform">
          add
        </span>
      </button>
    </div>
  );
};
