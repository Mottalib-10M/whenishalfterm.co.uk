import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'compare-term-dates',
  group: 'tools',
  order: 210,
  tool: 'compare',
  council: 'kent',
  related: ['half-term-dates', 'school-days-left', 'london-term-dates', 'term-time-holiday-fines', 'term-dates-scotland'],
  sources: ['govuk_find_council', 'bank_holidays', 'dfe_attendance'],
  slug: 'compare-term-dates',
  nav: 'Compare two councils',
  card: 'Separated parents, two schools, a move: shared and mismatched days',
  title: 'Compare Term Dates: Two Councils, Shared and Mismatched Days',
  description: 'Compare the term dates of two councils for 2026-27 or 2027-28: shared holidays, days when one child is off and the other in school, break by break, for separated parents and split families.',
  h1: 'Compare the term dates of two councils',
  intro: 'For two homes, two schools or a move between areas: what the calendars share and where they part.',
  resume: () => `Pick two councils and a school year: the tool walks through every weekday from 1 September to the end of the later summer term and counts three things, the weekdays when both councils' pupils are off, the weekdays when only the first council is off, and those when only the second is. It then sets the six main breaks side by side, with the number of weekdays they share. This is the question separated parents ask when they split the holidays, that grandparents ask when they look after cousins from two areas, and that families face when a child changes school across a boundary or goes to an academy that follows another council's calendar. The comparison uses each council's own published calendar, its bank holidays and the in-service days it fixes; INSET days chosen by each school are not included, so check those with the two schools.`,
  faqs: () => [
    { q: 'How do separated parents split school holidays?', a: 'Usually by agreement or under a child arrangements order that divides each break, or alternates them by year. When the children attend schools in different council areas, the order should name the calendar it follows. The comparison shows the weeks both calendars share, which are the easiest to divide.' },
    { q: 'What if my children go to schools in two councils?', a: 'Then you will usually have one or two weeks a year when one child is in school and the other on holiday, often around Easter or the end of July. The list of mismatched days in the tool gives them one by one, so you can plan childcare or ask a school about INSET dates.' },
    { q: 'Do academies follow the council calendar?', a: 'Many do, some do not. An academy trust can set its own term dates, sometimes the same for all its schools across several councils. If one school is an academy, compare against the council it follows, which the school website or prospectus will say.' },
  ],
  body: (h) => `
<h2>Reading the result</h2>
<p>The big number is the count of weekdays when one council's pupils are off and the other's are in school. Zero means the two calendars are identical on the days that matter, which happens between many London boroughs and between neighbouring English counties. A dozen or more usually means the Easter break or the end of the summer term falls in different weeks. The table then shows each break side by side, with the weekdays they share: five for two identical half terms, ten for identical Easter holidays.</p>
<h2>Where calendars most often part</h2>
<p>From the councils on this site, the breaks that differ most often in 2026-27 are the Easter holidays, which some councils tie to Easter and others to early April, and the last days of the summer term. October half term is shared by nearly every English council, apart from the few that have moved to two weeks. Christmas and May half term rarely differ by more than a day or two. Between England and Scotland, almost every week differs: Scottish schools return in mid-August and break up at the end of June.</p>
<p>The councils that differ in October 2026 are listed below, with every other council for reference.</p>
${h.breakTable('october', '2026-27', (c) => c.nation === 'england')}
<h2>Child arrangements and term dates</h2>
<p>Court orders and parenting plans often say "half of each school holiday", which is simple when both homes follow one calendar. When they do not, it helps to say in the plan which school's calendar governs, and how INSET days are treated. A family court will not settle term dates for you, and a parent who keeps a child out of school on a day when that school is open risks an unauthorised absence, which in England can lead to a ${h.a('term-time-holiday-fines', 'penalty notice')} for the parent who allowed it.</p>
<h2>Moving between councils</h2>
<p>A family that moves in the summer can find the new school's year starting a few days earlier or later than the old one, or, between Scotland and England, five weeks earlier. Compare the council you leave with the council you join for the year of the move: the tool shows how many days of the summer belong to which calendar.</p>
<!--tool:countdown|surrey-->`,
});
