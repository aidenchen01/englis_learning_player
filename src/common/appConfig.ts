export interface WindowDimensions {
  width: number;
  height: number;
}

export interface AppBranding {
  title: string;
  description: string;
}

export interface AppConfig {
  window: WindowDimensions;
  branding: AppBranding;
}

export const defaultAppConfig: AppConfig = {
  window: {
    width: 1024,
    height: 768
  },
  branding: {
    title: 'English Learning Player',
    description: 'A lightweight media player for study routines.'
  }
};

export function createWindowPreferences(config: AppConfig) {
  return {
    width: config.window.width,
    height: config.window.height,
    title: config.branding.title,
    backgroundColor: '#1a1a1a'
  };
}

export function describeApp(config: AppConfig) {
  return `${config.branding.title}: ${config.branding.description}`;
}
