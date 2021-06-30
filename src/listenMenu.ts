import { ipcRenderer } from "electron"
import { showInterface } from "./interfacelayer";
import { activeTab, closeTab, getActiveTab, getActiveView, selectedObj } from "./protal";

export default ()=>{
    ipcRenderer.on("clickMenuItem",(event:any,menuItemId:string)=>{

        console.log("clickMenuItem :"+menuItemId);
        if(menuItemId=="find"){
            var tab=getActiveTab();
            if(tab!=undefined)
               {
                   showInterface("find",(value=>{
                    var view=getActiveView(tab);
                   
                    var tds=view.querySelectorAll("td,.grid_title,.grid_info");
                    for(var i=0;i<tds.length;i++){
                        var td:any=tds.item(i);
                        td.innerHTML=td.innerText.replace(value,"<find>"+value+"</find>");
                    }
                    var finds=view.getElementsByTagName("find");
                    if(finds!=undefined&&finds.length>0){
                        var find=finds.item(0);
                        find.scrollIntoView();
                        var select=[];
                        for(var index in finds){
                             var findTmp=finds[index];
                            if(findTmp.textContent!=undefined&&findTmp.textContent.indexOf(value)>=0){
                                select.push(findTmp.innerHTML);
                            }
                          
                        }

                        selectedObj(select);
                    }

                   }));
                
               }

        }
       else if(menuItemId=="closetab"){
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
