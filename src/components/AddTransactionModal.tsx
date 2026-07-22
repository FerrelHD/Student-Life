import React, { useState } from 'react';
import { Transaction, TransactionCategory, TransactionType } from '../types';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
  onAddTransaction,
}) => {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(defaultType);
  const [category, setCategory] = useState<TransactionCategory>('FOOD');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!title.trim() || isNaN(numAmount) || numAmount <= 0) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    onAddTransaction({
      title: title.trim(),
      amount: numAmount,
      type,
      category: type === 'income' ? 'INCOME' : category,
      date: `Today, ${timeStr}`,
    });

    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6 border border-[#ff544c]/30 shadow-2xl relative">
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#ff544c]">
              {type === 'income' ? 'add_circle' : 'payments'}
            </span>
            <h3 className="font-jakarta font-bold text-lg text-white">
              {type === 'income' ? 'Add Deposit Credit' : 'Log Expense'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-white/10 text-white/60 hover:text-white"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-inter text-sm">
          {/* Transaction Type switcher */}
          <div className="flex bg-[#1c1b1b] p-1 rounded-xl border border-white/10">
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('INCOME');
              }}
              className={`flex-1 py-2 rounded-lg font-mono-code text-xs transition-all ${
                type === 'income'
                  ? 'bg-[#ff544c] text-[#5c0005] font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              + Deposit (Income)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'INCOME') setCategory('FOOD');
              }}
              className={`flex-1 py-2 rounded-lg font-mono-code text-xs transition-all ${
                type === 'expense'
                  ? 'bg-[#ff544c] text-[#5c0005] font-bold shadow'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              - Expense
            </button>
          </div>

          <div>
            <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
              TRANSACTION DESCRIPTION
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'income' ? 'e.g. TA Stipend / Freelance' : 'e.g. Lab Supplies / Coffee'}
              className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff544c]"
            />
          </div>

          <div>
            <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
              AMOUNT ($ USD)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:border-[#ff544c]"
            />
          </div>

          {type === 'expense' && (
            <div>
              <label className="block font-mono-code text-xs text-[#e4beb9]/80 mb-1">
                CATEGORY
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as TransactionCategory)}
                className="w-full bg-[#1c1b1b] border border-white/10 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-[#ff544c]"
              >
                <option value="FOOD">[FOOD] Food & Drink</option>
                <option value="TRANSPORT">[TRANSPORT] Rail / Commute</option>
                <option value="TECH">[TECH] Hardware & Gear</option>
                <option value="SUBSCRIPTION">[SUBSCRIPTION] Cloud / Services</option>
                <option value="OTHER">[OTHER] General</option>
              </select>
            </div>
          )}

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
              RECORD TRANSACTION
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
