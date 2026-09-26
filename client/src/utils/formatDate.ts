export function formatDate(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function estimatedDeliveryRange(input: string | Date): string {
  const d = typeof input === 'string' ? new Date(input) : input;
  const start = new Date(d);
  start.setDate(start.getDate() + 5);
  const end = new Date(d);
  end.setDate(end.getDate() + 7);
  const opts: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
  return `${start.toLocaleDateString('en-US', opts)} - ${end.toLocaleDateString('en-US', opts)}`;
}
