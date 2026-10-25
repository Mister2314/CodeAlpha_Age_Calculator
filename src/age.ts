/** Calendar-aware date math. All helpers work on local dates. */

export function isLeapYear(year: number): boolean {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year: number, month: number): number {
  // month: 1-12
  if (month === 2) return isLeapYear(year) ? 29 : 28;
  return [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export interface Age {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
}

/** Full years / months / days between two local dates, plus elapsed totals. */
export function diffYMD(from: Date, to: Date): Age {
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months--;
    // days in the month before `to`'s month
    const prevMonth = to.getMonth() === 0 ? 12 : to.getMonth();
    const prevYear = to.getMonth() === 0 ? to.getFullYear() - 1 : to.getFullYear();
    days += daysInMonth(prevYear, prevMonth);
  }
  if (months < 0) {
    months += 12;
    years--;
  }

  const totalDays = Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / 86_400_000);
  const totalHours = Math.floor((to.getTime() - startOfDay(from).getTime()) / 3_600_000);

  return { years, months, days, totalDays, totalHours };
}

export function ageAt(birth: Date, now: Date): Age {
  return diffYMD(birth, now);
}

/**
 * Next birthday as a real Date.
 * Feb 29 birthdays fall back to Mar 1 in non-leap years
 * (new Date() rolls over automatically — same convention).
 */
export function nextBirthday(birth: Date, now: Date): { date: Date; daysUntil: number; isToday: boolean } {
  const today = startOfDay(now);
  let candidate = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
  // Feb 29 in a non-leap year rolls forward to Mar 1 — keep it.
  if (candidate.getTime() < today.getTime()) {
    candidate = new Date(today.getFullYear() + 1, birth.getMonth(), birth.getDate());
  }
  const daysUntil = Math.round((candidate.getTime() - today.getTime()) / 86_400_000);
  return { date: candidate, daysUntil, isToday: daysUntil === 0 };
}

/** True if this date is Feb 29. */
export function isLeapDay(d: Date): boolean {
  return d.getMonth() === 1 && d.getDate() === 29;
}

export function isValidDate(y: number, m: number, d: number): boolean {
  if (m < 1 || m > 12) return false;
  return d >= 1 && d <= daysInMonth(y, m);
}
