import { app, BrowserWindow, ipcMain, screen } from 'electron';
import path from 'path'

const winWidth = 1000

const createWindow = () => {

  const primaryDisplay = screen.getPrimaryDisplay()
  const { width } = primaryDisplay.workAreaSize

  const win = new BrowserWindow({
    width: winWidth,
    x: width+(winWidth/5),
    y: 150,
    minimizable: false,
    maximizable: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      experimentalFeatures: true,
    },
    frame: false,
    transparent: true,
    show: false,
    hasShadow: false,
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    win.loadURL(process.env.VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(app.getAppPath(), 'dist/index.html'));
  }

  ipcMain.on('resize', (e: Electron.IpcMainEvent, screen: {w: string, h: string }) => {
    win.setResizable(true)
    win.setPosition(width+(winWidth/5), 150)
    win.setSize(winWidth, Number(screen.h.toString().replace('px','')))
    win.setResizable(false)
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