import React, { useState } from 'react';
import { LanguageType, Mission, PriorityType, MissionTag } from '../types';
import { getTranslation } from '../utils/i18n';
import { ExpressiveSelect, SelectOption } from './ExpressiveSelect';

interface AddMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddMission: (mission: Omit<Mission, 'id' | 'completed'>) => void;
  language?: LanguageType;
}

const priorityOptions = (t: ReturnType<typeof getTranslation>): SelectOption<PriorityType>[] => [
  { value: 'high', label: t.highPriority, icon: 'priority_high' },
  { value: 'medium', label: t.mediumPriority, icon: 'remove' },
  { value: 'low', label: t.lowPriority, icon: 'arrow_downward' },
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
  language = 'id',
}) => {
  const t = getTranslation(language);
  const [title, setTitle] = useState('');
  const [course, setCourse] = useState('');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [tag, setTag] = useState<MissionTag>('EXAM');
  const [dueDate, setDueDate] = useState('Due tomorrow');
  const [dateStr, setDateStr] = useState(new Date().toISOString().split('T')[0]);
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
      xpReward: Math.max(0, xpReward),
      focusPriority: priority === 'high' ? 'CRITICAL' : priority === 'medium' ? 'URGENT' : 'ROUTINE',
      dateStr,
    });

    setTitle('');
    setCourse('');
    setDueDate('Due tomorrow');
    setDateStr(new Date().toISOString().split('T')[0]);
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
            <h3 className="font-jakarta font-black text-xl text-white">{t.createNewMission}</h3>
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
              {t.missionTitle}
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
              {t.courseModule}
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
                {t.priority}
              </label>
              <ExpressiveSelect
                value={priority}
                options={priorityOptions(t)}
                onChange={(val) => setPriority(val as PriorityType)}
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-300 mb-1">
                {t.tag}
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
                {t.missionDate}
              </label>
              <input
                type="date"
                required
                value={dateStr}
                onChange={(e) => setDateStr(e.target.value)}
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9] [color-scheme:dark]"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-gray-300 mb-1">
                {t.dueTimeframe}
              </label>
              <input
                type="text"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                placeholder="e.g. Due in 2h"
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-300 mb-1">
              {t.xpReward}
            </label>
            <input
              type="number"
              min={0}
              value={xpReward}
              onChange={(e) => setXpReward(Math.max(0, Number(e.target.value)))}
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
            />
          </div>

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3.5 font-bold transition-colors cursor-pointer"
            >
              {t.cancel}
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#d1c4e9] text-[#1f1732] font-black rounded-full py-3.5 transition-colors cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
            >
              {t.addMissionBtn}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
