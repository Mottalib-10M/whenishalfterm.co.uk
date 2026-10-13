import { definePage } from '../../lib/guide-types';

const eng = (c: { nation: string }) => c.nation === 'england';
export default definePage({
  id: 'easter-holidays',
  group: 'breaks',
  order: 50,
  mini: 'break:easter',
  related: ['february-half-term', 'may-half-term', 'bank-holidays', 'school-holidays-2027', 'compare-term-dates'],
  sources: ['bank_holidays', 'govuk_find_council', 'ni_holidays'],
  slug: 'easter-holidays',
  nav: 'Easter holidays 2027',
  card: 'Two weeks around Easter Sunday 28 March, by council',
  title: 'Easter Holidays 2027: School Dates by Council, UK',
  description: 'Easter holidays 2027 school dates by council: the two weeks around Easter Sunday 28 March, the councils that differ, Good Friday and Easter Monday, Scotland, Wales and NI, and 2028.',
  h1: 'Easter school holidays 2027, council by council',
  intro: 'Easter moves every year, and so does the spring break: in 2027 it comes early, at the end of March.',
  resume: (h) => {
    const g = h.groups('easter', '2026-27', eng);
    const tot = g.reduce((a, x) => a + x.names.length, 0);
    return `The Easter holidays 2027 run from ${g[0] ? h.range(g[0].start, g[0].end) : 'Friday 26 March to Friday 9 April 2027'} for ${g[0] ? `${g[0].names.length} of the ${tot}` : 'most'} English council calendars on this site, with the spring term ending on Thursday 25 March and the summer term starting on Monday 12 April. Easter Sunday 2027 is 28 March, one of the earliest in recent years, so Good Friday (26 March) and Easter Monday (29 March), both bank holidays, sit at the start of the break rather than in its middle. Councils that tie the holiday to the first two weeks of April instead of to Easter break up later, and some give pupils Good Friday off and then two further weeks. Northern Ireland's common Easter closure is 25 March to 2 April 2027, and Scottish councils call the break the spring holiday. Choose your council below for its exact dates and how many school days are left before it starts.`;
  },
  faqs: (h) => [
    { q: 'When do schools break up for Easter 2027?', a: `For most English councils on this site the last day of the spring term is Thursday 25 March 2027, because Good Friday, 26 March, is the first day of the holidays. Pupils return on Monday 12 April. ${(() => { const g = h.groups('easter', '2026-27', eng); return g.length > 1 ? `${g.slice(1).reduce((a, x) => a + x.names.length, 0)} councils on the site use other dates.` : ''; })()}` },
    { q: 'Is Easter Monday 2027 a school day anywhere?', a: `Easter Monday, 29 March 2027, is a bank holiday in England, Wales and Northern Ireland, and ${(() => { const cs = h.councils.filter((c) => c.nation !== 'scotland' && c.years['2026-27']?.holidays.some((x) => x.start <= '2027-03-29' && '2027-03-29' <= x.end)); const all = h.councils.filter((c) => c.nation !== 'scotland' && c.years['2026-27']?.status !== 'not-published'); return `in 2027 it falls inside the Easter break of ${cs.length} of the ${all.length} calendars we hold for those nations`; })()}. Where it falls in term, schools are closed anyway. In Scotland it is not a bank holiday, and each Scottish council sets its spring holiday itself.` },
    { q: 'Why is the Easter holiday in different weeks each year?', a: 'Because Easter Sunday is fixed by the moon: the first Sunday after the first full moon on or after 21 March. It can fall from 22 March to 25 April. Most councils build the two weeks around it; a few fix the break in early April and leave the Easter weekend wherever it lands.' },
    { q: 'When are the Easter holidays 2028?', a: `Easter Sunday 2028 is 16 April, so the break moves to mid-April. ${(() => { const g = h.groups('easter', '2027-28', eng)[0]; return g ? `Where 2027-28 is published, it is mostly ${h.range(g.start, g.end)}.` : 'Few councils have published those dates yet.'; })()}` },
  ],
  body: (h) => {
    const g = h.groups('easter', '2026-27', eng);
    const g2 = h.groups('easter', '2027-28', eng);
    return `
<h2>Early Easter, early break</h2>
<p>Easter Sunday falls on 28 March in 2027 and on 16 April in 2028. The difference of almost three weeks moves the whole spring holiday, and with it the length of the terms on either side. A council that wants Good Friday and Easter Monday inside the break, which most do because both are bank holidays, has to finish the spring term before the Easter weekend: on Thursday 25 March 2027. The summer term that follows is then long, from 12 April to late July, with only May half term in between.</p>
${g.length > 1 ? `<p>Councils that chose another pattern for 2027: ${g.slice(1).map((x) => `${x.names.join(', ')} (${h.range(x.start, x.end)})`).join('; ')}.</p>` : ''}
<h2>Every council, Easter 2027</h2>
${h.breakTable('easter', '2026-27')}
<h2>Fixed Easter or fixed April?</h2>
<p>There are two ways to set the break. The first follows Easter: two weeks that contain Good Friday and Easter Monday, whatever their date. The second fixes the spring holiday on the first two weeks of April and lets Easter fall where it falls, which keeps the terms more even in years like 2027 but leaves the bank holidays in term time when Easter is very early or very late. When a council uses the second way and Easter Monday falls in term, the school is still closed that Monday because it is a bank holiday. The table above shows which councils break before the Easter weekend and which later.</p>
<h2>Scotland, Wales and Northern Ireland</h2>
<p>Welsh councils follow Easter in the same way as most of England. Scottish councils call it the spring holiday and set two weeks themselves; Good Friday is a Scottish bank holiday but Easter Monday is not. Northern Ireland's common closure dates for 2026-27 give 25 March to 2 April 2027, a shorter break of seven weekdays, and each school may add development days.</p>
<h2>Easter 2028</h2>
<p>${g2[0] ? `For the councils that have published 2027-28, the break is mostly ${h.range(g2[0].start, g2[0].end)}.` : ''} ${g2.length > 1 ? `Others: ${g2.slice(1).map((x) => `${x.names.join(', ')} (${h.range(x.start, x.end)})`).join('; ')}.` : ''} With Good Friday on 14 April and Easter Monday on 17 April 2028, councils that follow Easter will start the summer term on Tuesday 18 April.</p>
<!--tool:compare|essex-->
<h2>Easter clubs and exam revision</h2>
<p>For Year 11 and Year 13, the Easter break is the last holiday before GCSE and A level exams, which start in May. Many secondary schools run revision sessions in the second week, and those are voluntary: missing them is not an absence. The council's holiday activity and food programme, for children on free school meals, also runs part of the Easter break; your council's website lists the sessions. If you are thinking of extending the break by a day or two, remember that in England a holiday in term time is unauthorised unless the head teacher agrees for exceptional reasons, and that five days missed reach the threshold at which a school must consider a ${h.a('term-time-holiday-fines', 'penalty notice')}.</p>`;
  },
});
