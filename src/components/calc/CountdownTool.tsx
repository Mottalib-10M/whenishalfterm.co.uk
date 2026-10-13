/** Countdown from a date to every coming break of one council: calendar days and school days. */
import { useEffect, useState } from 'react';
import CouncilSelect from './CouncilSelect';
import { useCouncil } from './useCouncil';
import { breaks, daysBetween, schoolDays, addDays, rangeText, isIsoDate } from '../../lib/engine/calendar';
import type { CouncilLite, CouncilName } from '../../lib/lite';
import { readParams } from '../../lib/url-state';

declare const __BUILD_DAY__: string;
interface Props { initial: CouncilLite; names: CouncilName[]; secondary?: boolean; idPrefix?: string; only?: 'summer' }

export default function CountdownTool({ initial, names, secondary = false, idPrefix = 'cd', only }: Props) {
  const { council, slug, pick, loading, error } = useCouncil(initial);
  const [from, setFrom] = useState(__BUILD_DAY__);
  useEffect(() => {
    setFrom(new Date().toISOString().slice(0, 10));
    const c = readParams(window.location.search).get('c');
    if (c && c !== initial.s && names.some((n) => n.s === c)) pick(c, false);
  }, []);
  const ok = isIsoDate(from);
  const list = ok ? breaks(council).filter((b) => b.end >= from && (!only || b.key === only)).slice(0, only ? 2 : 6) : [];
  const first = list[0];
  return (
    <form className={secondary ? 'my-4 rounded-lg border border-navy-200 bg-white p-4' : 'rechner rounded-lg border border-navy-200 bg-white p-4 sm:p-5'} onSubmit={(e) => e.preventDefault()} aria-label="Countdown to the holidays" {...(secondary ? { 'data-simulateur-secondaire': '' } : {})}>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="grid grid-cols-1 gap-y-3">
          <CouncilSelect id={`${idPrefix}-c`} label="Council" value={slug} onChange={(v) => pick(v)} names={names} />
          <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
            <label htmlFor={`${idPrefix}-d`} className="mb-1 block text-sm font-medium text-navy-700">Counting from</label>
            <input id={`${idPrefix}-d`} type="date" value={from} min="2026-08-01" max="2028-07-31" onChange={(e) => setFrom(e.target.value)} className="h-12 rounded-lg border border-navy-300 bg-white px-3 text-navy-900" />
            <span />
          </div>
        </div>
        <div {...(secondary ? {} : { 'data-resultat': '' })} aria-live="polite" className="rounded-lg bg-accent-50 p-4">
          {error ? <p className="text-red-700">{error}</p> : loading ? <p className="text-navy-700">Loading…</p> : !first ? <p className="text-navy-800">No later break is published for {council.name} yet.</p> : (
            <>
              <p className="text-sm text-navy-700">{first.start <= from ? 'Under way' : `${first.name} starts in`} · {council.name}</p>
              <p className="mt-1 font-serif text-[2.4rem] font-bold leading-tight text-accent-500 tabular-nums">{first.start <= from ? first.name : `${daysBetween(from, first.start).toLocaleString('en-GB')} days`}</p>
              {first.start > from && <p className="text-navy-800"><span className="tabular-nums">{schoolDays(council, from, addDays(first.start, -1)).toLocaleString('en-GB')}</span> school days to go, counting {from === __BUILD_DAY__ ? 'today' : 'the start date'} if it is a school day</p>}
              <ul className="mt-3 space-y-1 border-t border-accent-100 pt-3 text-sm text-navy-800">
                {list.map((b) => <li key={b.start}><span className="font-medium">{b.name}</span>: {rangeText(b.start, b.end)}{b.start > from && <> · in {daysBetween(from, b.start).toLocaleString('en-GB')} days</>}</li>)}
              </ul>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
