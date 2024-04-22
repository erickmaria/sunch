import { globalShortcut } from "electron"
import { toggleWindow } from "../utils/wintoggle"
import net from 'net'
import { exec } from 'child_process'
import { config } from "dotenv"

config()

const PORT: number = <number>(process.env.SUNCH_EXTERNAL_SERVICE_PORT as unknown) || 7581;
const PATH: string = <string>(process.env.SUNCH_SHORTCUT_SCRIPTS as string) || '.';

/**
* run script to define the keyboard shortcuts
*
* @platform linux
*/
const scriptShortcuts = (() => {

    const execScript = (file: string) => {
        exec(`bash ${PATH}/${file} ${PORT}`, (error, stdout, stderr) => {
            if (error) {
              console.error(`[ERROR][LINUX] shortcuts script: ${error.message}`);
              return;
            }
            if (stderr) {
              console.error(`[ERROR][LINUX] shortcuts script: ${stderr}`);
              return;
            }
            console.log(`[INFO][LINUX] shortcuts scripts: ${stdout}`);
          });
    }

    return {
        register: () => {
            execScript('custom-keybindings-add.sh')
        },

        unregister: () => {
            execScript('custom-keybindings-remove.sh')
        }
    }
})();

/**
* provides API to interact with global shortcut functionality
*
* @platform linux
*/
const ShortcutsServer = (() => {

    return {
        start: () => {

            const server = net.createServer(socket => {
                socket.on('data', data => {
                    toggleWindow()
                });
            });

            server.listen(PORT, () => {
                console.log(`[INFO][LINUX] Shortcut server up at ${PORT}`);
            });
        }
    }
})();

/**
* only used for windowing system that not support global shortcuts
*
* @platform linux
*/
const ShortcurtsServerSupport = (() => {

    const windowingSystemSuported = ['wayland']

    const validation = () => {

        const sessionType = <string>process.env.XDG_SESSION_TYPE;

        if (windowingSystemSuported.includes(sessionType)) {
            console.log(`[WARNING][LINUX] globalShortcut register unsupported for \'${sessionType}\' windowing system`)
            return true
        }

        return false
    }

    return {
        activateServerWhenNecessary: (): boolean => {
            if (validation()) {
                ShortcutsServer.start()
                return true
            }
            return false
        }
    }
})();

const Shortcuts = (() => {

    const _register = () => {
        
        const ret = globalShortcut.register('CommandOrControl+Alt+P', () => {
            toggleWindow()
        })

        if (!ret) {
            console.log('[ERROR][GENERAL] globalShortcut register failed')
        }

    };

    return {
        register: () => {
            let nosSetShotcutGlobal = false
            if (process.platform === 'linux') {
                nosSetShotcutGlobal = ShortcurtsServerSupport.activateServerWhenNecessary()
                scriptShortcuts.register()
            }
            if (!nosSetShotcutGlobal) _register()
        },
        unregister: () => {
            globalShortcut.unregisterAll()
            scriptShortcuts.unregister()
        }
    }
})();

export {
    Shortcuts
}