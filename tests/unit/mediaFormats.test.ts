import { describe, expect, it } from 'vitest';
import { getFormatsByCategory, isFormatSupported, supportedFormats } from '../../src/common/mediaFormats';

describe('mediaFormats', () => {
  it('returns supported audio formats', () => {
    const audioFormats = getFormatsByCategory('audio');
    expect(audioFormats.length).toBeGreaterThan(0);
    expect(audioFormats.every((format) => format.category === 'audio')).toBe(true);
  });

  it('validates supported extensions regardless of prefix', () => {
    expect(isFormatSupported('.MP3')).toBe(true);
    expect(isFormatSupported('unknown')).toBe(false);
  });

  it('includes default supported formats', () => {
    const extensions = supportedFormats.map((format) => format.extension);
    expect(extensions).toContain('mp4');
  });
});
