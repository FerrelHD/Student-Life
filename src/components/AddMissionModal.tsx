import React, { useState } from 'react';
import { Mission, PriorityType, MissionTag } from '../types';

interface AddMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMission: (mission: Omit<Mission, 'id' | 'completed'>) => void;
}

export const AddMissionModal: React.FC<AddMissionModalProps> = ({
  isOpen,
  onClose,
  onAddMission,
}) => {
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [tag, setTag] = useState<MissionTag>('EXAM');
  const [dueDate, setDueDate] = useState('Due tomorrow');
  const [time, setTime] = useState('');
  const [location, setLocation] = useState('');
  const [xpReward, setXpReward] = useState(150);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !course.trim()) return;

    onAddMission({
      title: title.trim(),
      course: course.trim(),
      priority,
      tag,
      dueDate: dueDate.trim() || 'Due soon',
      time: time.trim() || undefined,
      location: location.trim() || undefined,
      xpReward: Number(xpReward) || 150,
      focusPriority: priority === 'high' ? 'CRITICAL' : priority === 'medium' ? 'URGENT' : 'ROUTINE',
      dateStr: new Date().toISOString().split('T')[0],
    });

    // Reset
    setTitle('');
    setCourse('');
    setDueDate('Due tomorrow');
    setTime('');
    setLocation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-[#ff544c]/30 shadow-2xl relative">
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff544c]">add_task</span>
            <h3 className="font-jakarta font-bold text-lg text-white">Create New Mission</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-inter text-sm">
          <div>
            <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
              MISSION TITLE
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Distributed Systems Project"
              className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff544c]"
            />
          </div>

          <div>
            <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
              COURSE / MODULE
            </label>
            <input
              type="text"
              required
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. CS 402"
              className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff544c]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
                PRIORITY
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityType)}
                className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff544c]"
              >
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
                TAG
              </label>
              <select
                value={tag}
                onChange={(e) => setTag(e.target.value as MissionTag)}
                className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff544c]"
              >
                <option value="EXAM">[EXAM]</option>
                <option value="LAB">[LAB]</option>
                <option value="PAPER">[PAPER]</option>
                <option value="CODE">[CODE]</option>
                <option value="READ">[READ]</option>
                <option value="PROJECT">[PROJECT]</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
                DUE TIMEFRAME
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Due in 3h, Due Friday"
                className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff544c]"
              />
            </div>

            <div>
              <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
                XP REWARD
              </label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff544c]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
                TIME SLOT (OPTIONAL)
              </label>
              <input
                type="text"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                placeholder="e.g. 14:30 - 16:30"
                className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff544c]"
              />
            </div>

            <div>
              <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
                LOCATION (OPTIONAL)
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Lab 4B"
                className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff544c]"
              />
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white rounded-xl py-3 font-semibold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#ff544c] hover:bg-[#ff544c]/90 text-[#5c0005] font-black rounded-xl py-3 transition-colors shadow-lg shadow-[#ff544c]/20"
            >
              INITIALIZE MISSION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
