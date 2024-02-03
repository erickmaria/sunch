import { app, BrowserWindow, ipcMain, screen } from 'electron';
import { join } from 'path'

const width = 1000
const maxHeight = 1000
const createWindow = () => {

  const win = new BrowserWindow({
    width: width,
    minWidth: width,
    maxWidth: width,
    y: 100,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      nodeIntegration: true,
      experimentalFeatures: true,
    },
    frame: false,
    transparent: true,
    show: false,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
    // win.webContents.openDevTools()
  } else {

    win.loadFile('dist/index.html')

  }

  ipcMain.on('resize', (e: Electron.IpcMainEvent, screen: {w: string, h: string }) => {

    let height = Number(screen.h.toString().replace('px',''))

    if (height > maxHeight) {
      height =  maxHeight
    }

    win.setSize(width, height)
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