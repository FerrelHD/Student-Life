import { Transaction } from '../types';

// A "series" is one recurring transaction identified by its title+category+type+amount.
// Given the latest known instance of each series, decide which ones are due for a
// fresh copy this month (i.e. their last instance was created in a prior month).
export function getDueRecurringTransactions(
  transactions: Transaction[],
  now: Date
): Transaction[] {
  const currentMonthKey = `${now.getFullYear()}-${now.getMonth()}`;
  const latestBySeries = new Map<string, Transaction>();

  for (const tx of transactions) {
    if (tx.recurrence !== 'monthly') continue;
    const seriesKey = `${tx.title}|${tx.category}|${tx.type}|${tx.amount}`;
    const existing = latestBySeries.get(seriesKey);
    if (!existing || new Date(tx.createdAt) > new Date(existing.createdAt)) {
      latestBySeries.set(seriesKey, tx);
    }
  }

  return Array.from(latestBySeries.values()).filter((tx) => {
    const createdAt = new Date(tx.createdAt);
    const monthKey = `${createdAt.getFullYear()}-${createdAt.getMonth()}`;
    return monthKey !== currentMonthKey;
  });
}
