import { describe, it, expect } from 'vitest';
import { parseNumericInput, isPositiveNumber } from './number';

describe('parseNumericInput', () => {
  it('parses plain number', () => {
    expect(parseNumericInput('1234')).toBe(1234);
  });

  it('parses number with comma decimal', () => {
    expect(parseNumericInput('3,68')).toBeCloseTo(3.68);
  });

  it('parses number with spaces', () => {
    expect(parseNumericInput('  1 234 ')).toBe(1234);
  });

  it('returns NaN for invalid', () => {
    expect(Number.isNaN(parseNumericInput('abc'))).toBe(true);
  });
});

describe('isPositiveNumber', () => {
  it('returns true for >0', () => {
    expect(isPositiveNumber(1)).toBe(true);
  });

  it('returns false for 0 or negative', () => {
    expect(isPositiveNumber(0)).toBe(false);
    expect(isPositiveNumber(-1)).toBe(false);
  });
});
