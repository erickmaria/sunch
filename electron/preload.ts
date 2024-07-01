import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('system', {
    resize: (screen : {w: string, h: string }) => {
        return ipcRenderer.send('resize', screen)
    },
    searchReady: (search: { ready: boolean}) => {
        return ipcRenderer.send('searchReady', search)
    },
    store: {
        get(key: string) {
          return ipcRenderer.sendSync('electron-store-get', key);
        },
        set(property: string, val: unknown) {
          ipcRenderer.send('electron-store-set', property, val);
        },
        openInEditor() {
            return ipcRenderer.send('electron-store-open-editor');
        }
    }
})

contextBridge.exposeInMainWorld('env', {
    SUNCH_GEMINI_API_KEY: process.env.SUNCH_GEMINI_API_KEY,
    SUNCH_GPT_API_KEY: process.env.SUNCH_GPT_API_KEY,
    SUNCH_THEME_DEFAULT:  process.env.SUNCH_THEME_DEFAULT
})

