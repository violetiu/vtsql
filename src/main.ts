import { app, BrowserWindow, ipcMain, Menu, MenuItem, nativeTheme } from "electron";
import * as path from "path";
import { recent, saveRecent } from "./config";
import { onIpcMain } from "./ipcmain";
import buildMenu from "./buildMenu";
import { OnBeforeRequestListenerDetails } from "electron/main";
const isMac = process.platform === 'darwin';
function createWindow() {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    height: 700,
    darkTheme:nativeTheme.shouldUseDarkColors,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      navigateOnDragDrop: true,
      webSecurity: true
    },
    frame:isMac?true:false,
    titleBarStyle: "hidden",
    width: 1247,
  });
  mainWindow.webContents.findInPage
  mainWindow.webContents.addListener("new-window", (event, url) => {
    event.preventDefault();
    
    if (url.startsWith("file")) {
      if (url.endsWith("sql")) {
        mainWindow.webContents.send("open_sql_file", url);
        return;
      }
    }else if(url.startsWith("app")){
        if(url=="app://editor"){
          console.log("app://editor");
          return;
        }
    }
    mainWindow.webContents.send("new_web", url);
  })
  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, "../index.html"));

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
  //
  onIpcMain(mainWindow);


}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  buildMenu();
}).then(() => {
  createWindow();
  app.on("activate", function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
      ipcMain.removeAllListeners();
      createWindow();
    }
  });
});

// app.on("ready", () => {
//   createWindow();

//   app.on("activate", function () {

//     if (BrowserWindow.getAllWindows().length === 0) {
//       ipcMain.removeAllListeners();
//       createWindow();
//     }
//   });
// });

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
