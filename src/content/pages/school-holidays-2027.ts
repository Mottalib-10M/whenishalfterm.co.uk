import { definePage } from '../../lib/guide-types';
import { breakOf, type YearKey } from '../../lib/engine/calendar';

export default definePage({
  id: 'school-holidays-2027',
  group: 'breaks',
  order: 80,
  mini: 'countdown',
  related: ['february-half-term', 'easter-holidays', 'may-half-term', 'summer-holidays', 'bank-holidays'],
  sources: ['bank_holidays', 'govuk_find_council', 'ni_holidays'],
  slug: 'school-holidays-2027',
  nav: 'School holidays 2027',
  card: 'Every break of the calendar year 2027, January to December',
  title: 'School Holidays 2027: Every Break From January to December',
  description: 'School holidays 2027 for the calendar year, by council: February half term, Easter, May half term, summer, and October 2027 where already published so far.',
  h1: 'School holidays 2027, January to December',
  intro: 'The calendar year 2027 straddles two school years: the second half of 2026-27 and the start of 2027-28.',
  resume: (h) => {
    const e = h.groups('february', '2026-27', (c) => c.nation === 'england')[0];
    const ea = h.groups('easter', '2026-27', (c) => c.nation === 'england')[0];
    const pub = h.councils.filter((c) => c.years['2027-28'] && c.years['2027-28']!.status !== 'not-published').length;
    return `School holidays in 2027 come from two school years. From January to July, the 2026-27 calendar applies: in most of England February half term ${e ? h.range(e.start, e.end) : 'in mid-February'}, the Easter holidays ${ea ? h.range(ea.start, ea.end) : 'around Easter Sunday, 28 March'}, May half term from the spring bank holiday on 31 May and a summer break from the third or fourth week of July. From September, the 2027-28 calendar takes over, with October half term and the start of the Christmas holidays in December 2027. ${pub} of the ${h.councils.length} calendars on this site already include 2027-28; for the others the autumn of 2027 is not yet known. The bank holidays of 2027 in England and Wales are 1 January, 26 and 29 March, 3 and 31 May, 30 August and 27 and 28 December, the last two standing in for a Christmas Day and Boxing Day that fall on a weekend. The countdown below lists your council's next breaks.`;
  },
  faqs: (h) => [
    { q: 'What are the main school holidays in 2027?', a: 'February half term, two weeks at Easter around 28 March, May half term from 31 May, about six weeks in summer from late July, October half term in late October and the Christmas holidays from about 20 December 2027. Each council fixes the exact dates.' },
    { q: 'Are the autumn 2027 holidays published yet?', a: `For ${h.councils.filter((c) => c.years['2027-28'] && c.years['2027-28']!.status !== 'not-published').length} of the ${h.councils.length} calendars on this site, yes. Councils normally publish a year at least a year ahead; the council pages say when a year is provisional or not yet out.` },
    { q: 'How many weeks of school holidays are there in 2027?', a: 'About thirteen weeks in England and Wales: one each for the three half terms, two at Easter, two at Christmas spread over two years, and six in summer. INSET days add about a week of days without pupils, chosen by each school.' },
  ],
  body: (h) => {
    const row = (c: (typeof h.councils)[number], y: YearKey, k: Parameters<typeof breakOf>[2]) => { const b = breakOf(c, y, k); return b ? h.range(b.start, b.end) : c.years[y]?.status === 'not-published' || !c.years[y] ? 'not yet' : 'n/a'; };
    const rows = h.councils.map((c) => [h.councilLink(c.slug), row(c, '2026-27', 'february'), row(c, '2026-27', 'easter'), row(c, '2026-27', 'may'), row(c, '2027-28', 'october')]);
    return `
<h2>The year at a glance, council by council</h2>
${h.table(['Council', 'February', 'Easter', 'May', 'October 2027'], rows, 'From the council calendars for 2026-27 and 2027-28.', ['l', 'l', 'l', 'l', 'l'])}
<p>Summer 2027 and Christmas 2027 have their own pages: the ${h.a('summer-holidays', 'summer holidays 2027')} by last day of term, and the ${h.a('christmas-holidays', 'Christmas holidays')} with both years.</p>
<h2>A year split in two</h2>
<p>Parents planning a calendar year often look for "2027" dates, but councils publish by school year, September to July. The first seven months of 2027 belong to 2026-27, which every council has published. The last four months belong to 2027-28, which many councils publish a year or more in advance and some only in the spring before. A council marked "not yet" in the October column has not released its 2027-28 calendar on its website at the date we read it.</p>
<h2>What is different about 2027</h2>
<p>Easter falls early, on 28 March, so the spring term is short and the summer term long. Christmas Day and Boxing Day fall on a Saturday and Sunday, so the substitute bank holidays are Monday 27 and Tuesday 28 December 2027 and New Year's Day is observed on Monday 3 January 2028. In Scotland, the summer bank holiday is Monday 2 August 2027 and St Andrew's Day falls on Tuesday 30 November 2027. In Northern Ireland, St Patrick's Day is a Wednesday and the Twelfth a Monday.</p>
<h2>Scotland and Northern Ireland in 2027</h2>
<p>Scottish schools break up for summer at the end of June 2027 and return in mid-August, so their 2027-28 year starts weeks before England's. Northern Ireland's summer holiday begins on 1 July 2027. The ${h.a('term-dates-scotland', 'Scotland page')} and the ${h.a('northern-ireland-term-dates', 'Northern Ireland page')} give the details.</p>
<!--tool:compare|essex-->`;
  },
});
