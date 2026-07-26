import React, { useState } from 'react';
import { Mission, PriorityType, MissionTag } from '../types';
import { ExpressiveSelect, SelectOption } from './ExpressiveSelect';

interface AddMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMission: (mission: Omit<Mission, 'id' | 'completed'>) => void;
}

const PRIORITY_OPTIONS: SelectOption<PriorityType>[] = [
  { value: 'high', label: 'High Priority', icon: 'priority_high' },
  { value: 'medium', label: 'Medium Priority', icon: 'remove' },
  { value: 'low', label: 'Low Priority', icon: 'arrow_downward' },
];

const TAG_OPTIONS: SelectOption<MissionTag>[] = [
  { value: 'EXAM', label: '[EXAM]', icon: 'quiz' },
  { value: 'LAB', label: '[LAB]', icon: 'science' },
  { value: 'PAPER', label: '[PAPER]', icon: 'description' },
  { value: 'CODE', label: '[CODE]', icon: 'terminal' },
  { value: 'READ', label: '[READ]', icon: 'menu_book' },
  { value: 'PROJECT', label: '[PROJECT]', icon: 'assignment' },
];

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

    setTitle('');
    setCourse('');
    setDueDate('Due tomorrow');
    setTime('');
    setLocation('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="expressive-card expressive-card-onyx w-full max-w-md p-6 shadow-2xl relative text-white border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d1c4e9] text-2xl">add_task</span>
            <h3 className="font-jakarta font-black text-xl text-white">Create New Mission</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-jakarta text-sm">
          <div>
            <label className="block text-xs font-extrabold text-gray-300 mb-1">
              MISSION TITLE
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Quantum Physics Lab Report"
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-300 mb-1">
              COURSE / MODULE
            </label>
            <input
              type="text"
              required
              value={course}
              onChange={(e) => setCourse(e.target.value)}
              placeholder="e.g. Physics 402"
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-gray-300 mb-1">
                PRIORITY
              </label>
              <ExpressiveSelect
                value={priority}
                options={PRIORITY_OPTIONS}
                onChange={(val) => setPriority(val as PriorityType)}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-300 mb-1">
                TAG
              </label>
              <ExpressiveSelect
                value={tag}
                options={TAG_OPTIONS}
                onChange={(val) => setTag(val as MissionTag)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-extrabold text-gray-300 mb-1">
                DUE TIMEFRAME
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Due in 2h"
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-300 mb-1">
                XP REWARD
              </label>
              <input
                type="number"
                value={xpReward}
                onChange={(e) => setXpReward(Number(e.target.value))}
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
              />
            </div>
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3.5 font-bold transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#d1c4e9] text-[#1f1732] font-black rounded-full py-3.5 transition-colors cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
            >
              Add Mission
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
