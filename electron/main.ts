import { app, BrowserWindow, globalShortcut } from 'electron';
import { runningNotification } from './notifications/notifcation';
import { toggleWindow } from './utils/wintoggle';
import { Window } from './models/window';
import { Tray } from './models/tray';
import { config } from 'dotenv'
import { Service } from './models/service'
config()

function App(){
  Window.getInstance()
  Tray.getInstance()
}


const Shortcuts = {
  register: () => {
    const ret = globalShortcut.register('CommandOrControl+Alt+P', () => {
      toggleWindow()
    })

    if (!ret){
      console.log('[ERROR] globalShortcut register failed')
    }
  },
  unregister: () => {
    globalShortcut.unregisterAll()
  }
}

const LinuxWindowingSystemShortcurtsSupport = {
  x11:  () => Shortcuts.register(),
  wayland: () => {
    console.log('[WARNING][LINUX] globalShortcut register unsupported for \'wayland\' windowing system')
    Service.run()
  }
}

app.whenReady().then(() => {

  if (process.platform === 'linux') {
    
    const sessionType = process.env.XDG_SESSION_TYPE;
    
    console.log('[INFO][LINUX] Session type:', sessionType);

    const registeShortcut = LinuxWindowingSystemShortcurtsSupport[sessionType as string]
    if(registeShortcut) registeShortcut()

  }else {
    Shortcuts.register()
  }

  if (process.platform === 'win32'){
    app.setAppUserModelId(app.name);
  }

  if (process.platform === "win32" || process.platform === "darwin") {
    app.setLoginItemSettings({
      openAtLogin: true,
      path: app.getPath('exe')
    })
  }

  App()
})
.then(() => runningNotification());

app.on('will-quit', () => {
  Shortcuts.unregister()
})

app.disableHardwareAcceleration()

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    Window.getInstance()
  }
});