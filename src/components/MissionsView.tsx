import React, { useState } from 'react';
import { Mission, PriorityType } from '../types';

interface MissionsViewProps {
  missions: Mission[];
  onToggleMission: (id: string) => void;
  onOpenAddMission: () => void;
}

export const MissionsView: React.FC<MissionsViewProps> = ({
  missions,
  onToggleMission,
  onOpenAddMission,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Pending' | 'Priority' | 'Done'>('All');

  const filteredMissions = missions.filter((mission) => {
    // Search matching
    const matchesSearch =
      mission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mission.tag.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    // Filter matching
    if (activeFilter === 'Pending') return !mission.completed;
    if (activeFilter === 'Done') return mission.completed;
    if (activeFilter === 'Priority') return mission.priority === 'high' && !mission.completed;

    return true;
  });

  const completedCount = missions.filter((m) => m.completed).length;
  const totalCount = missions.length;
  const completionPercentage = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 85;

  return (
    <div className="pt-24 pb-32 px-5 max-w-6xl mx-auto space-y-8 min-h-screen">
      {/* Search and Filter Section */}
      <section className="space-y-4">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#e4beb9]/60 group-focus-within:text-[#ff544c] transition-colors">
            search
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Scan for active missions..."
            className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl py-4 pl-12 pr-4 focus:outline-none focus:border-[#ff544c] focus:ring-1 focus:ring-[#ff544c] transition-all font-inter text-sm placeholder:text-[#e4beb9]/40 text-white"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 no-scrollbar">
          {(['All', 'Pending', 'Priority', 'Done'] as const).map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-5 py-2 rounded-full font-mono-code text-xs whitespace-nowrap active:scale-95 transition-all flex items-center gap-1 cursor-pointer ${
                  isActive
                    ? 'bg-[#ff544c] text-[#5c0005] font-bold shadow-lg shadow-[#ff544c]/20'
                    : 'glass-panel text-[#e4beb9] hover:bg-white/5'
                }`}
              >
                {filter === 'Priority' && (
                  <span className="material-symbols-outlined text-sm material-symbols-filled">
                    priority_high
                  </span>
                )}
                {filter}
              </button>
            );
          })}
        </div>
      </section>

      {/* Mission Grid (Bento Style) */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMissions.map((mission) => {
          const isHighPriority = mission.priority === 'high';

          return (
            <div
              key={mission.id}
              className={`glass-card rounded-2xl p-6 relative group transition-all duration-300 ${
                isHighPriority ? 'border-l-4 border-l-[#ff544c]' : ''
              } ${mission.completed ? 'opacity-50 scale-[0.98]' : ''}`}
            >
              <div className="absolute top-4 right-4">
                <span
                  className={`font-mono-code text-xs ${
                    isHighPriority
                      ? 'text-[#ff544c]'
                      : mission.tag === 'LAB' || mission.tag === 'CODE'
                      ? 'text-[#a2c9ff]'
                      : 'text-[#e4beb9]/60'
                  }`}
                >
                  [{mission.tag}]
                </span>
              </div>

              <div className="flex justify-between items-start mb-4 pr-12">
                <div>
                  <h3
                    className={`font-jakarta text-lg font-bold mb-1 transition-colors ${
                      mission.completed
                        ? 'line-through text-white/50'
                        : 'text-white group-hover:text-[#ff544c]'
                    }`}
                  >
                    {mission.title}
                  </h3>
                  <p className="font-inter text-sm text-[#e4beb9]/60">{mission.course}</p>
                </div>

                <div className="relative flex items-center justify-center flex-shrink-0 mt-0.5">
                  <input
                    type="checkbox"
                    checked={mission.completed}
                    onChange={() => onToggleMission(mission.id)}
                    className="appearance-none w-6 h-6 border-2 border-[#ff544c]/40 rounded-md checked:bg-[#ff544c] checked:border-[#ff544c] cursor-pointer transition-all"
                  />
                  {mission.completed && (
                    <span className="material-symbols-outlined absolute pointer-events-none text-[#5c0005] text-lg font-bold">
                      check
                    </span>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {mission.priority === 'high' && (
                  <span className="px-3 py-1 rounded-full bg-[#93000a]/20 text-[#ffb4ab] font-mono-code text-xs flex items-center gap-1 border border-[#ffb4ab]/20">
                    <span className="material-symbols-outlined text-xs material-symbols-filled">
                      bolt
                    </span>{' '}
                    High Priority
                  </span>
                )}

                {mission.priority === 'medium' && (
                  <span className="px-3 py-1 rounded-full bg-[#3394f1]/20 text-[#a2c9ff] font-mono-code text-xs border border-[#a2c9ff]/20">
                    Medium Priority
                  </span>
                )}

                {mission.priority === 'low' && (
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[#e4beb9]/60 font-mono-code text-xs border border-white/5">
                    Low Priority
                  </span>
                )}

                <span className="px-3 py-1 rounded-full bg-white/5 text-[#e4beb9] font-mono-code text-xs border border-white/10">
                  {mission.dueDate}
                </span>

                {mission.completed && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-mono-code text-xs border border-emerald-500/30">
                    +{mission.xpReward} XP
                  </span>
                )}
              </div>
            </div>
          );
        })}

        {/* Weekly Goal Stat Card */}
        <div className="glass-card rounded-2xl p-6 md:col-span-2 lg:col-span-1 bg-gradient-to-br from-[#1c1b1b] to-[#ff544c]/10 border-[#ff544c]/20 overflow-hidden relative">
          <div className="relative z-10">
            <h2 className="font-jakarta text-2xl font-bold text-white mb-2">WEEKLY GOAL</h2>
            <p className="font-inter text-sm text-[#e4beb9] mb-6">
              You've completed {completionPercentage}% of your missions this week. Keep the
              momentum!
            </p>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-[#ff544c] to-[#bb171c] transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
            <div className="mt-4 flex justify-between font-mono-code text-xs text-[#ff544c]">
              <span>
                {completedCount}/{totalCount} Missions
              </span>
              <span>+250 XP</span>
            </div>
          </div>
        </div>

        {/* Empty State / Add New Mission Card */}
        <div
          onClick={onOpenAddMission}
          className="glass-card rounded-2xl p-6 border-dashed border-2 border-white/10 flex flex-col items-center justify-center min-h-[160px] opacity-70 hover:opacity-100 transition-all group cursor-pointer"
        >
          <span className="material-symbols-outlined text-4xl text-[#e4beb9] mb-2 group-hover:text-[#ff544c] transition-colors">
            add_task
          </span>
          <span className="font-mono-code text-sm font-semibold text-white">Add New Mission</span>
        </div>
      </section>

      {/* Floating Action Button */}
      <button
        onClick={onOpenAddMission}
        className="fixed bottom-24 right-6 w-16 h-16 rounded-full bg-[#ff544c] text-[#5c0005] flex items-center justify-center shadow-2xl z-40 spider-red-pulse active:scale-90 transition-transform cursor-pointer"
        title="Create New Mission"
      >
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>
    </div>
  );
};
