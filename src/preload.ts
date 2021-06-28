// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { contextBridge, ipcRenderer, Menu } from 'electron';
import * as mysql from 'mysql';
import * as readline from 'readline';
import { onContextMenuCommand } from './contextmenu';
import { addResultView, basebase_active, editor_count, getActiveTab, getSelectedObj, layout, newEditor, openDatabase, openSqlResult, openViewData, openWeb, openWelcome } from './protal';
import { getColumnSuggestions, getDatabases, getTabels, getTabelsSuggestions } from './service';
import { onStatusbar } from './statusbar';
import { Theme } from './theme';
import * as path from 'path';
import * as fs from 'fs';
import listenMenu from './listenMenu';


window.onresize = () => {
  layout();
};
window.addEventListener("DOMContentLoaded", () => {
  Theme.load();
  layout();

  loadToolButton();

  runEditor();
  loadViewData();
  setTimeout(() => {
    openWelcome();
  }, 500);
  onContextMenuCommand();
  onStatusbar();
  listenMenu();
  onWeb();
  onOpenSQLFile();
  
  

});

function onOpenSQLFile(){
  ipcRenderer.on("open_sql_file",(event,url)=>{
    var path=url.replace("file://","");
    let fRead = fs.createReadStream(path);
    let objReadLine = readline.createInterface({
      input: fRead
    });
    var sqls:string[]=[];
    objReadLine.on('line', function (line) {
      sqls.push(line);
     
    });
    objReadLine.on("close", function () {
      newEditor(path,path,sqls);
    })
  

  });

  
  // contextBridge.exposeInMainWorld('electron', {
  //   startDrag: (fileName:string) => {
  //     console.log(fileName);
  //     ipcRenderer.send('ondragstart', path.join(process.cwd(), fileName))
  //   }
  // })
}

function onWeb(){
  ipcRenderer.on("new_web",(event,url)=>{
    openWeb(url);
  });
}

function loadViewData() {

  var viewdata = document.getElementById("view-data");
  viewdata.addEventListener("click", () => {

    openViewData();

  })

}

function loadToolButton() {

  var titlebar=document.getElementById("titlebar");
  titlebar.addEventListener("dblclick",()=>{
    ipcRenderer.send("window_max");
  });


  var newEditorButton = document.getElementById("new-editor");
  newEditorButton.addEventListener("click", () => {
    newEditor("Untitled-"+editor_count,"Untitled-"+editor_count,[""]);
  });


  var newAutoButton = document.getElementById("new-auto");
  newAutoButton.addEventListener("click", () => {
    var tab=getActiveTab();
    if(tab!=undefined){
      if(tab.type=="tables"){
        newEditor(
          "Create Tabes","Create Tabes"
          ,[
          "CREATE TABLE table_name(",
          "id varchar(64) NOT NULL DEFAULT '0',",
          "title varchar(80),",
          "PRIMARY KEY (id)",
          ")"
        ]);
      }else if(tab.type=="columns"){
        newEditor(
          "Add Column "+tab.table,"Add Column "+tab.table
          ,[
          "alter table "+tab.table+" add column column_name varchar(20) not null;"
        ]);
      }


    }
  });

  var delAutoButton = document.getElementById("delete-auto");
  delAutoButton.addEventListener("click", () => {
    var tab=getActiveTab();
    var selectList=getSelectedObj();
    if(selectList==undefined||selectList==null||selectList.length==0){
      console.log("delete-auto no selected");
      return;
    }
    if(tab!=undefined){
      if(tab.type=="tables"){
        newEditor(
          "Drop Table "+getSelectedObj()[0],"Drop Table "+getSelectedObj()[0],
          [
          "drop table if exists "+getSelectedObj()[0],
         
        ]);
      }else if(tab.type=="columns"){
        newEditor(
          "Drop Column "+getSelectedObj()[0],"Drop Column "+getSelectedObj()[0],
          [
          "alter table "+tab.table+" drop column "+getSelectedObj()[0]
        ]);
      }else if(tab.type=="result"){
        newEditor(
          "Delete From "+getSelectedObj()[0],"Delete From "+getSelectedObj()[0],
          [
          "delete from "+tab.table+" where  "+getSelectedObj()[0]
        ]);
      }


    }
  });


}
function runEditor() {
  var runEditorButton = document.getElementById("run-editor");
  runEditorButton.addEventListener("click", () => {
    var selection = window.getSelection();
    var text = selection.toString();

    if (text == undefined || text.length == 0) {
      alert("Please select SQL you want to execute first.");
      return;
    }

    text.split(";").forEach((sql) => {
      if (sql.trim().length > 1)
        openSqlResult(sql.trim());
    })


  });


}
