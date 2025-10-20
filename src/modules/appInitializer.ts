import { AppConfig, defaultAppConfig } from '../common/appConfig';
import { resolveMediaSources, selectSupportedSources, MediaSource } from './mediaLibrary';
import { initialPlaybackState } from './playbackController';

export interface InitializationResult {
  config: AppConfig;
  playlist: ReturnType<typeof selectSupportedSources>;
  playbackState: typeof initialPlaybackState;
}

export function initializeApplication(
  sources: MediaSource[],
  config: AppConfig = defaultAppConfig
): InitializationResult {
  const resolved = resolveMediaSources(sources);
  const playlist = selectSupportedSources(resolved);

  return {
    config,
    playlist,
    playbackState: initialPlaybackState
  };
}
