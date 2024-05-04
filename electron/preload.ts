import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electron', {
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
        }
    }
})

contextBridge.exposeInMainWorld('env', {
    SUNCH_GEMINI_API_KEY: process.env.SUNCH_GEMINI_API_KEY,
    SUNCH_GPT_API_KEY: process.env.SUNCH_GPT_API_KEY,
    SUNCH_THEME_DEFAULT:  process.env.SUNCH_THEME_DEFAULT
})

