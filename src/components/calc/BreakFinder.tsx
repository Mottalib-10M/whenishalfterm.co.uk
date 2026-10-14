/** Mini-simulator of the holiday pages: one break (October half term, Easter…) for the visitor's council. */
import { useEffect, useState } from 'react';
import CouncilSelect from './CouncilSelect';
import { useCouncil } from './useCouncil';
import { breakOf, daysBetween, schoolDays, addDays, rangeText, longDate, weekdaysIn, BREAK_LABEL, type BreakKey, type YearKey } from '../../lib/engine/calendar';
import type { CouncilLite, CouncilName } from '../../lib/lite';
import { readParams } from '../../lib/url-state';

declare const __BUILD_DAY__: string;
interface Props { initial: CouncilLite; names: CouncilName[]; breakKey: BreakKey; year: YearKey; secondary?: boolean; fullHref?: string }

export default function BreakFinder({ initial, names, breakKey, year, secondary = false, fullHref }: Props) {
  const { council, slug, pick, loading, error } = useCouncil(initial);
  const [y, setY] = useState<YearKey>(year);
  const [today, setToday] = useState(__BUILD_DAY__);
  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
    const c = readParams(window.location.search).get('c');
    if (c && c !== initial.s && names.some((n) => n.s === c)) pick(c, false);
  }, []);
  const b = breakOf(council, y, breakKey);
  const published = council.years[y] && council.years[y]!.status !== 'not-published';
  const away = b ? daysBetween(today, b.start) : null;
  const label = BREAK_LABEL[breakKey];
  const back = b ? nextOpen(council, b.end) : null;
  return (
    <form className="my-4 rounded-lg border border-navy-200 bg-white p-4" onSubmit={(e) => e.preventDefault()} aria-label={`${label} finder`} {...(secondary ? { 'data-simulateur-secondaire': '' } : {})}>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3">
          <CouncilSelect id={`bf-${breakKey}-council`} label="Your council" value={slug} onChange={(v) => pick(v)} names={names} />
          <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
            <label htmlFor={`bf-${breakKey}-year`} className="mb-1 block text-sm font-medium text-navy-700">School year</label>
            <div className="relative self-start"><select id={`bf-${breakKey}-year`} value={y} onChange={(e) => setY(e.target.value as YearKey)} className="w-full appearance-none truncate h-12 rounded-lg border border-navy-300 bg-white text-navy-900 pl-3 pr-10">
              <option value="2026-27">2026-27</option><option value="2027-28">2027-28</option>
            </select><svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          </div>
        </div>
        <div {...(secondary ? {} : { 'data-resultat': '' })} aria-live="polite" className="rounded-lg bg-accent-50 p-4">
          {error ? <p className="text-red-700">{error}</p> : loading ? <p className="text-navy-700">Loading…</p> : !published ? (
            <p className="text-navy-800">{council.name} has not published its {y} dates yet. The 2026-27 calendar is in the other year.</p>
          ) : b ? (
            <>
              <p className="text-sm text-navy-700">{council.nation === 'scotland' || council.nation === 'northern-ireland' ? b.name : label} {y} · {council.name}</p>
              <p className="mt-1 font-serif text-2xl font-bold text-accent-500 sm:text-[1.9rem]">{rangeText(b.start, b.end)}</p>
              <p className="mt-1 text-navy-800">{b.name} · {weekdaysIn(b.start, b.end)} weekdays off{back ? <> · back on {longDate(back)}</> : null}</p>
              {away !== null && away > 0 && <p className="mt-1 text-navy-800"><span className="font-semibold tabular-nums">{away.toLocaleString('en-GB')}</span> days from today, <span className="tabular-nums">{schoolDays(council, today, addDays(b.start, -1)).toLocaleString('en-GB')}</span> school days to go</p>}
              {away !== null && away <= 0 && b.end >= today && <p className="mt-1 font-semibold text-navy-900">Under way now.</p>}
              {fullHref && <p className="mt-2 text-sm"><a className="underline" href={fullHref}>All term dates for this council</a></p>}
            </>
          ) : <p className="text-navy-800">{council.name} lists no {label.toLowerCase()} in {y}: its calendar groups this break differently.</p>}
        </div>
      </div>
    </form>
  );
}
function nextOpen(c: Parameters<typeof schoolDays>[0], end: string) {
  let d = addDays(end, 1);
  for (let i = 0; i < 70; i++, d = addDays(d, 1)) if (schoolDays(c, d, d) === 1) return d;
  return null;
}
