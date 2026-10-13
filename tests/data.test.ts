/** Every council file holds together (same rules as the collection validator) and every page has
 *  snippets of the right length. */
import { describe, it, expect } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { addDays, isWeekend, type Council } from '../src/lib/engine/calendar';
import { TITLES } from '../src/data/council-snippets';
import { councilFaqs } from '../src/lib/council-text';

const dir = new URL('../src/data/councils/', import.meta.url);
const files = readdirSync(dir).filter((f) => f.endsWith('.json'));
const councils: Council[] = files.map((f) => JSON.parse(readFileSync(new URL(f, dir), 'utf8')));

describe('council files', () => {
  it('there are councils', () => { expect(councils.length).toBeGreaterThan(10); });
  for (const c of councils) {
    describe(c.slug, () => {
      it('has a source and facts', () => {
        expect(c.localFacts.length).toBeGreaterThanOrEqual(3);
        for (const f of c.localFacts) expect(f.source.startsWith('https://')).toBe(true);
      });
      for (const [y, Y] of Object.entries(c.years)) {
        if (!Y || Y.status === 'not-published') continue;
        it(`${y}: sessions on weekdays, in order, gaps covered by holidays`, () => {
          expect(Y.source?.officialUrl.startsWith('https://')).toBe(true);
          let prev = '';
          for (const s of Y.sessions) {
            expect(isWeekend(s.start)).toBe(false); expect(isWeekend(s.end)).toBe(false);
            expect(s.start <= s.end).toBe(true); expect(s.start > prev).toBe(true); prev = s.end;
          }
          for (let i = 0; i + 1 < Y.sessions.length; i++) {
            for (let d = addDays(Y.sessions[i].end, 1); d < Y.sessions[i + 1].start; d = addDays(d, 1)) {
              if (isWeekend(d)) continue;
              expect(Y.holidays.some((h) => h.start <= d && d <= h.end), `${c.slug} ${d} not in a holiday`).toBe(true);
            }
          }
        });
      }
      it('snippets fit RECETTE §11', () => {
        const t = TITLES(c);
        expect(t.title.length).toBeGreaterThanOrEqual(50); expect(t.title.length).toBeLessThanOrEqual(60);
        expect(t.description.length).toBeGreaterThanOrEqual(150); expect(t.description.length).toBeLessThanOrEqual(160);
      });
      it('FAQ answers of 40 to 90 words', () => {
        for (const f of councilFaqs(c)) { const n = f.a.split(/\s+/).length; expect(n, f.q).toBeGreaterThanOrEqual(40); expect(n, f.q).toBeLessThanOrEqual(90); }
      });
    });
  }
});
