import { app, BrowserWindow, ipcMain, shell } from "electron";
import { searchReadyNotification, stillRunningNotification } from "../../notifications/notifcation";
import { join } from 'path';
import { SettingsWindow } from "./settings";
// import fs from "fs"

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
      resizable: false,
      frame: false,
      transparent: true,
      show: false,
    });

    if (process.env.VITE_DEV_SERVER_URL) {
      win.loadURL(process.env.VITE_DEV_SERVER_URL)
      if (process.env.SUNCH_PAGE_HOME_DEVTOOLS_ENABLED === 'true') {

        const userDataPath = app.getPath("userData");
        const prefPath = join(userDataPath, "Preferences")
        console.log("[DEBUG][GENERAL] Electron Preferences: " + prefPath)
        // "electron": {
        //   "devtools": {
        //     "bounds": {
        //       "height": 600,
        //         "width": 600,
        //           "x": 100,
        //             "y": 200
        //     },
        //   }
        // }

        win.webContents.openDevTools({ mode: 'detach' });
        // win.webContents.once("devtools-opened", () => {
        //   const prefs = JSON.parse(fs.readFileSync(prefPath, "utf-8"))
        //   prefs.electron.devtools = {
        //     preferences: {
        //       "InspectorView.splitViewState": JSON.stringify({
        //         vertical: { size: 300 },
        //         horizontal: { size: 300 }
        //       })
        //     }
        //   }
        //   fs.writeFileSync(prefPath, JSON.stringify(prefs))
        // })

      }
    } else {
      win.loadFile('dist/index.html')
    }

    win.webContents.setWindowOpenHandler((details) => {
      shell.openExternal(details.url); // Open URL in user's browser
      return { action: "deny" }; // Prevent the URL from opening in the app
    });

    ipcMain.on('resize', (e: Electron.IpcMainEvent, screen: { w: string, h: string }) => {

      let height = Number(screen.h.toString().replace('px', ''))

      if (height > this.maxHeight) {
        height = this.maxHeight
      }

      Window.getInstance().bw.setSize(Math.ceil(this.width), Math.ceil(height))
    })

    ipcMain.on('dispatch-sync-config', async (e: Electron.IpcMainEvent, key: string, value: unknown) => {
      win.webContents.send('sync-config', { key, value });
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
      setTimeout(() => {
        Window.instance = Window.getInstance()
        Window.instance.bw.hide()

        SettingsWindow.getInstance().bw.hide()
      }, 100)
    })

    return win
  }

}

export { Window as HomeWidown }