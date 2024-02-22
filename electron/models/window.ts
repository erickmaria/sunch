import { BrowserWindow, ipcMain } from "electron";
import { searchReadyNotification, stillRunningNotification } from "../notifications/notifcation";
import { join } from 'path';

export class Window {

  private static instance: Window | null = null;

  private width = 900
  private maxHeight = 1000
  public bw: BrowserWindow

  private constructor() {
    this.bw = this.create()
  }

  public static getInstance(): Window {

    if (!Window.instance) {
      Window.instance = new Window();
    }
    return Window.instance;
  }


  private create(): BrowserWindow {
    const win = new BrowserWindow({
      width: this.width,
      minWidth: this.width,
      maxWidth: this.width,
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
      if (process.env.SUNCH_DEVTOOLS_ENABLED) win.webContents.openDevTools({mode: 'detach'})
    } else {
      win.loadFile('dist/index.html')
    }

    ipcMain.on('resize', (e: Electron.IpcMainEvent, screen: { w: string, h: string }) => {

      let height = Number(screen.h.toString().replace('px', ''))

      if (height > this.maxHeight) {
        height = this.maxHeight
      }


      Window.getInstance().bw.setSize(this.width, height)
      
    })

    ipcMain.on('searchReady', () => {

      const win = Window.getInstance().bw

      if (!win.isFocused() || !win.isVisible()) {
        searchReadyNotification()
      }
    })

    win.on("ready-to-show", () => {
      if (process.env.VITE_DEV_SERVER_URL) {
        win.show()
      }
    })

    win.on('close', () => {
      stillRunningNotification()
      Window.instance = null
    })

    return win
  }

}