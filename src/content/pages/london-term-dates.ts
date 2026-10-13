import { definePage } from '../../lib/guide-types';

const lon = (c: { region: string }) => c.region === 'London';
export default definePage({
  id: 'london-term-dates',
  group: 'nations',
  order: 300,
  mini: 'break:easter',
  council: 'croydon',
  related: ['compare-term-dates', 'half-term-dates', 'easter-holidays', 'summer-holidays', 'inset-days'],
  sources: ['govuk_find_council', 'bank_holidays', 'school_day_regs'],
  slug: 'london-term-dates',
  nav: 'London term dates',
  card: 'The boroughs side by side, and the ones that differ',
  title: 'London Term Dates 2026-27: Borough by Borough, Side by Side',
  description: 'London school term dates 2026-27 borough by borough: the shared London pattern, boroughs that start early or break later, half terms, Easter and summer.',
  h1: 'London term dates 2026-27, borough by borough',
  intro: 'Thirty-two boroughs, one city, mostly one calendar. Here is where London agrees and where it does not.',
  resume: (h) => {
    const ls = h.councils.filter(lon);
    const o = h.groups('october', '2026-27', lon);
    const e = h.groups('easter', '2026-27', lon);
    return `Every London borough sets the term dates of its own community and voluntary controlled schools, but most follow the same pattern, which makes it possible for a child to live in one borough and go to school in another without a second calendar. Of the ${ls.length} boroughs on this site, ${o[0] ? `${o[0].names.length} take October half term ${h.range(o[0].start, o[0].end)}` : 'most take the last week of October'} and ${e[0] ? `${e[0].names.length} have the Easter holidays ${h.range(e[0].start, e[0].end)}` : 'most share the same Easter weeks'}. The differences are at the edges: a borough that starts in late August, one that takes two weeks in October, others whose summer term runs a few days later into July. Wandsworth notes that its dates are based on those agreed by the London Inter Authority Admissions Group. Academies, which are numerous in London, can set their own. Pick a borough below for its Easter dates, or open its page for the full calendar.`;
  },
  faqs: (h) => [
    { q: 'Do all London boroughs have the same school holidays?', a: `Not quite. Most of the ${h.councils.filter(lon).length} boroughs on this site share the main breaks, but some start the year on a different day, take a longer October break or end the summer term later. The table on this page shows each borough for each break.` },
    { q: 'My child lives in one borough and goes to school in another: whose dates apply?', a: 'The dates of the school, which are those of the borough where the school is, or the academy trust’s if it is an academy. Where you live does not matter for term dates. It matters for admissions, which are coordinated across London.' },
    { q: 'When do London schools go back after the summer of 2026?', a: `${(() => { const m = new Map<string, string[]>(); for (const c of h.councils.filter(lon)) { const d = c.years['2026-27']?.sessions[0]?.start; if (d) m.set(d, [...(m.get(d) ?? []), c.name]); } return [...m.entries()].sort((a, b) => b[1].length - a[1].length).map(([d, n]) => `${h.date(d)}: ${n.length} borough${n.length > 1 ? 's' : ''}`).join('; '); })()}. Those are the dates on each borough’s own calendar; INSET days chosen by each school can delay the first day for pupils by one or two days, so check the school letter sent before the summer.` },
  ],
  body: (h) => {
    const keys = ['october', 'christmas', 'february', 'easter', 'may', 'summer'] as const;
    const blocks = keys.map((k) => {
      const g = h.groups(k, '2026-27', lon);
      if (!g.length) return '';
      return `<h3>${k === 'october' ? 'October half term 2026' : k === 'christmas' ? 'Christmas 2026' : k === 'february' ? 'February half term 2027' : k === 'easter' ? 'Easter 2027' : k === 'may' ? 'May half term 2027' : 'Summer 2027'}</h3><p>${g.map((x) => `${h.range(x.start, x.end)}: ${x.names.join(', ')}`).join('. ')}.</p>`;
    }).join('');
    const firsts = h.councils.filter(lon).map((c) => [h.councilLink(c.slug), c.years['2026-27']?.sessions[0] ? h.date(c.years['2026-27']!.sessions[0].start) : 'n/a', c.years['2026-27']?.sessions.at(-1) ? h.date(c.years['2026-27']!.sessions.at(-1)!.end) : 'n/a', c.years['2027-28'] && c.years['2027-28']!.status !== 'not-published' ? c.years['2027-28']!.status : 'not yet']);
    return `
<h2>The London pattern, break by break</h2>
<p>Grouping the boroughs by their dates shows where London speaks with one voice. The first group of each break is the largest.</p>
${blocks}
<h2>First and last day of the year, by borough</h2>
${h.table(['Borough', 'Term starts', 'Term ends', '2027-28'], firsts, 'Council calendar dates; INSET days may move the first day for pupils.', ['l', 'l', 'l', 'l'])}
<h2>Why London mostly agrees</h2>
<p>London children cross borough lines to school more than anywhere else in the country, and secondary admissions are coordinated across the capital. A borough that set very different holidays would leave thousands of families with two calendars. The boroughs therefore tend to align, and the pan-London admissions arrangements give them a common reference, which Wandsworth's term dates page names as its basis.</p>
<h2>Academies and church schools</h2>
<p>Many London secondary schools are academies, and many primary schools are voluntary aided church schools. Both set their own term dates. Most follow their borough, but a trust with schools in several boroughs may use one calendar for all of them. Always check the school's own calendar for INSET days and for any difference from the borough.</p>
<!--tool:compare|croydon-->
<h2>Living in London, working outside it</h2>
<p>The home counties do not always follow London. A parent working in Surrey or Kent whose children are at school in a London borough can compare the two calendars above: in 2026-27, Surrey's two-week October break is the main source of mismatched days.</p>`;
  },
});
