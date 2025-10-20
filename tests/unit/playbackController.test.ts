import { describe, expect, it } from 'vitest';
import {
  initialPlaybackState,
  pausePlayback,
  resumePlayback,
  startPlayback,
  stopPlayback
} from '../../src/modules/playbackController';

describe('playbackController', () => {
  it('starts playback from idle state', () => {
    const result = startPlayback(initialPlaybackState, 'track-1');
    expect(result).toEqual({ status: 'playing', currentTrackId: 'track-1' });
  });

  it('pauses only when playing', () => {
    const paused = pausePlayback({ status: 'playing', currentTrackId: 'track-1' });
    expect(paused.status).toBe('paused');

    const unchanged = pausePlayback(initialPlaybackState);
    expect(unchanged).toBe(initialPlaybackState);
  });

  it('resumes playback from paused state', () => {
    const paused = { status: 'paused' as const, currentTrackId: 'track-1' };
    const resumed = resumePlayback(paused);
    expect(resumed.status).toBe('playing');
  });

  it('stops playback and clears track id', () => {
    const stopped = stopPlayback();
    expect(stopped).toEqual({ status: 'stopped', currentTrackId: null });
  });
});
