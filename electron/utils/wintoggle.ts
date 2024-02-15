import { Windown } from "../models/window";

export function ToggleWin(clickOnTray?: boolean) {

    const win = Windown.getInstance().bw

    if (!win.isFocused() && !clickOnTray) {
        return win.show()
    }else if(win.isVisible()){
        return  win.hide()
    } else {
        return win.show()
    }

}
