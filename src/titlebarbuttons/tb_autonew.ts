import { getTablesColumn } from "../sqlservice";
import { addTablesView, newEditor, openMessage } from "../protal";
import { addTableInfoView } from "../protal";
import { getActiveTab } from "../protal";
import { ITitlebarButton } from "./ITitlebarButton";
export const tb_autonew:ITitlebarButton={
    id:"autonew",
    title:"Auto New",
    svg:'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-plus-lg" viewBox="0 0 16 16">    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>  </svg>',
    tabs:["tables","columns",'result'],
    align:"start",
    action:()=>{
        var tab = getActiveTab();
        if (tab != undefined) {
          if (tab.type == "tables") {
            newEditor(
              "Create Tabes", "Create Tabes"
              , [
                "CREATE TABLE table_name(",
                "id varchar(64) NOT NULL DEFAULT '0',",
                "title varchar(80),",
                "PRIMARY KEY (id)",
                ")"
              ]);
          } else if (tab.type == "columns") {
            newEditor(
              "Add Column " + tab.table, "Add Column " + tab.table
              , [
                "alter table " + tab.table + " add column column_name varchar(20) not null comment 'comment';"
              ]);
          }else if (tab.type == "result") {
            getTablesColumn(tab.database,tab.table,(error,results,fields)=>{
                if(error){
                   openMessage(error.message,error.stack,"darkred");
                }else{
                  console.log(results);
                  var columns="";
                  var values="";
                  results.forEach((row:any)=>{
                    columns+=row.COLUMN_NAME+",";
                    values+="'',";
                  });
                  if(columns.endsWith(",")){
                    columns=columns.substring(0,columns.length-1);
                    values=values.substring(0,values.length-1);
                  }
                  newEditor(
                    "Insert Data " + tab.table, "Insert Data " + tab.table
                    , [
                      "insert into " + tab.table +"("+columns+")"+ " values("+values+");"
                    ]);
                }
            });
          
          }
    
    
        }
    }
}