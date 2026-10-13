import { definePage } from '../../lib/guide-types';
import { firstLastDay, breakOf, yearSchoolDays } from '../../lib/engine/calendar';

const sc = (c: { nation: string }) => c.nation === 'scotland';
export default definePage({
  id: 'term-dates-scotland',
  group: 'nations',
  order: 310,
  mini: 'break:october',
  council: 'glasgow',
  related: ['inset-days', 'summer-holidays', 'bank-holidays', 'compare-term-dates', 'term-time-holiday-fines'],
  sources: ['scot_attendance', 'bank_holidays', 'govuk_find_council'],
  slug: 'term-dates-scotland',
  nav: 'Scotland term dates',
  card: 'August to June, in-service days and local holidays',
  title: 'Scotland School Term Dates 2026-27: Council by Council',
  description: 'Scotland school term dates 2026-27 by council: return in August, October holiday, February mid-term, spring holiday, in-service days and local holidays.',
  h1: 'Scottish school term dates 2026-27, council by council',
  intro: 'Scotland runs its own school year, earlier than England’s, and every council fixes its own in-service days.',
  resume: (h) => {
    const cs = h.councils.filter(sc);
    const firsts = cs.map((c) => firstLastDay(c, '2026-27')).filter(Boolean) as Array<{ first: string; last: string }>;
    const f0 = firsts.map((x) => x.first).sort();
    const l0 = firsts.map((x) => x.last).sort();
    return `Scottish schools start the year in mid-August and finish at the end of June, about five weeks ahead of England. Each of the 32 councils sets its own dates: ${cs.length ? `on the ${cs.length} Scottish councils of this site, pupils went back between ${h.date(f0[0])} and ${h.date(f0[f0.length - 1])} and the year ends between ${h.date(l0[0])} and ${h.date(l0[l0.length - 1])}` : 'the return falls in mid-August and the last day at the end of June'}. Instead of three half terms, the year has an October holiday of one or two weeks, two weeks at Christmas, a February mid-term of a few days, a spring holiday around Easter and local holidays such as a September weekend Monday or a May Day holiday. In-service days, when pupils stay at home, are fixed by the council and shown on its calendar, so the checker below includes them. Scotland has no penalty notice for term-time holidays, but most are recorded as unauthorised absence.`;
  },
  faqs: (h) => [
    { q: 'When do Scottish schools go back after the summer of 2027?', a: `${(() => { const d = h.councils.filter(sc).map((c) => firstLastDay(c, '2027-28')?.first).filter(Boolean).sort() as string[]; return d.length ? `For the Scottish councils that have published 2027-28, between ${h.date(d[0])} and ${h.date(d[d.length - 1])}` : 'In mid-August 2027, on dates each council publishes'; })()}. The council's in-service days usually come first, so pupils start a day or two after the staff.` },
    { q: 'Do all Scottish councils have the same October holiday?', a: 'No. Some take one week and others two, and the start date varies by a week or more across the country. Neighbouring councils often coordinate, but not always: compare two councils with the tool on this page if your family spans a boundary.' },
    { q: 'What is the September weekend?', a: 'A local holiday, usually a Friday and Monday or just a Monday in the second half of September, kept by many Scottish councils. It is set council by council and shown as a holiday on this site where the council lists it.' },
    { q: 'Can I be fined for a term-time holiday in Scotland?', a: 'No penalty notice exists in Scotland. The Scottish Government guidance asks schools to record most family holidays in term time as unauthorised absence, unless a parent’s job makes holidays in the school breaks impossible. Repeated unexplained absence can lead to an attendance order.' },
  ],
  body: (h) => {
    const cs = h.councils.filter(sc);
    const rows = cs.map((c) => { const fl = firstLastDay(c, '2026-27'); const o = breakOf(c, '2026-27', 'october'); const f = breakOf(c, '2026-27', 'february'); const e = breakOf(c, '2026-27', 'easter'); return [h.councilLink(c.slug), fl ? h.date(fl.first) : 'n/a', o ? h.range(o.start, o.end) : 'n/a', f ? h.range(f.start, f.end) : 'n/a', e ? h.range(e.start, e.end) : 'n/a', fl ? h.date(fl.last) : 'n/a', c.years['2026-27']?.inset?.length ?? 0]; });
    return `
<h2>The Scottish councils side by side</h2>
${cs.length ? h.table(['Council', 'Pupils back', 'October', 'February', 'Spring', 'Last day', 'In-service days'], rows, 'First and last pupil days exclude the in-service days fixed by each council.', ['l', 'l', 'l', 'l', 'l', 'l', 'r']) : '<p>The Scottish council calendars are being added.</p>'}
<h2>How a Scottish school year is built</h2>
<p>${(() => { const d = h.councils.filter(sc).map((c) => yearSchoolDays(c, '2026-27')).filter((x): x is number => x !== null).sort((a, b) => a - b); return d.length ? `On the calendars we hold, Scottish pupils have between ${d[0]} and ${d[d.length - 1]} school days in 2026-27 once in-service days and local holidays are taken out` : 'Scottish councils publish their in-service days and local holidays with the term dates'; })()}, in a year that starts in the second or third week of August. The October holiday, Christmas and the spring holiday then cut it into stretches of seven to eleven weeks, with shorter breaks for local holidays and the February mid-term. Each council consults head teachers and, often, its neighbours, and publishes the dates one or two years ahead, with the in-service days and local holidays included. That makes the council calendar more complete than in England, where schools pick their own training days.</p>
<h2>Local and public holidays</h2>
<p>Scottish bank holidays do not close schools by themselves. Councils publish their own list: Good Friday and Easter Monday sit inside or next to the spring holiday, a May Day holiday is common, and many councils keep a September weekend or a local holiday tied to a town's own calendar. St Andrew's Day is a Scottish bank holiday but a council decides whether its schools close. On this site, the checker uses only the holidays each council lists for its schools.</p>
<h2>Moving between Scotland and England</h2>
<p>A child who moves from England to Scotland in the summer can lose up to five weeks of holiday, because Scottish schools return in mid-August; a move the other way gives a very long summer. Families with children on both sides of the border, around Carlisle and the Borders for instance, can line up a Scottish and an English council with the comparison below.</p>
<!--tool:compare|cumberland-->`;
  },
});
