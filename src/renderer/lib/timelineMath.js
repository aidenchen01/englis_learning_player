(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = api;
    module.exports.default = api;
  } else {
    root.TimelineMath = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  function clampPercentage(percent) {
    if (!Number.isFinite(percent)) {
      throw new Error('Percentage must be a finite number');
    }

    if (percent < 0) {
      return 0;
    }

    if (percent > 100) {
      return 100;
    }

    return percent;
  }

  function timeToPercentage(timeInSeconds, durationInSeconds) {
    if (!Number.isFinite(timeInSeconds)) {
      throw new Error('Time must be a finite number');
    }

    if (!Number.isFinite(durationInSeconds)) {
      throw new Error('Duration must be a finite number');
    }

    if (durationInSeconds <= 0) {
      return 0;
    }

    const clampedTime = Math.min(Math.max(timeInSeconds, 0), durationInSeconds);
    return (clampedTime / durationInSeconds) * 100;
  }

  function percentageToTime(percent, durationInSeconds) {
    if (!Number.isFinite(durationInSeconds)) {
      throw new Error('Duration must be a finite number');
    }

    if (durationInSeconds <= 0) {
      return 0;
    }

    const safePercent = clampPercentage(percent);
    return (durationInSeconds * safePercent) / 100;
  }

  return {
    clampPercentage,
    timeToPercentage,
    percentageToTime
  };
});
