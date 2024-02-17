import { Menu, Tray as TrayElectron, app } from "electron";
import { ToggleWin } from "../utils/wintoggle";
import { IconColofulData } from "../utils/dataurl";

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
        ToggleWin(true)
    })

    return tray
  }

}