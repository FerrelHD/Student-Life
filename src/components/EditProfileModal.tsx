import React, { useState, useEffect, useRef } from 'react';
import { UserProfile } from '../types';
import { getTranslation } from '../utils/i18n';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (updated: Partial<UserProfile>) => void;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=256&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=256&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const t = getTranslation(profile.language);
  const isIndonesian = profile.language === 'id';

  const [name, setName] = useState(profile.name);
  const [role, setRole] = useState(profile.role);
  const [university, setUniversity] = useState(profile.university);
  const [gpa, setGpa] = useState(profile.gpa.toString());
  const [avatarUrl, setAvatarUrl] = useState(profile.avatarUrl);
  const [customAvatar, setCustomAvatar] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName(profile.name);
    setRole(profile.role);
    setUniversity(profile.university);
    setGpa(profile.gpa.toString());
    setAvatarUrl(profile.avatarUrl);
    setUploadedFileName(null);
  }, [profile, isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert(isIndonesian ? 'Mohon pilih file gambar (JPG, PNG, WEBP)' : 'Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (result) {
          setAvatarUrl(result);
          setCustomAvatar('');
          setUploadedFileName(file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSaveProfile({
      name: name.trim(),
      role: role.trim() || 'Smart Learner',
      university: university.trim() || (isIndonesian ? 'Universitas Indonesia' : 'Stanford University'),
      gpa: parseFloat(gpa) || profile.gpa,
      avatarUrl: customAvatar.trim() || avatarUrl,
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="expressive-card expressive-card-onyx w-full max-w-md p-6 shadow-2xl relative text-white border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d1c4e9] text-2xl">
              edit_square
            </span>
            <h3 className="font-jakarta font-black text-xl text-white">
              {isIndonesian ? 'Edit Profil' : 'Edit Profile'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-jakarta text-sm">
          {/* Avatar Selector & Direct File Upload */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-xs font-bold text-gray-300">
                {isIndonesian ? 'PILIH FOTO PROFIL' : 'CHOOSE AVATAR'}
              </label>

              {/* Upload File Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-xs font-bold text-[#d1c4e9] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">upload_file</span>
                <span>{isIndonesian ? 'Upload Foto Sendiri' : 'Upload Own Photo'}</span>
              </button>

              {/* Hidden File Input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileUpload}
              />
            </div>

            {/* Presets and Upload Card Carousel */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 no-scrollbar">
              {/* Direct Upload Button Circle */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-12 h-12 rounded-full border-2 border-dashed border-[#d1c4e9] bg-white/5 hover:bg-white/10 flex flex-col items-center justify-center flex-shrink-0 transition-all cursor-pointer text-[#d1c4e9]"
                title={isIndonesian ? 'Pilih file foto dari perangkat' : 'Upload photo from device'}
              >
                <span className="material-symbols-outlined text-lg">add_a_photo</span>
              </button>

              {/* Preset Avatars */}
              {PRESET_AVATARS.map((url, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setAvatarUrl(url);
                    setCustomAvatar('');
                    setUploadedFileName(null);
                  }}
                  className={`relative w-12 h-12 rounded-full overflow-hidden border-2 transition-all flex-shrink-0 cursor-pointer ${
                    avatarUrl === url && !customAvatar && !uploadedFileName
                      ? 'border-[#d1c4e9] scale-110 shadow-lg'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>

            {/* File Upload Status Banner */}
            {uploadedFileName && (
              <div className="mt-2 p-2.5 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-between text-xs text-emerald-300 font-bold">
                <div className="flex items-center gap-2 truncate">
                  <span className="material-symbols-outlined text-base text-emerald-400">check_circle</span>
                  <span className="truncate">{uploadedFileName}</span>
                </div>
                <span className="text-[10px] bg-emerald-500/20 px-2 py-0.5 rounded-full font-black uppercase">
                  {isIndonesian ? 'Uploaded' : 'Uploaded'}
                </span>
              </div>
            )}

            {/* Custom Avatar URL Input */}
            <input
              type="text"
              value={customAvatar}
              onChange={(e) => {
                setCustomAvatar(e.target.value);
                if (e.target.value) {
                  setAvatarUrl(e.target.value);
                  setUploadedFileName(null);
                }
              }}
              placeholder={isIndonesian ? 'Atau tempel Link Gambar (URL)...' : 'Or paste custom Image URL...'}
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-[#d1c4e9] mt-2"
            />
          </div>

          {/* Display Name */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">
              {isIndonesian ? 'NAMA LENGKAP' : 'FULL NAME'}
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Jacob Miller"
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
            />
          </div>

          {/* Academic Role / Title */}
          <div>
            <label className="block text-xs font-bold text-gray-300 mb-1">
              {isIndonesian ? 'JURUSAN / PERAN' : 'ROLE / MAJOR'}
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g. Computer Science Senior"
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* University */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                {isIndonesian ? 'UNIVERSITAS' : 'UNIVERSITY'}
              </label>
              <input
                type="text"
                value={university}
                onChange={(e) => setUniversity(e.target.value)}
                placeholder="e.g. Universitas Indonesia"
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
              />
            </div>

            {/* GPA */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                IPK / GPA
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                max="4.0"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="3.8"
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-3 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3.5 font-bold transition-colors cursor-pointer"
            >
              {isIndonesian ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#d1c4e9] text-[#1f1732] font-black rounded-full py-3.5 transition-colors cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
            >
              {isIndonesian ? 'Simpan Profil' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
