/** School year of one council: pupil days counted from the published calendar, INSET rule, first and last day. */
import { useEffect, useState } from 'react';
import CouncilSelect from './CouncilSelect';
import { useCouncil } from './useCouncil';
import { yearSchoolDays, firstLastDay, longDate, type YearKey } from '../../lib/engine/calendar';
import type { CouncilLite, CouncilName } from '../../lib/lite';
import { readParams } from '../../lib/url-state';

interface Props { initial: CouncilLite; names: CouncilName[]; secondary?: boolean; idPrefix?: string; focus?: 'inset' | 'days' }
const MODE: Record<string, string> = { fixed: 'The council fixes the INSET days below for its schools.', 'school-chooses': 'Each school picks its own INSET days: ask the school for them.', 'partly-fixed': 'Some INSET days are fixed by the council, the school chooses the rest.', 'not-stated': 'The council page says nothing about INSET days: ask the school.' };

export default function YearTool({ initial, names, secondary = false, idPrefix = 'yt', focus = 'days' }: Props) {
  const { council, slug, pick, loading, error } = useCouncil(initial);
  const [year, setYear] = useState<YearKey>('2026-27');
  useEffect(() => { const c = readParams(window.location.search).get('c'); if (c && c !== initial.s && names.some((n) => n.s === c)) pick(c, false); }, []);
  const Y = council.years[year];
  const days = yearSchoolDays(council, year);
  const fl = firstLastDay(council, year);
  return (
    <form className={secondary ? 'my-4 rounded-lg border border-navy-200 bg-white p-4' : 'rechner rounded-lg border border-navy-200 bg-white p-4 sm:p-5'} onSubmit={(e) => e.preventDefault()} aria-label="School year checker" {...(secondary ? { 'data-simulateur-secondaire': '' } : {})}>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-x-3">
          <CouncilSelect id={`${idPrefix}-c`} label="Council" value={slug} onChange={(v) => pick(v)} names={names} />
          <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
            <label htmlFor={`${idPrefix}-y`} className="mb-1 block text-sm font-medium text-navy-700">Year</label>
            <div className="relative self-start"><select id={`${idPrefix}-y`} value={year} onChange={(e) => setYear(e.target.value as YearKey)} className="w-full appearance-none truncate h-12 rounded-lg border border-navy-300 bg-white text-navy-900 pl-3 pr-10"><option value="2026-27">2026-27</option><option value="2027-28">2027-28</option></select><svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
          </div>
        </div>
        <div {...(secondary ? {} : { 'data-resultat': '' })} aria-live="polite" className="rounded-lg bg-accent-50 p-4">
          {error ? <p className="text-red-700">{error}</p> : loading ? <p className="text-navy-700">Loading…</p> : !Y || Y.status === 'not-published' || days === null ? <p className="text-navy-800">{council.name} has not published {year} yet.</p> : focus === 'inset' ? (
            <>
              <p className="text-sm text-navy-700">INSET days {year} · {council.name}</p>
              <p className="mt-1 font-serif text-[2rem] font-bold leading-tight text-accent-500">{(Y.inset?.length ?? 0) > 0 ? `${Y.inset!.length} fixed by the council` : 'Set by each school'}</p>
              <p className="mt-1 text-navy-800">{MODE[Y.insetMode ?? 'not-stated']}</p>
              {(Y.inset?.length ?? 0) > 0 && <ul className="mt-2 text-sm text-navy-800">{Y.inset!.map((i) => <li key={i.date}>{longDate(i.date)}</li>)}</ul>}
              <p className="mt-2 text-sm text-navy-700">Pupil days on the council calendar: <span className="tabular-nums font-semibold">{days}</span>{Y.inset?.length ? '' : days >= 194 ? ', so about five of them will become INSET days' : ''}.</p>
            </>
          ) : (
            <>
              <p className="text-sm text-navy-700">School days {year} · {council.name}</p>
              <p className="mt-1 font-serif text-[2.4rem] font-bold leading-tight text-accent-500 tabular-nums">{days} days</p>
              <p className="text-navy-800">on the council calendar, after weekends, holidays{council.nation === 'scotland' ? ', local holidays' : ', bank holidays'} and any INSET days it fixes.</p>
              {fl && <p className="mt-2 text-sm text-navy-800">First day {longDate(fl.first)} · last day {longDate(fl.last)}</p>}
              {Y.statedDays ? <p className="mt-1 text-sm text-navy-700">The council itself states {Y.statedDays} days.</p> : null}
            </>
          )}
        </div>
      </div>
    </form>
  );
}
