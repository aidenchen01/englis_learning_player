import { describe, expect, it } from 'vitest';
import seekStepModule from '../../src/renderer/lib/seekStep';

const {
  DEFAULT_STEP,
  SEEK_STEP_OPTIONS,
  normalizeSeekStep,
  calculateSeekTarget,
  createSeekStepStore
} = seekStepModule;

describe('seekStep module', () => {
  it('normalizes values to allowed steps with default fallback', () => {
    expect(normalizeSeekStep(5)).toBe(5);
    expect(normalizeSeekStep(10)).toBe(10);
    expect(normalizeSeekStep('15')).toBe(15);
    expect(normalizeSeekStep('invalid')).toBe(DEFAULT_STEP);
    expect(normalizeSeekStep(3)).toBe(DEFAULT_STEP);
    expect(normalizeSeekStep(null)).toBe(DEFAULT_STEP);
  });

  it('calculates seek targets within media boundaries', () => {
    const duration = 120;
    const current = 60;
    const step = SEEK_STEP_OPTIONS[2];

    expect(calculateSeekTarget(current, step, duration)).toBe(70);
    expect(calculateSeekTarget(current, -step, duration)).toBe(50);
    expect(calculateSeekTarget(5, -step, duration)).toBe(0);
    expect(calculateSeekTarget(duration - 2, step, duration)).toBe(duration);
    expect(calculateSeekTarget(current, step, -10)).toBe(0);
  });

  it('persists seek step selections through the store abstraction', () => {
    const calls: Array<{ key: string; value: string }> = [];
    const storage = {
      value: '',
      getItem() {
        return this.value;
      },
      setItem(key: string, value: string) {
        calls.push({ key, value });
        this.value = value;
      }
    };

    const store = createSeekStepStore(storage);

    expect(store.getStep()).toBe(DEFAULT_STEP);
    expect(calls.at(-1)).toEqual({ key: 'seekStepSeconds', value: String(DEFAULT_STEP) });

    const updated = store.setStep(15);
    expect(updated).toBe(15);
    expect(store.getStep()).toBe(15);
    expect(storage.value).toBe('15');
  });
});
