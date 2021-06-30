import { ipcRenderer } from "electron";
import { showInterface } from "../interfacelayer";
import { ITab } from "../ITab";
import { addTableInfoView, addTablesView, checkView, editor_count, getActiveTab, getActiveView, getSelectedObj, newEditor } from "../protal";
import { ITitlebarButton } from "./ITitlebarButton";
import { tb_autodelete } from "./tb_autodelete";
import { tb_autonew } from "./tb_autonew";
import { tb_gridtable } from "./tb_gridtable";
import { tb_modifycomment } from "./tb_modifycomment";
import { tb_neweditor } from "./tb_neweditor";
import { tb_reload } from "./tb_reload";
import { tb_runeditor } from "./tb_runeditor";
import { tb_transposedata } from "./tb_transposedata";
import { tb_viewdata } from "./tb_viewdata";

const titleBarButtons:ITitlebarButton[]=
[tb_reload,tb_runeditor,tb_viewdata,tb_neweditor,tb_autodelete,tb_autonew,tb_modifycomment,tb_transposedata,tb_gridtable];

export function loadTitleBarButton() {
  var titlebar = document.getElementById("titlebar");
  titlebar.addEventListener("dblclick", () => {
    ipcRenderer.send("window_max");
  });

   var titlebarStart = document.getElementById("titlebar-start");
   titlebarStart.innerHTML="";
   var titlebarEnd = document.getElementById("titlebar-end");
   titlebarEnd.innerHTML="";
   titleBarButtons.forEach((tb)=>{

    var tb_div=document.createElement("div");
    tb_div.className="titlebar-button";
    tb_div.id=tb.id;
    tb_div.title=tb.title;
    tb_div.innerHTML=tb.svg;
    var tabs="";
    tb.tabs.forEach(tab=>{
      tabs+=tab+",";
    })
    tb_div.setAttribute("data-tabs",tabs);
    if(tb.selected){
      tb_div.setAttribute("data-selected","true");
    }

    if(tb.align=="start"){
      titlebarStart.appendChild(tb_div);
    }else if(tb.align=="end"){
      titlebarEnd.appendChild(tb_div);
    }
    tb_div.onclick=()=>{tb.action()};

  });

  
  }
export function layoutToolButton(tab: ITab) {
   var toolButtons_div=document.getElementsByClassName("titlebar-button");
    for(var index=0;index<toolButtons_div.length;index++){
      var tb_div:any=toolButtons_div[index];
      var tabs=tb_div.getAttribute("data-tabs");
      if(tabs.indexOf(tab.type)>=0){
     
        var selected=tb_div.getAttribute("data-selected");
        if(selected!=undefined){
        
          if(getSelectedObj(tab)!=undefined){
            tb_div.style.display = "block";
          }else{
            tb_div.style.display = "none";
          }
        }else{
          tb_div.style.display = "block";
        }

      }else{
        tb_div.style.display = "none";
      }

    }

}