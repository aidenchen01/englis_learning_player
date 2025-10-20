import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { join } from 'path';

interface ListenerMap {
  [event: string]: Array<() => void>;
}

const listeners: ListenerMap = {};

const createdWindows: BrowserWindowStub[] = [];

class BrowserWindowStub {
  static getAllWindows = vi.fn(() => createdWindows);

  public readonly loadFile = vi.fn(async (filePath: string) => {
    this.loadedFile = filePath;
  });

  public readonly close = vi.fn();

  public loadedFile: string | undefined;

  constructor(public readonly options: Record<string, unknown>) {
    createdWindows.push(this);
  }
}

const appMock = {
  on: vi.fn((event: string, listener: () => void) => {
    listeners[event] = listeners[event] ?? [];
    listeners[event].push(listener);
    return appMock;
  }),
  quit: vi.fn()
};

function trigger(event: string) {
  for (const listener of listeners[event] ?? []) {
    listener();
  }
}

vi.mock('electron', () => ({
  app: appMock,
  BrowserWindow: BrowserWindowStub
}));

beforeEach(async () => {
  Object.keys(listeners).forEach((key) => {
    listeners[key] = [];
  });
  createdWindows.length = 0;
  appMock.on.mockClear();
  appMock.quit.mockClear();
  BrowserWindowStub.getAllWindows.mockClear();
  await vi.resetModules();
  vi.useFakeTimers();
  process.env.E2E_TEST = 'true';
});

afterEach(() => {
  vi.useRealTimers();
  delete process.env.E2E_TEST;
});

describe('application launch', () => {
  it('registers lifecycle hooks and creates a window when ready', async () => {
    await import('../../src/main/main');

    expect(appMock.on).toHaveBeenCalledWith('ready', expect.any(Function));
    expect(appMock.on).toHaveBeenCalledWith('window-all-closed', expect.any(Function));
    expect(appMock.on).toHaveBeenCalledWith('activate', expect.any(Function));

    trigger('ready');
    await Promise.resolve();

    expect(createdWindows).toHaveLength(1);
    const [windowInstance] = createdWindows;
    expect(windowInstance.options).toMatchObject({
      title: 'English Learning Player',
      backgroundColor: '#1a1a1a'
    });

    expect(windowInstance.loadFile).toHaveBeenCalledTimes(1);
    const [[loadedPath]] = windowInstance.loadFile.mock.calls;
    expect(loadedPath).toContain(join('renderer', 'index.html'));

    vi.runAllTimers();

    expect(windowInstance.close).toHaveBeenCalledTimes(1);
    expect(appMock.quit).toHaveBeenCalledTimes(1);
  });
});
