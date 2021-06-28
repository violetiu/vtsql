import { ipcRenderer } from "electron"
import { activeTab, closeTab, getActiveTab } from "./protal";

export default ()=>{
    ipcRenderer.on("clickMenuItem",(event:any,menuItemId:string)=>{

        console.log("clickMenuItem :"+menuItemId);
        if(menuItemId=="runcommand"){
            var command=document.getElementById("command");
            var commandInput:any=document.getElementById("command-input");
            command.style.display="block";
            commandInput.value=">";
            commandInput.focus();
            commandInput.onblur=()=>{
                commandInput.value="";

                command.style.display="none";
            }

        }else  if(menuItemId=="closetab"){
            var tab=getActiveTab();
            if(tab!=undefined)
                closeTab(tab);
            if(activeTab==undefined|| activeTab.length==0){
                ipcRenderer.send("window_close");
            }

        }
        else  if(menuItemId=="savesql"){
            var tab=getActiveTab();
            if(tab!=undefined){
                var views_div=document.getElementById("views");
                var children=views_div.children;
                for(var i=0;i<children.length;i++){
                    var child=children[i];
                    var childKey=child.getAttribute("data-key");
                    if(childKey==tab.key){
                       var lines=child.getElementsByClassName("view-line");
                       var context="";
                       for(var row in lines){
                           var line=lines[row];
                           context+=line.textContent+"\n";
                       }
                       download("Untitled.sql",context);
                        break;
                    }
                }

            }
            


        }
        function download(filename:string, text:string) {
            var element = document.createElement('a');
            element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
            element.setAttribute('download', filename);
            element.style.display = 'none';
            document.body.appendChild(element);
            element.click();
            document.body.removeChild(element);
          }
          
      


    });




}
