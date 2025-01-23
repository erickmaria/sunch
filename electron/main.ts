import { app, BrowserWindow, ipcMain } from 'electron';
import { runningNotification, stillRunningNotification } from './notifications/notifcation';
import { HomeWidown } from './ui/windows/home';
import { Tray } from './ui/tray';
import { Shortcuts } from './helpers/shortcuts';
import { store } from './store/config';
import { SettingsWindow } from './ui/windows/settings';

const data = { lock: 'app.lock' }
const gotTheLock = app.requestSingleInstanceLock(data)

if (!gotTheLock) {

  stillRunningNotification()
  setTimeout(() => {
    app.quit()
  }, 100)

} else {

  const App = () => {
    HomeWidown.getInstance()
    SettingsWindow.getInstance().bw.hide()
    Tray.getInstance()
  }

  app.on('will-quit', () => {
    Shortcuts.unregister()
  })

  app.disableHardwareAcceleration()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      HomeWidown.getInstance()
    }
  });

  app.whenReady()
    .then(() => {

      ipcMain.on('electron-store-get', async (e: Electron.IpcMainEvent, val: string) => {
        e.returnValue = store.get(val);
      });

      ipcMain.on('electron-store-set', async (e: Electron.IpcMainEvent, key: string, val: unknown) => {
        store.set(key, val);
      });

      ipcMain.on('electron-store-open-editor', async () => {
        store.openInEditor()
      });

    })
    .then(() => {
      if (process.platform === 'win32') {
        app.setAppUserModelId(app.name);
      }

      if (process.platform === "win32" || process.platform === "darwin") {
        app.setLoginItemSettings({
          openAtLogin: true,
          path: app.getPath('exe')
        })
      }
    })
    .then(() => App())
    .then(() => runningNotification())
    .then(() => Shortcuts.register())
    .then(() => console.log("[INFO][GENERAL] app running!"))

  // app.on('window-all-closed', (e: Event) => {
  //   e.preventDefault()
  // })

}

