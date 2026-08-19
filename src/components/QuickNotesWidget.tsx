import React, { useState, useEffect } from 'react';

interface QuickNote {
  id: string;
  title: string;
  urlOrContent: string;
  category: 'LINK' | 'ZOOM' | 'ROOM' | 'CONTACT';
}

const INITIAL_NOTES: QuickNote[] = [
  { id: '1', title: 'Drive Tugas Kuliah', urlOrContent: 'https://drive.google.com', category: 'LINK' },
  { id: '2', title: 'Zoom Ruang Diskusi 02', urlOrContent: 'https://zoom.us/j/123456789', category: 'ZOOM' },
  { id: '3', title: 'Kode Ruang Lab: Lab 402', urlOrContent: 'Gedung F - Lantai 4', category: 'ROOM' },
];

export const QuickNotesWidget: React.FC<{ lang?: 'id' | 'en' }> = ({ lang = 'id' }) => {
  const [notes, setNotes] = useState<QuickNote[]>(() => {
    try {
      const saved = localStorage.getItem('student_life_quick_notes');
      return saved ? JSON.parse(saved) : INITIAL_NOTES;
    } catch {
      return INITIAL_NOTES;
    }
  });

  const [isAdding, setIsAdding] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newCategory, setNewCategory] = useState<'LINK' | 'ZOOM' | 'ROOM' | 'CONTACT'>('LINK');

  useEffect(() => {
    localStorage.setItem('student_life_quick_notes', JSON.stringify(notes));
  }, [notes]);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    setNotes((prev) => [
      {
        id: Date.now().toString(),
        title: newTitle.trim(),
        urlOrContent: newContent.trim(),
        category: newCategory,
      },
      ...prev,
    ]);

    setNewTitle('');
    setNewContent('');
    setIsAdding(false);
  };

  const handleDelete = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const getCategoryIcon = (cat: QuickNote['category']) => {
    switch (cat) {
      case 'ZOOM': return 'videocam';
      case 'LINK': return 'link';
      case 'ROOM': return 'meeting_room';
      case 'CONTACT': return 'person';
    }
  };

  return (
    <section className="expressive-card expressive-card-surface p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[#635979] dark:text-[#d1c4e9] text-xl">
            quick_reference_all
          </span>
          <h3 className="font-jakarta font-black text-base text-[#1b1b1d] dark:text-[#f3f0f2]">
            {lang === 'id' ? 'Quick Notes & Link Kuliah' : 'Quick Academic Notes & Links'}
          </h3>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-3 py-1 rounded-full bg-black/5 dark:bg-white/10 text-xs font-bold text-[#1b1b1d] dark:text-[#f3f0f2] hover:bg-black/10 transition-colors cursor-pointer"
        >
          {isAdding ? (lang === 'id' ? 'Tutup' : 'Close') : (lang === 'id' ? '+ Catatan' : '+ Note')}
        </button>
      </div>

      {isAdding && (
        <form onSubmit={handleAdd} className="space-y-2 bg-black/5 dark:bg-white/5 p-3 rounded-2xl border border-black/5 dark:border-white/10 text-xs font-jakarta">
          <input
            type="text"
            required
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder={lang === 'id' ? 'Judul (mis: Zoom Lab / Drive Matkul)' : 'Title (e.g. Zoom Link / Drive)'}
            className="w-full bg-white dark:bg-white/10 px-3 py-2 rounded-xl focus:outline-none"
          />
          <input
            type="text"
            required
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder={lang === 'id' ? 'Link URL atau Teks Catatan' : 'URL or Note Text'}
            className="w-full bg-white dark:bg-white/10 px-3 py-2 rounded-xl focus:outline-none"
          />
          <div className="flex justify-between items-center pt-1">
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value as QuickNote['category'])}
              className="bg-white dark:bg-white/10 px-2 py-1.5 rounded-xl font-bold [color-scheme:dark]"
            >
              <option value="LINK">Link / Drive</option>
              <option value="ZOOM">Zoom / Meet</option>
              <option value="ROOM">Ruangan Kelas</option>
              <option value="CONTACT">Kontak Dosen</option>
            </select>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-full bg-[#d1c4e9] text-[#1f1732] font-black text-xs cursor-pointer"
            >
              {lang === 'id' ? 'Simpan' : 'Save'}
            </button>
          </div>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {notes.map((note) => {
          const isUrl = note.urlOrContent.startsWith('http');
          return (
            <div
              key={note.id}
              className="flex items-center justify-between p-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/5 text-xs"
            >
              <div className="flex items-center gap-2.5 min-w-0 pr-2">
                <span className="material-symbols-outlined text-base text-[#635979] dark:text-[#d1c4e9] flex-shrink-0">
                  {getCategoryIcon(note.category)}
                </span>
                <div className="min-w-0">
                  <span className="font-jakarta font-black block truncate text-[#1b1b1d] dark:text-[#f3f0f2]">
                    {note.title}
                  </span>
                  {isUrl ? (
                    <a
                      href={note.urlOrContent}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-[#635979] dark:text-[#d1c4e9] underline truncate block hover:opacity-80"
                    >
                      {note.urlOrContent}
                    </a>
                  ) : (
                    <span className="text-[10px] text-gray-500 dark:text-gray-400 truncate block">
                      {note.urlOrContent}
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => handleDelete(note.id)}
                className="text-gray-400 hover:text-rose-400 cursor-pointer flex-shrink-0 p-1"
              >
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );
};
