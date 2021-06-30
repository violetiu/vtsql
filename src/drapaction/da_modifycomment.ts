import { addTablesView, getSelectedObj, newEditor } from "../protal";
import { addTableInfoView } from "../protal";
import { getActiveTab } from "../protal";
import { IDrapActon } from "./IDrapActon";
export const da_modifycomment:IDrapActon={
    id:"modifycomment",
    title:"Modify Comment",
    svg:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-journal-plus" viewBox="0 0 16 16">    <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>    <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>    <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"/>  </svg>',
    tabs:["tables","columns"],
    action:(data)=>{
      var tab = getActiveTab();
       
        if (tab != undefined) {
    
          if (tab.type == "tables") {
            var table=data.table;
            newEditor(
              "Modify Comment " + table, "Modify Comment " + table,
              [
                "alter table "+table+" comment 'comment'",
  
              ]);
          } else if (tab.type == "columns") {
            var column=data.COLUMN_NAME;
            var columnType=data.COLUMN_TYPE;
          
            newEditor(
              "Modify Comment " +column, "Modify Comment " + column,
              [
                "alter table "+tab.table+"  MODIFY  column " + column+" "+columnType+" comment 'comment'" 
              ]);
          }
        }
    }
}