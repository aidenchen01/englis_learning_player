import { app, BrowserWindow } from 'electron';
import { join } from 'path';
import { createWindowPreferences, defaultAppConfig, describeApp } from '../common/appConfig';
import { initializeApplication } from '../modules/appInitializer';

export const SOURCES_FIXTURE = [
  { id: 'intro-track', name: 'Introduction', path: 'media/intro.mp3' },
  { id: 'lesson-video', name: 'Lesson Video', path: 'media/lesson.mp4' },
  { id: 'unsupported', name: 'Archive', path: 'media/archive.zip' }
];

export function createMainWindow() {
  const appInitialization = initializeApplication(SOURCES_FIXTURE);
  const windowPreferences = createWindowPreferences(appInitialization.config);
  const window = new BrowserWindow({
    width: windowPreferences.width,
    height: windowPreferences.height,
    title: windowPreferences.title,
    backgroundColor: windowPreferences.backgroundColor,
    webPreferences: {
      contextIsolation: true
    }
  });

  const rendererPath = join(__dirname, '..', 'renderer', 'index.html');
  window.loadFile(rendererPath).catch((error) => {
    console.error('Failed to load renderer:', error);
  });

  console.log('APP_READY', describeApp(appInitialization.config));

  if (process.env.E2E_TEST === 'true') {
    setTimeout(() => {
      window.close();
      app.quit();
    }, 1000);
  }
}

app.on('ready', createMainWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createMainWindow();
  }
});
