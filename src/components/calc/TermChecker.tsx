/**
 * "Is school open on this date?" plus the countdown to the next break, for one council.
 * Hydration (RECETTE §17.5): first render = the council given by the page and the build day;
 * the visitor's link (?c=…&d=…) and today's date are applied in useEffect, after hydration.
 */
import { useEffect, useMemo, useState } from 'react';
import CouncilSelect from './CouncilSelect';
import { dayStatus, nextBreak, schoolDaysLeftInYear, longDate, rangeText, addDays, isIsoDate, yearKeyOf, type YearKey } from '../../lib/engine/calendar';
import { fromLite, loadCouncil, type CouncilLite, type CouncilName } from '../../lib/lite';
import { readParams, updateURL } from '../../lib/url-state';

declare const __BUILD_DAY__: string;
interface Props { initial: CouncilLite; names: CouncilName[]; methodHref: string; councilHrefs: Record<string, string>; heading?: string }

const fmtInt = (n: number) => n.toLocaleString('en-GB');

export default function TermChecker({ initial, names, methodHref, councilHrefs, heading }: Props) {
  const [lite, setLite] = useState<CouncilLite>(initial);
  const [slug, setSlug] = useState(initial.s);
  const [date, setDate] = useState<string>(__BUILD_DAY__);
  const [today, setToday] = useState<string>(__BUILD_DAY__);
  const [error, setError] = useState('');

  useEffect(() => {
    const t = new Date().toISOString().slice(0, 10);
    setToday(t);
    const u = readParams(window.location.search);
    const d = u.get('d');
    setDate(d && isIsoDate(d) ? d : t);
    const c = u.get('c');
    if (c && c !== initial.s && names.some((x) => x.s === c)) pick(c, false);
  }, []);

  function pick(s: string, write = true) {
    setSlug(s);
    if (s === initial.s) { setLite(initial); setError(''); return; }
    loadCouncil(s).then((l) => { setLite(l); setError(''); }).catch(() => setError('This council could not be loaded. Reload the page and try again.'));
    if (write) updateURL({ c: s, d: date });
  }
  function changeDate(d: string) {
    setDate(d);
    if (isIsoDate(d)) updateURL({ c: slug === initial.s ? undefined : slug, d });
  }

  const council = useMemo(() => fromLite(lite), [lite]);
  const valid = isIsoDate(date);
  const st = valid ? dayStatus(council, date) : null;
  const nb = valid ? nextBreak(council, date) : null;
  const left = valid ? schoolDaysLeftInYear(council, date) : null;
  const yk = valid ? (yearKeyOf(date) as YearKey) : null;
  const src = yk ? council.years[yk]?.source : undefined;
  const loading = slug !== lite.s;

  let headline = 'Pick a date';
  let tone = 'text-navy-900';
  if (st) {
    if (st.open) { headline = 'School day'; tone = 'text-green-800'; }
    else if (st.kind === 'unknown') { headline = 'Not published yet'; tone = 'text-navy-700'; }
    else { headline = 'No school'; tone = 'text-accent-500'; }
  }
  const reason = st && !st.open && st.kind !== 'unknown'
    ? (st.kind === 'weekend' ? 'Weekend' : st.holiday && st.holiday.start !== st.holiday.end ? `${st.label}: ${rangeText(st.holiday.start, st.holiday.end)}` : st.label)
    : st?.kind === 'unknown' ? st.label : st?.open ? `${st.label} at ${council.officialName}` : '';
  const upcoming = useMemo(() => {
    if (!valid) return [];
    const out: Array<{ name: string; start: string; end: string }> = [];
    const all = (['2026-27', '2027-28'] as YearKey[]).flatMap((k) => council.years[k]?.status !== 'not-published' ? council.years[k]?.holidays ?? [] : []);
    for (const h of all.sort((a, b) => a.start.localeCompare(b.start))) if (h.end >= date && out.length < 4) out.push(h);
    return out;
  }, [council, date, valid]);

  return (
    <form className="rechner rounded-lg border border-navy-200 bg-white p-4 sm:p-5" onSubmit={(e) => e.preventDefault()} aria-label={heading ?? 'School open checker'}>
      <div className="grid grid-cols-[minmax(0,1fr)] gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-3">
            <CouncilSelect id="tc-council" label="Council (local authority)" value={slug} onChange={(v) => pick(v)} names={names} help="The council that runs the state schools where you live." />
            <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
              <label htmlFor="tc-date" className="mb-1 block text-sm font-medium text-navy-700">Date to check</label>
              <input id="tc-date" type="date" value={date} min="2026-08-01" max="2028-08-31" onChange={(e) => changeDate(e.target.value)} aria-describedby="tc-date-help"
                className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
              <p id="tc-date-help" className="mt-1 text-xs text-navy-600">Any day from August 2026 to August 2028.</p>
            </div>
          </div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <button type="button" className="rounded border border-navy-300 px-3 py-1.5 text-navy-800 hover:border-accent-500" onClick={() => changeDate(today)}>Today</button>
            <button type="button" className="rounded border border-navy-300 px-3 py-1.5 text-navy-800 hover:border-accent-500" onClick={() => changeDate(addDays(today, 1))}>Tomorrow</button>
            {nb?.next && <button type="button" className="rounded border border-navy-300 px-3 py-1.5 text-navy-800 hover:border-accent-500" onClick={() => changeDate(nb.next!.start)}>First day of the next break</button>}
          </div>
          {councilHrefs[slug] && slug !== initial.s && <p className="mt-3 text-sm"><a className="text-accent-500 underline" href={councilHrefs[slug]}>{lite.n} term dates in full</a></p>}
        </div>
        <div data-resultat aria-live="polite" className="rounded-lg bg-accent-50 p-4">
          {error ? <p className="text-red-700">{error}</p> : loading ? <p className="text-navy-700">Loading {names.find((n) => n.s === slug)?.n}…</p> : (
            <>
              <p className="text-sm text-navy-700">{valid ? longDate(date) : 'Enter a date'} · {council.name}</p>
              <p className={`mt-1 font-serif text-[2.4rem] font-bold leading-tight ${tone}`}>{headline}</p>
              {reason && <p className="mt-1 text-navy-800">{reason}</p>}
              {st?.open && st.insetCaveat && <p className="mt-2 text-sm text-navy-700">Open on the council calendar. Your school may still use this day for one of its own INSET days, and academies can set different dates.</p>}
              {st?.provisional && <p className="mt-2 text-sm text-amber-800">The council marks this year as provisional.</p>}
              {nb?.next && nb.daysUntil !== null && (
                <div className="mt-4 border-t border-accent-100 pt-3">
                  <p className="text-sm text-navy-700">{nb.current ? 'After this break, the next one' : 'Next break'}</p>
                  <p className="font-semibold text-navy-900">{nb.next.name}: {rangeText(nb.next.start, nb.next.end)}</p>
                  <p className="text-navy-800"><span className="font-serif text-2xl font-bold tabular-nums">{fmtInt(nb.daysUntil)}</span> days away{nb.schoolDaysUntil !== null && nb.schoolDaysUntil > 0 && <>, <span className="tabular-nums">{fmtInt(nb.schoolDaysUntil)}</span> school days</>}</p>
                </div>
              )}
              {left !== null && left > 0 && <p className="mt-2 text-sm text-navy-700">School days left in {yk}: <span className="tabular-nums font-semibold text-navy-900">{fmtInt(left)}</span></p>}
              {upcoming.length > 0 && (
                <ul className="mt-3 space-y-1 border-t border-accent-100 pt-3 text-sm text-navy-800">
                  {upcoming.map((h) => <li key={h.start}><span className="font-medium">{h.name}</span> · {rangeText(h.start, h.end)}</li>)}
                </ul>
              )}
              {src && <p className="mt-3 text-xs text-navy-600">Dates read on <a className="underline" href={src.officialUrl} target="_blank" rel="nofollow noopener noreferrer">{council.officialName}</a> on {longDate(src.retrieved, true).replace(/^\w+ /, '')} · <a className="underline" href={methodHref}>method</a></p>}
            </>
          )}
        </div>
      </div>
    </form>
  );
}
