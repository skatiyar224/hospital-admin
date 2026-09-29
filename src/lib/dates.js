/**
 * dates.js
 * Appointment dates are 'YYYY-MM-DD' strings in the HOSPITAL's timezone
 * (mirrors the backend). "Today" is therefore computed in that timezone,
 * not the visitor's, so a patient abroad sees the same bookable days.
 */
import { siteConfig } from './siteConfig';

export function todayString() {
  // en-CA formats as YYYY-MM-DD.
  return new Intl.DateTimeFormat('en-CA', { timeZone: siteConfig.timezone }).format(new Date());
}

export function addDays(dateStr, days) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** 0 = Sunday ... 6 = Saturday */
export function dayOfWeek(dateStr) {
  return new Date(`${dateStr}T00:00:00Z`).getUTCDay();
}

const fmt = (dateStr, options) => new Intl.DateTimeFormat('en-IN', { timeZone: 'UTC', ...options }).format(new Date(`${dateStr}T00:00:00Z`));

export const formatDateLong = (d) => fmt(d, { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
export const formatDateShort = (d) => fmt(d, { day: 'numeric', month: 'short', year: 'numeric' });
export const weekdayShort = (d) => fmt(d, { weekday: 'short' });
export const dayNumber = (d) => fmt(d, { day: 'numeric' });
export const monthShort = (d) => fmt(d, { month: 'short' });

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/** '14:30' -> '2:30 PM' */
export function formatTime(hhmm) {
  if (!hhmm) return '';
  const [h, m] = hhmm.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  return `${h % 12 || 12}:${String(m).padStart(2, '0')} ${suffix}`;
}

/** Age in whole years from a 'YYYY-MM-DD' birth date. */
export function ageFromDob(dob) {
  if (!dob) return null;
  const today = todayString();
  let age = Number(today.slice(0, 4)) - Number(dob.slice(0, 4));
  if (today.slice(5) < dob.slice(5)) age -= 1;
  return age;
}
