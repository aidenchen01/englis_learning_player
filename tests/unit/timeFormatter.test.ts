import { describe, expect, it } from 'vitest';
import timeFormatterModule from '../../src/renderer/lib/timeFormatter';

const { formatTime } = timeFormatterModule;

describe('timeFormatter module', () => {
  it('returns 00:00 for invalid or negative values', () => {
    expect(formatTime(NaN)).toBe('00:00');
    expect(formatTime(-10)).toBe('00:00');
  });

  it('formats seconds into mm:ss for short durations', () => {
    expect(formatTime(5)).toBe('00:05');
    expect(formatTime(75)).toBe('01:15');
  });

  it('formats hours when duration exceeds one hour', () => {
    expect(formatTime(3665)).toBe('1:01:05');
  });
});
