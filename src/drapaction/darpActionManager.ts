import { ipcRenderer } from "electron";
import { showInterface } from "../interfacelayer";
import { ITab } from "../ITab";
import { addTableInfoView, addTablesView, checkView, editor_count, getActiveTab, getActiveView, getSelectedObj, newEditor } from "../protal";
import { ITitlebarButton } from "../titlebarbuttons/ITitlebarButton";
import { da_autodelete } from "./da_autodelete";
import { da_modifycomment } from "./da_modifycomment";
import { da_truncate } from "./da_truncate";
import { IDrapActon } from "./IDrapActon";

const darpActions: IDrapActon[] =
  [da_autodelete,da_modifycomment,da_truncate];

export function onDrapActionElement(ele: HTMLElement, data: any) {
  var command_layer = document.getElementById("darp_layer");
  ele.setAttribute("draggable","true");
  var startX:number=0;
  var startY:number;
  ele.ondragstart = (event) => {
    event.dataTransfer.setData("data", JSON.stringify(data));
    command_layer.style.display = "block";
    command_layer.style.left=(event.clientX+50)+"px";
    startX=event.clientX;
    startY=event.clientY;
    var y=event.clientY+40;
   
    if(y>window.innerHeight*2/3){
     
      command_layer.style.bottom=(window.innerHeight-event.clientY+40)+"px";
      command_layer.style.top="";
      command_layer.style.height="auto"
    }else{
      command_layer.style.top=y+"px";
      command_layer.style.height="auto"
      command_layer.style.bottom="";
    }
   
  
  };
  ele.ondrag=(event)=>{
    var val=Math.pow(event.clientX-startX,2)+Math.pow(event.clientY-startY,2);
    var opacity=0;
    if(val>10000){
      opacity=1;
    }else{
      opacity=val/10000;
    }
    command_layer.style.opacity=opacity+"";
   
    console.log(val);
  };
  ele.ondragend = (event) => {
    event.dataTransfer.setData("data", undefined);
    command_layer.style.display = "none";
    command_layer.style.opacity="0";
  }
}

export function loadDarpActions() {

  var darpView = document.getElementById("darp-view");
  darpView.innerHTML = "";

  darpActions.forEach(da => {

    var da_div = document.createElement("div");
    da_div.className = "darp_area";
    da_div.id = da.id;
    da_div.title = da.title;
    da_div.innerHTML = da.svg + "<div>" + da.title + "</div>";
    var tabs = "";
    da.tabs.forEach(tab => {
      tabs += tab + ",";
    })
    da_div.setAttribute("data-tabs", tabs);
    darpView.appendChild(da_div);
    da_div.ondragover = (event) => {
      da_div.setAttribute("data-over", "true");
      event.preventDefault();
    };
  
    da_div.ondragleave = (event) => {
      da_div.setAttribute("data-over", "false");

    };
    da_div.ondrop = (event) => {
      event.preventDefault();
      var data = event.dataTransfer.getData("data");
      da_div.setAttribute("data-over", "false");
      da.action(JSON.parse(data));
    };
  }
  );


}
