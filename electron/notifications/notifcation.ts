import { Notification } from 'electron'
import { IconColofulData } from '../utils/dataurl'
import { Windown } from '../models/window'

export function runningNotification () {

    const win = Windown.getInstance().bw

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

    const win = Windown.getInstance().bw

    new Notification({ 
        icon: IconColofulData,
        title: 'Sunch is still running',
        body: 'running on System Tray',
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

export function searchReadyNotification () {

    const win = Windown.getInstance().bw

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