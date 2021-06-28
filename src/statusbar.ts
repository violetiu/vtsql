import { layout, openWeb, openWelcome, setSidebarVisiable, sidebarVisiable } from "./protal";

export function onStatusbar(){
    var statusbar_home=document.getElementById("statusbar-home");
    statusbar_home.addEventListener("click",()=>{
        openWelcome();


    });

    var statusbar_msg=document.getElementById("statusbar-msg");
    statusbar_msg.addEventListener("click",()=>{
        openWeb("https://document.violetime.com");


    });
    var sidebar_toggle=document.getElementById("sidebar-toggle");
    sidebar_toggle.addEventListener("click",()=>{
        var sidebar = document.getElementById("sidebar");
        if (!sidebarVisiable) {
            setSidebarVisiable(true);
        
            sidebar.style.display = "block";
         
        }else{
            setSidebarVisiable(false);
        
            sidebar.style.display = "none";
        }   
        layout();

    });

    
   


}