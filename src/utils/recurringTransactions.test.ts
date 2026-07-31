import { describe, it, expect } from 'vitest';
import { getDueRecurringTransactions } from './recurringTransactions';
import { Transaction } from '../types';

const base: Transaction = {
  id: '1',
  title: 'Uang Saku Bulanan',
  category: 'INCOME',
  amount: 1500000,
  type: 'income',
  date: 'Hari ini, 09:00',
  recurrence: 'monthly',
  createdAt: '2026-06-01T09:00:00Z',
};

describe('getDueRecurringTransactions', () => {
  it('flags a recurring transaction last created in a prior month as due', () => {
    const now = new Date('2026-07-31T12:00:00Z');
    expect(getDueRecurringTransactions([base], now)).toEqual([base]);
  });

  it('does not flag a recurring transaction already created this month', () => {
    const now = new Date('2026-06-15T12:00:00Z');
    expect(getDueRecurringTransactions([base], now)).toEqual([]);
  });

  it('ignores non-recurring transactions', () => {
    const oneOff: Transaction = { ...base, recurrence: 'none' };
    const now = new Date('2026-07-31T12:00:00Z');
    expect(getDueRecurringTransactions([oneOff], now)).toEqual([]);
  });

  it('only checks the latest instance of a series, not older ones', () => {
    const older = { ...base, id: '0', createdAt: '2026-01-01T09:00:00Z' };
    const latest = { ...base, id: '2', createdAt: '2026-07-01T09:00:00Z' };
    const now = new Date('2026-07-31T12:00:00Z');
    expect(getDueRecurringTransactions([older, latest], now)).toEqual([]);
  });
});
