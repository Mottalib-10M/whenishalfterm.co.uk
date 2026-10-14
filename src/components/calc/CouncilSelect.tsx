import type { CouncilName } from '../../lib/lite';

interface Props { id: string; label: string; value: string; onChange: (v: string) => void; names: CouncilName[]; help?: string; className?: string }

/** Native select, grouped by nation then region: on a phone it opens the system picker. */
export default function CouncilSelect({ id, label, value, onChange, names, help, className = '' }: Props) {
  const groups = new Map<string, CouncilName[]>();
  for (const c of names) {
    const g = c.nat === 'england' ? (c.r === 'London' ? 'London' : `England: ${c.r}`) : c.nat === 'scotland' ? 'Scotland' : c.nat === 'wales' ? 'Wales' : 'Northern Ireland';
    if (!groups.has(g)) groups.set(g, []);
    groups.get(g)!.push(c);
  }
  const order = [...groups.keys()].sort((a, b) => a.localeCompare(b));
  return (
    <div className={`grid grid-rows-subgrid row-span-3 content-start gap-y-0 ${className}`}>
      <label htmlFor={id} className="mb-1 block text-sm font-medium text-navy-700">{label}</label>
      <div className="relative self-start"><select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={help ? `${id}-help` : undefined}
        className="h-12 w-full appearance-none truncate rounded-lg border border-navy-300 bg-white text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20 pl-3 pr-10">
        {order.map((g) => (
          <optgroup key={g} label={g}>
            {groups.get(g)!.sort((a, b) => a.n.localeCompare(b.n)).map((c) => <option key={c.s} value={c.s}>{c.n}</option>)}
          </optgroup>
        ))}
      </select><svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-500" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" /></svg></div>
      {help && <p id={`${id}-help`} className="mt-1 text-xs text-navy-600">{help}</p>}
    </div>
  );
}
