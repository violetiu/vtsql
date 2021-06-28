import { BrowserWindow, ipcMain, Menu } from "electron";
import { recent, saveRecent } from "./config";

export function onIpcMain(mainWindow: BrowserWindow) {

  ipcMain.on("window_max", () => {

    mainWindow.maximize();

  });
  //
  ipcMain.on("window_close", () => {

    mainWindow.close();

  });


  ipcMain.on("recent", () => {
    recent(mainWindow);

  });
  //
  ipcMain.on("save_recent", (event, recentData) => {
    saveRecent(recentData);

  });
  // main
  ipcMain.on('show-sidebar-menu', (event, database) => {
    const template: any = [
      {
        label: 'new database',
        click: () => { event.sender.send('sidebar-menu-command', { command: 'new database', database: database }) },
      },
      { type: 'separator' },
      {
        label: 'drop database',
        click: () => { event.sender.send('sidebar-menu-command', { command: 'drop database', database: database }) }
      }
    ]
    const menu = Menu.buildFromTemplate(template)
    var sender: any = BrowserWindow.fromWebContents(event.sender);
    menu.popup(sender);
  });
  // main
  ipcMain.on('show-tables-menu', (event) => {
    const template: any = [
      {
        label: 'new table',
        click: () => { event.sender.send('tables-menu-command', 'new table') },
      },
      {
        label: 'rename',
        click: () => { event.sender.send('tables-menu-command', 'rename') },
      },
      {
        label: 'copy',
        click: () => { event.sender.send('tables-menu-command', 'copy') },
      },
      { type: 'separator' },
      {
        label: 'drop table',
        click: () => { event.sender.send('tables-menu-command', 'drop table') },


      },
      {
        label: 'truncate table',
        click: () => { event.sender.send('tables-menu-command', 'truncate table') },


      },
      {
        label: 'empty table',
        click: () => { event.sender.send('tables-menu-command', 'empty table') },


      }, { type: 'separator' },
      {
        label: 'edit table',
        click: () => { event.sender.send('tables-menu-command', 'edit table') },


      },
      {
        label: 'data view',
        click: () => { event.sender.send('tables-menu-command', 'data view') },


      },
    ]
    const menu = Menu.buildFromTemplate(template)
    var sender: any = BrowserWindow.fromWebContents(event.sender);
    menu.popup(sender);
  });


}