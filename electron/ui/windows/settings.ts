import { app, BrowserWindow, ipcMain } from "electron";
import { searchReadyNotification, stillRunningNotification } from "../../notifications/notifcation";
import { join } from 'path';

class Window {

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

  public static setInstanceNull(){
    Window.instance = null
  }

  private create(): BrowserWindow {
    const win = new BrowserWindow({
      title: "settings", 
      width: this.width,
      minWidth: this.width,
      maxWidth: this.width,
      y: 50,
      resizable: false,
      minimizable: false,
      maximizable: false,
      autoHideMenuBar: true,
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        nodeIntegration: true,
        experimentalFeatures: true,
      },
      show: false,
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      win.loadURL(process.env.VITE_DEV_SERVER_URL+"settings")
      if (process.env.SUNCH_DEVTOOLS_ENABLED === 'true'){
        win.webContents.openDevTools({mode: 'detach'})
      }
    } else {
      win.loadFile('dist/index.html')
    }


    ipcMain.on('exit', () => {
      win.close()
    })


    win.on("ready-to-show", () => {
      if (process.env.VITE_DEV_SERVER_URL) {
        win.show()
      }
    })

    win.on('close', () => {
        Window.instance = Window.getInstance()
        Window.instance.bw.hide()
    })

    return win
  }

}

export { Window as SettingsWindow }