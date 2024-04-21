import { app, BrowserWindow } from 'electron';
import { runningNotification } from './notifications/notifcation';
import { Window } from './ui/window';
import { Tray } from './ui/tray';
import { config } from 'dotenv'
import { Shortcuts } from './utils/shortcuts';

config()

const App = () => {
  Window.getInstance()
  Tray.getInstance()
}

app.on('will-quit', () => {
  Shortcuts.unregister()
})

app.disableHardwareAcceleration()

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    Window.getInstance()
  }
});


app.whenReady()
.then(() => {

  if (process.platform === 'win32'){
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
