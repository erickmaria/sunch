


import { app, BrowserWindow } from 'electron';
import { createWindow } from './window';
import { createTray } from './tray';

function App(){
  const win = createWindow()
  const tray = createTray(win)

}

app.whenReady().then(App);

app.disableHardwareAcceleration()

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
});
