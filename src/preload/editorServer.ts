const http = require('http');
var messageQueue:Array<any>=[];
export function pushEditorAction(action:any){
    messageQueue.push(action);
}
export const editorServer: { start: () => void, clients: Array<any> } = {
    clients: [],
    start: () => {

        var server = http.createServer(function (req:any, res:any) {   // 2 - creating server

            if(req.url=="/listen"){
                if(messageQueue.length==0){
                    res.write(JSON.stringify({action:"none"}));  
                }else{
                  var message= messageQueue.pop(); 
                  res.write(JSON.stringify(message));  
                }
            

            }else{
            
            }
         
       
            res.end();  
        
        });
        server.listen(null, "localhost", () => {
            console.log('opened server on', server.address());
            var address = server.address();
            var serverDiv = document.createElement("div");
            serverDiv.id = "server";
            serverDiv.setAttribute("data-port", address.port);
            serverDiv.setAttribute("data-family", address.family);
            serverDiv.setAttribute("data-address", address.address);
            document.body.appendChild(serverDiv);
        });
        console.log(server);

    }

}
