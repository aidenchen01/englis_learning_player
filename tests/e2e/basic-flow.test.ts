import { describe, expect, it } from 'vitest';
import { initializeApplication } from '../../src/modules/appInitializer';
import {
  initialPlaybackState,
  pausePlayback,
  resumePlayback,
  startPlayback,
  stopPlayback
} from '../../src/modules/playbackController';

const SOURCES = [
  { id: '1', name: 'Warmup Audio', path: '/media/warmup.mp3' },
  { id: '2', name: 'Practice Video', path: '/media/practice.mp4' },
  { id: '3', name: 'Notes', path: '/media/notes.txt' }
];

describe('end-to-end media workflow', () => {
  it('initializes playlist and transitions through playback states', () => {
    const result = initializeApplication(SOURCES);

    expect(result.playlist).toHaveLength(2);
    expect(result.playlist.map((item) => item.id)).toEqual(['1', '2']);

    const started = startPlayback(initialPlaybackState, result.playlist[0].id);
    expect(started.status).toBe('playing');

    const paused = pausePlayback(started);
    expect(paused.status).toBe('paused');

    const resumed = resumePlayback(paused);
    expect(resumed.status).toBe('playing');

    const stopped = stopPlayback();
    expect(stopped.status).toBe('stopped');
  });
});
