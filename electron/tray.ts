import { Tray, Menu, BrowserWindow, app } from "electron";
import { IconColofulData } from "./utils/dataurl";
import { ToggleWin } from "./utils/wintoggle";

export const createTray = (win: BrowserWindow): Tray => {

    const tray = new Tray(IconColofulData)

    const contextMenu = Menu.buildFromTemplate([
        { 
            label: 'quit',
            role: 'quit',
            click: function(){
                app.quit()
            },
        },
    ])
    
    tray.setToolTip('Sunch')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
        ToggleWin(win)
    })

    // function show() {
    //     const { x, y } = getPosition()
    //     win.setPosition(x, y, false)
    //     win.show()
    //     win.focus()
    // }

    // function getPosition(): { x: number, y: number } {
    //     const winBounds = win.getBounds()
    //     const trayBounds =  tray.getBounds()
        
    //     const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (winBounds.width / 2))
    //     const y = Math.round(trayBounds.y + trayBounds.height + 3)

    //     return {x, y}
    // }

    return tray
}