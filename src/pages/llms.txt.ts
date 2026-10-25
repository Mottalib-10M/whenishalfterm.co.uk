/** llms.txt (RECETTE §21): what the site is, where its data comes from, its main pages. Built from the data. */
import type { APIRoute } from 'astro';
import { COUNCILS, councilRouteId } from '../lib/councils';
import { PAGES } from '../lib/guides';
import { route } from '../i18n/routes';
import { SITE_URL, LAST_UPDATED } from '../data/site-config';
export const GET: APIRoute = () => {
  const lines = [
    '# When Is Half Term',
    '',
    `> School term and holiday dates for 2026-27 and 2027-28, council by council, across England, Scotland, Wales and Northern Ireland. Each calendar is read on the council's own website and stored with its source link and reading date (last ${LAST_UPDATED}). Tools: is school open on a date, countdown to the next break, school days left, comparison of two councils, term-time holiday fine calculator. Published by Radif Partners, an independent publisher; not a council or government site.`,
    '',
    '## Guides',
    ...PAGES.map((p) => `- [${p.nav}](${SITE_URL}${route(p.id, 'en')}): ${p.card}`),
    '',
    '## Councils',
    ...COUNCILS.map((c) => `- [${c.name} term dates](${SITE_URL}${route(councilRouteId(c.slug), 'en')}): ${c.officialName}`),
    '',
    '## Method',
    `- [How the dates are read and tested](${SITE_URL}${route('method', 'en')})`,
    `- [About](${SITE_URL}${route('about', 'en')})`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
