import { describe, expect, it } from 'vitest';
import timelineMathModule from '../../src/renderer/lib/timelineMath';

const { clampPercentage, timeToPercentage, percentageToTime } = timelineMathModule;

describe('timelineMath module', () => {
  it('clamps percentage to the 0-100 range', () => {
    expect(clampPercentage(-10)).toBe(0);
    expect(clampPercentage(150)).toBe(100);
    expect(clampPercentage(45)).toBe(45);
  });

  it('converts time to percentage respecting bounds', () => {
    expect(timeToPercentage(30, 120)).toBe(25);
    expect(timeToPercentage(-5, 120)).toBe(0);
    expect(timeToPercentage(500, 200)).toBe(100);
  });

  it('converts percentage back to time', () => {
    expect(percentageToTime(50, 200)).toBe(100);
    expect(percentageToTime(0, 200)).toBe(0);
  });

  it('returns zero when duration is not positive', () => {
    expect(timeToPercentage(10, 0)).toBe(0);
    expect(percentageToTime(50, 0)).toBe(0);
  });

  it('throws when inputs are not finite numbers', () => {
    expect(() => clampPercentage(Number.POSITIVE_INFINITY)).toThrow();
    expect(() => timeToPercentage(NaN, 10)).toThrow();
    expect(() => timeToPercentage(10, Number.NaN)).toThrow();
    expect(() => percentageToTime(NaN, 10)).toThrow();
    expect(() => percentageToTime(10, Number.NaN)).toThrow();
  });
});
