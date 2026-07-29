import { getTranslation } from './i18n';

type Translation = ReturnType<typeof getTranslation>;

// Countdown label — days while there's time to spare, switching to hours
// once the deadline lands today ("3 Hari" -> "5 Jam" -> "Lewat tenggat").
export function formatDeadlineLabel(
  dateStr: string | undefined,
  t: Translation,
  time?: string,
  now = new Date()
): string {
  if (!dateStr) return '';

  const target = new Date(`${dateStr}T${time || '23:59'}`);
  const diffMs = target.getTime() - now.getTime();
  if (diffMs <= 0) return t.overdue;

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const targetDay = new Date(target.getFullYear(), target.getMonth(), target.getDate());
  const diffDays = Math.round((targetDay.getTime() - today.getTime()) / 86_400_000);

  if (diffDays >= 1) return `${diffDays} ${t.days}`;
  const hoursLeft = Math.max(1, Math.ceil(diffMs / 3_600_000));
  return `${hoursLeft} ${t.hours}`;
}
