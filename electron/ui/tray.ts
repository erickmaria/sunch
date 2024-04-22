import { Menu, MenuItem, MenuItemConstructorOptions, Tray as TrayElectron, app } from "electron";
import { toggleWindow } from "../utils/wintoggle";
import { IconColofulData } from "../helpers/icondata";

export class Tray {

  private static instance: Tray | null = null;
  public tw: TrayElectron

  private constructor() {
    this.tw = this.create()
  }

  public static getInstance(): Tray {

    if (!Tray.instance) {
        Tray.instance = new Tray();
    }
    return Tray.instance;
  }


  private create(): TrayElectron {
    
    const tray = new TrayElectron(IconColofulData)

    let template: Array<(MenuItemConstructorOptions) | (MenuItem)> = [
      {
        label: 'Sunch',
        click: function(){
          toggleWindow()
        },
      },
      { 
        label: 'quit',
        role: 'quit',
        click: function(){
          app.quit()
        },
    }]

    if (process.platform !== "linux"){
      // remove label 'Sunch' on non-linux platform
      template.shift()
    }

    const contextMenu = Menu.buildFromTemplate(template)
    
    tray.setToolTip('Sunch')
    tray.setContextMenu(contextMenu)

    tray.on('click', () => {
      toggleWindow()
    })

    return tray
  }

}