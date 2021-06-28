import { ipcRenderer } from "electron";
import { newEditor, openSqlResult } from "./protal";

export function onContextMenuCommand(){
    ipcRenderer.on('sidebar-menu-command', (e, result) => {
        if(result.command=="new database"){          
            newEditor(
            "Create Batabase","Create Batabase",
                [
                "CREATE DATABASE IF NOT EXISTS database_name",
                "DEFAULT CHARACTER SET utf8 "
            ]);


        }else if(result.command=="drop database"){
            
            newEditor(
                "Drop Batabase "+result.database,"CrDropeate Batabase "+result.database,
                [
                " DROP DATABASE IF EXISTS "+result.database
            ]);


        }
  
  
  
    });
    ipcRenderer.on('tables-menu-command', (e, command) => {
        if(command==""){

        }else if(command==""){

            
        }
  
  
  
    });
  }
  export function newBatabase(){



  }