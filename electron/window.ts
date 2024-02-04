import { BrowserWindow, app, ipcMain } from "electron";
import { join } from 'path';

const width = 1000
const maxHeight = 1000

export const createWindow = (): BrowserWindow => {

  const win = new BrowserWindow({
    width: width,
    minWidth: width,
    maxWidth: width,
    y: 50,
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

  ipcMain.on('resize', (e: Electron.IpcMainEvent, screen: { w: string, h: string }) => {

    let height = Number(screen.h.toString().replace('px', ''))

    if (height > maxHeight) {
      height = maxHeight
    }

    win.setSize(width, height)
  })

  win.on("ready-to-show", () => {
    if (process.env.VITE_DEV_SERVER_URL) {
      win.show()
    }
  })

  return win
};