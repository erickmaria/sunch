import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electron', {
    resize: (screen : {w: string, h: string }) => {
        return ipcRenderer.send('resize', screen)
    },
    searchReady: (search: { ready: boolean}) => {
        return ipcRenderer.send('searchReady', search)
    }
})

contextBridge.exposeInMainWorld('env', {
    SUNCH_GEMINI_API_KEY: process.env.SUNCH_GEMINI_API_KEY,
})
