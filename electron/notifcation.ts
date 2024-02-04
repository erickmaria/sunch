import { Notification } from 'electron'

export function RunningNotification () {
    new Notification({ title: 'Sunch', body: 'Running on System Tray' }).show()
}