import React, { useState } from 'react';
import { Transaction, TransactionCategory, TransactionType } from '../types';
import { ExpressiveSelect, SelectOption } from './ExpressiveSelect';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: TransactionType;
  onAddTransaction: (transaction: Omit<Transaction, 'id'>) => void;
}

const CATEGORY_OPTIONS: SelectOption<TransactionCategory>[] = [
  { value: 'FOOD', label: 'Makanan & Minuman', icon: 'local_cafe' },
  { value: 'TRANSPORT', label: 'Transportasi & KRL', icon: 'directions_bus' },
  { value: 'TECH', label: 'Teknologi & Gadget', icon: 'memory' },
  { value: 'SUBSCRIPTION', label: 'Langganan & Buku', icon: 'menu_book' },
  { value: 'OTHER', label: 'Lainnya', icon: 'category' },
];

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
      date: `Hari ini, ${timeStr}`,
    });

    setTitle('');
    setAmount('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
      <div className="expressive-card expressive-card-onyx w-full max-w-md p-6 shadow-2xl relative text-white border border-white/10">
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 mb-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#d1c4e9] text-2xl">
              {type === 'income' ? 'add_circle' : 'payments'}
            </span>
            <h3 className="font-jakarta font-black text-xl text-white">
              {type === 'income' ? 'Tambah Pemasukan Saldo' : 'Catat Pengeluaran'}
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
              + Pemasukan
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
              - Pengeluaran
            </button>
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-300 mb-1">
              KETERANGAN TRANSAKSI
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={type === 'income' ? 'e.g. Gaji Asisten Dosen / Les' : 'e.g. Makan Siang / Kopi'}
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
            />
          </div>

          <div>
            <label className="block text-xs font-extrabold text-gray-300 mb-1">
              NOMINAL (RP)
            </label>
            <input
              type="number"
              step="1000"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="e.g. 50000"
              className="w-full bg-white/10 text-white placeholder-gray-400 border border-white/15 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
            />
          </div>

          {type === 'expense' && (
            <div>
              <label className="block text-xs font-extrabold text-gray-300 mb-1">
                KATEGORI
              </label>
              <ExpressiveSelect
                value={category}
                options={CATEGORY_OPTIONS}
                onChange={(val) => setCategory(val as TransactionCategory)}
              />
            </div>
          )}

          <div className="pt-3 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white rounded-full py-3.5 font-bold transition-colors cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              className="flex-1 bg-[#d1c4e9] text-[#1f1732] font-black rounded-full py-3.5 transition-colors cursor-pointer shadow-md hover:scale-[1.02] active:scale-95"
            >
              Simpan Transaksi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
