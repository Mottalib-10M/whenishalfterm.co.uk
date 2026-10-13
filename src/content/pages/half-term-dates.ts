import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'half-term-dates',
  group: 'breaks',
  order: 10,
  mini: 'break:october',
  related: ['october-half-term', 'february-half-term', 'may-half-term', 'school-days-left', 'compare-term-dates'],
  sources: ['govuk_find_council', 'school_day_regs', 'ni_holidays'],
  slug: 'half-term-dates',
  nav: 'Half term dates',
  card: 'October, February and May 2026-27, council by council',
  title: 'Half Term Dates 2026-27: October, February, May by Council',
  description: 'Half term dates 2026-27 and 2027-28 by council: October, February and May, read on each council website, two-week breaks flagged, and your own dates here.',
  h1: 'Half term dates 2026-27, council by council',
  intro: 'When is half term? Three times a year, and not on the same week everywhere: here are the dates each council set.',
  resume: (h) => {
    const o = h.groups('october', '2026-27', (c) => c.nation === 'england')[0];
    const f = h.groups('february', '2026-27', (c) => c.nation === 'england')[0];
    const m = h.groups('may', '2026-27', (c) => c.nation === 'england')[0];
    return `Half term is the one-week break in the middle of each of the three terms of the school year in England and Wales. In 2026-27 most English councils on this site have October half term ${o ? h.range(o.start, o.end) : 'in the last week of October'}, February half term ${f ? h.range(f.start, f.end) : 'in mid-February'} and May half term ${m ? h.range(m.start, m.end) : 'at the end of May'}, the week of the late May bank holiday. The dates are set by each council for the schools it runs, so a minority of areas differ, sometimes by a whole week, and a few take two weeks in October. Scotland has no half term as such but an October holiday and a short February mid-term, both set by each council, and Northern Ireland closes for two days at Halloween and two in February. Pick your council in the finder below for your own dates and the number of days until they start.`;
  },
  faqs: (h) => {
    const o = h.groups('october', '2026-27', (c) => c.nation === 'england')[0];
    return [
      { q: 'Why is it called half term?', a: 'Because it splits a term in two. The school year in England and Wales has three terms, autumn, spring and summer, and each has a one-week break near its middle. Some councils, such as Kent, number six terms instead, which is the same calendar described half by half.' },
      { q: 'Is half term the same week across England?', a: `Mostly, not entirely. ${o ? `${o.names.length} English councils on this site share October half term ${h.range(o.start, o.end)}` : 'Most English councils share the same October week'}, but each council sets its own calendar and academies can set theirs. Check the table on this page or your council page before booking.` },
      { q: 'Do INSET days make half term longer?', a: 'Often. Schools in England like to place one of their five INSET days on the Friday before or the Monday after a half term, which turns a nine-day break into ten or eleven days for pupils. Those days are chosen by each school and appear in its own letters, not on the council calendar.' },
      { q: 'How long is half term?', a: 'Five weekdays in most of England and Wales, with the two weekends either side: nine days in all. A few councils take two weeks in October. In Scotland the October break lasts one or two weeks depending on the council, and the February mid-term is usually two days.' },
    ];
  },
  body: (h) => {
    const eng = (c: { nation: string }) => c.nation === 'england';
    const og = h.groups('october', '2026-27', eng);
    const fg = h.groups('february', '2026-27', eng);
    const mg = h.groups('may', '2026-27', eng);
    const line = (g: { start: string; end: string; names: string[] }[]) => g.slice(1).map((x) => `${h.range(x.start, x.end)} (${x.names.join(', ')})`).join('; ');
    return `
<h2>The three half terms of 2026-27</h2>
<p>The autumn term runs from early September to just before Christmas and is broken by October half term. The spring term, from January to Easter, has February half term. The summer term, from after Easter to late July, has May half term, which always contains the late May bank holiday. In England the three half terms of 2026-27 fall as follows for the councils we hold.</p>
<h3>October half term 2026</h3>
<p>${og[0] ? `${og[0].names.length} English councils take ${h.range(og[0].start, og[0].end)}.` : ''} ${og.length > 1 ? `The others: ${line(og)}.` : 'No English council on the site has another week.'}</p>
<h3>February half term 2027</h3>
<p>${fg[0] ? `${fg[0].names.length} councils take ${h.range(fg[0].start, fg[0].end)}.` : ''} ${fg.length > 1 ? `Others: ${line(fg)}.` : ''}</p>
<h3>May half term 2027</h3>
<p>${mg[0] ? `${mg[0].names.length} councils take ${h.range(mg[0].start, mg[0].end)}, the week that starts with the late May bank holiday on 31 May.` : ''} ${mg.length > 1 ? `Others: ${line(mg)}.` : ''}</p>
<h2>Every council, October half term 2026</h2>
${h.breakTable('october', '2026-27')}
<p>"Weekdays" counts Monday to Friday off school. A two-week October break shows 10. Each link opens the council page with both school years in full and the date we read the council's calendar.</p>
<h2>Why some councils move half term</h2>
<p>Most councils aim for terms of roughly equal length and a half term near the middle of each. When Easter is early, as in 2027 with Easter Sunday on 28 March, the spring term is short and the summer term long, and some councils move May half term or split the summer differently. In autumn the reasons are local: a council may follow a neighbour so that families with children on both sides of a boundary get the same week, or align with the dates of a large academy trust. A two-week October break has to be found somewhere in the 190 days: Surrey, which has one in 2026, takes the five days from the summer holiday, so its summer term runs to 28 July 2027, and goes back to one week in October 2027.</p>
<h2>Half term in Scotland, Wales and Northern Ireland</h2>
<p>Welsh councils publish half terms in the same pattern as England, and most choose the same weeks. Scottish councils do not use the words half term: the October holiday runs one or two weeks and often starts a week earlier than in England, and the February mid-term is a long weekend of two days around the middle of the month. Northern Ireland's common closure dates give two days at Halloween, 29 and 30 October 2026, and a two-day mid-term on 11 and 12 February 2027, around which each school can add its own days.</p>
<!--tool:compare|surrey-->
<h2>When a child has two calendars</h2>
<p>Half term is where a family with children in two council areas, or two parents in different areas, sees its calendars come apart first. The comparison above counts, for the whole year, the weekdays when one area is off and the other in school, and lists each break side by side. Change the two councils to your own.</p>
<h2>Before you book</h2>
<p>Check three things. First, the council calendar on this site or on the council website. Second, whether your child's school is an academy or a voluntary aided school, which can choose other dates: its website will say. Third, the school's INSET days, which can add a day on either side. A holiday taken in term time without the head teacher's agreement is an unauthorised absence, and in England five days off reach the threshold at which a school must consider a ${h.a('term-time-holiday-fines', 'penalty notice')}.</p>`;
  },
});
