import { BrowserWindow, ipcMain } from "electron";
import { join } from 'path';

class Window {

  private static instance: Window | null = null;

  private width = 500
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

  public static setInstanceNull() {
    Window.instance = null
  }

  private create(): BrowserWindow {
    const win = new BrowserWindow({
      title: "prompts",
      width: this.width,
      minWidth: this.width,
      maxWidth: this.width,
      // y: 50,
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
      win.loadURL(process.env.VITE_DEV_SERVER_URL + `#/prompts`, {})
      if (process.env.SUNCH_PAGE_PROMPTS_DEVTOOLS_ENABLED === 'true') {
        win.webContents.openDevTools({ mode: 'detach' })
      }
    } else {
      win.loadFile('dist/index.html', { hash: `/prompts` })
    }

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

export { Window as PromptsWindow }