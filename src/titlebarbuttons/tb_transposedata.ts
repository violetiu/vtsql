import { showInterface } from "../interfacelayer";
import { addTablesView, getActiveView, getSelectedObj, newEditor } from "../protal";
import { addTableInfoView } from "../protal";
import { getActiveTab } from "../protal";
import { ITitlebarButton } from "./ITitlebarButton";
export const tb_transposedata:ITitlebarButton={
    id:"transposedata",
    title:"Transpose Data",
    svg:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-distribute-vertical" viewBox="0 0 16 16">    <path fill-rule="evenodd" d="M1 1.5a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0-.5.5zm0 13a.5.5 0 0 0 .5.5h13a.5.5 0 0 0 0-1h-13a.5.5 0 0 0-.5.5z"/>    <path d="M2 7a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7z"/>  </svg>',
    tabs:["result"],
    align:"start",
    action:()=>{
     
      var tab = getActiveTab();
      if (tab != undefined) {
        var view = getActiveView(tab);
        if (view != undefined) {
          var ths = view.getElementsByTagName("th");
          if (getActiveView != undefined && ths.length >= 4) {
  
            var placeholder = "[col_x],[col_y],[col_v]";
  
            showInterface(placeholder, (value:string) => {
              if (value != undefined && value.split(",").length == 3) {
                var list = value.split(",");
                var cols = [];
                for (var index = 0; index < list.length; index++) {
                  for (var i = 0; i < ths.length; i++) {
                    if (ths.item(i).textContent == list[index]) {
                      cols.push(i);
                    }
                  }
                }
                if (cols.length != 3) {
                  alert("param error");
  
                } else {
                  //
                  var xArray: Array<any> = [];
                  var yArray: Array<any> = [];
                  var vArray: Array<any> = [];
  
                  var trs = view.getElementsByTagName("tr");
                  for (var r = 0; r < trs.length; r++) {
                    var row = trs.item(r);
                    var cellx = row.children.item(cols[0]).textContent;
                    var celly = row.children.item(cols[1]).textContent;
                    var cellv = row.children.item(cols[2]).textContent;
                    var x = 0;
                    if (xArray.indexOf(cellx) >= 0) {
                      x = xArray.indexOf(cellx);
                    } else {
                      x = xArray.length;
                      xArray.push(cellx);
                    }
                    var y = 0;
                    if (yArray.indexOf(celly) >= 0) {
                      y = yArray.indexOf(celly);
                    } else {
                      y = yArray.length;
                      yArray.push(celly);
                    }
                    var vArrayRow = vArray[y];
                    if (vArrayRow == undefined) {
                      vArrayRow = [];
                      vArray.push(vArrayRow)
                    }
                    var vArrayCell = vArrayRow[x];
                    if (vArrayCell == undefined) {
                      vArrayCell = cellv;
                      vArrayRow.push(vArrayCell);
                    }
  
  
  
                  }
                  console.log(yArray);
                  console.log(vArray);
                  view.innerHTML = "";
                  var table_div = document.createElement("table");
                  var thead_div = document.createElement("thead");
                  var tbody_div = document.createElement("tbody");
                  table_div.appendChild(thead_div);
                  table_div.appendChild(tbody_div);
                  for (var c = 0; c < xArray.length; c++) {
                    if (c == 0) {
                      var th = document.createElement("th");
                      th.className = "th-tow";
                      th.innerText = " ";
                      thead_div.appendChild(th);
                    }
                    var th = document.createElement("th");
                    th.innerText = xArray[c];
                    thead_div.appendChild(th);
                  }
  
  
                  for (var r = 0; r < yArray.length; r++) {
                    var tr = document.createElement("tr");
                    for (var c = 0; c < xArray.length; c++) {
                      if (c == 0) {
                        var td = document.createElement("td");
                        td.innerText = yArray[r];
                        td.className = "td-tow";
                        tr.appendChild(td);
                      }
                      var td = document.createElement("td");
                      td.innerText = vArray[r][c];
                      tr.appendChild(td);
                    }
                    tbody_div.appendChild(tr);
                  }
  
                  view.appendChild(table_div);
  
                }
  
  
  
  
              } else {
                alert("param error");
              }
  
            });
  
          }
  
        }
      }
    }
}