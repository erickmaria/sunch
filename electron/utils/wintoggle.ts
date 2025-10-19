import { HomeWindow } from "../ui/windows/home";
import { SettingsWindow } from "../ui/windows/settings";

export function toggleWindow(): void {

    SettingsWindow.getInstance().bw.close();

    const win = HomeWindow.getInstance().bw

    !win.isFocused() ? (win.show(), win.focus()) : win.isVisible() ? win.hide() : (win.show(), win.focus())

}