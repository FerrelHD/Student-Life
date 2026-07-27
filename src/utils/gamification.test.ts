import { describe, it, expect } from 'vitest';
import { addXP, checkBadgeThresholds } from './gamification';

describe('addXP', () => {
  it('adds xp without leveling up below the 1000xp boundary', () => {
    expect(addXP(100, 1, 50)).toEqual({ xp: 150, level: 1 });
  });

  it('levels up when crossing a 1000xp boundary', () => {
    expect(addXP(950, 1, 100)).toEqual({ xp: 1050, level: 2 });
  });

  it('never lowers the level below the current one', () => {
    expect(addXP(500, 3, 10)).toEqual({ xp: 510, level: 3 });
  });
});

describe('checkBadgeThresholds', () => {
  it('flags all badges at their exact thresholds', () => {
    expect(checkBadgeThresholds(14, 15000, 20)).toEqual({ b5: true, b6: true, b7: true });
  });

  it('flags no badges just below their thresholds', () => {
    expect(checkBadgeThresholds(13, 14999, 19)).toEqual({ b5: false, b6: false, b7: false });
  });
});
