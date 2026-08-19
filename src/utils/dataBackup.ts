export function formatExportJSON(data: Record<string, unknown>): string {
  return JSON.stringify({
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    ...data,
  }, null, 2);
}

export function parseImportJSON(jsonStr: string): Record<string, unknown> {
  const parsed = JSON.parse(jsonStr);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Invalid JSON structure');
  }
  return parsed;
}

// Self-check
if (typeof process !== 'undefined' && process.env?.NODE_ENV === 'test') {
  const sample = formatExportJSON({ profile: { name: 'Test' } });
  const restored = parseImportJSON(sample);
  if ((restored.profile as { name: string }).name !== 'Test') {
    throw new Error('Backup self-check failed');
  }
}
