import { definePage } from '../../lib/guide-types';
import { yearSchoolDays } from '../../lib/engine/calendar';

export default definePage({
  id: 'how-many-school-days',
  group: 'rules',
  order: 130,
  mini: 'year',
  related: ['inset-days', 'school-days-left', 'term-time-holiday-fines', 'summer-holidays', 'compare-term-dates'],
  sources: ['school_day_regs', 'kent_2026', 'ni_terms', 'dfe_attendance'],
  slug: 'how-many-school-days',
  nav: 'School days in a year',
  card: '190 days, 380 sessions, counted council by council',
  title: 'School Days in a Year 2026-27: 190 Days, Council by Council',
  description: 'How many school days in a year: 190 days or 380 sessions in England, 195 teacher days, 200 in Northern Ireland, and the 2026-27 count for each council.',
  h1: 'How many school days are there in a year?',
  intro: 'The rule is 190, but councils count differently, and the gap is where INSET days go.',
  resume: (h) => `A school year in England has 190 days with pupils: the law sets at least ${h.P.schoolYear.englandSessions} sessions, and a school day has two. Teachers work ${h.P.schoolYear.englandTeacherDays} days, so five are training days without pupils. Councils publish their calendar either as 195 days, leaving each school to remove its five INSET days, or as about 190 days with the INSET days on top. On this site the engine counts, for each council, the weekdays in term minus bank holidays and any in-service days the council itself fixes: a council that publishes 195 days shows 195, and its pupils will in fact attend 190. Scottish calendars come to about 190 pupil days too, with in-service days already removed. Northern Ireland schools must be open on ${h.P.schoolYear.niOpenDays} days, of which up to ${h.P.schoolYear.niDevelopmentDaysMax} can be development days. Choose a council below to see its count, first day and last day.`,
  faqs: (h) => [
    { q: 'Is it 190 or 195 school days?', a: `Both. Pupils in England must have ${h.P.schoolYear.englandSessions} sessions, 190 days. Teachers can be directed to work ${h.P.schoolYear.englandTeacherDays} days. The five extra days are INSET days. A council calendar that shows 195 days includes the INSET days that each school will choose; one that shows 190 leaves them outside.` },
    { q: 'What percentage of the year is a day off school?', a: 'One school day is about 0.5 per cent of a 190-day year, and one week about 2.6 per cent. Attendance of 90 per cent means missing 19 days, almost four weeks, which is the level schools treat as persistent absence.' },
    { q: 'Do snow days have to be made up?', a: 'Not usually. If a school cannot open for reasons beyond its control, such as heavy snow or a heating failure, and it is not reasonably practicable to meet at another time, the regulations treat the sessions as not required. The 380-session total is reduced accordingly.' },
    { q: 'How many school days are in a week, a term?', a: 'Five per week. An autumn term from early September to Christmas has about 75 school days, a spring term 55 to 65 depending on Easter, and a summer term the rest. Kent, which numbers six terms, publishes 39, 35, 30, 24, 34 and 33 days for 2026-27.' },
  ],
  body: (h) => {
    const rows = h.councils.map((c) => [h.councilLink(c.slug), yearSchoolDays(c, '2026-27') ?? 'n/a', c.years['2026-27']?.statedDays ?? '', yearSchoolDays(c, '2027-28') ?? 'not yet']).filter((r) => r[1] !== 'n/a');
    return `
<h2>What the law says</h2>
<p>Regulation 3 of the ${h.src('school_day_regs', 'Education (School Day and School Year) (England) Regulations 1999')} divides every school day into two sessions with a break in the middle and requires at least ${h.P.schoolYear.englandSessions} sessions a year. If a school is prevented from meeting for a session and cannot make it up at another time, the session is treated as held. That is the legal basis of the 190 days. The ${h.P.schoolYear.englandTeacherDays} days and ${h.num(h.P.schoolYear.englandTeacherHours)} hours of directed time come from teachers' pay and conditions, which is why Kent's calendar explains that schools may replace INSET days with extra hours instead.</p>
<h2>Every council's count for 2026-27</h2>
${h.table(['Council', 'Weekdays in school 2026-27', 'Days stated by the council', '2027-28'], rows, 'Weekdays in term, less bank holidays (England, Wales, NI), council closures and in-service days fixed by the council.', ['l', 'r', 'r', 'r'])}
<p>A count of 195 or 196 means INSET days are still to come out. A count near 190 means the council either fixed its in-service days or built the year at 190. A count of 197 or 198 means the published calendar holds a few more days than the usual 195, which schools absorb with INSET or closure days of their own; the council page quotes what the council says about it.</p>
<h2>Scotland, Wales and Northern Ireland</h2>
<p>Scottish councils build a year of about 195 days for staff, with in-service days marked on the calendar, which leaves about 190 for pupils. Welsh councils work to the same 190 pupil days, and some fix their INSET days on the calendar. In Northern Ireland, ${h.src('ni_terms', 'nidirect')} says schools must open for ${h.P.schoolYear.niOpenDays} days and can use up to ${h.P.schoolYear.niDevelopmentDaysMax} of them for staff training and school development.</p>
<h2>Why the count matters to parents</h2>
<p>Attendance is measured in sessions against this total. A 95 per cent attendance rate allows about nine and a half days off in a year, for any reason; 90 per cent, nineteen days, is the level at which a pupil is counted as persistently absent. In England, ten unauthorised sessions within ten school weeks is the threshold for a ${h.a('term-time-holiday-fines', 'penalty notice')}.</p>
<!--tool:countdown-->`;
  },
});
