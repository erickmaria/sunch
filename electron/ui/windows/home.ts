import { app, BrowserWindow, ipcMain, shell } from "electron";
import { searchReadyNotification, stillRunningNotification } from "../../notifications/notifcation";
import { join } from 'path';
import { SettingsWindow } from "./settings";

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
      maxWidth: this.maxHeight,
      y: 50,
      webPreferences: {
        preload: join(__dirname, 'preload.js'),
        nodeIntegration: true,
        experimentalFeatures: false,
      },
      resizable: false,
      frame: false,
      transparent: true,
      show: false,
    });


    win.on('system-context-menu', (event) => {
      event.preventDefault()
    })

    // win.webContents.on('context-menu', (event) => {
    //   event.preventDefault()
    // })

    if (process.env.VITE_DEV_SERVER_URL) {
      win.loadURL(process.env.VITE_DEV_SERVER_URL)
      if (process.env.SUNCH_PAGE_HOME_DEVTOOLS_ENABLED === 'true') {

        const userDataPath = app.getPath("userData");
        const prefPath = join(userDataPath, "Preferences")
        console.log(`[DEBUG][GENERAL] Electron Preferences: ${prefPath}`)
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

    win.webContents.session.webRequest.onBeforeSendHeaders(
      (details, callback) => {
        const { requestHeaders } = details;
        UpsertKeyValue(requestHeaders, 'Access-Control-Allow-Origin', ['*']);
        callback({ requestHeaders });
      },
    );

    win.webContents.session.webRequest.onHeadersReceived((details, callback) => {
      const { responseHeaders } = details;
      UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Origin', ['*']);
      UpsertKeyValue(responseHeaders, 'Access-Control-Allow-Headers', ['*']);
      callback({
        responseHeaders,
      });
    });

    return win
  }

}

function UpsertKeyValue(obj: Record<string, string | string[]> | undefined, keyToChange: string, value: string[]) {
  if (!obj) return;
  const keyToChangeLower = keyToChange.toLowerCase();
  for (const key of Object.keys(obj)) {
    if (key.toLowerCase() === keyToChangeLower) {
      obj[key] = value;
      return;
    }
  }
  obj[keyToChange] = value;
}

export { Window as HomeWindow }