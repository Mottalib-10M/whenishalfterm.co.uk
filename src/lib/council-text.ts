/**
 * Generated prose of a council page. Every sentence is chosen by the council's data (two-week
 * October break or not, Easter inside or outside the break, INSET rule, 2027-28 published or not):
 * the dates come from the JSON file, never typed here. These blocks are marked data-chrome on the
 * page; what makes each page unique is its `localFacts`, read on the council's own pages.
 */
import { COUNCILS } from './councils';
import { breakOf, firstLastDay, yearSchoolDays, longDate, plainDate, rangeText, weekdaysIn, addDays, dayStatus, bankHolidays, type Council, type BreakKey, type YearKey, type Break } from './engine/calendar';
import type { FAQ } from './guide-types';

const Y1: YearKey = '2026-27', Y2: YearKey = '2027-28';
const published = (c: Council, y: YearKey) => !!c.years[y] && c.years[y]!.status !== 'not-published' && c.years[y]!.sessions.length > 0;
const who = (c: Council) => c.nation === 'northern-ireland' ? 'schools in Northern Ireland' : `${c.name} schools`;
export const dayAfter = (c: Council, b: Break) => {
  let d = addDays(b.end, 1);
  for (let i = 0; i < 80; i++, d = addDays(d, 1)) if (dayStatus(c, d).open) return d;
  return null;
};

/** Most common dates of a break across all councils of a nation (the "usual" pattern). */
export function modeOf(key: BreakKey, year: YearKey, nation: Council['nation']) {
  const m = new Map<string, number>();
  for (const c of COUNCILS.filter((x) => x.nation === nation)) {
    const b = breakOf(c, year, key);
    if (b) m.set(`${b.start}|${b.end}`, (m.get(`${b.start}|${b.end}`) ?? 0) + 1);
  }
  const top = [...m.entries()].sort((a, b) => b[1] - a[1])[0];
  if (!top) return null;
  const [start, end] = top[0].split('|');
  return { start, end, count: top[1], total: [...m.values()].reduce((a, b) => a + b, 0) };
}

export function councilIntro(c: Council): string {
  const o = breakOf(c, Y1, 'october'), x = breakOf(c, Y1, 'christmas');
  if (c.nation === 'northern-ireland') return `The common closure dates every school sector in Northern Ireland agreed for 2026-27, with the three extra TransformED days, and what each school still decides for itself.`;
  if (!published(c, Y1)) return `${c.officialName} has not yet published its 2026-27 calendar on its website.`;
  return `${c.officialName} calendar for 2026-27${published(c, Y2) ? ' and 2027-28' : ''}: ${o ? `${o.name} ${rangeText(o.start, o.end)}` : 'autumn term'}${x ? `, then ${x.name} from ${plainDate(x.start)}` : ''}.`;
}

export function councilResume(c: Council): string {
  const s: string[] = [];
  const fl = firstLastDay(c, Y1);
  const Y = c.years[Y1]!;
  if (fl) s.push(`${c.nation === 'northern-ireland' ? 'Schools in Northern Ireland resume' : `${c.name} schools go back`} on ${longDate(fl.first)} and the 2026-27 school year ends on ${longDate(fl.last)}, according to the calendar published by ${c.officialName}.`);
  const o = breakOf(c, Y1, 'october');
  if (o) s.push(o.weekdays >= 10 ? `The October break lasts two full weeks, from ${rangeText(o.start, o.end)}, twice the usual half term in most of England.` : o.weekdays <= 2 ? `The October break is short: ${o.weekdays} weekday${o.weekdays > 1 ? 's' : ''}, ${rangeText(o.start, o.end)}.` : `${o.name} is ${rangeText(o.start, o.end)}.`);
  const x = breakOf(c, Y1, 'christmas');
  if (x) { const back = dayAfter(c, x); s.push(`Christmas holidays run from ${rangeText(x.start, x.end)}${back ? `, with pupils back on ${longDate(back)}` : ''}.`); }
  const f = breakOf(c, Y1, 'february'), e = breakOf(c, Y1, 'easter');
  if (f) s.push(`${f.name} is ${rangeText(f.start, f.end)}${f.weekdays <= 2 ? `, only ${f.weekdays} days` : ''}.`);
  if (e) {
    const gf = '2027-03-26', em = '2027-03-29';
    const inside = e.start <= gf && em <= e.end;
    s.push(`The Easter holidays cover ${rangeText(e.start, e.end)}${inside ? ', taking in Good Friday and Easter Monday' : e.start > em ? ', after the Easter weekend' : ''}.`);
  }
  const m = breakOf(c, Y1, 'may'), su = breakOf(c, Y1, 'summer');
  if (m) s.push(`${m.name} is ${rangeText(m.start, m.end)}.`);
  if (su) s.push(`The summer holidays start on ${longDate(su.start)}.`);
  const days = yearSchoolDays(c, Y1);
  if (days !== null) {
    const inset = Y.insetMode === 'fixed' ? ` once the ${Y.inset?.length ?? 0} in-service days fixed by the council are taken out` : Y.insetMode === 'school-chooses' ? `, and each school then takes some of them as its own INSET days` : '';
    s.push(`That leaves ${days} weekdays in school${c.nation === 'scotland' ? '' : ' after bank holidays'}${inset}.`);
  }
  if (published(c, Y2)) {
    const f2 = firstLastDay(c, Y2), o2 = breakOf(c, Y2, 'october');
    s.push(`The 2027-28 calendar is ${c.years[Y2]!.status === 'provisional' ? 'out as a provisional draft' : 'already published'}${f2 ? `: school starts on ${longDate(f2.first)}` : ''}${o2 ? ` and the October break is ${rangeText(o2.start, o2.end)}` : ''}.`);
  } else s.push(`${c.officialName} had not published 2027-28 dates when we last checked.`);
  if (Y.source) s.push(`Dates read on ${c.officialName}'s own ${Y.source.format === 'pdf' ? 'PDF calendar' : Y.source.format === 'doc' || Y.source.format === 'docx' ? 'Word calendar' : 'web page'} on ${plainDate(Y.source.retrieved)}.`);
  return s.join(' ');
}

/** Comparison paragraphs: chosen by whether the council follows the most common pattern of its nation. */
export function councilCompare(c: Council): string {
  if (!published(c, Y1)) return '';
  const out: string[] = [];
  const keys: BreakKey[] = ['october', 'february', 'easter', 'may', 'summer'];
  const same: string[] = [], diff: string[] = [];
  for (const k of keys) {
    const b = breakOf(c, Y1, k), md = modeOf(k, Y1, c.nation);
    if (!b || !md || md.total < 3) continue;
    const lab = b.name.toLowerCase();
    if (b.start === md.start && b.end === md.end) same.push(lab);
    else diff.push(`${lab} (${rangeText(b.start, b.end)}, where ${md.count} of the ${md.total} ${nationWord(c)} calendars on this site have ${rangeText(md.start, md.end)})`);
  }
  if (same.length) out.push(`<p>${c.name} keeps the most common ${nationWord(c)} dates for its ${listAnd(same)}.</p>`);
  if (diff.length) out.push(`<p>It moves away from the usual pattern for its ${listAnd(diff)}. A family with children in two areas should check these weeks first.</p>`);
  const peers = COUNCILS.filter((x) => x.slug !== c.slug && x.region === c.region && published(x, Y1));
  if (peers.length) {
    const eB = breakOf(c, Y1, 'easter');
    const sameE = peers.filter((p) => { const q = breakOf(p, Y1, 'easter'); return q && eB && q.start === eB.start && q.end === eB.end; }).map((p) => p.name);
    const otherE = peers.filter((p) => !sameE.includes(p.name)).map((p) => p.name);
    if (eB) out.push(`<p>In the ${c.region} region, ${sameE.length ? `${listAnd(sameE)} ${sameE.length > 1 ? 'share' : 'shares'} the same Easter break` : 'no other council on this site has the same Easter break'}${otherE.length ? `, while ${listAnd(otherE.slice(0, 6))} ${otherE.length > 1 ? 'use' : 'uses'} different Easter dates` : ''}.</p>`);
  }
  return out.join('');
}
const nationWord = (c: Council) => c.nation === 'england' ? 'English' : c.nation === 'scotland' ? 'Scottish' : c.nation === 'wales' ? 'Welsh' : 'Northern Irish';
export const listAnd = (a: string[]) => a.length <= 1 ? (a[0] ?? '') : `${a.slice(0, -1).join(', ')} and ${a[a.length - 1]}`;

export function councilFaqs(c: Council): FAQ[] {
  const f: FAQ[] = [];
  if (!published(c, Y1)) return f;
  const o = breakOf(c, Y1, 'october');
  const ac = c.nation === 'northern-ireland' ? 'Each school can still open on a common closure date or add its own development days, so check the school calendar.' : 'Academies and voluntary aided schools can set other dates, so check the school website as well.';
  if (o) { const back = dayAfter(c, o); f.push({ q: `When is ${o.name} 2026 for ${who(c)}?`, a: `${c.officialName} lists ${rangeText(o.start, o.end)}, ${o.weekdays} weekday${o.weekdays > 1 ? 's' : ''} off${back ? `, and pupils return on ${longDate(back)}` : ''}. It is the first break of the school year that began on ${longDate(firstLastDay(c, Y1)?.first ?? o.start)}. ${ac}` }); }
  const x = breakOf(c, Y1, 'christmas');
  if (x) { const last = addDays(x.start, -1); let d = last; while (!dayStatus(c, d).open) d = addDays(d, -1); f.push({ q: `What is the last day before Christmas 2026 in ${c.name}?`, a: `The last school day on the ${c.officialName} calendar is ${longDate(d)}. The Christmas holidays then run ${rangeText(x.start, x.end)}, which covers Christmas Day, Boxing Day and New Year's Day. Some schools finish early on the last afternoon.` }); }
  const e = breakOf(c, Y1, 'easter');
  if (e) { const back = dayAfter(c, e); let lastE = addDays(e.start, -1); while (!dayStatus(c, lastE).open) lastE = addDays(lastE, -1); f.push({ q: `What are the Easter 2027 school holiday dates in ${c.name}?`, a: `${rangeText(e.start, e.end)} (${e.weekdays} weekdays), after a last day of the spring term on ${longDate(lastE)}. Easter Sunday is 28 March 2027${back ? `, and school starts again on ${longDate(back)}` : ''}. ${c.nation === 'scotland' ? 'The council may call this the spring holiday.' : 'Good Friday and Easter Monday are bank holidays either way.'}` }); }
  const su = breakOf(c, Y1, 'summer');
  const fl = firstLastDay(c, Y1);
  if (su && fl) f.push({ q: `When do ${who(c)} break up for summer 2027?`, a: `The last day of the 2026-27 school year is ${longDate(fl.last)}, so the summer holidays begin on ${longDate(su.start)}. ${published(c, Y2) ? `The council has set the first day back as ${longDate(firstLastDay(c, Y2)?.first ?? su.end)}.` : 'The return date in autumn 2027 will be on the 2027-28 calendar, not yet published.'} Days off before the end of term need the head teacher's agreement.` });
  return f;
}

/** Bank holidays that fall in term time (England, Wales, NI) for the table note. */
export function termBankHolidays(c: Council, y: YearKey): string[] {
  const Y = c.years[y];
  if (!Y || !published(c, y) || c.nation === 'scotland') return [];
  const bh = bankHolidays(c.nation);
  return [...bh.keys()].filter((d) => Y.sessions.some((s) => s.start <= d && d <= s.end)).map((d) => `${bh.get(d)} (${plainDate(d)})`);
}
export { weekdaysIn };
