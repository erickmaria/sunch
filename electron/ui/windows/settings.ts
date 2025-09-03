import { BrowserWindow, ipcMain } from "electron";
import { join } from 'path';

class Window {

  private static instance: Window | null = null;

  private width = 400
  private maxHeight = 700
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
      transparent: true,
      frame: false,
      show: false,
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      win.loadURL(process.env.VITE_DEV_SERVER_URL + "#/settings", {

      })
      if (process.env.SUNCH_PAGE_SETTINGS_DEVTOOLS_ENABLED === 'true') {
        win.webContents.openDevTools({ mode: 'detach' })
      }
    } else {
       win.loadFile('dist/index.html', { hash: "/settings" })
    }

    ipcMain.on('dispatch-sync-config', async (e: Electron.IpcMainEvent, key: string, value: unknown) => {
      win.webContents.send('sync-config', {key, value} );
    })

    win.on("ready-to-show", () => {
        win.show()
    })
    
    win.on('close', (e: Electron.Event) => {
      // e.preventDefault()

      Window.instance = null
      setTimeout(() => {
        Window.instance = Window.getInstance()
        Window.instance.bw.hide()

      }, 100)
    })

    return win
  }

}

export { Window as SettingsWindow }