import { Window } from "../models/window";

export function ToggleWin(clickOnTray?: boolean): void {

    const win = Window.getInstance().bw

    if (!win.isFocused() && !clickOnTray) {
        win.show()
    }else if(win.isVisible()){
        win.hide()
    } else {
        win.show()
    }


}