import { describe, it, expect } from 'vitest';
import { penalty } from '../src/lib/engine/penalty';

// DfE, Working together to improve school attendance (2026), paras 184 and 194; Wales SI 2013/1983 reg. 4.
describe('penalty notices', () => {
  it('England, first notice paid within 21 days: £80 per parent per child', () => {
    expect(penalty({ nation: 'england', parents: 2, children: 2, notice: 1, timing: 'early', daysOff: 5 }).total).toBe(320);
  });
  it('England, first notice paid late: £160', () => {
    expect(penalty({ nation: 'england', parents: 1, children: 1, notice: 1, timing: 'late', daysOff: 5 }).total).toBe(160);
  });
  it('England, second notice is a flat £160 whatever the timing', () => {
    expect(penalty({ nation: 'england', parents: 1, children: 1, notice: 2, timing: 'early', daysOff: 5 }).perNotice).toBe(160);
  });
  it('England, no third notice', () => {
    expect(penalty({ nation: 'england', parents: 1, children: 1, notice: 3, timing: 'early', daysOff: 5 }).total).toBeNull();
  });
  it('threshold: 10 sessions = 5 days', () => {
    expect(penalty({ nation: 'england', parents: 1, children: 1, notice: 1, timing: 'early', daysOff: 4.5 }).meetsThreshold).toBe(false);
    expect(penalty({ nation: 'england', parents: 1, children: 1, notice: 1, timing: 'early', daysOff: 5 }).meetsThreshold).toBe(true);
  });
  it('Wales £60 within 28 days, £120 within 42', () => {
    expect(penalty({ nation: 'wales', parents: 1, children: 3, notice: 1, timing: 'early', daysOff: 5 }).total).toBe(180);
    expect(penalty({ nation: 'wales', parents: 1, children: 1, notice: 1, timing: 'late', daysOff: 5 }).total).toBe(120);
  });
  it('Scotland and Northern Ireland: no notice', () => {
    expect(penalty({ nation: 'scotland', parents: 2, children: 1, notice: 1, timing: 'early', daysOff: 5 }).system).toBe('none');
    expect(penalty({ nation: 'northern-ireland', parents: 2, children: 1, notice: 1, timing: 'early', daysOff: 5 }).total).toBeNull();
  });
});
