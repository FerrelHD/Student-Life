import React from 'react';
import { Transaction, WeeklySpend } from '../types';

interface VaultViewProps {
  transactions: Transaction[];
  totalCredits: number;
  weeklySpend: WeeklySpend[];
  onOpenAddTransaction: (type?: 'income' | 'expense') => void;
}

export const VaultView: React.FC<VaultViewProps> = ({
  transactions,
  totalCredits,
  weeklySpend,
  onOpenAddTransaction,
}) => {
  // Compute savings target percentage
  const savedAmount = 1300.0;
  const targetAmount = 2000.0;
  const savingsPct = Math.round((savedAmount / targetAmount) * 100);

  return (
    <div className="pt-24 pb-28 px-5 max-w-6xl mx-auto space-y-6 min-h-screen">
      {/* Hero Balance Card */}
      <section className="glass-panel rounded-2xl p-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4">
          <span className="font-mono-code text-xs text-[#ff544c] opacity-80 uppercase tracking-widest">
            [VAULT_ACCESS_01]
          </span>
        </div>

        <div className="space-y-1">
          <p className="font-mono-code text-xs text-[#e4beb9] uppercase tracking-widest">
            Total Available Credits
          </p>
          <h2 className="font-jakarta text-3xl md:text-4xl font-extrabold text-white tracking-tighter">
            ${totalCredits.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </h2>
        </div>

        {/* Savings Goal Progress */}
        <div className="mt-6 glass-red p-5 rounded-xl relative">
          <div className="flex justify-between items-end mb-3">
            <div>
              <p className="font-mono-code text-xs text-[#ff544c] uppercase font-bold">
                Current Mission
              </p>
              <h3 className="font-jakarta font-bold text-lg text-white">New MacBook Pro</h3>
            </div>
            <div className="text-right">
              <span className="font-jakarta text-2xl font-black text-[#ff544c]">{savingsPct}%</span>
            </div>
          </div>

          {/* XP Bar Style Progress */}
          <div className="h-2.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#ff544c] to-[#ffb4ac] rounded-full shadow-[0_0_15px_rgba(255,84,76,0.6)] transition-all duration-500"
              style={{ width: `${savingsPct}%` }}
            />
          </div>

          <div className="flex justify-between mt-2 font-mono-code text-xs text-[#e4beb9]">
            <span>${savedAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} saved</span>
            <span>Target: ${targetAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
          </div>
        </div>
      </section>

      {/* Quick Actions Grid */}
      <section className="grid grid-cols-2 gap-4">
        <button
          onClick={() => onOpenAddTransaction('income')}
          className="flex items-center justify-center gap-2 bg-[#ff544c] text-[#5c0005] font-jakarta font-bold text-base py-4 rounded-xl active:scale-95 transition-transform animate-pulse-red cursor-pointer shadow-lg shadow-[#ff544c]/20"
        >
          <span className="material-symbols-outlined">add_circle</span>
          <span>Deposit</span>
        </button>

        <button
          onClick={() => onOpenAddTransaction('expense')}
          className="flex items-center justify-center gap-2 glass-panel border-white/20 text-white font-jakarta font-bold text-base py-4 rounded-xl active:scale-95 transition-transform hover:bg-white/5 cursor-pointer"
        >
          <span className="material-symbols-outlined">payments</span>
          <span>Expenses</span>
        </button>
      </section>

      {/* Stats Preview (Bento Section) */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Weekly Spending Chart */}
        <div className="glass-panel rounded-2xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-jakarta font-bold text-base text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-[#ff544c]">insights</span>
              Weekly Burn
            </h3>
            <span className="font-mono-code text-xs text-[#ff544c] bg-[#ff544c]/10 px-2.5 py-1 rounded">
              -12% vs last week
            </span>
          </div>

          <div className="h-40 flex items-end justify-between gap-1.5 px-2 pt-4">
            {weeklySpend.map((spend, idx) => {
              const maxAmount = 140;
              const heightPct = Math.min(100, Math.round((spend.amount / maxAmount) * 100));

              return (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute -top-7 font-mono-code text-[11px] text-[#ff544c] font-bold opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-1.5 py-0.5 rounded border border-white/10 pointer-events-none">
                    ${spend.amount}
                  </div>

                  {/* Bar */}
                  <div
                    className={`w-full rounded-t-sm transition-all duration-300 ${
                      spend.isToday
                        ? 'bg-[#ff544c] shadow-[0_0_10px_rgba(255,84,76,0.4)]'
                        : 'bg-white/10 hover:bg-[#ff544c]/30'
                    }`}
                    style={{ height: `${heightPct}%` }}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex justify-between font-mono-code text-xs text-[#e4beb9] px-2">
            {weeklySpend.map((spend, idx) => (
              <span
                key={idx}
                className={spend.isToday ? 'text-[#ff544c] font-bold' : 'text-[#e4beb9]/60'}
              >
                {spend.day}
              </span>
            ))}
          </div>
        </div>

        {/* Spending Insights */}
        <div className="glass-panel rounded-2xl p-6 flex flex-col justify-between">
          <div className="space-y-4">
            <h3 className="font-jakarta font-bold text-base text-white">Spending Focus</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-[#ff544c] rounded-full" />
                <div>
                  <p className="font-mono-code text-xs text-[#e4beb9] uppercase">Food & Drink</p>
                  <p className="font-jakarta font-bold text-lg text-white">$450.00</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-2 h-10 bg-white/20 rounded-full" />
                <div>
                  <p className="font-mono-code text-xs text-[#e4beb9] uppercase">Tech & Gear</p>
                  <p className="font-jakarta font-bold text-lg text-white">$1,200.00</p>
                </div>
              </div>
            </div>
          </div>

          <button className="mt-6 text-[#ff544c] font-mono-code text-xs uppercase flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer">
            View Full Analysis <span className="material-symbols-outlined text-sm">chevron_right</span>
          </button>
        </div>
      </section>

      {/* Recent Transactions */}
      <section className="space-y-4">
        <div className="flex justify-between items-end px-1">
          <h3 className="font-jakarta text-xl font-bold text-white tracking-tight">
            Recent Transactions
          </h3>
          <span className="font-mono-code text-xs text-[#ff544c]">
            {transactions.length} Total
          </span>
        </div>

        <div className="space-y-3">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';

            return (
              <div
                key={tx.id}
                className={`glass-panel rounded-2xl p-4 flex items-center justify-between group hover:border-[#ff544c]/30 transition-colors ${
                  !isIncome ? 'border-l-4 border-l-[#ff544c]' : ''
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#353534]/60 flex items-center justify-center flex-shrink-0">
                    <span
                      className={`material-symbols-outlined text-xl ${
                        isIncome ? 'text-[#ff544c]' : 'text-white'
                      }`}
                    >
                      {tx.category === 'INCOME'
                        ? 'work'
                        : tx.category === 'FOOD'
                        ? 'lunch_dining'
                        : tx.category === 'TRANSPORT'
                        ? 'train'
                        : tx.category === 'SUBSCRIPTION'
                        ? 'shopping_bag'
                        : 'payments'}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-inter font-semibold text-sm text-white">{tx.title}</h4>
                    <p className="font-mono-code text-xs text-[#e4beb9]/70 uppercase">
                      [{tx.category}]
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <p
                    className={`font-jakarta font-bold text-base ${
                      isIncome ? 'text-[#ffb4ac]' : 'text-white'
                    }`}
                  >
                    {isIncome ? '+' : '-'}${tx.amount.toFixed(2)}
                  </p>
                  <p className="font-mono-code text-[11px] text-[#e4beb9]/60">{tx.date}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
