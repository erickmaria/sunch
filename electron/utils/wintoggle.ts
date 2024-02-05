import { BrowserWindow } from "electron";

export function ToggleWin(win: BrowserWindow, clickOnTray?: boolean) {

    if (!win.isFocused() && !clickOnTray) {
        return win.show()
    } else if(win.isVisible()){
        return win.hide()
    } else {
        return win.show()
    }

}
