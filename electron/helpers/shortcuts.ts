import { app, globalShortcut } from "electron"
import { toggleWindow } from "../utils/wintoggle"
import net from 'net'
import { spawn } from 'child_process'
import { join } from 'path';
import { config } from "dotenv"

config()

const PORT: number = <number>(process.env.SUNCH_SHORTCUT_SERVER_PORT as unknown) || 7581;
const appPath = app.getAppPath().includes('asar') ? join(app.getAppPath(), '../..') : app.getAppPath() // or process.resourcesPath
const PATH: string = join(appPath, 'scripts/shortcuts')

/**
* run script to define the keyboard shortcuts
*
* @platform linux
*/
const scriptShortcuts = (() => {

    const execScript = (file: string) => {
        const scriptPath = join(PATH, file);
        const child = spawn('bash', [scriptPath, `${PORT}`, appPath]);

        child.on('error', (error: Error) => {
            console.error(`[ERROR][LINUX] shortcuts script: ${error.message}`);
        });

        if (child.stderr) {
            child.stderr.on('data', (chunk: Buffer) => {
                console.error(`[ERROR][LINUX] shortcuts script: ${chunk.toString()}`);
            });
        }

        if (child.stdout) {
            child.stdout.on('data', (chunk: Buffer) => {
                console.log(`[INFO][LINUX] shortcuts scripts: ${chunk.toString()}`);
            });
        }
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