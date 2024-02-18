import { app, BrowserWindow, globalShortcut } from 'electron';
import { runningNotification } from './notifications/notifcation';
import { ToggleWin } from './utils/wintoggle';
import { Window } from './models/window';
import { Tray } from './models/tray';

function App(){
  Window.getInstance()
  Tray.getInstance()
}

app.whenReady().then(() => {

  globalShortcut.register('CommandOrControl+Alt+P', () => {
    ToggleWin()
  })

  if (process.platform === 'win32')
  {
    app.setAppUserModelId(app.name);
  }

  app.setLoginItemSettings({
    openAtLogin: true,
    path: app.getPath('exe')
  })

  App()
})
.then(() => runningNotification());

app.on('will-quit', () => {
  globalShortcut.unregister('CommandOrControl+Alt+P')
  globalShortcut.unregisterAll()
})

app.disableHardwareAcceleration()

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    Window.getInstance()
  }
});