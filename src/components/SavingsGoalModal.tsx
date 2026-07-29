import React, { useState, useEffect } from 'react';
import { LanguageType, SavingsGoal } from '../types';
import { getTranslation } from '../utils/i18n';
import { useEscapeClose } from '../utils/useEscapeClose';

interface SavingsGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  savingsGoal: SavingsGoal;
  onUpdateSavings: (newSaved: number, newGoal?: Partial<SavingsGoal>) => void;
  language?: LanguageType;
}

export const SavingsGoalModal: React.FC<SavingsGoalModalProps> = ({
  isOpen,
  onClose,
  savingsGoal,
  onUpdateSavings,
  language = 'id',
}) => {
  const t = getTranslation(language);
  const [depositAmount, setDepositAmount] = useState('');
  const [title, setTitle] = useState(savingsGoal.title);
  const [targetAmount, setTargetAmount] = useState(savingsGoal.targetAmount.toString());
  const [isEditingGoal, setIsEditingGoal] = useState(false);

  useEffect(() => {
    setTitle(savingsGoal.title);
    setTargetAmount(savingsGoal.targetAmount.toString());
  }, [savingsGoal, isOpen]);

  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleDeposit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(depositAmount);
    if (!isNaN(val) && val > 0) {
      onUpdateSavings(savingsGoal.savedAmount + val);
      setDepositAmount('');
      onClose();
    }
  };

  const handleSaveGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const newTarget = parseFloat(targetAmount);
    if (title.trim() && !isNaN(newTarget) && newTarget > 0) {
      onUpdateSavings(savingsGoal.savedAmount, {
        title: title.trim(),
        targetAmount: newTarget,
      });
      setIsEditingGoal(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" className="expressive-card expressive-card-onyx w-full max-w-md p-6 shadow-2xl relative text-white border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#ece28c] text-[#1f1c00] flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">savings</span>
            </div>
            <div>
              <h3 className="font-jakarta font-black text-lg text-white">{t.savingsManager}</h3>
              <p className="font-jakarta text-xs text-[#ece28c] font-bold">{savingsGoal.title || t.noSavingsGoal}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label={t.cancel}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        {/* Tab switcher: Deposit vs Edit Goal */}
        <div className="flex bg-white/10 p-1 rounded-full mb-4 border border-white/10 font-jakarta text-xs font-bold">
          <button
            type="button"
            onClick={() => setIsEditingGoal(false)}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
              !isEditingGoal ? 'bg-[#d1c4e9] text-[#1f1732] shadow-sm' : 'text-gray-300 hover:text-white'
            }`}
          >
            {t.depositMoneyTab}
          </button>
          <button
            type="button"
            onClick={() => setIsEditingGoal(true)}
            className={`flex-1 py-2 rounded-full transition-all cursor-pointer ${
              isEditingGoal ? 'bg-[#d1c4e9] text-[#1f1732] shadow-sm' : 'text-gray-300 hover:text-white'
            }`}
          >
            {t.editGoalDetailsTab}
          </button>
        </div>

        {!isEditingGoal ? (
          <form onSubmit={handleDeposit} className="space-y-4 font-jakarta text-sm">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex justify-between items-center">
              <div>
                <p className="text-xs font-bold text-gray-400">{t.currentSavings}</p>
                <p className="text-lg font-black text-white">Rp {savingsGoal.savedAmount.toLocaleString('id-ID')}</p>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-gray-400">{t.targetAmountLabel}</p>
                <p className="text-base font-extrabold text-[#ece28c]">Rp {savingsGoal.targetAmount.toLocaleString('id-ID')}</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                {t.depositAmountLabel}
              </label>
              <input
                type="number"
                step="1000"
                required
                value={depositAmount}
                onChange={(e) => setDepositAmount(e.target.value)}
                placeholder="e.g. 500000"
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl clay-inset px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3.5 font-bold transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#d1c4e9] text-[#1f1732] font-black py-3.5 rounded-full text-sm clay-raised hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                {t.depositBtn}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleSaveGoal} className="space-y-4 font-jakarta text-sm">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                {t.goalNameLabel}
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. New MacBook Pro M3"
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl clay-inset px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                {t.targetAmountLabel}
              </label>
              <input
                type="number"
                step="100000"
                required
                value={targetAmount}
                onChange={(e) => setTargetAmount(e.target.value)}
                placeholder="28000000"
                className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl clay-inset px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
              />
            </div>

            <div className="pt-2 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3.5 font-bold transition-colors cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                type="submit"
                className="flex-1 bg-[#ece28c] text-[#1f1c00] font-black py-3.5 rounded-full text-sm clay-raised hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
              >
                {t.saveGoalBtn}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
