import { Notification } from 'electron'
import { IconColofulData } from '../helpers/icondata'
import { toggleWindow } from '../utils/wintoggle'

export function runningNotification () {
    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch running on System Tray', 
        body: 'click to show',
        silent: true,
    }).on('click', () => toggleWindow()).show()
}

export function stillRunningNotification () {
    // adding delay to not show notification when the app is closing
    setTimeout(()=>{
        new Notification({ 
            icon: IconColofulData,
            title: 'Sunch is still running',
            body: 'running on System Tray',
            silent: true,
        }).on('click', () => toggleWindow()).show()
    }, 100)
}

export function searchReadyNotification () {
    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch your search is ready',
        body: 'click to show',
        silent: true,
    }).on('click', () => toggleWindow()).show()
}