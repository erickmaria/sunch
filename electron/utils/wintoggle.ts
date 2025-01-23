import { HomeWidown as Window } from "../ui/windows/home";

export function toggleWindow(): void {

    const win = Window.getInstance().bw

    !win.isFocused() ? win.show() : win.isVisible() ? win.hide() : win.show()

}