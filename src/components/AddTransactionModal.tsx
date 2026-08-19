import React, { useEffect, useState } from 'react';
import { LanguageType, Transaction, TransactionCategory, TransactionType } from '../types';
import { getTranslation, formatTimeNow } from '../utils/i18n';
import { parseNumericInput, isPositiveNumber } from '../utils/number';
import { useEscapeClose } from '../utils/useEscapeClose';
import { ExpressiveSelect, SelectOption } from './ExpressiveSelect';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  onAddTransaction: (transaction: Omit<Transaction, 'id' | 'createdAt'>) => void;
  editingTransaction?: Transaction | null;
  onEditTransaction?: (id: string, patch: Omit<Transaction, 'id' | 'createdAt'>) => void;
  language?: LanguageType;
}

const categoryOptions = (t: ReturnType<typeof getTranslation>): SelectOption<TransactionCategory>[] => [
  { value: 'FOOD', label: t.food, icon: 'local_cafe' },
  { value: 'TRANSPORT', label: t.transport, icon: 'directions_bus' },
  { value: 'TECH', label: t.tech, icon: 'memory' },
  { value: 'SUBSCRIPTION', label: t.subscription, icon: 'menu_book' },
  { value: 'OTHER', label: t.other, icon: 'category' },
];

export const AddTransactionModal: React.FC<AddTransactionModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'expense',
  onAddTransaction,
  editingTransaction,
  onEditTransaction,
  language = 'id',
}) => {
  const t = getTranslation(language);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>(defaultType);
  const [category, setCategory] = useState<TransactionCategory>('FOOD');
  const [recurring, setRecurring] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (editingTransaction) {
      setTitle(editingTransaction.title);
      setAmount(String(editingTransaction.amount));
      setType(editingTransaction.type);
      setCategory(editingTransaction.category);
      setRecurring(editingTransaction.recurrence === 'monthly');
    } else {
      setTitle('');
      setAmount('');
      setType(defaultType);
      setCategory('FOOD');
      setRecurring(false);
    }
  }, [isOpen, editingTransaction, defaultType]);

  useEscapeClose(isOpen, onClose);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const numAmount = parseNumericInput(amount);
    if (!title.trim()) {
      setError(t.description + ' ' + (language === 'id' ? 'harus diisi' : 'is required'));
      return;
    }
    if (!isPositiveNumber(numAmount)) {
      setError(language === 'id' ? 'Masukkan jumlah yang valid lebih besar dari 0' : 'Enter a valid amount greater than 0');
      return;
    }

    const category_ = type === 'income' ? 'INCOME' : category;
    const recurrence = recurring ? 'monthly' : 'none';

    if (editingTransaction) {
      onEditTransaction?.(editingTransaction.id, {
        title: title.trim(),
        amount: numAmount,
        type,
        category: category_,
        date: editingTransaction.date,
        recurrence,
      });
    } else {
      const timeStr = formatTimeNow(language);
      onAddTransaction({
        title: title.trim(),
        amount: numAmount,
        type,
        category: category_,
        date: `${t.today}, ${timeStr}`,
        recurrence,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div role="dialog" aria-modal="true" className="expressive-card expressive-card-onyx w-full max-w-md p-6 shadow-2xl relative text-white border border-white/10 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d1c4e9] text-2xl">
              {type === 'income' ? 'add_circle' : 'payments'}
            </span>
            <h3 className="font-jakarta font-black text-xl text-white">
              {editingTransaction ? t.editTransactionTitle : type === 'income' ? t.addDepositCredit : t.logExpense}
            </h3>
          </div>
          <button
            onClick={onClose}
            aria-label={t.cancel}
            className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer"
          >
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 font-jakarta text-sm">
          {/* Transaction Type switcher */}
          <div className="flex bg-white/10 p-1.5 rounded-full border border-white/10">
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('INCOME');
              }}
              className={`flex-1 py-2.5 rounded-full font-jakarta text-xs font-black transition-all cursor-pointer ${
                type === 'income'
                  ? 'bg-[#d1c4e9] text-[#1f1732] shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {t.depositTab}
            </button>
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'INCOME') setCategory('FOOD');
              }}
              className={`flex-1 py-2.5 rounded-full font-jakarta text-xs font-black transition-all cursor-pointer ${
                type === 'expense'
                  ? 'bg-[#d1c4e9] text-[#1f1732] shadow-sm'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              {t.expenseTab}
            </button>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-300 mb-1">
              {t.description}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'income' ? 'e.g. Gaji Asisten Dosen / Les' : 'e.g. Makan Siang / Kopi'}
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl clay-inset px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-300 mb-1">
              {t.amountRp}
            </label>
            <input
              type="number"
              step="1000"
              required
              value={amount}
              onChange={(e) => { setAmount(e.target.value); setError(null); }}
              placeholder="e.g. 50000"
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl clay-inset px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
            />
            {error && <p className="mt-2 text-[12px] text-rose-400 font-bold">{error}</p>}
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-xs font-extrabold text-gray-300 mb-1">
                {t.categoryLabel}
              </label>
              <ExpressiveSelect
                value={category}
                options={categoryOptions(t)}
                onChange={(val) => setCategory(val as TransactionCategory)}
              />
            </div>
          )}

          <label className="flex items-center gap-2.5 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="w-4 h-4 rounded accent-[#d1c4e9] cursor-pointer"
            />
            <span className="text-xs font-extrabold text-gray-300">{t.recurringMonthly}</span>
          </label>

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
              disabled={!!error}
              className={`flex-1 ${error ? 'opacity-60 cursor-not-allowed' : 'bg-[#d1c4e9]'} text-[#1f1732] font-black rounded-full py-3.5 transition-colors cursor-pointer clay-raised hover:scale-[1.02] active:scale-95`}
            >
              {editingTransaction ? t.saveTransactionBtn : t.recordTx}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
