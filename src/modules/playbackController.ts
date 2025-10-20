export type PlaybackStatus = 'idle' | 'playing' | 'paused' | 'stopped';

export interface PlaybackState {
  status: PlaybackStatus;
  currentTrackId: string | null;
}

export const initialPlaybackState: PlaybackState = {
  status: 'idle',
  currentTrackId: null
};

export function startPlayback(state: PlaybackState, trackId: string): PlaybackState {
  return {
    status: 'playing',
    currentTrackId: trackId
  };
}

export function pausePlayback(state: PlaybackState): PlaybackState {
  if (state.status !== 'playing') {
    return state;
  }

  return {
    ...state,
    status: 'paused'
  };
}

export function resumePlayback(state: PlaybackState): PlaybackState {
  if (state.status !== 'paused' || !state.currentTrackId) {
    return state;
  }

  return {
    ...state,
    status: 'playing'
  };
}

export function stopPlayback(): PlaybackState {
  return {
    status: 'stopped',
    currentTrackId: null
  };
}
