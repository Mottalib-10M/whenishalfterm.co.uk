import { definePage } from '../../lib/guide-types';

const eng = (c: { nation: string }) => c.nation === 'england';
export default definePage({
  id: 'february-half-term',
  group: 'breaks',
  order: 40,
  mini: 'break:february',
  related: ['half-term-dates', 'easter-holidays', 'christmas-holidays', 'term-dates-scotland', 'school-days-left'],
  sources: ['govuk_find_council', 'ni_holidays', 'bank_holidays'],
  slug: 'february-half-term',
  nav: 'February half term 2027',
  card: 'Spring half term in England and Wales, mid-term in Scotland',
  title: 'February Half Term 2027: Dates by Council, Scottish Mid-Term',
  description: 'February half term 2027 by council: the week most of England takes, the councils that differ, the two-day Scottish mid-term and Northern Ireland dates.',
  h1: 'February half term 2027 by council',
  intro: 'The shortest term of the year has the most uniform half term in England, and the most varied in Scotland.',
  resume: (h) => {
    const g = h.groups('february', '2026-27', eng);
    const tot = g.reduce((a, x) => a + x.names.length, 0);
    return `February half term 2027 is ${g[0] ? h.range(g[0].start, g[0].end) : 'the week of 15 February'} for ${g[0] ? `${g[0].names.length} of the ${tot}` : 'most'} English councils on this site, so pupils finish on Friday 12 February and go back on Monday 22 February. With Easter early in 2027, Easter Sunday on 28 March, the spring term is short: about six weeks before half term and five after it. In Scotland the February break is a mid-term of two days, usually a Monday and Tuesday or a Thursday and Friday, chosen council by council, often with an in-service day alongside. Northern Ireland's common mid-term closure is Thursday 11 and Friday 12 February 2027. Pick your council below for its exact dates, the weekdays off and how many school days remain before the break.`;
  },
  faqs: (h) => [
    { q: 'When is February half term 2027 in England?', a: `For most councils on this site, ${(() => { const g = h.groups('february', '2026-27', eng)[0]; return g ? h.range(g.start, g.end) : '15 to 19 February 2027'; })()}. Pupils are back on Monday 22 February unless the school has an INSET day. A handful of councils have another week; the table on this page lists them, and academies can choose differently.` },
    { q: 'Is there a half term in February in Scotland?', a: 'Not a week. Scottish councils give a February mid-term of usually two days, sometimes extended by an in-service day, and the dates differ from one council to the next. Check the council page for the exact days.' },
    { q: 'Is Valentine’s Day in half term in 2027?', a: 'No. Valentine’s Day 2027 is Sunday 14 February, the day before the most common half term week begins. Shrove Tuesday 2027 is 9 February, in term time, and Ash Wednesday 10 February.' },
    { q: 'When is February half term 2028?', a: `${(() => { const g = h.groups('february', '2027-28', eng)[0]; return g ? `Where 2027-28 is published, mostly ${h.range(g.start, g.end)}.` : 'Most councils have not published 2027-28 yet.'; })()} Easter 2028 falls late, on 16 April, so the spring term of 2027-28 is long and some councils place half term later in February.` },
  ],
  body: (h) => {
    const g = h.groups('february', '2026-27', eng);
    return `
<h2>Why 2027 is a short spring</h2>
<p>The spring term runs from the first days of January to the Easter holidays. When Easter is early, as in 2027, the term shrinks: from 4 January to 25 March 2027 is eleven and a half weeks, with half term in the middle. In 2027-28, when Easter Sunday is 16 April 2028, the same term runs to the end of March and lasts about thirteen weeks. That is why February half term moves a week from one year to the next while October half term barely does.</p>
${g.length > 1 ? `<p>Councils that differ in 2027: ${g.slice(1).map((x) => `${x.names.join(', ')} (${h.range(x.start, x.end)})`).join('; ')}.</p>` : '<p>Every English council on the site takes the same week in February 2027.</p>'}
<h2>All councils, February 2027</h2>
${h.breakTable('february', '2026-27')}
<h2>Scotland's mid-term</h2>
<p>Scottish calendars rarely have a full week in February. The mid-term holiday is two weekdays, which a council may put at the start of the week or at the end, and many add an in-service day so that pupils get three or four days. The dates of the mid-term are local: two councils that share a boundary can choose different weeks. That matters for parents working in one council and living in another, and for teachers whose children attend school in a different council.</p>
<h2>Northern Ireland</h2>
<p>The common mid-term for 2026-27 is Thursday 11 and Friday 12 February 2027. Schools often extend it with development days, and each school publishes its own calendar. St Patrick's Day on Wednesday 17 March 2027 is a separate common closure day, five weeks later.</p>
<!--tool:compare|essex-->
<h2>A cheap week to travel?</h2>
<p>Travel and ski prices follow demand, and demand follows the week most of England shares, so a family in a council with another week can sometimes travel for less. Check the school's own dates first: an academy can follow a different calendar, and taking children out in term time without permission is an unauthorised absence that can lead to a ${h.a('term-time-holiday-fines', 'penalty notice')} in England and Wales.</p>
<h2>What the term looks like around the break</h2>
<p>The weeks after February half term are the run-up to mocks for Year 11 and Year 13, and many secondary schools schedule parents' evenings and options evenings in them. Primary schools often hold book weeks and science weeks in the same stretch. None of these change the council calendar, but they explain why schools discourage any absence in the second half of the spring term.</p>`;
  },
});
