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
      <select id={id} value={value} onChange={(e) => onChange(e.target.value)} aria-describedby={help ? `${id}-help` : undefined}
        className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20">
        {order.map((g) => (
          <optgroup key={g} label={g}>
            {groups.get(g)!.sort((a, b) => a.n.localeCompare(b.n)).map((c) => <option key={c.s} value={c.s}>{c.n}</option>)}
          </optgroup>
        ))}
      </select>
      {help && <p id={`${id}-help`} className="mt-1 text-xs text-navy-600">{help}</p>}
    </div>
  );
}
