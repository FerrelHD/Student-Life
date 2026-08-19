import React, { useState } from 'react';
import { useEscapeClose } from '../utils/useEscapeClose';

interface GpaCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentGpa: number;
  onUpdateGpa: (newGpa: number) => void;
  lang?: 'id' | 'en';
}

interface CourseItem {
  id: string;
  name: string;
  sks: number;
  gradeValue: number; // 4.0, 3.7, 3.3, 3.0, 2.7, etc.
}

const GRADE_MAP = [
  { label: 'A (4.0)', val: 4.0 },
  { label: 'A- (3.7)', val: 3.7 },
  { label: 'B+ (3.3)', val: 3.3 },
  { label: 'B (3.0)', val: 3.0 },
  { label: 'B- (2.7)', val: 2.7 },
  { label: 'C+ (2.3)', val: 2.3 },
  { label: 'C (2.0)', val: 2.0 },
  { label: 'D (1.0)', val: 1.0 },
  { label: 'E (0.0)', val: 0.0 },
];

export const GpaCalculatorModal: React.FC<GpaCalculatorModalProps> = ({
  isOpen,
  onClose,
  currentGpa,
  onUpdateGpa,
  lang = 'id',
}) => {
  const [courses, setCourses] = useState<CourseItem[]>([
    { id: '1', name: 'Algoritma & Pemrograman', sks: 3, gradeValue: 4.0 },
    { id: '2', name: 'Kalkulus & Matematika Diskrit', sks: 4, gradeValue: 3.7 },
    { id: '3', name: 'Struktur Data & Basis Data', sks: 3, gradeValue: 4.0 },
  ]);

  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const addCourse = () => {
    setCourses((prev) => [
      ...prev,
      { id: Date.now().toString(), name: `Matkul ${prev.length + 1}`, sks: 3, gradeValue: 4.0 },
    ]);
  };

  const removeCourse = (id: string) => {
    if (courses.length <= 1) return;
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  const updateCourse = (id: string, patch: Partial<CourseItem>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  };

  // Calculate GPA
  const totalSKS = courses.reduce((acc, c) => acc + c.sks, 0);
  const totalPoints = courses.reduce((acc, c) => acc + c.sks * c.gradeValue, 0);
  const targetSemesterGpa = totalSKS > 0 ? totalPoints / totalSKS : 0;

  const L = {
    title: lang === 'id' ? 'Kalkulator & Target IPK 📊' : 'GPA Target Calculator 📊',
    subtitle: lang === 'id' ? 'Hitung estimasi IPK semester ini berdasarkan bobot SKS' : 'Simulate your semester GPA based on subject credits',
    courseName: lang === 'id' ? 'Mata Kuliah' : 'Subject',
    sks: 'SKS',
    grade: lang === 'id' ? 'Target Nilai' : 'Target Grade',
    addCourse: lang === 'id' ? '+ Tambah Matkul' : '+ Add Subject',
    semesterGpa: lang === 'id' ? 'Estimasi IPK Semester' : 'Est. Semester GPA',
    applyToProfile: lang === 'id' ? 'Simpan ke Profil' : 'Save to Profile',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" className="expressive-card expressive-card-onyx w-full max-w-md p-6 shadow-2xl relative text-white border border-white/10 flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d1c4e9] text-2xl">calculate</span>
            <h3 className="font-jakarta font-black text-lg text-white">{L.title}</h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <p className="text-xs text-gray-400 font-jakarta">{L.subtitle}</p>

        {/* Current vs Target GPA Banner */}
        <div className="grid grid-cols-2 gap-3 bg-white/5 p-3.5 rounded-2xl border border-white/10">
          <div>
            <span className="text-[10px] font-extrabold uppercase text-gray-400 block">{lang === 'id' ? 'IPK Saat Ini' : 'Current GPA'}</span>
            <span className="font-mono-code text-xl font-black text-[#d1c4e9]">{currentGpa.toFixed(2)}</span>
          </div>
          <div>
            <span className="text-[10px] font-extrabold uppercase text-gray-400 block">{L.semesterGpa}</span>
            <span className="font-mono-code text-xl font-black text-emerald-400">{targetSemesterGpa.toFixed(2)}</span>
          </div>
        </div>

        {/* Course List Input */}
        <div className="space-y-3">
          {courses.map((course) => (
            <div key={course.id} className="bg-white/5 p-3 rounded-2xl border border-white/10 space-y-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={course.name}
                  onChange={(e) => updateCourse(course.id, { name: e.target.value })}
                  className="flex-1 bg-white/10 text-white text-xs font-bold px-3 py-2 rounded-xl focus:outline-none focus:ring-1 focus:ring-[#d1c4e9]"
                  placeholder={L.courseName}
                />
                {courses.length > 1 && (
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="text-rose-400 hover:text-rose-300 p-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-base">delete</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">{L.sks}</label>
                  <select
                    value={course.sks}
                    onChange={(e) => updateCourse(course.id, { sks: Number(e.target.value) })}
                    className="w-full bg-white/10 text-white font-bold px-2 py-1.5 rounded-xl focus:outline-none [color-scheme:dark]"
                  >
                    {[1, 2, 3, 4, 6].map((s) => (
                      <option key={s} value={s}>{s} SKS</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 block mb-1">{L.grade}</label>
                  <select
                    value={course.gradeValue}
                    onChange={(e) => updateCourse(course.id, { gradeValue: Number(e.target.value) })}
                    className="w-full bg-white/10 text-white font-bold px-2 py-1.5 rounded-xl focus:outline-none [color-scheme:dark]"
                  >
                    {GRADE_MAP.map((g) => (
                      <option key={g.label} value={g.val}>{g.label}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={addCourse}
          className="w-full py-2.5 bg-white/10 hover:bg-white/15 text-[#d1c4e9] font-extrabold rounded-2xl text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
        >
          {L.addCourse}
        </button>

        {/* Actions */}
        <div className="pt-2 flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3 font-bold font-jakarta transition-colors cursor-pointer text-sm"
          >
            {lang === 'id' ? 'Batal' : 'Cancel'}
          </button>
          <button
            onClick={() => {
              onUpdateGpa(targetSemesterGpa);
              onClose();
            }}
            className="flex-1 bg-[#d1c4e9] text-[#1f1732] font-black rounded-full py-3 font-jakarta hover:scale-[1.02] active:scale-95 transition-all cursor-pointer text-sm"
          >
            {L.applyToProfile}
          </button>
        </div>
      </div>
    </div>
  );
};
