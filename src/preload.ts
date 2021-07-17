// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer, Menu } from 'electron';
import * as mysql from 'mysql';
import * as readline from 'readline';
import { onContextMenuCommand } from './contextmenu';
import { addResultView, basebase_active, editor_count, getActiveTab, getActiveView, getSelectedObj, layout, loadUsed, newEditor, openDatabase, openSqlResult, openViewData, openWeb, openWelcome } from './protal';
import { getColumnSuggestions, getDatabases, getTabels, getTabelsSuggestions, listenConnect } from './sqlservice';
import { onStatusbar } from './statusbar';
import { Theme } from './theme';
import * as path from 'path';
import * as fs from 'fs';
import listenMenu from './listenMenu';
import { listenerInterface, showInterface } from './interfacelayer';
import { loadTitleBarButton, loadWindowsTitleButton } from './titlebarbuttons/titlebarButtonManager';
import { loadDarpActions } from './drapaction/darpActionManager';
import {editorServer} from './preload/editorServer';
const isMac = process.platform === 'darwin';

window.onresize = () => {
  layout();
};
window.addEventListener("DOMContentLoaded", () => {
  Theme.load();
  if(!isMac){
    loadWindowsTitleButton();
  }
  editorServer.start();

  layout();

  loadTitleBarButton();
  listenerInterface();



  setTimeout(() => {
    openWelcome();
  },100);
  
  setTimeout(() => {
    document.getElementById("views").style.display="block";
    document.getElementById("statusbar").style.display="flex";
  },1000);
  setTimeout(() => {
    loadUsed();
  }, 10);
  onContextMenuCommand();
  onStatusbar();
  listenMenu();
  onWeb();
  onOpenSQLFile();
  loadDarpActions();
  listenConnect();

});

function onOpenSQLFile() {
  ipcRenderer.on("open_sql_file", (event, url) => {
    var path ="";
    if(process.platform==="win32"){
      path=url.replace("file:///", "");
    }else{
      path=url.replace("file://", "");
    }
   
    let fRead = fs.createReadStream(path);
    let objReadLine = readline.createInterface({
      input: fRead
    });
    var sqls: string[] = [];
    objReadLine.on('line', function (line) {
      sqls.push(line);

    });
    objReadLine.on("close", function () {
      newEditor(path, path, sqls);
    })


  });


  // contextBridge.exposeInMainWorld('electron', {
  //   startDrag: (fileName:string) => {
  //     console.log(fileName);
  //     ipcRenderer.send('ondragstart', path.join(process.cwd(), fileName))
  //   }
  // })
}

function onWeb() {
  ipcRenderer.on("new_web", (event, url) => {
    openWeb(url);
  });
}

