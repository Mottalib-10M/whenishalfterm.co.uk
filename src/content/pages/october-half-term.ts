import { definePage } from '../../lib/guide-types';

const eng = (c: { nation: string }) => c.nation === 'england';
export default definePage({
  id: 'october-half-term',
  group: 'breaks',
  order: 20,
  mini: 'break:october',
  related: ['half-term-dates', 'christmas-holidays', 'term-dates-scotland', 'inset-days', 'compare-term-dates'],
  sources: ['govuk_find_council', 'ni_holidays', 'bank_holidays'],
  slug: 'october-half-term',
  nav: 'October half term 2026',
  card: 'The autumn break, one week or two, by council',
  title: 'October Half Term 2026: Dates by Council, One or Two Weeks',
  description: 'October half term 2026 dates council by council: the week most of England takes, the councils with a two-week break, the Scottish October holiday and Halloween in Northern Ireland.',
  h1: 'October half term 2026: when it is in your area',
  intro: 'Autumn half term splits the longest term of the year. Most of England takes the same week; a few councils take two.',
  resume: (h) => {
    const g = h.groups('october', '2026-27', eng);
    const tw = h.groups('october', '2026-27', eng).filter((x) => (Date.parse(x.end) - Date.parse(x.start)) / 86400000 >= 11);
    const two = tw.flatMap((x) => x.names);
    return `October half term 2026 is ${g[0] ? h.range(g[0].start, g[0].end) : 'the last week of October'} for ${g[0] ? `${g[0].names.length} of the ${g.reduce((a, x) => a + x.names.length, 0)}` : 'most'} English council calendars on this site, so pupils finish on Friday 23 October and return on Monday 2 November. ${two.length ? `${two.join(', ')} ${two.length > 1 ? 'have' : 'has'} a two-week break, ${tw.map((x) => h.range(x.start, x.end)).join(' or ')}.` : ''} The autumn term is the longest of the year, close to fifteen weeks from early September to the Christmas holidays, and the October break is the only pause in it. Scottish councils call it the October holiday and set it themselves, often one or two weeks from mid-October. Northern Ireland closes on 29 and 30 October for Halloween. Academies can choose other weeks, and many schools add an INSET day to one end of the break. Use the finder below for your council's exact dates and the days left until they start.`;
  },
  faqs: (h) => [
    { q: 'What date do schools go back after October half term 2026?', a: 'Where half term is 26 to 30 October, pupils return on Monday 2 November 2026, unless the school has placed an INSET day on that Monday. Where the break lasts two weeks, the return is usually the same Monday, because the extra week comes before. Your council page gives the first school day after each break.' },
    { q: 'Is October half term two weeks in 2026?', a: 'Only in a few areas. Most of England keeps one week. A two-week break means the council took five days from elsewhere in the year, usually the summer holiday, because pupils must still have 190 days of school. Scottish councils often have two weeks as a matter of course.' },
    { q: 'Is Halloween in half term this year?', a: 'Saturday 31 October 2026 falls just after the 26 to 30 October week, so in most of England Halloween is the last Saturday of half term. In Northern Ireland the common Halloween closure is Thursday 29 and Friday 30 October 2026.' },
    { q: 'When is October half term 2027?', a: `For councils that have published 2027-28, it is mostly ${(() => { const g = h.groups('october', '2027-28', eng)[0]; return g ? h.range(g.start, g.end) : 'the last full week of October'; })()}. The council pages show which areas have published the year and which differ.` },
  ],
  body: (h) => {
    const g = h.groups('october', '2026-27', eng);
    const g2 = h.groups('october', '2027-28', eng);
    const others = g.slice(1).map((x) => `${h.range(x.start, x.end)}: ${x.names.join(', ')}`);
    return `
<h2>The week most of England takes</h2>
<p>${g[0] ? `${h.range(g[0].start, g[0].end)} is the October half term of ${g[0].names.join(', ')}.` : ''} Each council fixed the week when it published its 2026-27 calendar. It follows a simple logic: the autumn term starts in the first week of September, and the eighth week after that is half term.</p>
${others.length ? `<p>The councils that chose differently: ${others.join('; ')}.</p>` : ''}
<h2>All councils, October 2026</h2>
${h.breakTable('october', '2026-27')}
<h2>One week or two</h2>
<p>A longer October break has been discussed for years because the autumn term is long and ends in the dark. The catch is arithmetic. A school year in England needs at least 380 sessions, 190 days, and a council cannot simply add five days of holiday: it has to take them from another break, nearly always the summer. Surrey, which has a two-week October half term in 2026, keeps its summer term open until 28 July 2027 and returns to a single week in October 2027. A family with children in Surrey and in a neighbouring county will therefore have one week in common in October 2026 and one week where only the Surrey child is off.</p>
<h2>Scotland: the October holiday</h2>
<p>Scottish schools go back in mid-August, so their autumn term reaches its middle sooner. Councils set an October holiday of one or two weeks, frequently starting around the second or third Monday of October, and many put in-service days next to it. Because every Scottish council fixes its own in-service days, the first day back is not the same across the central belt. The ${h.a('term-dates-scotland', 'Scotland page')} lines the councils up.</p>
<h2>Northern Ireland: two days at Halloween</h2>
<p>The common closure dates agreed by all school sectors give Thursday 29 and Friday 30 October 2026. Many schools add development days to make a longer break, and each school announces them itself. School transport and meals are not provided on the common closure days.</p>
<h2>October half term 2027</h2>
<p>${g2[0] ? `Of the councils that have published 2027-28, ${g2[0].names.length} take ${h.range(g2[0].start, g2[0].end)}.` : 'Few councils have published 2027-28 yet.'} ${g2.length > 1 ? `${g2.slice(1).map((x) => `${x.names.join(', ')}: ${h.range(x.start, x.end)}`).join('; ')}.` : ''} Councils that have not published will normally do so before the end of the current school year.</p>
<!--tool:compare|surrey-->
<h2>Planning around the week</h2>
<p>The prices of family holidays rise for half term, which is why some parents look at the days either side. The Monday or Friday next to a half term is the day schools most often use as an INSET day, so check the school's own list before assuming it is a school day. Taking a child out on a day that is not INSET is an unauthorised absence; in England the threshold for a ${h.a('term-time-holiday-fines', 'penalty notice')} is ten sessions, five days, within ten school weeks; a whole extra week reaches it on its own. Childcare clubs usually take bookings for half term from early September: the dates on your council page are the ones they plan on.</p>`;
  },
});
