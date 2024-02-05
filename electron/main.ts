import { app, BrowserWindow, globalShortcut, Tray } from 'electron';
import { createWindow } from './window';
import { createTray } from './tray';
import { runningNotification } from './notifications/notifcation';
import { ToggleWin } from './utils/wintoggle';

let win: BrowserWindow;
let tray: Tray;

function App(){
  win = createWindow()
  tray = createTray(win)
}

app.whenReady().then(() => {

  const ret = globalShortcut.register('CommandOrControl+Alt+P', () => {
    ToggleWin(win)
  })

    
  if (process.platform === 'win32')
  {
    app.setAppUserModelId(app.name);
  }

  App()
})
.then(runningNotification);

app.on('will-quit', () => {
  globalShortcut.unregister('CommandOrControl+Alt+P')
  globalShortcut.unregisterAll()
})

app.disableHardwareAcceleration()

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});