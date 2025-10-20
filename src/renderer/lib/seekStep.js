(function (root, factory) {
  const api = factory();
  if (typeof module === 'object' && typeof module.exports === 'object') {
    module.exports = api;
    module.exports.default = api;
  } else {
    root.SeekStep = api;
  }
})(
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof self !== 'undefined'
      ? self
      : this,
  function () {
    const STORAGE_KEY = 'seekStepSeconds';
    const DEFAULT_STEP = 5;
    const ALLOWED_STEPS = Object.freeze([1, 5, 10, 15]);

    function normalizeSeekStep(value) {
      if (typeof value === 'number' && Number.isFinite(value)) {
        const rounded = Math.round(value);
        return ALLOWED_STEPS.includes(rounded) ? rounded : DEFAULT_STEP;
      }

      if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number.parseInt(value, 10);
        if (Number.isFinite(parsed)) {
          return ALLOWED_STEPS.includes(parsed) ? parsed : DEFAULT_STEP;
        }
      }

      return DEFAULT_STEP;
    }

    function clampTime(value, duration) {
      const safeValue = Number.isFinite(value) ? value : 0;
      const safeDuration = Number.isFinite(duration) && duration > 0 ? duration : 0;

      if (safeDuration === 0) {
        return 0;
      }

      if (safeValue < 0) {
        return 0;
      }

      if (safeValue > safeDuration) {
        return safeDuration;
      }

      return safeValue;
    }

    function calculateSeekTarget(currentTime, offsetSeconds, duration) {
      const safeCurrent = Number.isFinite(currentTime) ? currentTime : 0;
      const safeOffset = Number.isFinite(offsetSeconds) ? offsetSeconds : 0;
      const candidate = safeCurrent + safeOffset;

      return clampTime(candidate, duration);
    }

    function ensureStorage(storageLike) {
      if (!storageLike) {
        let memoryValue = null;
        return {
          getItem() {
            return memoryValue;
          },
          setItem(_key, value) {
            memoryValue = value;
          }
        };
      }

      return storageLike;
    }

    function createSeekStepStore(storageLike) {
      const storage = ensureStorage(storageLike);

      function readStep() {
        const stored = storage.getItem(STORAGE_KEY);
        const normalized = normalizeSeekStep(stored);

        if (stored !== String(normalized)) {
          storage.setItem(STORAGE_KEY, String(normalized));
        }

        return normalized;
      }

      return {
        getStep() {
          return readStep();
        },
        setStep(value) {
          const normalized = normalizeSeekStep(value);
          storage.setItem(STORAGE_KEY, String(normalized));
          return normalized;
        }
      };
    }

    return {
      STORAGE_KEY,
      DEFAULT_STEP,
      SEEK_STEP_OPTIONS: ALLOWED_STEPS,
      normalizeSeekStep,
      calculateSeekTarget,
      createSeekStepStore
    };
  }
);
