export type MediaCategory = 'audio' | 'video';

export interface MediaFormat {
  extension: string;
  mimeType: string;
  category: MediaCategory;
}

export const supportedFormats: MediaFormat[] = [
  { extension: 'mp3', mimeType: 'audio/mpeg', category: 'audio' },
  { extension: 'aac', mimeType: 'audio/aac', category: 'audio' },
  { extension: 'wav', mimeType: 'audio/wav', category: 'audio' },
  { extension: 'mp4', mimeType: 'video/mp4', category: 'video' },
  { extension: 'mov', mimeType: 'video/quicktime', category: 'video' },
  { extension: 'mkv', mimeType: 'video/x-matroska', category: 'video' }
];

export function getFormatsByCategory(category: MediaCategory): MediaFormat[] {
  return supportedFormats.filter((format) => format.category === category);
}

export function isFormatSupported(extension: string): boolean {
  const normalized = extension.replace(/^\./, '').toLowerCase();
  return supportedFormats.some((format) => format.extension === normalized);
}
