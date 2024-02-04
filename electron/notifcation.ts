import { Notification } from 'electron'
import { IconTray } from './utils'

export function RunningNotification () {
    new Notification({ 
        icon: IconTray,
        // title: 'Sunch', 
        body: 'Running on System Tray',
        silent: true,
    }).show()
}