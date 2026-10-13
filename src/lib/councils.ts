/** Registry of councils: every file of `src/data/councils/` is one council and one page. */
import type { Council, Nation } from './engine/calendar';
import type { CouncilLite, CouncilName } from './lite';
export type { CouncilLite, CouncilName } from './lite';

const mods = import.meta.glob<{ default: Council }>('../data/councils/*.json', { eager: true });

export const COUNCILS: Council[] = Object.entries(mods)
  .map(([file, m]) => {
    const c = m.default;
    const base = file.split('/').pop()!.replace(/\.json$/, '');
    if (c.slug !== base) throw new Error(`${file}: slug “${c.slug}” differs from the file name`);
    return c;
  })
  .sort((a, b) => a.name.localeCompare(b.name));

export const councilBySlug = (slug: string) => COUNCILS.find((c) => c.slug === slug);
export const NATION_LABEL: Record<Nation, string> = { england: 'England', wales: 'Wales', scotland: 'Scotland', 'northern-ireland': 'Northern Ireland' };
/** Route id of a council page (`kent-term-dates`). */
export const councilRouteId = (slug: string) => `${slug}-term-dates`;
/** Compact data handed to the browser tools (no facts, no sources). */
export const NAMES: CouncilName[] = COUNCILS.map((c) => ({ s: c.slug, n: c.name, nat: c.nation, r: c.region }));
export const toLite = (c: Council): CouncilLite => ({
  s: c.slug, n: c.name, nat: c.nation, r: c.region,
  y: Object.fromEntries(Object.entries(c.years).map(([k, Y]) => [k, Y && { status: Y.status, sessions: Y.sessions.map(({ start, end, label }) => ({ start, end, label })), holidays: Y.holidays, closures: Y.closures, inset: Y.inset, insetMode: Y.insetMode, source: Y.source && { officialUrl: Y.source.officialUrl, via: Y.source.via, retrieved: Y.source.retrieved, format: Y.source.format } }])) as Council['years'],
  o: c.officialName,
});
