import { BrowserWindow, Menu } from "electron";
import * as fs from "fs";
import * as os from "os";

export function used(mainWindow: BrowserWindow) {
  var path = os.homedir + "/.vtsql";
  var usedPath = path + "/used.json";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var usedData: any = {};
  if (!fs.existsSync(usedPath)) {
    usedData = {
      createTime: getNow(),
      databases: {},
      tables: {},
      columns: {}
    };
    fs.writeFileSync(usedPath, JSON.stringify(usedData));
  } else {
    try {
      usedData = JSON.parse(fs.readFileSync(usedPath).toString());
    } catch (e) {
      usedData = JSON.parse(fs.readFileSync(path + "/used.old.json").toString());
    }
  }
  mainWindow.webContents.send("_used", usedData);
}
export function saveUsed(usedtData: any) {
  
  var path = os.homedir + "/.vtsql";
  var usedtPath = path + "/used.json";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  if (fs.existsSync(usedtPath)) {
    if (fs.readFileSync(usedtPath).length > 5)
      fs.renameSync(usedtPath, path + "/used.old.json");
  }
  fs.writeFileSync(usedtPath, JSON.stringify(usedtData));

}
export function recent(mainWindow: BrowserWindow) {
  var path = os.homedir + "/.vtsql";
  var recentPath = path + "/recent.json";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var recentData: any = {};
  if (!fs.existsSync(recentPath)) {
    recentData = {
      createTime: getNow(), recent: [

      ]
    };
    fs.writeFileSync(recentPath, JSON.stringify(recentData));
  } else {
    try {
      recentData = JSON.parse(fs.readFileSync(recentPath).toString());
    } catch (e) {
      recentData = JSON.parse(fs.readFileSync(path + "/recent.old.json").toString());
    }
  }
  mainWindow.webContents.send("_recent", recentData);
}
export function saveRecent(recentData: any) {
  console.log(recentData);
  var path = os.homedir + "/.vtsql";
  var recentPath = path + "/recent.json";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  if (fs.existsSync(recentPath)) {
    if (fs.readFileSync(recentPath).length > 5)
      fs.renameSync(recentPath, path + "/recent.old.json");
  }
  fs.writeFileSync(recentPath, JSON.stringify(recentData));

}

export function getTime(): number {

  return new Date().getTime();
}
export function getNow(): string {

  return new Date().toUTCString();
}
