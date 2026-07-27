import React from 'react';
import { Badge, LanguageType } from '../types';
import { useEscapeClose } from '../utils/useEscapeClose';
import { getTranslation } from '../utils/i18n';

interface BadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  badges: Badge[];
  language?: LanguageType;
}

export const BadgesModal: React.FC<BadgesModalProps> = ({
  isOpen,
  onClose,
  badges,
  language = 'id',
}) => {
  useEscapeClose(isOpen, onClose);
  if (!isOpen) return null;

  const unlockedCount = badges.filter((b) => b.unlocked).length;
  const totalCount = badges.length;
  const t = getTranslation(language);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" className="expressive-card expressive-card-onyx w-full max-w-md p-6 shadow-2xl relative text-white border border-white/10 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#d1c4e9] text-[#1f1732] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">military_tech</span>
            </div>
            <div>
              <h3 className="font-jakarta font-black text-lg text-white">
                {t.badgesShowcaseTitle}
              </h3>
              <p className="font-jakarta text-xs text-[#d1c4e9] font-bold">
                {t.badgesUnlockedCount.replace('{unlocked}', String(unlockedCount)).replace('{total}', String(totalCount))}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.close}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 py-1">
          {badges.map((badge) => (
            <div
              key={badge.id}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center justify-between ${
                badge.unlocked
                  ? 'bg-white/10 border-white/15 shadow-sm hover:scale-[1.02]'
                  : 'bg-white/5 border-white/5 opacity-50 grayscale'
              }`}
            >
              <div className="relative mb-2">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    badge.unlocked
                      ? 'bg-[#d1c4e9] text-[#1f1732]'
                      : 'bg-white/10 text-gray-400'
                  }`}
                >
                  <span className="material-symbols-outlined text-2xl">{badge.icon}</span>
                </div>
                {badge.unlocked ? (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-black border border-[#1b1b1d]">
                    ✓
                  </span>
                ) : (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gray-600 text-white flex items-center justify-center text-[10px] font-black border border-[#1b1b1d]">
                    🔒
                  </span>
                )}
              </div>

              <div>
                <h4 className="font-jakarta font-black text-sm text-white">{badge.title}</h4>
                <p className="font-jakarta text-[10px] font-extrabold text-[#ece28c] uppercase mt-0.5">
                  {badge.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Close Button */}
        <div className="pt-4 flex-shrink-0">
          <button
            onClick={onClose}
            className="w-full bg-[#d1c4e9] text-[#1f1732] font-black py-3.5 rounded-full text-sm transition-all cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
          >
            {t.closeShowcase}
          </button>
        </div>
      </div>
    </div>
  );
};
