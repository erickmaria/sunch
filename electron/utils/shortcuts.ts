import { globalShortcut } from "electron"
import { toggleWindow } from "./wintoggle"
import net from 'net'

/**
* provides API to interact with global shortcut functionality
*
* @platform linux
*/
const ShortcutsServer = (() => {

    return {
        start: () => {

            const PORT: number = <number>(process.env.SUNCH_EXTERNAL_SERVICE_PORT as unknown) || 7581;

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

    const exec = () => {
        
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
            }
            if (!nosSetShotcutGlobal) exec()
        },
        unregister: () => {
            globalShortcut.unregisterAll()
        }
    }
})();

export {
    Shortcuts
}