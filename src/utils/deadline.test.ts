import { describe, it, expect } from 'vitest';
import { formatDeadlineLabel } from './deadline';
import { getTranslation } from './i18n';

const t = getTranslation('id');
const now = new Date(2026, 6, 29, 10, 0); // 2026-07-29 10:00

describe('formatDeadlineLabel', () => {
  it('returns empty string when there is no date', () => {
    expect(formatDeadlineLabel(undefined, t, undefined, now)).toBe('');
  });

  it('flags a past date as overdue', () => {
    expect(formatDeadlineLabel('2026-07-28', t, undefined, now)).toBe(t.overdue);
  });

  it('switches to hours once the deadline is today', () => {
    expect(formatDeadlineLabel('2026-07-29', t, '18:00', now)).toBe(`8 ${t.hours}`);
  });

  it('flags a due time already passed today as overdue', () => {
    expect(formatDeadlineLabel('2026-07-29', t, '09:00', now)).toBe(t.overdue);
  });

  it('counts whole days remaining while there is more than a day left', () => {
    expect(formatDeadlineLabel('2026-08-08', t, undefined, now)).toBe(`10 ${t.days}`);
  });
});
