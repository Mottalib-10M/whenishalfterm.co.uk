/**
 * One guide = ONE data file in `src/content/pages/<id>.ts` (URL, snippets, H1, citable block, FAQ,
 * body, sources, tool). Council pages are generated from `src/data/councils/<slug>.json` instead.
 * How to add either: CONTRIBUTING-PAGES.md at the repository root.
 */
import type { SourceKey } from './engine/params';
import type { Council, BreakKey, YearKey } from './engine/calendar';

export type Group = 'breaks' | 'rules' | 'tools' | 'nations';
export interface FAQ { q: string; a: string }
/** Tool shown in first position (tool pages) or right after the citable block (guides). */
export type ToolKind = 'checker' | 'compare' | 'penalty' | 'countdown' | 'countdown-summer' | 'year' | 'inset' | 'bank' | `break:${BreakKey}`;

export interface Helpers {
  a: (id: string, text: string) => string;
  num: (n: number) => string;
  date: (iso: string) => string;
  range: (a: string, b: string) => string;
  table: (headers: string[], rows: Array<Array<string | number>>, caption?: string, align?: Array<'l' | 'r'>) => string;
  src: (key: SourceKey, text?: string) => string;
  P: typeof import('../data/params-2026.json');
  councils: Council[];
  /** Table of every council's dates for one break (`breakTable('october', '2026-27')`). */
  breakTable: (key: BreakKey, year: YearKey, filter?: (c: Council) => boolean) => string;
  /** Councils grouped by the dates of one break: [{ range, names[] }], largest group first. */
  groups: (key: BreakKey, year: YearKey, filter?: (c: Council) => boolean) => Array<{ start: string; end: string; names: string[] }>;
  councilLink: (slug: string, text?: string) => string;
}

export interface PageDef {
  id: string;
  group: Group;
  order: number;
  /** Main tool of the page, in first screen (marked data-outil: tool page). */
  tool?: ToolKind;
  /** Tool shown after the citable block of a guide. */
  mini?: ToolKind;
  /** Default council of the tool (slug), Kent if absent. */
  council?: string;
  related: string[];
  sources: SourceKey[];
  slug: string;
  nav: string;
  card: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  resume: (h: Helpers) => string;
  faqs: (h: Helpers) => FAQ[];
  body: (h: Helpers) => string;
}
export const definePage = (g: PageDef): PageDef => g;
