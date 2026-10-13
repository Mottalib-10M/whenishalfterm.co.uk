import { definePage } from '../../lib/guide-types';

const eng = (c: { nation: string }) => c.nation === 'england';
export default definePage({
  id: 'christmas-holidays',
  group: 'breaks',
  order: 30,
  mini: 'break:christmas',
  related: ['october-half-term', 'february-half-term', 'bank-holidays', 'school-days-left', 'term-dates-scotland'],
  sources: ['bank_holidays', 'govuk_find_council', 'ni_holidays'],
  slug: 'christmas-holidays',
  nav: 'Christmas holidays 2026',
  card: 'Last day of term, first day back in January',
  title: 'Christmas Holidays 2026: School Break-Up Dates by Council',
  description: 'Christmas holidays 2026 by council: the last day of the autumn term, the first day back in January 2027, the bank holidays in the break, Scotland and NI.',
  h1: 'Christmas school holidays 2026: last day and return by council',
  intro: 'Two weeks for nearly everyone, but the last day of term and the first day of January differ more than you would think.',
  resume: (h) => {
    const g = h.groups('christmas', '2026-27', eng);
    return `The Christmas holidays 2026 run from ${g[0] ? h.range(g[0].start, g[0].end) : 'Monday 21 December 2026 to Friday 1 January 2027'} for ${g[0] ? `${g[0].names.length} of the English councils on this site` : 'most of England'}: the autumn term ends on Friday 18 December and pupils return on Monday 4 January 2027. Christmas Day falls on a Friday this year and Boxing Day on a Saturday, so the substitute bank holiday is Monday 28 December, inside the break, as is New Year's Day on Friday 1 January. Councils that start the spring term on Tuesday 5 January give one more day. Scotland adds 2 January as a bank holiday, moved to Monday 4 January 2027, so Scottish schools return later. Northern Ireland's common closure runs from 21 December to 1 January. Pick your council below for its exact last day and first day back, and the school days left before the break.`;
  },
  faqs: (h) => [
    { q: 'What day do schools break up for Christmas 2026?', a: 'In most of England the last day of the autumn term is Friday 18 December 2026. Some schools finish at lunchtime that day. A few councils end on Thursday 17 December, or keep schools open to Monday 21 or Tuesday 22 December: the table on this page lists each one.' },
    { q: 'When do children go back to school in January 2027?', a: 'For most English councils on this site, Monday 4 January 2027. Some schools take that Monday as an INSET day, which moves the return for pupils to Tuesday 5 January. In Scotland, 4 January is the substitute bank holiday for 2 January, so no council returns that day.' },
    { q: 'Are the Christmas bank holidays counted as school holidays?', a: 'They fall inside the break, so they make no difference to school days. In 2026 the bank holidays in England and Wales are Friday 25 December, Monday 28 December (in place of Boxing Day) and Friday 1 January 2027, all within the two weeks.' },
    { q: 'When are the Christmas holidays 2027?', a: `${(() => { const g = h.groups('christmas', '2027-28', eng)[0]; return g ? `Where the 2027-28 calendar is out, mostly ${h.range(g.start, g.end)}.` : 'Most councils have not published 2027-28 yet.'; })()} Christmas Day 2027 falls on a Saturday, so the substitute bank holidays are Monday 27 and Tuesday 28 December, and New Year's Day is moved to Monday 3 January 2028.` },
  ],
  body: (h) => {
    const g = h.groups('christmas', '2026-27', eng);
    return `
<h2>How the 2026 break falls</h2>
<p>December 2026 starts on a Tuesday. The fifteenth week of a term that began in the first week of September ends on Friday 18 December, which is why that Friday is the last day for most schools. The two weeks that follow contain every public holiday of the season: Christmas Day on Friday 25, the Boxing Day substitute on Monday 28, and New Year's Day on Friday 1 January. The spring term then starts on Monday 4 January 2027, the first working Monday of the year.</p>
${g.length > 1 ? `<p>Not every council follows that pattern. ${g.slice(1).map((x) => `${x.names.join(', ')}: ${h.range(x.start, x.end)}`).join('; ')}.</p>` : ''}
<h2>Every council, Christmas 2026</h2>
${h.breakTable('christmas', '2026-27')}
<h2>The last day of term</h2>
<p>The council calendar gives the last day, not the time. Many schools finish early on the final afternoon, and breakfast and after-school clubs may close early that week. Schools tell parents by letter in November. If the last day falls on a Friday and the school takes an INSET day on the Thursday, the break starts a day sooner for pupils; that happens, but it is rarer at Christmas than at half term.</p>
<h2>Scotland and the 2 January holiday</h2>
<p>Scotland has an extra bank holiday on 2 January. In 2027 it falls on a Saturday and is moved to Monday 4 January, the day most of England goes back. Scottish schools therefore cannot restart that Monday, and each council sets its own first day back. St Andrew's Day, on Monday 30 November 2026, is a bank holiday in Scotland but not a school holiday in every council; the ${h.a('term-dates-scotland', 'Scotland page')} shows which councils close.</p>
<h2>Northern Ireland</h2>
<p>The common closure dates for 2026-27 give Christmas and New Year from 21 December 2026 to 1 January 2027, with schools resuming on Monday 4 January. Individual schools can add school development days on either side.</p>
<!--tool:countdown-->
<h2>Christmas 2027 for the planners</h2>
<p>Christmas Day 2027 is a Saturday. England and Wales therefore have bank holidays on Monday 27 and Tuesday 28 December 2027 and on Monday 3 January 2028, in place of New Year's Day.${(() => { const g = h.groups('christmas', '2027-28', eng)[0]; return g ? ` Councils that have published 2027-28 mostly close ${h.range(g.start, g.end)}.` : ''; })()} The council pages say which have published.</p>
<h2>Childcare and the gap days</h2>
<p>For working parents the difficult days are the ones between the bank holidays: 21 to 24 December and 29 to 31 December. Holiday clubs that run in those weeks book up early, and many close completely between Christmas and New Year. Local authorities publish lists of holiday activity and food programmes for children on free school meals, including days in the Christmas break; your council's website lists them.</p>`;
  },
});
