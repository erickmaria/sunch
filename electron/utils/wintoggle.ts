import { Windown } from "../models/window";

export function ToggleWin(clickOnTray?: boolean): void {

    const win = Windown.getInstance().bw

    if (!win.isFocused() && !clickOnTray) {
        win.show()
    }else if(win.isVisible()){
        win.hide()
    } else {
        win.show()
    }


}