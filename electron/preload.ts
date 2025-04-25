import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld('system', {
    resize: (screen: { w: string, h: string }) => {
        return ipcRenderer.send('resize', screen)
    },
    searchReady: (search: { ready: boolean }) => {
        return ipcRenderer.send('searchReady', search)
    },
    store: {
        get(key: string) {
            return ipcRenderer.sendSync('electron-store-get', key);
        },
        set(property: string, value: unknown) {
            ipcRenderer.send('electron-store-set', property, value);
        },
        openInEditor() {
            return ipcRenderer.send('electron-store-open-editor');
        },
    },
    openWindow(windowName: string) {
        return ipcRenderer.send('open-window', windowName);
    },
    closeWindow(windowName: string) {
        return ipcRenderer.send('close-window', windowName);
    },
    dispatchSyncConfig(property: string, value: unknown) {
        return ipcRenderer.send('dispatch-sync-config', property, value);
    },
    syncConfig: (callback: (data: any) => void) => ipcRenderer.on('sync-config', (_event, data) => {
        callback(data);
    }),
    getAppVersion: () => ipcRenderer.invoke('get-app-version')
})

contextBridge.exposeInMainWorld('env', {
    SUNCH_GEMINI_API_KEY: process.env.SUNCH_GEMINI_API_KEY,
    SUNCH_GPT_API_KEY: process.env.SUNCH_GPT_API_KEY,
    SUNCH_THEME_DEFAULT: process.env.SUNCH_THEME_DEFAULT
})

