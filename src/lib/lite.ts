/** Client-safe council types and helpers (no data import: the browser loads one council at a time). */
import type { Council, Nation } from './engine/calendar';
export interface CouncilLite { s: string; n: string; o: string; nat: Nation; r: string; y: Council['years'] }
export interface CouncilName { s: string; n: string; nat: Nation; r: string }
export const fromLite = (l: CouncilLite): Council => ({ slug: l.s, name: l.n, officialName: l.o, nation: l.nat, region: l.r, type: '', appliesTo: '', academyNote: '', localFacts: [], years: l.y });
const cache = new Map<string, Promise<CouncilLite>>();
/** Loads `/data/councils/<slug>.json` (built with the site, same origin, nothing sent). */
export function loadCouncil(slug: string): Promise<CouncilLite> {
  if (!cache.has(slug)) cache.set(slug, fetch(`/data/councils/${slug}.json`).then((r) => { if (!r.ok) throw new Error(String(r.status)); return r.json(); }));
  return cache.get(slug)!;
}
export const NATION_NAME: Record<Nation, string> = { england: 'England', wales: 'Wales', scotland: 'Scotland', 'northern-ireland': 'Northern Ireland' };
