import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path'

let createWindow = () => {

  const win = new BrowserWindow({
    width: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      experimentalFeatures: true,
    },
    frame: false,
    transparent: true,
    show: false
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile('dist/index.html');
  }

  // win.webContents.openDevTools()

  ipcMain.on('resize', (e: any, screen: any) => {
    win.setSize(600, Number(screen.h?.toString().replace('px',''))+15)
  })

  win.on("ready-to-show", () => win.show())
};

app.whenReady().then(() => {
  createWindow();
});

app.disableHardwareAcceleration()

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit()
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ipcMain.on('resize', (e: any, screen: any) => {
//   window.resizeTo(screen.w, screen.h)
// })