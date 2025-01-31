import { Notification } from 'electron'
import { IconColofulData } from '../helpers/icondata'
import { toggleWindow } from '../utils/wintoggle'
import { store } from '../store/config'

export function runningNotification () {
    if (store.get('general.notification.enable') == false) return
    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch running on System Tray', 
        body: 'click to show',
        silent: true,
    }).on('click', () => toggleWindow()).show()
}

export function stillRunningNotification () {
    if (store.get('general.notification.enable') == false) return
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
    if (store.get('general.notification.enable') == false) return
    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch your search is ready',
        body: 'click to show',
        silent: true,
    }).on('click', () => toggleWindow()).show()
}