/** Term-time holiday fine calculator (penalty notices), England and Wales; Scotland and NI explained. */
import { useState } from 'react';
import { penalty, type Timing } from '../../lib/engine/penalty';
import type { Nation } from '../../lib/engine/calendar';
import { updateURL } from '../../lib/url-state';
import NumberField from '../ui/NumberField';

const sel = 'h-12 w-full appearance-none truncate rounded-lg border border-navy-300 bg-white text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 pl-3 pr-10';
function Field({ id, label, children, help }: { id: string; label: string; children: React.ReactNode; help?: string }) {
  return (<div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0"><label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>{children}{help ? <p id={`${id}-help`} className="mt-1 text-xs text-navy-600">{help}</p> : <span />}</div>);
}
export default function PenaltyCalc({ methodHref }: { methodHref: string }) {
  const [nation, setNation] = useState<Nation>('england');
  const [days, setDays] = useState(5);
  const [children, setChildren] = useState('1');
  const [parents, setParents] = useState('2');
  const [notice, setNotice] = useState<1 | 2 | 3>(1);
  const [timing, setTiming] = useState<Timing>('early');
  const d = Math.max(0, days);
  const r = penalty({ nation, parents: +parents, children: +children, notice, timing, daysOff: d });
  const sync = (o: Record<string, string | number>) => updateURL({ n: nation, d: days, k: children, p: parents, x: notice, t: timing, ...o });
  return (
    <form className="rechner rounded-lg border border-navy-200 bg-white p-4 sm:p-5" onSubmit={(e) => e.preventDefault()} aria-label="Term-time holiday fine calculator">
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-2 gap-x-3 gap-y-3">
          <Field id="pc-nation" label="Where is the school?"><div className="relative self-start"><select id="pc-nation" className={sel} value={nation} onChange={(e) => { setNation(e.target.value as Nation); sync({ n: e.target.value }); }}><option value="england">England</option><option value="wales">Wales</option><option value="scotland">Scotland</option><option value="northern-ireland">Northern Ireland</option></select><svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></div></Field>
          <NumberField id="pc-days" label="School days missed" value={days} onChange={(v) => { setDays(v); sync({ d: v }); }} unit="days" max={60} decimals={days % 1 ? 1 : 0} help="2.5 days = 5 sessions" />
          <Field id="pc-children" label="Children taken out"><div className="relative self-start"><select id="pc-children" className={sel} value={children} onChange={(e) => { setChildren(e.target.value); sync({ k: e.target.value }); }}>{[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}</option>)}</select><svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></div></Field>
          <Field id="pc-parents" label="Parents fined"><div className="relative self-start"><select id="pc-parents" className={sel} value={parents} onChange={(e) => { setParents(e.target.value); sync({ p: e.target.value }); }}><option value="1">1</option><option value="2">2</option></select><svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></div></Field>
          {nation === 'england' && <Field id="pc-notice" label="Notice for this child"><div className="relative self-start"><select id="pc-notice" className={sel} value={notice} onChange={(e) => { setNotice(+e.target.value as 1 | 2 | 3); sync({ x: e.target.value }); }}><option value="1">First in 3 years</option><option value="2">Second in 3 years</option><option value="3">Third in 3 years</option></select><svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></div></Field>}
          {(nation === 'england' || nation === 'wales') && notice !== 2 && <Field id="pc-timing" label="Paid"><div className="relative self-start"><select id="pc-timing" className={sel} value={timing} onChange={(e) => { setTiming(e.target.value as Timing); sync({ t: e.target.value }); }}><option value="early">{nation === 'wales' ? 'Within 28 days' : 'Within 21 days'}</option><option value="late">{nation === 'wales' ? 'Day 29 to 42' : 'Day 22 to 28'}</option></select><svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></div></Field>}
        </div>
        <div data-resultat aria-live="polite" className="rounded-lg bg-accent-50 p-4">
          <p className="text-sm text-navy-700">Total for the household</p>
          <p className="mt-1 font-serif text-[2.4rem] font-bold leading-tight text-accent-500 tabular-nums">{r.total !== null ? `£${r.total.toLocaleString('en-GB')}` : r.system === 'none' ? 'No fixed fine' : 'Court instead'}</p>
          {r.perNotice !== null && <p className="text-navy-800">{r.notices} notice{r.notices > 1 ? 's' : ''} × £{r.perNotice} (one per parent, per child)</p>}
          <p className="mt-2 text-navy-800">{r.rule}.</p>
          {r.deadline && <p className="mt-1 text-sm text-navy-700">{r.deadline}.</p>}
          {r.meetsThreshold !== null && <p className="mt-3 border-t border-accent-100 pt-3 text-sm text-navy-800">{r.sessions} sessions missed: {r.meetsThreshold ? 'the national threshold of 10 sessions in 10 school weeks is reached, so the school must consider a notice.' : 'under the national threshold of 10 sessions in 10 school weeks, but late marks and other absence count towards it.'}</p>}
          <p className="mt-3 text-xs text-navy-600">Estimate from the published rules, not legal advice · <a className="underline" href={methodHref}>method</a></p>
        </div>
      </div>
    </form>
  );
}
