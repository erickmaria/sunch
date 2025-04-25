import { app, BrowserWindow, ipcMain } from 'electron';
import { runningNotification, stillRunningNotification } from './notifications/notifcation';
import { HomeWidown } from './ui/windows/home';
import { Tray } from './ui/tray';
import { Shortcuts } from './helpers/shortcuts';
import { store } from './store/config';
import { SettingsWindow } from './ui/windows/settings';
import { autoUpdater } from "electron-updater"

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

      ipcMain.on('electron-store-get', async (e: Electron.IpcMainEvent, value: string) => {
        e.returnValue = store.get(value);
      });

      ipcMain.on('electron-store-set', async (e: Electron.IpcMainEvent, key: string, value: unknown) => {
        store.set(key, value);
      });

      ipcMain.on('electron-store-open-editor', async () => {
        store.openInEditor()
      });

      ipcMain.on('open-window', async (e: Electron.IpcMainEvent, windowName: string) => {
        switch (windowName) {
          case "home":
            HomeWidown.getInstance().bw.show()
          case "settings":
            SettingsWindow.getInstance().bw.show()
        }
      });
  
      ipcMain.on('close-window', async (e: Electron.IpcMainEvent, windowName: string) => {

        switch (windowName) {
          case "home":
            HomeWidown.getInstance().bw.hide()
          case "settings":
            SettingsWindow.getInstance().bw.hide()
        }
      })
  

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
    .then(() => autoUpdater.checkForUpdatesAndNotify())
  // app.on('window-all-closed', (e: Event) => {
  //   e.preventDefault()
  // })

}

