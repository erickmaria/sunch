import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electron', {
    resize: (screen : {w: string, h: string }) => {
        return ipcRenderer.send('resize', screen)
    }
})

contextBridge.exposeInMainWorld('env', {
    SUNCH_GEMINI_API_KEY: process.env.SUNCH_GEMINI_API_KEY,
    SUNCH_SCRAPGPT_API_KEY: process.env.SUNCH_SCRAPGPT_API_KEY,
})
