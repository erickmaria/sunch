import { app, BrowserWindow, globalShortcut } from 'electron';
import { runningNotification } from './notifications/notifcation';
import { toggleWindow } from './utils/wintoggle';
import { Window } from './models/window';
import { Tray } from './models/tray';
import { config } from 'dotenv'

config()

function App(){
  Window.getInstance()
  Tray.getInstance()
}

app.whenReady().then(() => {

  globalShortcut.register('CommandOrControl+Alt+P', () => {
    toggleWindow()
  })

  if (process.platform === 'win32'){
    app.setAppUserModelId(app.name);
  }

  if (process.platform === "win32" || process.platform === "darwin") {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath('exe')
    })
  }

  App()
})
.then(() => runningNotification());

app.on('will-quit', () => {
  globalShortcut.unregister('CommandOrControl+Alt+P')
  globalShortcut.unregisterAll()
})

app.disableHardwareAcceleration()

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    Window.getInstance()
  }
});
