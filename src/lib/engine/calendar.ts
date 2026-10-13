/**
 * School calendar engine. Pure functions, ISO dates ("2026-10-26"), UTC arithmetic only.
 * Data: one JSON file per council in `src/data/councils/` (read on the council's own page,
 * see CONTRIBUTING-COUNCILS.md) and the gov.uk bank holiday feed in `src/data/bank-holidays.json`.
 * Tested in tests/calendar.test.ts.
 */
import BANK from '../../data/bank-holidays.json';

export type Nation = 'england' | 'wales' | 'scotland' | 'northern-ireland';
export type YearKey = '2026-27' | '2027-28';
export const YEARS: YearKey[] = ['2026-27', '2027-28'];

export interface Session { start: string; end: string; label?: string }
export interface Holiday { name: string; start: string; end: string }
export interface DayNote { date: string; label: string }
export interface SourceInfo { officialUrl: string; pageUrl?: string; via: 'direct' | 'wayback' | 'webfetch'; fetchedUrl?: string; retrieved: string; format: string }
export interface CouncilYear {
  status: 'published' | 'provisional' | 'not-published';
  source?: SourceInfo;
  sessions: Session[];
  holidays: Holiday[];
  closures?: DayNote[];
  inset?: DayNote[];
  insetMode?: 'fixed' | 'school-chooses' | 'partly-fixed' | 'not-stated';
  insetNote?: string;
  statedDays?: number | null;
  notes?: string;
}
export interface LocalFact { fact: string; source: string }
export interface Council {
  slug: string; name: string; officialName: string; nation: Nation; region: string; type: string;
  appliesTo: string; academyNote: string; localFacts: LocalFact[];
  years: Partial<Record<YearKey, CouncilYear>>;
}

/* ----------------------------------------------------------------------------- dates */
const MS = 86_400_000;
const toMs = (iso: string) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10));
const fromMs = (ms: number) => new Date(ms).toISOString().slice(0, 10);
export const addDays = (iso: string, n: number) => fromMs(toMs(iso) + n * MS);
/** Whole days from a to b (b later = positive). */
export const daysBetween = (a: string, b: string) => Math.round((toMs(b) - toMs(a)) / MS);
/** 0 = Monday … 6 = Sunday. */
export const weekday = (iso: string) => (new Date(toMs(iso)).getUTCDay() + 6) % 7;
export const isWeekend = (iso: string) => weekday(iso) >= 5;
export const isIsoDate = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s) && fromMs(toMs(s)) === s;
/** Academic year containing a date: 1 August to 31 July. */
export function yearKeyOf(iso: string): string {
  const y = +iso.slice(0, 4), m = +iso.slice(5, 7);
  const start = m >= 8 ? y : y - 1;
  return `${start}-${String(start + 1).slice(2)}`;
}
/** Weekdays (Mon-Fri) from a to b inclusive. */
export function weekdaysIn(a: string, b: string): number {
  let n = 0;
  for (let d = a; d <= b; d = addDays(d, 1)) if (!isWeekend(d)) n++;
  return n;
}

/* ----------------------------------------------------------------------- bank holidays */
const DIVISION: Record<Nation, keyof typeof BANK.divisions> = { england: 'england-and-wales', wales: 'england-and-wales', scotland: 'scotland', 'northern-ireland': 'northern-ireland' };
const bankCache = new Map<Nation, Map<string, string>>();
export function bankHolidays(nation: Nation): Map<string, string> {
  if (!bankCache.has(nation)) bankCache.set(nation, new Map(BANK.divisions[DIVISION[nation]].map((e) => [e.date, e.title])));
  return bankCache.get(nation)!;
}
export const BANK_SOURCE = { url: BANK.page, feed: BANK.source, retrieved: BANK.retrieved };

/* ---------------------------------------------------------------------- holiday keys */
export type BreakKey = 'october' | 'christmas' | 'february' | 'easter' | 'may' | 'summer' | 'other';
export const BREAK_LABEL: Record<BreakKey, string> = {
  october: 'October half term', christmas: 'Christmas holidays', february: 'February half term',
  easter: 'Easter holidays', may: 'May half term', summer: 'Summer holidays', other: 'Other holiday',
};
/** The break a holiday belongs to, from its name first, then from its dates. */
export function breakKey(h: Holiday): BreakKey {
  const n = h.name.toLowerCase();
  const m = +h.start.slice(5, 7);
  const len = weekdaysIn(h.start, h.end);
  if (/christmas|winter break|winter holiday/.test(n)) return 'christmas';
  if (/easter|spring holiday|spring break/.test(n)) return 'easter';
  if (/summer holiday|summer break|^summer$/.test(n) || (/summer/.test(n) && !/half/.test(n))) return 'summer';
  if (/october|autumn half|autumn break|tattie|halloween/.test(n)) return 'october';
  if (/february|spring half|mid-?term/.test(n) && (m === 2 || m === 3 || m === 1)) return 'february';
  if (/may half|whitsun|summer half|late may|may half-term|spring bank/.test(n)) return 'may';
  if (/half.?term|mid.?term/.test(n)) {
    if (m === 10 || m === 11) return 'october';
    if (m === 2) return 'february';
    if (m === 5 || m === 6) return 'may';
  }
  if (len >= 3) {
    if (m === 10 || m === 11) return 'october';
    if (m === 12) return 'christmas';
    if (m === 2) return 'february';
    if (m === 3 || m === 4) return 'easter';
    if (m === 5 || (m === 6 && +h.start.slice(8, 10) < 15)) return 'may';
    if (m >= 6 && m <= 8) return 'summer';
  }
  return 'other';
}

/* -------------------------------------------------------------------------- day status */
export type DayKind = 'open' | 'weekend' | 'holiday' | 'bank-holiday' | 'inset' | 'closure' | 'unknown';
export interface DayStatus {
  date: string; open: boolean; kind: DayKind; label: string;
  year: string; holiday?: Holiday; breakKey?: BreakKey;
  /** England: schools choose some INSET days themselves, so an "open" day may still be one. */
  insetCaveat: boolean; provisional: boolean;
}
export const yearOf = (c: Council, iso: string): CouncilYear | undefined => c.years[yearKeyOf(iso) as YearKey];
const publishedYear = (Y?: CouncilYear) => !!Y && Y.status !== 'not-published' && Y.sessions.length > 0;

export function dayStatus(c: Council, iso: string): DayStatus {
  const year = yearKeyOf(iso);
  const Y = yearOf(c, iso);
  const base = { date: iso, year, insetCaveat: false, provisional: Y?.status === 'provisional' };
  if (isWeekend(iso)) return { ...base, open: false, kind: 'weekend', label: 'Weekend' };
  if (!publishedYear(Y)) {
    // The summer break that closes the previous year can run into August of a year not yet published.
    const prev = c.years[`${+year.slice(0, 4) - 1}-${year.slice(2, 4)}` as YearKey];
    const h = prev?.holidays.find((x) => x.start <= iso && iso <= x.end);
    if (h) return { ...base, open: false, kind: 'holiday', label: h.name, holiday: h, breakKey: breakKey(h) };
    return { ...base, open: false, kind: 'unknown', label: `${c.name} has not published ${year} dates yet` };
  }
  const y = Y!;
  const s = y.sessions.find((x) => x.start <= iso && iso <= x.end);
  if (!s) {
    const h = y.holidays.find((x) => x.start <= iso && iso <= x.end);
    if (h) return { ...base, open: false, kind: 'holiday', label: h.name, holiday: h, breakKey: breakKey(h) };
    if (iso < y.sessions[0].start || iso > y.sessions[y.sessions.length - 1].end) {
      const h2: Holiday = { name: 'Summer holidays', start: iso, end: iso };
      return { ...base, open: false, kind: 'holiday', label: 'Summer holidays', holiday: h2, breakKey: 'summer' };
    }
    return { ...base, open: false, kind: 'unknown', label: 'Not covered by the published calendar' };
  }
  const inset = y.inset?.find((x) => x.date === iso);
  if (inset) return { ...base, open: false, kind: 'inset', label: inset.label || 'INSET day' };
  const cl = y.closures?.find((x) => x.date === iso);
  if (cl) return { ...base, open: false, kind: /bank/i.test(cl.label) ? 'bank-holiday' : 'closure', label: cl.label };
  // Scotland: councils list their own local and public holidays; bank holidays are not school closures by themselves.
  if (c.nation !== 'scotland') {
    const bh = bankHolidays(c.nation).get(iso);
    if (bh) return { ...base, open: false, kind: 'bank-holiday', label: bh };
  }
  return { ...base, open: true, kind: 'open', label: s.label || 'Term time', insetCaveat: y.insetMode !== 'fixed' };
}

/** School days from `from` to `to` inclusive (pupil days under the published calendar). */
export function schoolDays(c: Council, from: string, to: string): number {
  let n = 0;
  for (let d = from; d <= to; d = addDays(d, 1)) if (dayStatus(c, d).open) n++;
  return n;
}

/** Pupil days in a published year: weekdays in sessions, less bank holidays, closures and fixed INSET days. */
export function yearSchoolDays(c: Council, key: YearKey): number | null {
  const Y = c.years[key];
  if (!publishedYear(Y)) return null;
  return Y!.sessions.reduce((n, s) => n + schoolDays(c, s.start, s.end), 0);
}

export interface Break extends Holiday { key: BreakKey; year: YearKey; weekdays: number }
/** All listed holidays of a council, both years, in order, with their break key. */
export function breaks(c: Council): Break[] {
  const out: Break[] = [];
  for (const k of YEARS) {
    const Y = c.years[k];
    if (!publishedYear(Y)) continue;
    for (const h of Y!.holidays) out.push({ ...h, key: breakKey(h), year: k, weekdays: weekdaysIn(h.start, h.end) });
  }
  return out.sort((a, b) => a.start.localeCompare(b.start));
}
/** One break of one year (the longest if a council lists two pieces with the same key). */
export function breakOf(c: Council, key: YearKey, b: BreakKey): Break | undefined {
  return breaks(c).filter((x) => x.year === key && x.key === b).sort((x, y) => y.weekdays - x.weekdays)[0];
}

export interface NextBreak { current?: Break; next?: Break; daysUntil: number | null; schoolDaysUntil: number | null }
/** The holiday under way on `iso`, if any, and the next one to start after it. */
export function nextBreak(c: Council, iso: string): NextBreak {
  const all = breaks(c).filter((b) => b.key !== 'other' || b.weekdays >= 1);
  const current = all.find((b) => b.start <= iso && iso <= b.end);
  const next = all.find((b) => b.start > iso);
  if (!next) return { current, daysUntil: null, schoolDaysUntil: null };
  return { current, next, daysUntil: daysBetween(iso, next.start), schoolDaysUntil: schoolDays(c, iso, addDays(next.start, -1)) };
}

/** School days left in the academic year from `iso` (inclusive). */
export function schoolDaysLeftInYear(c: Council, iso: string): number | null {
  const Y = yearOf(c, iso);
  if (!publishedYear(Y)) return null;
  return schoolDays(c, iso, Y!.sessions[Y!.sessions.length - 1].end);
}

/** First and last pupil day of a year. */
export function firstLastDay(c: Council, key: YearKey): { first: string; last: string } | null {
  const Y = c.years[key];
  if (!publishedYear(Y)) return null;
  let first = Y!.sessions[0].start;
  while (!dayStatus(c, first).open) first = addDays(first, 1);
  let last = Y!.sessions[Y!.sessions.length - 1].end;
  while (!dayStatus(c, last).open) last = addDays(last, -1);
  return { first, last };
}

/* -------------------------------------------------------------------------- comparison */
export interface Comparison {
  year: YearKey;
  /** Weekdays from 1 September to the later last day of term where both are off / only one is off. */
  bothOff: number; onlyA: number; onlyB: number;
  rows: Array<{ key: BreakKey; a?: Break; b?: Break; sharedWeekdays: number }>;
  /** Weekdays where one council's pupils are off and the other's are in school, listed. */
  mismatch: Array<{ date: string; off: 'a' | 'b'; label: string }>;
}
export function compareCouncils(a: Council, b: Council, key: YearKey): Comparison | null {
  const A = a.years[key], B = b.years[key];
  if (!publishedYear(A) || !publishedYear(B)) return null;
  const start = `${key.slice(0, 4)}-09-01`;
  const end = [A!.sessions[A!.sessions.length - 1].end, B!.sessions[B!.sessions.length - 1].end].sort()[1];
  let bothOff = 0, onlyA = 0, onlyB = 0;
  const mismatch: Comparison['mismatch'] = [];
  for (let d = start; d <= end; d = addDays(d, 1)) {
    if (isWeekend(d)) continue;
    const sa = dayStatus(a, d), sb = dayStatus(b, d);
    if (!sa.open && !sb.open) bothOff++;
    else if (!sa.open) { onlyA++; mismatch.push({ date: d, off: 'a', label: sa.label }); }
    else if (!sb.open) { onlyB++; mismatch.push({ date: d, off: 'b', label: sb.label }); }
  }
  const keys: BreakKey[] = ['october', 'christmas', 'february', 'easter', 'may', 'summer'];
  const rows = keys.map((k) => {
    const x = breakOf(a, key, k), y = breakOf(b, key, k);
    let shared = 0;
    if (x && y) {
      const s = x.start > y.start ? x.start : y.start;
      const e = x.end < y.end ? x.end : y.end;
      if (s <= e) shared = weekdaysIn(s, e);
    }
    return { key: k, a: x, b: y, sharedWeekdays: shared };
  });
  return { year: key, bothOff, onlyA, onlyB, rows, mismatch };
}

/* ---------------------------------------------------------------------------- display */
export function longDate(iso: string, withYear = true): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', ...(withYear ? { year: 'numeric' } : {}), timeZone: 'UTC' }).replace(',', '');
}
export function shortDate(iso: string, withYear = true): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short', ...(withYear ? { year: 'numeric' } : {}), timeZone: 'UTC' }).replace(',', '');
}
export function plainDate(iso: string): string {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
}
/** "26 to 30 October 2026", "21 December 2026 to 1 January 2027". */
export function rangeText(a: string, b: string): string {
  if (a === b) return plainDate(a);
  const da = new Date(`${a}T00:00:00Z`), db = new Date(`${b}T00:00:00Z`);
  const sameY = da.getUTCFullYear() === db.getUTCFullYear();
  const sameM = sameY && da.getUTCMonth() === db.getUTCMonth();
  const left = da.toLocaleDateString('en-GB', { day: 'numeric', ...(sameM ? {} : { month: 'long' }), ...(sameY ? {} : { year: 'numeric' }), timeZone: 'UTC' });
  return `${left} to ${plainDate(b)}`;
}
