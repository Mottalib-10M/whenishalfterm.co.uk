import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'school-days-left',
  group: 'tools',
  order: 200,
  tool: 'countdown',
  related: ['summer-holidays', 'christmas-holidays', 'how-many-school-days', 'half-term-dates', 'compare-term-dates'],
  sources: ['govuk_find_council', 'bank_holidays', 'school_day_regs'],
  slug: 'school-days-left',
  nav: 'Countdown to the holidays',
  card: 'Days and school days until every coming break',
  title: 'School Days Left Countdown: Days Until Half Term and Summer',
  description: 'How many school days are left until half term, Christmas, Easter or the summer holidays? A countdown for your council, in calendar days and school days, from any date you choose.',
  h1: 'How many school days until the holidays?',
  intro: 'Pick your council: the countdown runs to every coming break, in days and in school days.',
  resume: () => `This countdown takes the calendar of your council and counts, from today or any date you enter, the calendar days and the school days left before each of the next breaks: half term, Christmas, Easter, May half term and the summer holidays. School days leave out weekends, holidays, bank holidays in term time and the in-service days a council fixes. It counts the start date itself when that day is a school day, so on a Monday morning before a week of term the answer includes that Monday. The INSET days that schools in England choose for themselves are not on council calendars, so a school with an INSET day before the break will have one school day fewer than shown. The numbers come from the same council files as the rest of the site, each read on the council's own website, with the reading date on its page.`,
  faqs: () => [
    { q: 'Does the countdown include today?', a: 'Yes, when today is a school day. Counting from a Monday of a normal week, the school days to the following Monday’s half term are five. If you check in the evening after school, subtract one. The calendar days are counted to the first day of the break.' },
    { q: 'Why does my child’s school have a different number?', a: 'Usually because of an INSET day the school has placed before the break, or because the school is an academy with its own calendar. The countdown uses the council calendar, the bank holidays and any in-service days the council fixes.' },
    { q: 'Can I count to a date that is not a holiday?', a: 'The list below the result gives every coming break of your council. To count school days to any other date, such as an exam or a trip, use the date checker on the home page on that day and on the start day, or the council page, which shows each term’s weekdays.' },
  ],
  body: (h) => `
<h2>How the count works</h2>
<p>For each day from the start date to the day before the break, the engine asks the same question as the date checker: is it a weekend, a listed holiday, a closure, an in-service day fixed by the council, or a bank holiday in England, Wales or Northern Ireland? Every day that passes all five tests is a school day. The calendar days are simply the days from the start date to the first day of the break.</p>
<h2>Typical counts in 2026-27</h2>
<p>For a council with October half term from 26 October and a start of term on 1 or 2 September, the first half of the autumn term has 38 or 39 school days and the second half 35. The spring term of 2027 is short because Easter is early: around 30 school days before February half term and 24 after it, in Kent's numbering. The summer term is the longest stretch, about 34 days before May half term and 33 after, in the same calendar. Councils that start on another weekday or move a break will differ by a few days.</p>
${h.breakTable('summer', '2026-27')}
<h2>Countdowns for Scotland and Northern Ireland</h2>
<p>Scottish councils end the year in late June, so the summer countdown reaches zero four weeks before England's. Their in-service days are on the council calendar and already left out of the count. In Northern Ireland the common closure dates give the summer holiday from 1 July 2027; schools may add development days.</p>
<!--tool:compare|kent-->
<h2>Two children, two countdowns</h2>
<p>If your children go to schools in different councils, or one is at an academy that follows a neighbour, the comparison above shows the weekdays when one is off and the other in school. The ${h.a('compare-term-dates', 'comparison page')} lists those days one by one.</p>`,
});
