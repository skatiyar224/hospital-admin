import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merges conditional class names and resolves Tailwind conflicts. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount) {
  if (amount == null || Number.isNaN(Number(amount))) return '—';
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
}

export function initials(name = '') {
  return name
    .replace(/^(dr\.?|mr\.?|mrs\.?|ms\.?)\s+/i, '')
    .split(' ')
    .filter(Boolean)
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

const ASSET_URL = import.meta.env.VITE_ASSET_URL || 'http://localhost:5000';

/** Turns a stored image path (/uploads/...) or URL into a src. Returns null if none. */
export function resolveImage(src) {
  if (!src) return null;
  return src.startsWith('http') ? src : `${ASSET_URL}${src}`;
}
