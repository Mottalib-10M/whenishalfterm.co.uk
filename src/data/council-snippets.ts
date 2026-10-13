/** Title, description and H1 of a council page (RECETTE §11: 50-60 / 150-160 characters, key term first).
 *  The first candidate of the right length wins; tests/snippets.test.ts fails if none fits. */
import type { Council } from '../lib/engine/calendar';

const fit = (cands: string[], lo: number, hi: number) => cands.find((s) => s.length >= lo && s.length <= hi);
export function TITLES(c: Council) {
  const n = c.name;
  const has28 = !!c.years['2027-28'] && c.years['2027-28']!.status !== 'not-published';
  const term = c.nation === 'northern-ireland' ? 'School Holidays' : 'Term Dates';
  const yrs = has28 ? '2026-27 and 2027-28' : '2026-27';
  const title = fit([
    `${n} ${term} ${yrs}: Half Terms, INSET`,
    `${n} ${term} ${yrs}: Half Terms`,
    `${n} ${term} ${yrs}, School Holidays`,
    `${n} ${term} ${yrs}: Half Term, Easter`,
    `${n} ${term} ${yrs}: Half Terms, Easter, Summer`,
    `${n} ${term} ${yrs}: Half Terms, INSET, Holidays`,
    `${n} ${term} ${yrs}: Half Terms and Holidays`,
    `${n} ${term} 2026-27: Half Terms, INSET, Holidays`,
    `${n} ${term} 2026-27: Half Terms and Holidays`,
    `${n} ${term} 2026-27, Half Terms`,
    `${n} ${term} 2026-27`,
    `${n} ${term} ${yrs}, Holidays`,
    `${n} ${term} ${yrs}, INSET`,
    `${n} ${term} ${yrs}`,
    `${n} ${term} 2026-27: Holidays`,
  ], 50, 60);
  const who = c.nation === 'northern-ireland' ? 'common closure dates' : 'school term dates';
  const description: string | undefined = fit([
    `${n} ${who} for ${yrs}, read on the ${c.officialName} website: half terms, Christmas, Easter, summer and INSET days, with a free school open checker.`,
    `${n} ${who} for ${yrs} from ${c.officialName}: half terms, Christmas, Easter, summer and INSET days, with a free school open checker.`,
    `${n} ${who} for ${yrs} from ${c.officialName}: half terms, Christmas, Easter, summer, INSET days and a free checker for any date.`,
    `${n} ${who} for ${yrs}, read on the council website: every half term, Christmas, Easter and summer date, INSET days and a free checker.`,
    `${n} ${who} for ${yrs}: half terms, Christmas, Easter, summer and INSET days from ${c.officialName}, plus a free open checker.`,
    `${n} ${who} for ${yrs}: half terms, Christmas, Easter and summer from ${c.officialName}, plus a free school open checker.`,
    `${n} ${who} for ${yrs}, read on ${c.officialName}: half terms, Easter, summer, INSET days and a school open checker.`,
    `${n} ${who} ${yrs}: half terms, Christmas, Easter, summer and INSET days read on the official council website, plus a free checker for any day.`,
    `${n} ${who} ${yrs}: every half term, Christmas, Easter and summer date read on the official website, INSET days and a free open checker.`,
  ], 150, 160) ?? (() => {
    const bases = [`${n} ${who} for ${yrs}: half terms, Christmas, Easter, summer and INSET days`, `${n} ${who} ${yrs}: half terms, Easter, summer, INSET days`, `${n} ${who} ${yrs}: every half term and holiday`];
    const ends = [', read on the council website, with a free school open checker.', ', read on the official website, plus a free checker for any day.', ', from the official calendar, with a free school open checker for any date.', ', each read on the official council calendar, with a free checker.', '. Read on the official calendar, with a checker for any day.', ', checked on the council site.', ', read on the council site, with a checker.', ' from the council, with a free checker.'];
    for (const b of bases) for (const e of ends) { const d = b + e; if (d.length >= 150 && d.length <= 160) return d; }
    return undefined;
  })();
  if (!title || !description) throw new Error(`${c.slug}: no title (${title}) or description (${description}) of the right length`);
  return { title, description, h1: `${n} ${term.toLowerCase()} ${has28 ? '2026-27 and 2027-28' : '2026-27'}` };
}
