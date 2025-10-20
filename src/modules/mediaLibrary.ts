import { isFormatSupported } from '../common/mediaFormats';

export interface MediaSource {
  id: string;
  name: string;
  path: string;
}

export interface ResolvedMediaSource extends MediaSource {
  extension: string;
  supported: boolean;
}

export function resolveMediaSources(sources: MediaSource[]): ResolvedMediaSource[] {
  return sources.map((source) => {
    const extensionMatch = source.path.split('.').pop() ?? '';
    const extension = extensionMatch.toLowerCase();

    return {
      ...source,
      extension,
      supported: isFormatSupported(extension)
    };
  });
}

export function selectSupportedSources(resolved: ResolvedMediaSource[]): ResolvedMediaSource[] {
  return resolved.filter((source) => source.supported);
}
