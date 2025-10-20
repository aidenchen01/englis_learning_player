(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = api;
    module.exports.default = api;
  } else {
    root.TimeFormatter = api;
  }
})(typeof globalThis !== 'undefined' ? globalThis : typeof self !== 'undefined' ? self : this, function () {
  function pad(value) {
    return value.toString().padStart(2, '0');
  }

  function formatTime(seconds) {
    if (!Number.isFinite(seconds) || seconds <= 0) {
      return '00:00';
    }

    const totalSeconds = Math.floor(seconds);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const remainderSeconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours}:${pad(minutes)}:${pad(remainderSeconds)}`;
    }

    return `${pad(minutes)}:${pad(remainderSeconds)}`;
  }

  return {
    formatTime
  };
});
