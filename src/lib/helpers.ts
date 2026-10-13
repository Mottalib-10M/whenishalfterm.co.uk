/** Writing helpers handed to every guide body. */
import { route, ROUTES } from '../i18n/routes';
import { P, type SourceKey } from './engine/params';
import { COUNCILS, councilRouteId } from './councils';
import { breakOf, rangeText, plainDate, weekdaysIn, type BreakKey, type YearKey, type Council } from './engine/calendar';
import type { Helpers } from './guide-types';
import { formatNumber } from './format';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
export function table(headers: string[], rows: Array<Array<string | number>>, caption?: string, align: Array<'l' | 'r'> = []) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="border-b border-navy-300 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-navy-700 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r) => `<tr>${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}
const councilLink = (slug: string, text?: string) => {
  const c = COUNCILS.find((x) => x.slug === slug);
  if (!c) throw new Error(`Unknown council in a link: ${slug}`);
  return `<a href="${route(councilRouteId(slug), 'en')}">${text ?? c.name}</a>`;
};
export function groups(key: BreakKey, year: YearKey, filter: (c: Council) => boolean = () => true) {
  const m = new Map<string, { start: string; end: string; names: string[] }>();
  for (const c of COUNCILS.filter(filter)) {
    const b = breakOf(c, year, key);
    if (!b) continue;
    const k = `${b.start}|${b.end}`;
    if (!m.has(k)) m.set(k, { start: b.start, end: b.end, names: [] });
    m.get(k)!.names.push(c.name);
  }
  return [...m.values()].sort((a, b) => b.names.length - a.names.length || a.start.localeCompare(b.start));
}
export function breakTable(key: BreakKey, year: YearKey, filter: (c: Council) => boolean = () => true) {
  const rows = COUNCILS.filter(filter).map((c) => {
    const b = breakOf(c, year, key);
    const Y = c.years[year];
    const status = !Y || Y.status === 'not-published' ? 'Not published yet' : b ? rangeText(b.start, b.end) : 'No break of this kind';
    return [councilLink(c.slug), status, b ? weekdaysIn(b.start, b.end) : '', Y?.source ? `<a href="${Y.source.officialUrl}" target="_blank" rel="nofollow noopener noreferrer">${Y.status === 'provisional' ? 'provisional, ' : ''}read ${plainDate(Y.source.retrieved)}</a>` : ''];
  });
  return table(['Council', 'Dates', 'Weekdays', 'Source'], rows, undefined, ['l', 'l', 'r', 'l']);
}
export function helpers(strict = false): Helpers {
  return {
    P,
    councils: COUNCILS,
    a: (id, text) => {
      if (!ROUTES.some((r) => r.id === id)) { if (strict) throw new Error(`Unknown page id in a link: ${id}`); return text; }
      return `<a href="${route(id, 'en')}">${text}</a>`;
    },
    num: (n) => formatNumber(n, 0),
    date: (iso) => plainDate(iso),
    range: rangeText,
    table,
    src: (key: SourceKey, text?: string) => { const s = P.sources[key]; return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label.en}</a>`; },
    breakTable, groups, councilLink,
  };
}
