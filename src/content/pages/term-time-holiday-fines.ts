import { definePage } from '../../lib/guide-types';

export default definePage({
  id: 'term-time-holiday-fines',
  group: 'rules',
  order: 110,
  tool: 'penalty',
  related: ['inset-days', 'half-term-dates', 'how-many-school-days', 'term-dates-scotland', 'compare-term-dates'],
  sources: ['dfe_attendance', 'dfe_attendance_pdf', 'wales_penalty_regs', 'scot_attendance', 'ni_attendance', 'govuk_absence'],
  slug: 'term-time-holiday-fines',
  nav: 'Term-time holiday fines',
  card: 'Penalty notices: £80, £160, the 10-session rule',
  title: 'Term Time Holiday Fines 2026: £80 or £160 Penalty Calculator',
  description: 'Term time holiday fine calculator: £80 or £160 per parent per child in England, £60 or £120 in Wales, the 10-session rule, Scotland and Northern Ireland.',
  h1: 'Term-time holiday fines: what a penalty notice costs',
  intro: 'Taking a child out of school for a holiday without permission can cost each parent a fine per child. Here is the arithmetic.',
  resume: (h) => {
    const E = h.P.penalties.england, W = h.P.penalties.wales;
    return `In England a term-time holiday that the school has not authorised can lead to a penalty notice of £${E.firstReduced} per parent and per child if paid within ${E.firstReducedDays} days, rising to £${E.firstFull} if paid between day ${E.firstReducedDays + 1} and day ${E.firstFullDays}, under the national framework in force since ${h.date(E.since)}. A second notice for the same child within three years is a flat £${E.second}, and a third is not allowed: the council then considers prosecution, where fines reach £${h.num(E.prosecutionLevel3)} or £${h.num(E.prosecutionLevel4)}. Schools must consider a notice once a pupil has ${E.thresholdSessions} sessions of unauthorised absence, five school days, within ${E.thresholdWeeks} school weeks. Two parents taking two children away for a week can therefore owe £${E.firstReduced * 4} if they pay quickly. Wales charges £${W.reduced} within ${W.reducedDays} days and £${W.full} within ${W.fullDays}. Scotland and Northern Ireland have no penalty notice for absence. Enter your situation below.`;
  },
  faqs: (h) => {
    const E = h.P.penalties.england;
    return [
      { q: 'Is the holiday fine per child or per family?', a: `Per parent and per child. A notice is issued to each parent liable for the absence, for each child. Two parents and two children means four notices: £${E.firstReduced * 4} if all are paid within ${E.firstReducedDays} days, £${E.firstFull * 4} if paid later within ${E.firstFullDays} days.` },
      { q: 'How many days off trigger a penalty notice?', a: `In England the national threshold is ${E.thresholdSessions} sessions of unauthorised absence within ${E.thresholdWeeks} school weeks. A school day has two sessions, so five days of holiday reach it, and so can a mix such as three days of holiday and four late arrivals after the register closes. The period can span two terms or two school years.` },
      { q: 'Can I appeal a school holiday fine?', a: 'There is no right of appeal against a penalty notice in England. If you do not pay within 28 days the council must either prosecute for the original offence or withdraw the notice. If you think it was issued wrongly, for example for an absence the school had authorised, contact the council that issued it before the deadline.' },
      { q: 'Does the head teacher have to agree to a holiday in term time?', a: 'Leave of absence can only be granted for exceptional circumstances, requested in advance by a parent the child lives with, and at the school’s discretion. A family holiday is rarely accepted as exceptional. A school must not apply a blanket policy either way, and must consider each request.' },
      { q: 'Are there fines for term-time holidays in Scotland?', a: 'No. Scotland has no penalty notice for school absence. Scottish Government guidance says most family holidays in term time should be recorded as unauthorised absence, unless a parent’s job prevents leave in the school holidays. Persistent absence can lead to an attendance order or a referral to the Children’s Reporter.' },
    ];
  },
  body: (h) => {
    const E = h.P.penalties.england, W = h.P.penalties.wales;
    return `
<h2>England: the national framework</h2>
<p>Since ${h.date(E.since)}, the same rules apply in every council area of England, set out in the Department for Education's statutory guidance ${h.src('dfe_attendance', 'Working together to improve school attendance')} (paragraphs 179 to 205 of the 2026 edition). Before that date each council had its own code and its own threshold. The amounts are fixed by regulation:</p>
${h.table(['Situation', 'Paid within', 'Amount per parent, per child'], [
  ['First notice for this child in 3 years', `${E.firstReducedDays} days`, `£${E.firstReduced}`],
  ['First notice, paid late', `day ${E.firstReducedDays + 1} to ${E.firstFullDays}`, `£${E.firstFull}`],
  ['Second notice within 3 years', `${E.secondDays} days`, `£${E.second} flat`],
  ['Third time within 3 years', 'no notice possible', `prosecution or other action`],
], 'England, national framework for penalty notices.', ['l', 'l', 'r'])}
<p>Unpaid after ${E.firstFullDays} days, the council must decide whether to prosecute for the original offence or withdraw the notice. In the magistrates' court, failing to secure regular attendance carries a fine of up to £${h.num(E.prosecutionLevel3)}, and up to £${h.num(E.prosecutionLevel4)} with a possible community order or prison sentence of up to three months when the parent knew the child was not attending.</p>
<h2>The threshold: ten sessions in ten school weeks</h2>
<p>A school day has two sessions, morning and afternoon. A school must consider issuing a notice when a pupil reaches ${E.thresholdSessions} unauthorised sessions within any ${E.thresholdWeeks} school weeks. A week's holiday is ten sessions on its own. The rolling period crosses terms and school years, so two days taken before the summer and three after it count together. For a holiday in term time, the guidance says a notice should normally be issued without first offering support, because support is not relevant to a holiday.</p>
<h2>Who gets the notice</h2>
<p>Each parent who allowed the absence can receive one, for each child: in practice both parents of a couple on a family holiday. A parent who did not agree to the trip, for example a separated parent who was not consulted, should usually not be issued one, whichever parent asked the school for leave. Money goes to the council, which must spend any surplus on attendance support.</p>
<h2>Wales</h2>
<p>Welsh councils issue notices under the ${h.src('wales_penalty_regs', 'Education (Penalty Notices) (Wales) Regulations 2013')}: £${W.reduced} if paid within ${W.reducedDays} days and £${W.full} if paid within ${W.fullDays} days. Each council's code of conduct sets when a school may ask for one, so the threshold is local.</p>
<h2>Scotland and Northern Ireland</h2>
<p>Neither has a penalty notice for absence. In Scotland the ${h.src('scot_attendance', 'Scottish Government attendance guidance')} asks schools to record most term-time holidays as unauthorised; persistent non-attendance can end in an attendance order, a referral to the Children's Reporter or prosecution under the Education (Scotland) Act 1980. In Northern Ireland the Education Welfare Service can take a parent to court, where ${h.src('ni_attendance', 'nidirect')} says the fine can reach £${h.num(h.P.penalties['northern-ireland'].courtFinePerChild)} for each child.</p>
<h2>Ways to avoid a fine legally</h2>
<p>Use the holidays your council sets, which you can check on this site; add INSET days, which are not absences; and if a family event really is exceptional, ask the school in writing well before. The ${h.a('half-term-dates', 'half term dates')} and the ${h.a('compare-term-dates', 'council comparison')} help families with children in two areas find the weeks they share.</p>
<!--tool:countdown-->`;
  },
});
