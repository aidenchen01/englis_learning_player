(function () {
  const playerStateModule = (typeof window !== 'undefined' && window.PlayerState) || null;
  const timeFormatterModule = (typeof window !== 'undefined' && window.TimeFormatter) || null;
  const timelineMathModule = (typeof window !== 'undefined' && window.TimelineMath) || null;
  const seekStepModule = (typeof window !== 'undefined' && window.SeekStep) || null;

  if (!playerStateModule || !timeFormatterModule || !timelineMathModule || !seekStepModule) {
    console.error('Player modules are not available.');
    return;
  }

  const {
    createInitialPlayerState,
    loadSource,
    setStatus,
    updateTime,
    updateDuration,
    updateVolume,
    hasSource
  } = playerStateModule;
  const { formatTime } = timeFormatterModule;
  const { timeToPercentage, percentageToTime } = timelineMathModule;
  const { SEEK_STEP_OPTIONS, createSeekStepStore, calculateSeekTarget } = seekStepModule;

  const fileInput = document.getElementById('file-input');
  const playPauseButton = document.getElementById('play-pause');
  const timeline = document.getElementById('timeline');
  const currentTimeDisplay = document.getElementById('current-time');
  const totalTimeDisplay = document.getElementById('total-time');
  const volumeSlider = document.getElementById('volume');
  const fileNameLabel = document.getElementById('file-name');
  const mediaElement = document.getElementById('media-element');
  const seekStepSelect = document.getElementById('seek-step');

  let state = createInitialPlayerState();
  let objectUrl = null;
  let isTimelineActive = false;
  const seekStepStore = createSeekStepStore(
    typeof window !== 'undefined' && window.localStorage ? window.localStorage : undefined
  );
  let currentSeekStep = seekStepStore.getStep();

  mediaElement.classList.add('is-hidden');
  mediaElement.volume = state.volume;
  initializeSeekStepSelect();
  updateUI();

  function initializeSeekStepSelect() {
    if (!seekStepSelect) {
      return;
    }

    const options = Array.from(seekStepSelect.options);
    if (options.length === 0) {
      SEEK_STEP_OPTIONS.forEach((value) => {
        const option = document.createElement('option');
        option.value = value.toString();
        option.textContent = `${value}s`;
        seekStepSelect.appendChild(option);
      });
    }

    seekStepSelect.value = currentSeekStep.toString();

    seekStepSelect.addEventListener('change', () => {
      const parsed = Number.parseInt(seekStepSelect.value, 10);
      currentSeekStep = seekStepStore.setStep(parsed);
      seekStepSelect.value = currentSeekStep.toString();
    });
  }

  function revokeObjectUrl() {
    if (objectUrl) {
      URL.revokeObjectURL(objectUrl);
      objectUrl = null;
    }
  }

  function resetMediaElement() {
    mediaElement.pause();
    mediaElement.removeAttribute('src');
    mediaElement.load();
  }

  function updateTimelineFromState() {
    if (!hasSource(state) || state.duration <= 0) {
      timeline.value = '0';
      timeline.disabled = true;
      return;
    }

    timeline.disabled = false;

    if (!isTimelineActive) {
      const percent = timeToPercentage(state.currentTime, state.duration);
      timeline.value = percent.toString();
    }
  }

  function updateUI() {
    const ready = hasSource(state);

    playPauseButton.disabled = !ready;
    playPauseButton.textContent = state.status === 'playing' ? 'Pause' : 'Play';
    fileNameLabel.textContent = ready ? state.currentSource : 'No media selected';

    updateTimelineFromState();

    currentTimeDisplay.textContent = formatTime(state.currentTime);
    totalTimeDisplay.textContent = formatTime(state.duration);

    volumeSlider.value = state.volume.toString();

    if (ready) {
      mediaElement.classList.remove('is-hidden');
    } else {
      mediaElement.classList.add('is-hidden');
    }
  }

  function handlePlayPauseToggle() {
    if (!hasSource(state)) {
      return;
    }

    if (state.status === 'playing') {
      mediaElement.pause();
      return;
    }

    mediaElement
      .play()
      .catch((error) => {
        console.error('Failed to play media:', error);
      });
  }

  fileInput.addEventListener('change', (event) => {
    const input = event.target;
    const file = input.files && input.files[0];

    if (!file) {
      return;
    }

    revokeObjectUrl();
    resetMediaElement();

    const previousVolume = state.volume;
    state = createInitialPlayerState({ volume: previousVolume });
    state = loadSource(state, file.name, 0);

    objectUrl = URL.createObjectURL(file);
    mediaElement.src = objectUrl;
    mediaElement.load();

    mediaElement.dataset.mediaType = file.type.startsWith('audio') ? 'audio' : 'video';

    updateUI();

    input.value = '';
  });

  playPauseButton.addEventListener('click', () => {
    handlePlayPauseToggle();
  });

  timeline.addEventListener('input', () => {
    if (!hasSource(state) || state.duration <= 0) {
      return;
    }

    isTimelineActive = true;
    const percent = Number.parseFloat(timeline.value);
    const newTime = percentageToTime(percent, state.duration);
    state = updateTime(state, newTime);
    mediaElement.currentTime = state.currentTime;
    currentTimeDisplay.textContent = formatTime(state.currentTime);
  });

  timeline.addEventListener('change', () => {
    if (!hasSource(state) || state.duration <= 0) {
      return;
    }

    isTimelineActive = false;
    const percent = Number.parseFloat(timeline.value);
    const newTime = percentageToTime(percent, state.duration);
    state = updateTime(state, newTime);
    mediaElement.currentTime = state.currentTime;
    updateUI();
  });

  volumeSlider.addEventListener('input', () => {
    const volumeValue = Number.parseFloat(volumeSlider.value);
    state = updateVolume(state, volumeValue);
    mediaElement.volume = state.volume;
  });

  document.addEventListener('keydown', (event) => {
    const code = event.code || event.key;

    if (code === 'Space' || code === ' ') {
      event.preventDefault();
      handlePlayPauseToggle();
      return;
    }

    if (!hasSource(state)) {
      return;
    }

    if (event.code === 'ArrowLeft' || event.code === 'ArrowRight') {
      event.preventDefault();

      const direction = event.code === 'ArrowLeft' ? -1 : 1;
      const offset = direction * currentSeekStep;
      const targetTime = calculateSeekTarget(state.currentTime, offset, state.duration);

      state = updateTime(state, targetTime);
      mediaElement.currentTime = state.currentTime;
      updateUI();
    }

    handleSeekKeydown(event);
  });

  mediaElement.addEventListener('loadedmetadata', () => {
    const duration = Number.isFinite(mediaElement.duration) ? mediaElement.duration : 0;
    state = updateDuration(state, duration);
    state = setStatus(state, 'paused');
    updateUI();
  });

  mediaElement.addEventListener('timeupdate', () => {
    if (isTimelineActive) {
      return;
    }

    state = updateTime(state, mediaElement.currentTime);
    updateUI();
  });

  mediaElement.addEventListener('play', () => {
    state = setStatus(state, 'playing');
    updateUI();
  });

  mediaElement.addEventListener('pause', () => {
    if (mediaElement.ended) {
      return;
    }

    state = setStatus(state, 'paused');
    updateUI();
  });

  mediaElement.addEventListener('ended', () => {
    state = updateTime(state, state.duration);
    state = setStatus(state, 'paused');
    mediaElement.currentTime = state.currentTime;
    updateUI();
  });

  window.addEventListener('beforeunload', () => {
    revokeObjectUrl();
    resetMediaElement();
  });
})();
