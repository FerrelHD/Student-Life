import React, { useState } from 'react';
import { Transaction, WeeklySpend, SavingsGoal, LanguageType } from '../types';
import { getTranslation } from '../utils/i18n';

function downloadTransactionsCsv(transactions: Transaction[]) {
  const header = ['Date', 'Title', 'Category', 'Type', 'Amount'];
  const rows = transactions.map((tx) => [tx.date, tx.title, tx.category, tx.type, String(tx.amount)]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(','))
    .join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

interface VaultViewProps {
  transactions: Transaction[];
  totalCredits: number;
  weeklySpend: WeeklySpend[];
  savingsGoal: SavingsGoal;
  language?: LanguageType;
  onOpenAddTransaction: (type?: 'income' | 'expense') => void;
  onOpenManageSavings: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  transactions,
  totalCredits,
  weeklySpend,
  savingsGoal,
  language = 'id',
  onOpenAddTransaction,
  onOpenManageSavings,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const langKey = (language as LanguageType) || 'id';
  const t = getTranslation(langKey);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const savingsPct = Math.min(
    100,
    Math.round((savingsGoal.savedAmount / Math.max(1, savingsGoal.targetAmount)) * 100)
  );

  const getDayLabel = (shortDay: string) => {
    if (langKey === 'en') {
      const map: Record<string, string> = {
        Sen: 'Mon',
        Sel: 'Tue',
        Rab: 'Wed',
        Kam: 'Thu',
        Jum: 'Fri',
        Sab: 'Sat',
        Min: 'Sun',
      };
      return map[shortDay] || shortDay;
    }
    return shortDay;
  };

  return (
    <div className="pt-24 pb-32 md:pb-16 px-4 sm:px-6 max-w-md md:max-w-4xl lg:max-w-5xl mx-auto space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          search
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder={t.searchTransactions}
          className="w-full bg-white dark:bg-[#1e1e22] text-[#1b1b1d] dark:text-[#f3f0f2] border border-black/10 dark:border-white/10 rounded-full py-3.5 pl-12 pr-4 font-jakarta text-sm focus:outline-none focus:ring-2 focus:ring-[#d1c4e9]"
        />
      </div>

      {/* Total Balance Hero Card (Always Rupiah) */}
      <section className="expressive-card expressive-card-lavender p-6 relative overflow-hidden shadow-sm text-[#1f1732]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="font-jakarta text-xs font-black opacity-80 mb-1">{t.totalBalance}</p>
            <h2 className="font-jakarta font-black text-3xl tracking-tight text-[#1f1732]">
              Rp {totalCredits.toLocaleString('id-ID')}
            </h2>
          </div>

          <div className="w-14 h-14 rounded-2xl bg-black/10 flex items-center justify-center text-[#1f1732]">
            <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onOpenAddTransaction('income')}
            className="flex-1 bg-[#1b1b1d] text-white py-3.5 px-5 rounded-full font-jakarta font-extrabold text-sm flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all cursor-pointer clay-raised"
          >
            <span className="material-symbols-outlined text-lg text-white">add</span>
            <span className="text-white">{t.addMoney}</span>
          </button>

          <button
            onClick={() => onOpenAddTransaction('expense')}
            className="w-12 h-12 rounded-full bg-white text-[#1b1b1d] flex items-center justify-center hover:scale-105 active:scale-95 transition-all cursor-pointer clay-raised"
            title="Transfer / Expense"
          >
            <span className="material-symbols-outlined text-xl text-[#1b1b1d]">send</span>
          </button>
        </div>
      </section>

      {/* Weekly Burn Section */}
      <section className="expressive-card expressive-card-onyx p-6 shadow-sm space-y-4 text-white">
        <div className="flex justify-between items-center">
          <h3 className="font-jakarta font-black text-lg text-white">
            {t.weeklyBurn}
          </h3>
          <span className="bg-white/10 text-gray-300 px-3 py-1 rounded-full font-jakarta text-xs font-bold">
            {t.thisWeek}
          </span>
        </div>

        {/* Bar Chart */}
        <div className="h-36 flex items-end justify-between gap-2 pt-2 px-2">
          {weeklySpend.map((spend, idx) => {
            const maxAmount = 500000;
            const heightPct = Math.min(100, Math.round((spend.amount / maxAmount) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div
                  className={`w-full rounded-2xl transition-all duration-500 ${
                    spend.isToday
                      ? 'bg-[#d1c4e9]'
                      : 'bg-white/15'
                  }`}
                  style={{ height: `${heightPct}%` }}
                />
                <span
                  className={`font-jakarta text-xs ${
                    spend.isToday ? 'font-black text-[#d1c4e9]' : 'font-bold text-gray-400'
                  }`}
                >
                  {getDayLabel(spend.shortDay)}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Savings Goal Section (Always Rupiah) */}
      <section className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <h3 className="font-jakarta font-black text-lg text-[#1b1b1d] dark:text-[#f3f0f2]">
            {t.savingsGoal}
          </h3>
          <button
            onClick={onOpenManageSavings}
            className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5] hover:underline cursor-pointer"
          >
            {t.manageGoal}
          </button>
        </div>

        <div
          onClick={onOpenManageSavings}
          className="expressive-card expressive-card-butter p-6 shadow-sm relative overflow-hidden text-[#1f1c00] cursor-pointer hover:scale-[1.01] active:scale-95 transition-all"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-black/10 flex items-center justify-center text-[#1f1c00]">
                <span className="material-symbols-outlined text-2xl">laptop_mac</span>
              </div>
              <div>
                <h4 className="font-jakarta font-black text-base text-[#1f1c00]">{savingsGoal.title || t.noSavingsGoal}</h4>
                <p className="font-jakarta text-xs font-bold opacity-80 text-[#1f1c00]">
                  Rp {savingsGoal.savedAmount.toLocaleString('id-ID')} / Rp {savingsGoal.targetAmount.toLocaleString('id-ID')}
                </p>
              </div>
            </div>
            <span className="bg-black/10 px-3 py-1 rounded-full font-jakarta font-black text-xs text-[#1f1c00]">
              {savingsPct}%
            </span>
          </div>

          <div className="w-full bg-black/15 h-3.5 rounded-full overflow-hidden mb-3">
            <div className="bg-[#1b1b1d] h-full rounded-full transition-all duration-700" style={{ width: `${savingsPct}%` }} />
          </div>

          <div className="flex flex-wrap justify-between items-center gap-x-2 gap-y-1 text-xs font-black opacity-90 text-[#1f1c00]">
            <span className="underline">{t.tapToDeposit}</span>
            <span>{t.almostThere}</span>
          </div>
        </div>
      </section>

      {/* Recent Transactions List (Always Rupiah) */}
      <section className="space-y-3">
        <div className="space-y-1 px-1">
          <h3 className="font-jakarta font-black text-lg text-[#1b1b1d] dark:text-[#f3f0f2]">
            {t.recentTransactions}
          </h3>
          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
            <span className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5]">
              {t.transactionsCount.replace('{count}', String(filteredTransactions.length))}
            </span>
            {transactions.length > 0 && (
              <button
                type="button"
                onClick={() => downloadTransactionsCsv(filteredTransactions)}
                className="flex items-center gap-1 font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5] hover:underline cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                {t.exportCsv}
              </button>
            )}
          </div>
        </div>

        {transactions.length === 0 && (
          <div className="text-center py-10 space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#635979] dark:text-[#cdc1e5] opacity-60">receipt_long</span>
            <p className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5]">{t.noTransactions}</p>
          </div>
        )}

        {transactions.length > 0 && filteredTransactions.length === 0 && (
          <div className="text-center py-10 space-y-3">
            <span className="material-symbols-outlined text-4xl text-[#635979] dark:text-[#cdc1e5] opacity-60">search_off</span>
            <p className="font-jakarta text-xs font-bold text-[#635979] dark:text-[#cdc1e5]">{t.noTransactionsMatch}</p>
          </div>
        )}

        <div className="space-y-3">
          {filteredTransactions.map((tx) => {
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className="expressive-card expressive-card-onyx p-4 flex flex-wrap items-center justify-between gap-x-3 gap-y-2 shadow-sm text-white"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center ${
                      tx.category === 'TRANSPORT'
                        ? 'bg-[#d1c4e9] text-[#1f1732]'
                        : tx.category === 'FOOD'
                        ? 'bg-[#ece28c] text-[#1f1c00]'
                        : 'bg-[#ffb8b3] text-[#410004]'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xl">
                      {tx.category === 'TRANSPORT'
                        ? 'directions_bus'
                        : tx.category === 'FOOD'
                        ? 'local_cafe'
                        : tx.category === 'INCOME'
                        ? 'work'
                        : 'menu_book'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-jakarta font-black text-sm text-white">
                      {tx.title}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span
                        className={`clay-chip px-2 py-0.5 font-jakarta text-[10px] font-extrabold ${
                          tx.category === 'TRANSPORT'
                            ? 'bg-[#d1c4e9] text-[#1f1732]'
                            : tx.category === 'FOOD'
                            ? 'bg-[#ece28c] text-[#1f1c00]'
                            : 'bg-[#ffb8b3] text-[#410004]'
                        }`}
                      >
                        {tx.category}
                      </span>
                      <span className="font-jakarta text-xs text-gray-300 font-bold whitespace-nowrap">{tx.date}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-auto">
                  <span
                    className={`font-jakarta font-black text-sm whitespace-nowrap flex-shrink-0 ${
                      isIncome ? 'text-emerald-400' : 'text-[#ffb8b3]'
                    }`}
                  >
                    {isIncome ? '+Rp ' : '-Rp '}{tx.amount.toLocaleString('id-ID')}
                  </span>
                  <button
                    type="button"
                    aria-label={langKey === 'id' ? 'Edit transaksi' : 'Edit transaction'}
                    onClick={() => onEditTransaction(tx)}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">edit</span>
                  </button>
                  <button
                    type="button"
                    aria-label={langKey === 'id' ? 'Hapus transaksi' : 'Delete transaction'}
                    onClick={() => {
                      if (window.confirm(t.deleteConfirm)) onDeleteTransaction(tx.id);
                    }}
                    className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-lg">delete</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
