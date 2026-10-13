/** School absence penalty notices: England (DfE national framework, 19 August 2024) and Wales
 *  (Education (Penalty Notices) (Wales) Regulations 2013, reg. 4). Scotland and Northern Ireland
 *  have no fixed penalty notice for absence. Amounts come from params-2026.json. */
import { P } from './params';
import type { Nation } from './calendar';

export type Timing = 'early' | 'late';
export interface PenaltyInput { nation: Nation; parents: number; children: number; notice: 1 | 2 | 3; timing: Timing; daysOff: number }
export interface PenaltyResult {
  system: 'notice' | 'none';
  perNotice: number | null; notices: number; total: number | null;
  sessions: number; meetsThreshold: boolean | null;
  rule: string; deadline: string;
}
const E = P.penalties.england, W = P.penalties.wales;

export function penalty(i: PenaltyInput): PenaltyResult {
  const parents = Math.max(1, Math.min(2, Math.round(i.parents)));
  const children = Math.max(1, Math.min(10, Math.round(i.children)));
  const sessions = Math.max(0, Math.round(i.daysOff * 2));
  const notices = parents * children;
  if (i.nation === 'england') {
    const meets = sessions >= E.thresholdSessions;
    if (i.notice === 3) return { system: 'notice', perNotice: null, notices, total: null, sessions, meetsThreshold: meets,
      rule: `No third notice within 3 years: the council takes other action, often prosecution (fine up to £${E.prosecutionLevel3.toLocaleString('en-GB')}, or £${E.prosecutionLevel4.toLocaleString('en-GB')} under section 444(1A))`, deadline: '' };
    const per = i.notice === 2 ? E.second : i.timing === 'early' ? E.firstReduced : E.firstFull;
    const rule = i.notice === 2 ? `Second notice in 3 years: flat £${E.second} within ${E.secondDays} days`
      : i.timing === 'early' ? `First notice paid within ${E.firstReducedDays} days: £${E.firstReduced}` : `First notice paid between day ${E.firstReducedDays + 1} and day ${E.firstFullDays}: £${E.firstFull}`;
    return { system: 'notice', perNotice: per, notices, total: per * notices, sessions, meetsThreshold: meets, rule, deadline: `Unpaid after ${E.firstFullDays} days: the council prosecutes or withdraws the notice` };
  }
  if (i.nation === 'wales') {
    const per = i.timing === 'early' ? W.reduced : W.full;
    const rule = i.timing === 'early' ? `Paid within ${W.reducedDays} days: £${W.reduced}` : `Paid between day ${W.reducedDays + 1} and day ${W.fullDays}: £${W.full}`;
    return { system: 'notice', perNotice: per, notices, total: per * notices, sessions, meetsThreshold: null, rule, deadline: `Unpaid after ${W.fullDays} days: prosecution is possible` };
  }
  return { system: 'none', perNotice: null, notices: 0, total: null, sessions, meetsThreshold: null,
    rule: i.nation === 'scotland' ? 'No penalty notice in Scotland: a term-time holiday is usually recorded as unauthorised absence; persistent absence can lead to an attendance order, a referral to the Children’s Reporter or prosecution'
      : `No penalty notice in Northern Ireland: the Education Welfare Service can take a parent to court, where the fine can reach £${P.penalties['northern-ireland'].courtFinePerChild.toLocaleString('en-GB')} per child`, deadline: '' };
}
