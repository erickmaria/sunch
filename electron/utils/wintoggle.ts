import { BrowserWindow } from "electron";

export function ToggleWin(win: BrowserWindow) {

    if(!win.isFocused()){
        win.show()
        return
    }

    if(win.isVisible()){
        win.hide()
    }else{
        win.show()
    }

}
