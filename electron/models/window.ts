import { BrowserWindow, ipcMain } from "electron";
import { searchReadyNotification } from "../notifications/notifcation";
import { join } from 'path';
import { Wind } from "lucide-react";

export class Windown {

  private static instance: Windown | null = null;

  private width = 1000
  private maxHeight = 1000
  public bw: BrowserWindow

  private constructor() {
    this.bw = this.create()
  }

  public static getInstance(): Windown {

    if (!Windown.instance) {
      Windown.instance = new Windown();
    }
    return Windown.instance;
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
      // win.webContents.openDevTools({mode: 'detach'})
    } else {

      win.loadFile('dist/index.html')

    }

    ipcMain.on('resize', (e: Electron.IpcMainEvent, screen: { w: string, h: string }) => {

      let height = Number(screen.h.toString().replace('px', ''))

      if (height > this.maxHeight) {
        height = this.maxHeight
      }

      Windown.getInstance().bw.setSize(this.width, height)
      
    })

    ipcMain.on('searchReady', (e: Electron.IpcMainEvent, search: { ready: boolean }) => {

      const win = Windown.getInstance().bw

      if (!win.isFocused() || !win.isVisible()) {
        searchReadyNotification()
      }
    })

    win.on("ready-to-show", () => {
      if (process.env.VITE_DEV_SERVER_URL) {
        win.show()
      }
    })

    win.on('close', (event) => {
      Windown.instance = null
    })

    return win
  }

}