/** The parameter file, typed. Every statutory figure shown on a page is read here. */
import RAW from '../../data/params-2026.json';
export type SourceKey = keyof typeof RAW.sources;
export const P = RAW;
