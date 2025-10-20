import { describe, expect, it } from 'vitest';
import { createWindowPreferences, defaultAppConfig, describeApp } from '../../src/common/appConfig';

describe('appConfig', () => {
  it('creates window preferences from configuration', () => {
    const preferences = createWindowPreferences({
      window: { width: 800, height: 600 },
      branding: { title: 'Test Player', description: 'Testing env' }
    });

    expect(preferences).toMatchObject({
      width: 800,
      height: 600,
      title: 'Test Player',
      backgroundColor: '#1a1a1a'
    });
  });

  it('describes the application branding', () => {
    expect(describeApp(defaultAppConfig)).toContain(defaultAppConfig.branding.title);
  });
});
