import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('electron', {
    resize: (screen :any) => {
        return ipcRenderer.send('resize', screen)
    }
})
