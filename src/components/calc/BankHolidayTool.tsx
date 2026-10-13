/** Next bank holidays in each part of the UK, from the GOV.UK feed stored at build time. */
import { useEffect, useState } from 'react';
import { bankHolidays, daysBetween, longDate, type Nation } from '../../lib/engine/calendar';

declare const __BUILD_DAY__: string;
const N: Array<[Nation, string]> = [['england', 'England and Wales'], ['scotland', 'Scotland'], ['northern-ireland', 'Northern Ireland']];

export default function BankHolidayTool({ secondary = false }: { secondary?: boolean }) {
  const [nation, setNation] = useState<Nation>('england');
  const [today, setToday] = useState(__BUILD_DAY__);
  useEffect(() => setToday(new Date().toISOString().slice(0, 10)), []);
  const list = [...bankHolidays(nation).entries()].filter(([d]) => d >= today).slice(0, 6);
  return (
    <form className={secondary ? 'my-4 rounded-lg border border-navy-200 bg-white p-4' : 'rechner rounded-lg border border-navy-200 bg-white p-4 sm:p-5'} onSubmit={(e) => e.preventDefault()} aria-label="Next bank holidays" {...(secondary ? { 'data-simulateur-secondaire': '' } : {})}>
      <div className="grid gap-5 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="self-start">
          <label htmlFor="bh-nation" className="mb-1 block text-sm font-medium text-navy-700">Part of the UK</label>
          <select id="bh-nation" value={nation} onChange={(e) => setNation(e.target.value as Nation)} className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900">{N.map(([k, l]) => <option key={k} value={k}>{l}</option>)}</select>
          <p className="mt-1 text-xs text-navy-600">Wales shares the England list.</p>
        </div>
        <div {...(secondary ? {} : { 'data-resultat': '' })} aria-live="polite" className="rounded-lg bg-accent-50 p-4">
          {list[0] ? (<>
            <p className="text-sm text-navy-700">Next bank holiday</p>
            <p className="mt-1 font-serif text-[2rem] font-bold leading-tight text-accent-500">{list[0][1]}</p>
            <p className="text-navy-800">{longDate(list[0][0])}, in {daysBetween(today, list[0][0]).toLocaleString('en-GB')} days</p>
            <ul className="mt-3 space-y-1 border-t border-accent-100 pt-3 text-sm text-navy-800">{list.slice(1).map(([d, t]) => <li key={d}>{t}: {longDate(d)}</li>)}</ul>
          </>) : <p>No later date in the stored list.</p>}
        </div>
      </div>
    </form>
  );
}
