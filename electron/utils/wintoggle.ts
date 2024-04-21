import { Window } from "../ui/window";

export function toggleWindow(): void {

    const win = Window.getInstance().bw

    !win.isFocused() ? win.show() : win.isVisible() ? win.hide() : win.show()

}