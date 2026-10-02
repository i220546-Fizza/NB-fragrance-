import type { BottleSize } from '../types';

/** The fixed set of bottle sizes every perfume can be configured with. */
export const BOTTLE_SIZES: BottleSize[] = ['10ML', '20ML', '30ML', '50ML', '100ML'];

/** "50ML" -> "50 ML" for display. */
export function prettySize(size: string): string {
  return size.replace(/ML$/i, ' ML');
}
