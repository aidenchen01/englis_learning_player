import { describe, expect, it } from 'vitest';
import playerStateModule from '../../src/renderer/lib/playerState';

const {
  createInitialPlayerState,
  loadSource,
  setStatus,
  togglePlayback,
  updateTime,
  updateDuration,
  updateVolume,
  hasSource
} = playerStateModule;

describe('playerState module', () => {
  it('creates an initial state with optional overrides', () => {
    const state = createInitialPlayerState({ volume: 0.5 });
    expect(state).toEqual({
      status: 'idle',
      currentSource: null,
      currentTime: 0,
      duration: 0,
      volume: 0.5
    });
  });

  it('loads a source and resets timeline keeping the volume', () => {
    const initial = createInitialPlayerState({ volume: 0.25 });
    const loaded = loadSource(initial, 'lesson.mp4', 0);
    expect(loaded).toEqual({
      status: 'paused',
      currentSource: 'lesson.mp4',
      currentTime: 0,
      duration: 0,
      volume: 0.25
    });
  });

  it('prevents playing without a source but allows pausing when ready', () => {
    const initial = createInitialPlayerState();
    expect(setStatus(initial, 'playing')).toBe(initial);

    const loaded = loadSource(initial, 'intro.mp3', 120);
    const paused = setStatus(loaded, 'paused');
    expect(paused.status).toBe('paused');
  });

  it('toggles between play and pause when a source is available', () => {
    const loaded = loadSource(createInitialPlayerState(), 'intro.mp3', 60);
    const playing = togglePlayback(loaded);
    expect(playing.status).toBe('playing');
    const paused = togglePlayback(playing);
    expect(paused.status).toBe('paused');
  });

  it('clamps the playback position and duration to safe bounds', () => {
    const loaded = loadSource(createInitialPlayerState(), 'lesson.mp4', 180);
    const withDuration = updateDuration(loaded, 180);
    const beyondEnd = updateTime(withDuration, 400);
    expect(beyondEnd.currentTime).toBe(180);

    const beforeStart = updateTime(withDuration, -20);
    expect(beforeStart.currentTime).toBe(0);

    const shortenedDuration = updateDuration(beyondEnd, 60);
    expect(shortenedDuration.duration).toBe(60);
    expect(shortenedDuration.currentTime).toBe(60);
  });

  it('clamps volume between 0 and 1', () => {
    const initial = createInitialPlayerState();
    const loud = updateVolume(initial, 4);
    expect(loud.volume).toBe(1);

    const quiet = updateVolume(initial, -2);
    expect(quiet.volume).toBe(0);
  });

  it('reports readiness when a source is loaded', () => {
    const initial = createInitialPlayerState();
    expect(hasSource(initial)).toBe(false);

    const loaded = loadSource(initial, 'track.mp3', 0);
    expect(hasSource(loaded)).toBe(true);
  });
});
