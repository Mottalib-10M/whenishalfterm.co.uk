import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'inset-days',
  group: 'rules',
  order: 100,
  mini: 'inset',
  related: ['how-many-school-days', 'half-term-dates', 'term-time-holiday-fines', 'term-dates-scotland', 'school-days-left'],
  sources: ['school_day_regs', 'kent_2026', 'ni_terms', 'dfe_attendance'],
  slug: 'inset-days',
  nav: 'INSET days',
  card: 'Who sets them, how many, and how to find them',
  title: 'INSET Days 2026-27: How Many, Who Sets Them, By Council',
  description: 'INSET days 2026-27 explained: five a year in England chosen by each school, in-service days fixed by Scottish and Welsh councils, development days in NI, and your council rule.',
  h1: 'INSET days 2026-27: who decides and how to find yours',
  intro: 'Training days are the dates parents find out last. Who sets them depends on where you live.',
  resume: (h) => {
    const fixed = h.councils.filter((c) => (c.years['2026-27']?.inset?.length ?? 0) > 0).map((c) => c.name);
    return `INSET days, in-service training days, are school days when teachers work and pupils stay at home. In England the law asks schools to open for ${h.P.schoolYear.englandSessions} sessions, ${h.P.schoolYear.englandPupilDays} days, while teachers can be asked to work ${h.P.schoolYear.englandTeacherDays} days, so a school normally has five INSET days a year, and it is the school, not the council, that picks them. Many councils therefore publish a calendar of 195 days with a note that schools will choose five; some publish 190 days and leave the INSET days outside it. Scottish councils, by contrast, fix in-service days for all their schools, often at the start of the year and beside the breaks, and some Welsh councils do the same. ${fixed.length ? `On this site, ${fixed.length} council calendars include fixed in-service days.` : ''} In Northern Ireland schools can use up to ${h.P.schoolYear.niDevelopmentDaysMax} school development days. Pick your council below to see which rule it follows.`;
  },
  faqs: (h) => [
    { q: 'How many INSET days do schools in England get?', a: `Usually five. Teachers can be directed to work on ${h.P.schoolYear.englandTeacherDays} days, of which ${h.P.schoolYear.englandPupilDays} are with pupils. A school may also replace some or all of the five days with twilight sessions after school, as long as teachers' total directed time stays within ${h.num(h.P.schoolYear.englandTeacherHours)} hours a year.` },
    { q: 'Where do I find my school’s INSET days?', a: 'On the school website, usually under term dates or the calendar, and in letters home at the start of the year. Councils that let schools choose do not list them. In Scotland and much of Wales they are on the council calendar, and this site shows them on each council page.' },
    { q: 'Is an INSET day an authorised absence?', a: 'It is not an absence at all: the school is closed to pupils, so no attendance mark is recorded. That is why a holiday that starts on an INSET day does not cost a school day, and why families often ask for the INSET dates before booking.' },
    { q: 'Can a school change its INSET days during the year?', a: 'It can, and it should tell parents in good time. A school might move a day, for example to join training shared with other schools of its trust. If a change causes a childcare problem, raise it with the school early: the council does not control INSET days in England.' },
  ],
  body: (h) => {
    const fixed = h.councils.filter((c) => (c.years['2026-27']?.inset?.length ?? 0) > 0);
    const rows = h.councils.filter((c) => c.years['2026-27'] && c.years['2026-27']!.status !== 'not-published').map((c) => {
      const Y = c.years['2026-27']!;
      const mode = Y.insetMode === 'fixed' ? 'fixed by the council' : Y.insetMode === 'partly-fixed' ? 'partly fixed' : Y.insetMode === 'school-chooses' ? 'chosen by each school' : 'not stated';
      return [h.councilLink(c.slug), mode, Y.inset?.length ?? 0, Y.statedDays ?? ''];
    });
    return `
<h2>England: five days, chosen by the school</h2>
<p>The Education (School Day and School Year) (England) Regulations 1999 require at least ${h.P.schoolYear.englandSessions} sessions a year, two per day. Teachers' contracts allow ${h.P.schoolYear.englandTeacherDays} working days. The five days between the two numbers are the INSET days. In community and voluntary controlled schools the council sets the term dates, but not the INSET days: each head teacher places them, often next to a half term or at the start of September. Kent, for example, publishes a year of 195 days in six terms and states that pupils attend 190, each school naming its own five non-contact days.</p>
<p>Some schools convert the five days into "disaggregated" training: a number of after-school sessions adding up to the same hours, within the ${h.num(h.P.schoolYear.englandTeacherHours)} hours of directed time. Pupils then lose no day at all.</p>
<h2>Every council, its INSET rule</h2>
${h.table(['Council', 'INSET days 2026-27', 'Fixed days listed', 'Days stated by the council'], rows, 'As written on each council calendar.', ['l', 'l', 'r', 'r'])}
<h2>Scotland: in-service days on the council calendar</h2>
<p>Scottish councils publish in-service days with the term dates. They often open the new school year with in-service days in mid-August and place others next to the breaks. ${fixed.filter((c) => c.nation === 'scotland').length ? `Among the councils on this site, ${fixed.filter((c) => c.nation === 'scotland').map((c) => `${c.name} lists ${c.years['2026-27']!.inset!.length}`).join(', ')}.` : ''} Because each council chooses its own, the same week can be a school week in one council and an in-service day in the next.</p>
<h2>Wales and Northern Ireland</h2>
<p>Some Welsh councils give the dates of INSET days on their calendar, others leave them to schools; the table above shows which. Northern Ireland schools must open on 200 days and can use up to ${h.P.schoolYear.niDevelopmentDaysMax} of them as school development days, when pupils stay at home; each school announces its own. In 2026-27 the Department of Education added three closure days for the TransformED reform programme: 25 September 2026, 25 January 2027 and 4 May 2027.</p>
<!--tool:countdown-->
<h2>How the checker handles INSET days</h2>
<p>The "is school open?" checker on this site marks the in-service days a council fixes as days without school. For English councils that leave INSET days to schools, it cannot know them: it marks the day as a school day on the council calendar and says that your school may still use it for training. If the school has given you its list, compare it with the checker before booking anything.</p>`;
  },
});
