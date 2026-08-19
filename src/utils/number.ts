export function parseNumericInput(raw: string): number {
  if (raw === null || raw === undefined) return NaN;
  const s = String(raw).trim();
  if (s === '') return NaN;
  const normalized = s.replace(/\s+/g, '').replace(/,/, '.');
  const n = parseFloat(normalized);
  return Number.isFinite(n) ? n : NaN;
}

export function isPositiveNumber(n: number): boolean {
  return !Number.isNaN(n) && n > 0;
}
