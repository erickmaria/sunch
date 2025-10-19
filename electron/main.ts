import { app, BrowserWindow, ipcMain, ipcRenderer } from 'electron';
import { runningNotification, stillRunningNotification } from './notifications/notifcation';
import { HomeWindow } from './ui/windows/home';
import { Tray } from './ui/tray';
import { Shortcuts } from './helpers/shortcuts';
import { store } from './store/config';
import { SettingsWindow } from './ui/windows/settings';
import { autoUpdater } from "electron-updater"
import path from 'path';
import fs from 'fs';
import fsp from 'fs/promises';
import { spawn, } from 'child_process';
import { PromptsWindow } from './ui/windows/prompts';
import { UserSettingsSchema } from './store/schemas/userSettings'

const recordingsDir = path.join(app.getPath('documents'), app.getName(), 'recordings');

const data = { lock: 'app.lock' }
const gotTheLock = app.requestSingleInstanceLock(data)

if (!gotTheLock) {

  stillRunningNotification()
  setTimeout(() => {
    app.quit()
  }, 100)

} else {

  const App = () => {
    SettingsWindow.getInstance().bw.hide()
    PromptsWindow.getInstance().bw.hide()

    Tray.getInstance()
  }

  app.on('will-quit', () => {
    Shortcuts.unregister()
    store.delete("tabs")
  })

  app.disableHardwareAcceleration()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      HomeWindow.getInstance()
    }
  });

  app.whenReady()
    .then(() => {

      ipcMain.on('electron-store-get', async (e: Electron.IpcMainEvent, value: string) => {
        e.returnValue = store.get(value);
      });

      ipcMain.on('electron-store-set', async (e: Electron.IpcMainEvent, key: string, value: unknown) => {
        store.set(key, value);
      });
      ipcMain.on('electron-store-del', async <Key extends keyof typeof UserSettingsSchema>(e: Electron.IpcMainEvent, key: Key) => {
        store.delete(key)
        console.log("delete: " + key)
      });

      ipcMain.on('electron-store-open-editor', async () => {
        store.openInEditor()
      });

      ipcMain.on('open-window', async (e: Electron.IpcMainEvent, windowName: string, ...args: unknown[]) => {
        switch (windowName) {
          case "home":
            HomeWindow.getInstance().bw.show()
            break;
          case "settings":
            SettingsWindow.getInstance().bw.show()
            break;
          case "prompts":
            PromptsWindow.getInstance().bw.show()
            break;
        }
      });

      ipcMain.on('close-window', async (e: Electron.IpcMainEvent, windowName: string) => {

        switch (windowName) {
          case "home":
            HomeWindow.getInstance().bw.hide()
            break;
          case "settings":
            SettingsWindow.getInstance().bw.hide()
            break;
          case "prompts":
            PromptsWindow.getInstance().bw.hide()
            break;
        }
      })

      ipcMain.on('minimize-window', async (e: Electron.IpcMainEvent, windowName: string) => {

        switch (windowName) {
          case "home":
            HomeWindow.getInstance().bw.minimize()
            break;
          case "settings":
            SettingsWindow.getInstance().bw.minimize()
            break;
        }
      })

      ipcMain.handle('get-app-version', async () => {
        return app.getVersion()
      });

      ipcMain.on('save-audio-blob', async (event, { base64, filename }: { base64: string; filename: string }) => {


        if (!fs.existsSync(recordingsDir)) {
          fs.mkdirSync(recordingsDir, { recursive: true });
        }

        const filePath = path.join(recordingsDir, filename);
        const buffer = Buffer.from(base64, 'base64');

        fs.writeFile(filePath, buffer, (err) => {
          if (err) {
            console.error('Failed to save file:', err);
          } else {
            console.log(' Saved audio to:', filePath);
          }
        });
      });

      ipcMain.on('transcript', () => {

        console.log("transcripting recording: ", recordingsDir)


        const child = spawn(`uvx --from openai-whisper whisper.exe --model medium --output_dir \"${recordingsDir}\"  -f txt \"${recordingsDir}\\recording.webm\"`, [], {
          shell: true
        })

        child.stdout.on('data', (data) => {
          console.log(`stdout: ${data}`);
        });

        child.stderr.on('data', (data) => {
          console.error(`stderr: ${data}`);
        });

        child.on('close', (code) => {
          if (code == 0) {
            fsp.readFile(recordingsDir + '\\recording.txt', { encoding: 'utf8' }).then((data) => console.log(data))
          }
          console.log(`transcript: child process exited with code ${code}`);
        });
      });

      ipcMain.on('dispatch-sync-config', async (e: Electron.IpcMainEvent, key: string, value: unknown) => {
        HomeWindow.getInstance().bw.webContents.send('sync-config', { key, value });
      })

    })
    .then(() => {
      if (process.platform === 'win32') {
        app.setAppUserModelId(app.name);
      }

      if (process.platform === "win32" || process.platform === "darwin") {
        app.setLoginItemSettings({
          openAtLogin: true,
          path: app.getPath('exe')
        })
      }
    })
    .then(() => App())
    .then(() => runningNotification())
    .then(() => Shortcuts.register())
    .then(() => console.log("[INFO][GENERAL] app running!"))
    .then(() => autoUpdater.checkForUpdatesAndNotify())
  // app.on('window-all-closed', (e: Event) => {
  //   e.preventDefault()
  // })

}

