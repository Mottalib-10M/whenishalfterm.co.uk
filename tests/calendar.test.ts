import { describe, it, expect } from 'vitest';
import { dayStatus, nextBreak, yearSchoolDays, schoolDays, compareCouncils, breakOf, breakKey, weekdaysIn, yearKeyOf, firstLastDay, isIsoDate, type Council } from '../src/lib/engine/calendar';
import kent from '../src/data/councils/kent.json';
import surrey from '../src/data/councils/surrey.json';
import ni from '../src/data/councils/northern-ireland.json';

const K = kent as unknown as Council, S = surrey as unknown as Council, N = ni as unknown as Council;

describe('dates', () => {
  it('academic year runs August to July', () => {
    expect(yearKeyOf('2026-08-01')).toBe('2026-27');
    expect(yearKeyOf('2027-07-31')).toBe('2026-27');
    expect(yearKeyOf('2027-08-01')).toBe('2027-28');
  });
  it('validates ISO dates', () => {
    expect(isIsoDate('2027-02-29')).toBe(false);
    expect(isIsoDate('2028-02-29')).toBe(true);
  });
  it('counts weekdays', () => { expect(weekdaysIn('2026-10-26', '2026-11-01')).toBe(5); });
});

describe('Kent (Kent County Council PDF 2026-27, read 2026-10-12)', () => {
  it('Term 1 ends Friday 23 October, half term the following week', () => {
    expect(dayStatus(K, '2026-10-23').open).toBe(true);
    const s = dayStatus(K, '2026-10-26');
    expect(s.open).toBe(false); expect(s.kind).toBe('holiday'); expect(s.breakKey).toBe('october');
    expect(dayStatus(K, '2026-11-02').open).toBe(true);
  });
  it('closes on the early May bank holiday inside Term 5', () => {
    const s = dayStatus(K, '2027-05-03');
    expect(s.open).toBe(false); expect(s.kind).toBe('bank-holiday');
  });
  it('weekend and Good Friday', () => {
    expect(dayStatus(K, '2026-10-24').kind).toBe('weekend');
    expect(dayStatus(K, '2027-03-26').breakKey).toBe('easter');
  });
  it('195 days on the council calendar, as Kent states', () => {
    expect(yearSchoolDays(K, '2026-27')).toBe(195);
    expect(yearSchoolDays(K, '2027-28')).toBe(195);
  });
  it('flags the INSET caveat on an open day', () => { expect(dayStatus(K, '2026-10-12').insetCaveat).toBe(true); });
  it('countdown from Monday 12 October 2026: 14 days, 10 school days to half term', () => {
    const n = nextBreak(K, '2026-10-12');
    expect(n.next?.key).toBe('october'); expect(n.daysUntil).toBe(14); expect(n.schoolDaysUntil).toBe(10);
  });
  it('during a break, the next one is the following break', () => {
    const n = nextBreak(K, '2026-10-28');
    expect(n.current?.key).toBe('october'); expect(n.next?.key).toBe('christmas');
  });
  it('first and last pupil days', () => {
    expect(firstLastDay(K, '2026-27')).toEqual({ first: '2026-09-01', last: '2027-07-21' });
  });
  it('summer 2026 before the first published year counts as holiday', () => {
    expect(dayStatus(K, '2026-08-20').breakKey).toBe('summer');
  });
  it('school days across a term', () => { expect(schoolDays(K, '2026-09-01', '2026-10-23')).toBe(39); });
});

describe('Surrey against Kent, 2026-27', () => {
  it('Surrey breaks two weeks in October', () => { expect(breakOf(S, '2026-27', 'october')?.weekdays).toBe(10); });
  it('5 days when only Surrey is off (19 to 23 October) and 5 when only Kent is off (22 to 28 July)', () => {
    const c = compareCouncils(K, S, '2026-27')!;
    expect(c.onlyB).toBe(5); expect(c.onlyA).toBe(5);
    expect(c.rows.find((r) => r.key === 'october')!.sharedWeekdays).toBe(5);
  });
});

describe('Northern Ireland common closure dates 2026-27', () => {
  it('St Patrick’s Day and the TransformED days are closures', () => {
    expect(dayStatus(N, '2027-03-17').open).toBe(false);
    expect(dayStatus(N, '2026-09-25').open).toBe(false);
    expect(dayStatus(N, '2027-05-04').open).toBe(false);
  });
  it('summer from 1 July', () => { expect(dayStatus(N, '2027-07-01').breakKey).toBe('summer'); expect(dayStatus(N, '2027-06-30').open).toBe(true); });
  it('2027-28 not published: unknown, not guessed', () => { expect(dayStatus(N, '2027-09-15').kind).toBe('unknown'); });
  it('Halloween break is the October break', () => { expect(breakOf(N, '2026-27', 'october')?.start).toBe('2026-10-29'); });
});

describe('break names', () => {
  it('classifies Scottish names', () => {
    expect(breakKey({ name: 'October holiday', start: '2026-10-12', end: '2026-10-23' })).toBe('october');
    expect(breakKey({ name: 'February mid-term', start: '2027-02-15', end: '2027-02-16' })).toBe('february');
    expect(breakKey({ name: 'Spring holiday', start: '2027-03-29', end: '2027-04-09' })).toBe('easter');
    expect(breakKey({ name: 'September weekend', start: '2026-09-21', end: '2026-09-21' })).toBe('other');
  });
});
