import { BrowserWindow, Notification } from 'electron'
import { IconColofulData } from '../utils/dataurl'

export function runningNotification (win: BrowserWindow) {
    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch running on System Tray', 
        body: 'click to show',
        silent: true,
    }).on('click', () => {
        if(!win.isFocused()){
            win.focus()
        }
        if(!win.isVisible()){
            win.show()
        }
    }).show()
}

export function stillRunningNotification () {
    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch is still running',
        body: 'running on System Tray',
        silent: true,
    }).show()
}

export function searchReadyNotification (win: BrowserWindow) {
    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch your search is ready',
        body: 'click to show',
        silent: true,
    }).on('click', () => {
        if(!win.isFocused()){
            win.focus()
        }
        if(!win.isVisible()){
            win.show()
        }
    }).show()
}