var callbackTmp:interfaceCallback;
export type interfaceCallback=(value:string)=>void;
export function listenerInterface() {
    var interface_div = document.getElementById("interface");
    var interface_input :any= document.getElementById("interface-input");
    var interface_button = document.getElementById("interface-button");
    // interface_input.addEventListener("blur", () => {
    //     interface_div.style.display = "none";
    // });
    interface_button.addEventListener("click",()=>{
        var key=interface_div.getAttribute("data-key");
        if(callbackTmp!=undefined){
            callbackTmp(interface_input.value);
        }
        callbackTmp=undefined;
        interface_div.style.display = "none";
    })
    interface_input.addEventListener("keydown",(event:any)=>{
        if(event.key=="Enter"){
            var key=interface_div.getAttribute("data-key");
            if(callbackTmp!=undefined){
                callbackTmp(interface_input.value);
            }
            callbackTmp=undefined;
            interface_div.style.display = "none";
        }
    });

}
export function showInterface(placeholder:string,callback:interfaceCallback){
    var interface_div = document.getElementById("interface");
    var interface_input:any = document.getElementById("interface-input");
    var interface_button = document.getElementById("interface-button");
    interface_div.style.display="flex";
    interface_input.focus();
    interface_input.value="";
    interface_input.setAttribute("placeholder",placeholder);
    callbackTmp=callback;

}