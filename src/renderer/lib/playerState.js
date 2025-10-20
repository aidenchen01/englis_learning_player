(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = api;
    module.exports.default = api;
  } else {
    root.PlayerState = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  const VALID_STATUSES = new Set(['idle', 'playing', 'paused', 'stopped']);

  function createInitialPlayerState(overrides) {
    const baseState = {
      status: 'idle',
      currentSource: null,
      currentTime: 0,
      duration: 0,
      volume: 1
    };

    return Object.assign(baseState, overrides || {});
  }

  function clampVolume(value) {
    if (!Number.isFinite(value)) {
      throw new Error('Volume must be a finite number');
    }

    if (value < 0) {
      return 0;
    }

    if (value > 1) {
      return 1;
    }

    return value;
  }

  function loadSource(state, sourceId, duration) {
    const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;
    const baseVolume = typeof state.volume === 'number' ? state.volume : 1;

    return {
      status: 'paused',
      currentSource: sourceId,
      currentTime: 0,
      duration: safeDuration,
      volume: clampVolume(baseVolume)
    };
  }

  function setStatus(state, status) {
    if (!VALID_STATUSES.has(status)) {
      throw new Error(`Unsupported playback status: ${status}`);
    }

    if (!state.currentSource && (status === 'playing' || status === 'paused')) {
      return state;
    }

    if (status === 'stopped') {
      return {
        status: 'stopped',
        currentSource: null,
        currentTime: 0,
        duration: 0,
        volume: state.volume
      };
    }

    return Object.assign({}, state, { status });
  }

  function togglePlayback(state) {
    if (!state.currentSource) {
      return state;
    }

    return state.status === 'playing' ? setStatus(state, 'paused') : setStatus(state, 'playing');
  }

  function updateTime(state, timeInSeconds) {
    if (!Number.isFinite(timeInSeconds)) {
      throw new Error('Time must be a finite number');
    }

    const duration = state.duration;
    const upperBound = duration > 0 ? duration : Math.max(timeInSeconds, 0);
    const clampedTime = Math.min(Math.max(timeInSeconds, 0), upperBound);

    return Object.assign({}, state, { currentTime: clampedTime });
  }

  function updateDuration(state, duration) {
    if (!Number.isFinite(duration)) {
      throw new Error('Duration must be a finite number');
    }

    const safeDuration = duration < 0 ? 0 : duration;
    const safeTime = Math.min(state.currentTime, safeDuration);

    return Object.assign({}, state, {
      duration: safeDuration,
      currentTime: safeTime
    });
  }

  function updateVolume(state, volume) {
    return Object.assign({}, state, {
      volume: clampVolume(volume)
    });
  }

  function hasSource(state) {
    return Boolean(state.currentSource);
  }

  return {
    createInitialPlayerState,
    loadSource,
    setStatus,
    togglePlayback,
    updateTime,
    updateDuration,
    updateVolume,
    hasSource
  };
});
