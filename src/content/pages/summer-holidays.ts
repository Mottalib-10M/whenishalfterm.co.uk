import { definePage } from '../../lib/guide-types';

const eng = (c: { nation: string }) => c.nation === 'england';
export default definePage({
  id: 'summer-holidays',
  group: 'breaks',
  order: 70,
  mini: 'countdown-summer',
  related: ['school-holidays-2027', 'may-half-term', 'school-days-left', 'term-dates-scotland', 'how-many-school-days'],
  sources: ['bank_holidays', 'govuk_find_council', 'ni_holidays'],
  slug: 'summer-holidays',
  nav: 'Summer holidays 2027',
  card: 'Break-up day and return in September, by council',
  title: 'Summer Holidays 2027: School Break-Up Dates by Council, UK',
  description: 'Summer holidays 2027 school dates by council: the last day of term in July, the first day back in September 2027, Scotland in late June, Northern Ireland from 1 July, and a countdown.',
  h1: 'Summer holidays 2027: when schools break up, council by council',
  intro: 'Six weeks in England and Wales, seven in Scotland and two months in Northern Ireland, starting on different days.',
  resume: (h) => {
    const g = h.groups('summer', '2026-27', eng);
    const tot = g.reduce((a, x) => a + x.names.length, 0);
    return `The summer holidays 2027 start on ${g[0] ? h.date(g[0].start) : 'Thursday 22 July 2027'} for ${g[0] ? `${g[0].names.length} of the ${tot}` : 'most'} English councils on this site, after a last day of term in the week of 19 July, and the school year 2027-28 starts again in the first days of September. The date of the last day varies more than any other in the calendar: some councils close on a Friday, others on a Tuesday or Wednesday, and a council that took a longer October break keeps its schools open into the last week of July. Scotland is different: Scottish schools break up at the end of June and go back in mid-August. Northern Ireland's summer holiday begins on 1 July 2027. The summer bank holiday is Monday 30 August 2027 in England, Wales and Northern Ireland and Monday 2 August in Scotland. The countdown below gives the days and school days left before your council breaks up.`;
  },
  faqs: (h) => [
    { q: 'What date do schools break up for summer 2027?', a: `${(() => { const g = h.groups('summer', '2026-27', eng); return g[0] ? `The most common start of the holidays in England is ${h.date(g[0].start)}, so the last school day is the day before.` : 'Most English councils break up in the third week of July.'; })()} Each council's page gives its exact last day, and academies may finish on another day.` },
    { q: 'How long are the summer holidays in England?', a: 'About six weeks: from the third or fourth week of July to the first days of September. A council that gives two weeks in October takes the days from the summer, so its holiday is shorter. In Scotland the break is about seven weeks, from late June to mid-August.' },
    { q: 'When do schools go back in September 2027?', a: `Where the 2027-28 calendar is published, ${(() => { const m = new Map<string, number>(); for (const c of h.councils.filter((x) => x.nation === 'england')) { const s0 = c.years['2027-28']?.sessions[0]?.start; if (s0) m.set(s0, (m.get(s0) ?? 0) + 1); } const top = [...m.entries()].sort((a, b) => b[1] - a[1])[0]; return top ? `the most common first day in England is ${h.date(top[0])}` : 'the council pages give the first day'; })()}, after the summer bank holiday on 30 August. Many schools use the first day or two as INSET days, so pupils start a day or two later than the council date.` },
    { q: 'Why do Scottish schools break up in June?', a: 'Scottish calendars start in mid-August, so the whole year sits about five weeks earlier than in England while keeping a similar number of school days. Each Scottish council sets its own dates, which is why the last day in June is not the same across Scotland.' },
  ],
  body: (h) => {
    const g = h.groups('summer', '2026-27', eng);
    const gs = h.groups('summer', '2026-27', (c) => c.nation === 'scotland');
    return `
<h2>The last day of term in July 2027</h2>
<p>Councils count backwards from the 190 days pupils must attend. Starting in the first days of September 2026 and keeping the usual breaks, most land on a last day in the third week of July 2027. A council that begins its year on a Tuesday, or takes two weeks in October, ends a few days later.</p>
${g.length ? `<p>${g.map((x) => `Holidays from ${h.date(x.start)}: ${x.names.join(', ')}`).join('. ')}.</p>` : ''}
<h2>Every council, summer 2027</h2>
${h.breakTable('summer', '2026-27')}
<p>Where the end of the summer holidays is blank, the council has not yet published the start of 2027-28, so the return date is not known.</p>
<h2>Scotland: June to August</h2>
<p>${gs.length ? `Scottish councils on the site break up from ${gs.map((x) => h.date(x.start)).sort()[0]}.` : 'Scottish councils break up at the end of June.'} The school year then restarts in mid-August, with in-service days before pupils return. The ${h.a('term-dates-scotland', 'Scotland page')} lists the councils side by side, which matters for families who move between Scotland and England in the summer: a child can be in school in Edinburgh in mid-August while a cousin in Carlisle is still on holiday.</p>
<h2>Northern Ireland</h2>
<p>The common closure dates for 2026-27 start the summer holiday on 1 July 2027. Schools resume in the first days of September, and the Battle of the Boyne holiday on 12 July falls inside the break.</p>
<h2>The first day back</h2>
<p>The council date for the first day of the new year is when staff start. In England many schools spend the first one or two days on INSET, and some reception and Year 7 classes start with a staggered intake, so a child's first day can be later than the date on the council calendar. The school letter of July gives the actual day.</p>
<!--tool:compare|surrey-->
<h2>Planning six weeks</h2>
<p>Holiday clubs and the council's holiday activity and food programme for children on free school meals run part of the summer. Families with children in two areas lose some shared weeks when the last days of term differ: the comparison above shows how many weekdays one child is off while the other is still in school. Booking a holiday before the last day of term, even a day early, is an unauthorised absence unless the head teacher agrees, and in England it can bring a ${h.a('term-time-holiday-fines', 'penalty notice')}.</p>`;
  },
});
