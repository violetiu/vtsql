import { addTablesView, getSelectedObj, newEditor } from "../protal";
import { addTableInfoView } from "../protal";
import { getActiveTab } from "../protal";
import { IDrapActon } from "./IDrapActon";
export const da_autodelete:IDrapActon={
    id:"autodelete",
    title:"Auto Delete",
    svg:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>  </svg>',
    tabs:["tables","columns","result"],
    action:(data)=>{
      var tab = getActiveTab();
   
      if (tab != undefined) {
        if (tab.type == "tables") {
          var table=data.table;
          newEditor(
            "Drop Table " + table, "Drop Table " + table,
            [
              "drop table if exists " +table,
  
            ]);
        } else if (tab.type == "columns") {
          var column=data.COLUMN_NAME;
          newEditor(
            "Drop Column " + column, "Drop Column " + column,
            [
              "alter table " + tab.table + " drop column " + column
            ]);
        } else if (tab.type == "result") {
          var where: string = "";
          for (var key in data) {
              var item = data[key];
              if(item=="null"){
                where += " "+key+" is null and";
              }else{
                where += " "+key+"='" + item + "' and";
              }
          }
          if (where.endsWith("and")) {
              where = where.substring(0, where.length - 4);
          }
          newEditor(
            "Delete From " + tab.table, "Delete From " + tab.table,
            [
              "delete from " + tab.table + " where  " + where
            ]);
        }
  
  
      }
    }
}