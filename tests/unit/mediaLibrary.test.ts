import { describe, expect, it } from 'vitest';
import { resolveMediaSources, selectSupportedSources } from '../../src/modules/mediaLibrary';

describe('mediaLibrary', () => {
  const sampleSources = [
    { id: '1', name: 'Audio', path: '/tmp/sample.mp3' },
    { id: '2', name: 'Video', path: '/tmp/sample.mp4' },
    { id: '3', name: 'Document', path: '/tmp/sample.pdf' }
  ];

  it('resolves media sources with extension metadata', () => {
    const resolved = resolveMediaSources(sampleSources);
    expect(resolved[0]).toMatchObject({ extension: 'mp3', supported: true });
    expect(resolved[2].supported).toBe(false);
  });

  it('selects only supported media sources', () => {
    const resolved = resolveMediaSources(sampleSources);
    const supported = selectSupportedSources(resolved);
    expect(supported).toHaveLength(2);
    expect(supported.every((source) => source.supported)).toBe(true);
  });
});
