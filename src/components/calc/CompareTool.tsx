/** Two councils side by side: which breaks overlap, and the weekdays when only one has school. */
import { useEffect, useState } from 'react';
import CouncilSelect from './CouncilSelect';
import { useCouncil } from './useCouncil';
import { compareCouncils, rangeText, shortDate, BREAK_LABEL, type YearKey } from '../../lib/engine/calendar';
import type { CouncilLite, CouncilName } from '../../lib/lite';
import { readParams, updateURL } from '../../lib/url-state';

interface Props { a: CouncilLite; b: CouncilLite; names: CouncilName[]; methodHref: string; secondary?: boolean; idPrefix?: string }

export default function CompareTool({ a, b, names, methodHref, secondary = false, idPrefix = 'cmp' }: Props) {
  const A = useCouncil(a, 'a');
  const B = useCouncil(b, 'b');
  const [year, setYear] = useState<YearKey>('2026-27');
  const [showDays, setShowDays] = useState(false);
  useEffect(() => {
    const u = readParams(window.location.search);
    const pa = u.get('a'), pb = u.get('b'), y = u.get('y');
    if (pa && pa !== a.s && names.some((n) => n.s === pa)) A.pick(pa, false);
    if (pb && pb !== b.s && names.some((n) => n.s === pb)) B.pick(pb, false);
    if (y === '2027-28') setYear(y);
  }, []);
  const ready = !A.loading && !B.loading;
  const cmp = ready ? compareCouncils(A.council, B.council, year) : null;
  const same = A.slug === B.slug;
  return (
    <form className={secondary ? 'my-4 rounded-lg border border-navy-200 bg-white p-4' : 'rechner rounded-lg border border-navy-200 bg-white p-4 sm:p-5'} onSubmit={(e) => e.preventDefault()} aria-label="Compare two councils" {...(secondary ? { 'data-simulateur-secondaire': '' } : {})}>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="grid grid-cols-1 gap-y-3">
          <CouncilSelect id={`${idPrefix}-a`} label="First council" value={A.slug} onChange={(v) => A.pick(v)} names={names} />
          <CouncilSelect id={`${idPrefix}-b`} label="Second council" value={B.slug} onChange={(v) => B.pick(v)} names={names} help="For example the other parent's area, or a school just over the boundary." />
          <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
            <label htmlFor={`${idPrefix}-y`} className="mb-1 block text-sm font-medium text-navy-700">School year</label>
            <select id={`${idPrefix}-y`} value={year} onChange={(e) => { setYear(e.target.value as YearKey); updateURL({ a: A.slug, b: B.slug, y: e.target.value }); }} className="h-12 rounded-lg border border-navy-300 bg-white px-3 text-navy-900"><option value="2026-27">2026-27</option><option value="2027-28">2027-28</option></select>
          </div>
        </div>
        <div {...(secondary ? {} : { 'data-resultat': '' })} aria-live="polite" className="rounded-lg bg-accent-50 p-4">
          {A.error || B.error ? <p className="text-red-700">{A.error || B.error}</p> : !ready ? <p className="text-navy-700">Loading…</p> : same ? <p className="text-navy-800">Pick two different councils.</p> : !cmp ? (
            <p className="text-navy-800">{[A.council, B.council].filter((c) => !c.years[year] || c.years[year]!.status === 'not-published').map((c) => c.name).join(' and ')} {year} dates are not published yet. Try 2026-27.</p>
          ) : (
            <>
              <p className="text-sm text-navy-700">{A.council.name} and {B.council.name}, {year}</p>
              <p className="mt-1 font-serif text-[2.2rem] font-bold leading-tight text-accent-500 tabular-nums">{cmp.onlyA + cmp.onlyB} {cmp.onlyA + cmp.onlyB === 1 ? 'day' : 'days'}</p>
              <p className="text-navy-800">weekdays when one council's pupils are off and the other's are in school ({A.council.name} off: {cmp.onlyA}, {B.council.name} off: {cmp.onlyB}). Both off: {cmp.bothOff} weekdays.</p>
              <div className="mt-3 overflow-x-auto">
                <table className="journal w-full text-sm">
                  <thead><tr><th scope="col" className="py-1 pr-2 text-left">Break</th><th scope="col" className="py-1 pr-2 text-left">{A.council.name}</th><th scope="col" className="py-1 pr-2 text-left">{B.council.name}</th><th scope="col" className="py-1 text-right">Shared</th></tr></thead>
                  <tbody>{cmp.rows.map((r) => (
                    <tr key={r.key} className="border-b border-accent-100"><td className="py-1 pr-2">{BREAK_LABEL[r.key]}</td><td className="py-1 pr-2">{r.a ? rangeText(r.a.start, r.a.end) : 'n/a'}</td><td className="py-1 pr-2">{r.b ? rangeText(r.b.start, r.b.end) : 'n/a'}</td><td className="py-1 text-right tabular-nums">{r.sharedWeekdays}</td></tr>
                  ))}</tbody>
                </table>
              </div>
              {cmp.mismatch.length > 0 && <button type="button" className="mt-3 text-sm underline" onClick={() => setShowDays(!showDays)}>{showDays ? 'Hide' : 'List'} the {cmp.mismatch.length} mismatched days</button>}
              {showDays && <ul className="mt-2 columns-1 text-sm text-navy-800 sm:columns-2">{cmp.mismatch.map((m) => <li key={m.date}>{shortDate(m.date)}: {m.off === 'a' ? A.council.name : B.council.name} off ({m.label})</li>)}</ul>}
              <p className="mt-3 text-xs text-navy-600">Council calendars only: INSET days chosen by each school are not included · <a className="underline" href={methodHref}>method</a></p>
            </>
          )}
        </div>
      </div>
    </form>
  );
}
