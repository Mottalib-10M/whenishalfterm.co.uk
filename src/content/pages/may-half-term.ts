import { definePage } from '../../lib/guide-types';

const eng = (c: { nation: string }) => c.nation === 'england';
export default definePage({
  id: 'may-half-term',
  group: 'breaks',
  order: 60,
  mini: 'break:may',
  related: ['half-term-dates', 'easter-holidays', 'summer-holidays', 'bank-holidays', 'inset-days'],
  sources: ['bank_holidays', 'govuk_find_council', 'ni_holidays'],
  slug: 'may-half-term',
  nav: 'May half term 2027',
  card: 'Whitsun week, the spring bank holiday and the exams',
  title: 'May Half Term 2027: Whitsun Dates by Council, With Exams',
  description: 'May half term 2027 by council: the Whitsun week from the spring bank holiday on 31 May, councils that differ, the May Day closure, exams, Scotland, NI.',
  h1: 'May half term 2027: the Whitsun week by council',
  intro: 'The summer term has one break, built around the spring bank holiday, in the middle of exam season.',
  resume: (h) => {
    const g = h.groups('may', '2026-27', eng);
    const tot = g.reduce((a, x) => a + x.names.length, 0);
    return `May half term 2027 is ${g[0] ? h.range(g[0].start, g[0].end) : 'the week of 31 May'} for ${g[0] ? `${g[0].names.length} of the ${tot}` : 'most'} English councils on this site: the week that starts with the spring bank holiday on Monday 31 May, often still called Whitsun. Pupils finish on Friday 28 May and return on Monday 7 June 2027. Earlier in the same term, the early May bank holiday on Monday 3 May closes schools for a day without being a half term. Because the break sits in the middle of GCSE and A level exams, secondary schools often run revision sessions and some exams resume straight after it. Scottish schools have no May half term: they finish the year at the end of June and close only for the May Day holiday and local holidays set by each council. Northern Ireland closes for May Day and the spring bank holiday. Pick your council below for its own week.`;
  },
  faqs: (h) => [
    { q: 'Is the May bank holiday part of half term?', a: 'The late one is. The spring bank holiday on Monday 31 May 2027 is the first day of May half term in most of England. The early May bank holiday on Monday 3 May 2027 is a separate single day when schools close, four weeks earlier.' },
    { q: 'Why is May half term called Whitsun?', a: 'Whit Monday, the day after Pentecost, used to be a bank holiday. In 1971 it was replaced by the fixed spring bank holiday on the last Monday of May, but the name stuck to the holiday and to the school week that follows it.' },
    { q: 'Do GCSE exams stop during May half term?', a: 'Normally yes: the exam boards’ common timetable leaves the most usual half term week free, and papers resume after it. Schools may still hold revision days. If your child’s school has a different half term, check the exam timetable, which is national and does not move for local calendars.' },
    { q: 'When is May half term 2028?', a: `${(() => { const g = h.groups('may', '2027-28', eng)[0]; return g ? `Where 2027-28 is published, mostly ${h.range(g.start, g.end)}` : 'Not yet published by most councils'; })()}. The spring bank holiday 2028 is Monday 29 May.` },
  ],
  body: (h) => {
    const g = h.groups('may', '2026-27', eng);
    return `
<h2>A break tied to a bank holiday</h2>
<p>The spring bank holiday falls on the last Monday of May. Councils start May half term on that Monday, so the week moves with the calendar: 31 May to 4 June in 2027, 29 May to 2 June in 2028. Because the date is fixed by the bank holiday and not by Easter, May half term is the most uniform break of the year in England and Wales.</p>
${g.length > 1 ? `<p>Councils with another week in 2027: ${g.slice(1).map((x) => `${x.names.join(', ')} (${h.range(x.start, x.end)})`).join('; ')}.</p>` : '<p>Every English council on the site takes the same week in 2027.</p>'}
<h2>Every council, May half term 2027</h2>
${h.breakTable('may', '2026-27')}
<h2>The long summer term of 2027</h2>
<p>With Easter early, the 2027 summer term starts on 12 April for most councils and runs to around 21 or 22 July: some fourteen weeks, broken by the early May bank holiday and May half term. The half term splits it into a short first half of seven weeks, with most written exams, and a second half of about seven weeks with sports days, trips, transition days for new pupils and end-of-year events.</p>
<h2>Exams around the break</h2>
<p>GCSE and A level written exams generally run from early or mid May to late June. The exam boards publish one common timetable, which normally leaves the most usual half term week free. For a pupil in an area or academy with a different half term, an exam can fall in that school's holiday: the pupil sits it at school as normal. Missing a public exam to travel is not something a school can authorise.</p>
<h2>Scotland and Northern Ireland</h2>
<p>Scottish schools are in their final term in May, which ends at the end of June. They close for the May Day holiday, often in the first week of May, and for local holidays, which in some councils include a Victoria Day holiday in late May. These come from each council's calendar on this site, not from the bank holiday list. In Northern Ireland the common closure dates give May Day on 3 May 2027, an extra closure on 4 May 2027 for the TransformED programme, and the spring bank holiday on 31 May 2027.</p>
<!--tool:compare|kent-->
<h2>Making the most of the week</h2>
<p>For primary pupils, May half term is the first warm-weather break of the year and the busiest week for holiday clubs outside the summer. For secondary pupils in exam years it is a revision week. Prices for holidays rise for the week most councils share; a family in an area with another week sometimes travels for less. Taking extra days around the break without the head teacher's agreement counts as unauthorised absence, and in exam season schools are unlikely to agree.</p>`;
  },
});
