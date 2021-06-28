import { BrowserWindow, Menu } from "electron";
import * as fs from "fs";
import * as os from "os";
export function recent(mainWindow:BrowserWindow){
  var path = os.homedir + "/.vtsql";
  var recentPath = path + "/recent.json";
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
  var recentData: any = {};
  if (!fs.existsSync(recentPath)) {
    recentData = { createTime: getNow(),  recent:[
    
    ]};
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
export function saveRecent(recentData:any){
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

export function getTime():number{

  return new Date().getTime();
}
export  function getNow():string{

  return new Date().toUTCString();
}
