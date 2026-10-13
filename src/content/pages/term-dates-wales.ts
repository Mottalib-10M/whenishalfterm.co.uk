import { definePage } from '../../lib/guide-types';
import { firstLastDay, breakOf } from '../../lib/engine/calendar';

const wa = (c: { nation: string }) => c.nation === 'wales';
export default definePage({
  id: 'term-dates-wales',
  group: 'nations',
  order: 320,
  mini: 'break:easter',
  council: 'carmarthenshire',
  related: ['term-time-holiday-fines', 'inset-days', 'half-term-dates', 'bank-holidays', 'compare-term-dates'],
  sources: ['wales_penalty_regs', 'bank_holidays', 'govuk_find_council'],
  slug: 'term-dates-wales',
  nav: 'Wales term dates',
  card: 'Welsh councils, INSET days and the £60 penalty',
  title: 'Wales School Term Dates 2026-27: By Council, INSET, Fines',
  description: 'Wales school term dates 2026-27 by council: half terms, an Easter break earlier than England\'s, designated INSET days and the £60 Welsh penalty notice.',
  h1: 'Welsh school term dates 2026-27 by council',
  intro: 'Welsh councils set their own calendars, close to England’s, with a few differences that matter for border families.',
  resume: (h) => {
    const cs = h.councils.filter(wa);
    const o = h.groups('october', '2026-27', wa)[0];
    const e = h.groups('easter', '2026-27', wa)[0];
    return `Each of the 22 councils in Wales sets the term dates of its community and voluntary controlled schools, as in England, and neighbouring councils often choose the same weeks. ${cs.length ? `Of the ${cs.length} Welsh councils on this site, ${o ? `${o.names.length} take October half term ${h.range(o.start, o.end)}` : ''}${e ? ` and ${e.names.length} have the Easter holidays ${h.range(e.start, e.end)}` : ''}.` : ''} The Welsh school year has the same shape as the English one: three terms, each with a half term, summer holidays from late July and about 190 days with pupils. Some Welsh councils name a designated INSET day for all their schools on 1 September, others leave all five, or six, to each school; Flintshire notes that Welsh Ministers can direct councils whose dates are not harmonised. Welsh law has its own penalty notice for unauthorised absence: £${h.P.penalties.wales.reduced} if paid within ${h.P.penalties.wales.reducedDays} days, £${h.P.penalties.wales.full} within ${h.P.penalties.wales.fullDays}. Bank holidays are the same as in England. Choose a council below for its Easter break and the days left before it.`;
  },
  faqs: (h) => [
    { q: 'Do all Welsh councils have the same term dates?', a: 'Neighbouring councils often share the same half terms and Easter, but each council publishes its own calendar, and the first and last days of the year can differ. Check the council page on this site, and the school, since voluntary aided and foundation schools can set their own dates.' },
    { q: 'How much is the fine for a term-time holiday in Wales?', a: `£${h.P.penalties.wales.reduced} per parent per child if paid within ${h.P.penalties.wales.reducedDays} days, rising to £${h.P.penalties.wales.full} if paid within ${h.P.penalties.wales.fullDays} days, under the Education (Penalty Notices) (Wales) Regulations 2013. Each council's code of conduct sets when a notice can be issued.` },
    { q: 'Are Welsh and English half terms the same week?', a: 'For October and May, usually yes. In 2026-27 the Welsh councils on this site take February half term on 8 to 12 February and Easter from 22 March, a week before most of England. A family with children on both sides of the border should compare the two councils with the tool on this page.' },
  ],
  body: (h) => {
    const cs = h.councils.filter(wa);
    const rows = cs.map((c) => { const fl = firstLastDay(c, '2026-27'); const o = breakOf(c, '2026-27', 'october'); const e = breakOf(c, '2026-27', 'easter'); return [h.councilLink(c.slug), fl ? h.date(fl.first) : 'n/a', o ? h.range(o.start, o.end) : 'n/a', e ? h.range(e.start, e.end) : 'n/a', fl ? h.date(fl.last) : 'n/a', c.years['2026-27']?.inset?.length ?? 0]; });
    return `
<h2>The Welsh councils side by side</h2>
${cs.length ? h.table(['Council', 'First day', 'October', 'Easter', 'Last day', 'INSET days fixed'], rows, 'From each council calendar for 2026-27.', ['l', 'l', 'l', 'l', 'l', 'r']) : '<p>The Welsh council calendars are being added.</p>'}
<h2>Who sets the dates in Wales</h2>
<p>School term dates in Wales are set by the local authority for community and voluntary controlled schools and by the governing body for foundation and voluntary aided schools. Since the Education (Wales) Act 2014, Welsh Ministers can direct councils and governing bodies to harmonise their dates, which is why the Welsh calendars on this site are almost identical. The pattern is close to England's, so a family that moves across the border rarely changes its holidays by more than a few days.</p>
<h2>Absence and penalty notices</h2>
<p>In Wales, as in England, a term-time holiday without the head teacher's permission is an unauthorised absence. The penalty notice is set by the ${h.src('wales_penalty_regs', 'Education (Penalty Notices) (Wales) Regulations 2013')}: £${h.P.penalties.wales.reduced} within ${h.P.penalties.wales.reducedDays} days, £${h.P.penalties.wales.full} within ${h.P.penalties.wales.fullDays}. The threshold for a notice is set by each council's local code of conduct, not by a national rule as in England since 2024. The ${h.a('term-time-holiday-fines', 'fine calculator')} works out the amount for your family.</p>
<h2>Border families</h2>
<p>Around Chester, Shrewsbury, Hereford and the Severn crossings, many children live on one side of the border and go to school on the other. The school's calendar applies, whichever side you live on. Compare the two councils below to see where the holidays differ.</p>
<!--tool:compare|cheshire-west-and-chester-->`;
  },
});
