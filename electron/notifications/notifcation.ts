import { Notification } from 'electron'
import { IconColofulData } from '../utils/dataurl'
import { ToggleWin } from '../utils/wintoggle'

export function runningNotification () {
    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch running on System Tray', 
        body: 'click to show',
        silent: true,
    }).on('click', () => ToggleWin()).show()
}

export function stillRunningNotification () {
    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch is still running',
        body: 'running on System Tray',
        silent: true,
    }).on('click', () => ToggleWin()).show()
}

export function searchReadyNotification () {
    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch your search is ready',
        body: 'click to show',
        silent: true,
    }).on('click', () => ToggleWin()).show()
}