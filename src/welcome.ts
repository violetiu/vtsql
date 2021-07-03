import { ipcRenderer } from "electron";
import { ConnectionConfig } from "mysql";
import { getTime, saveRecent } from "./config";

import { editor_count, loadDatabases, newEditor, openDatabase, openMessage } from "./protal";
import { config, getColumnSuggestions, getDatabases, getTabelsSuggestions, testConnect } from "./service";
import { Theme } from "./theme";
export var recentConfig:any;
export default function html(color: string): HTMLElement {
    var root = document.createElement("div");
    root.className = "welcome";
    var h1 = document.createElement("h1");
    h1.innerText = "VIOLETIME MYSQL TOOL";
    root.appendChild(h1);
    root.appendChild(document.createElement("br"));
    root.appendChild(document.createElement("br"));

    var main = document.createElement("div");
    main.style.display = "flex";
    var left = document.createElement("div")
    left.style.flex = "1";
    var right = document.createElement("div")
    right.style.flex = "1";
    main.appendChild(left);
    main.appendChild(right);
    root.appendChild(main);

    var start = document.createElement("h3");
    start.innerText = "Start";
    left.appendChild(start);

    var starts_div = document.createElement("div");

    var new_div = document.createElement("div");
    new_div.className = "link";
    new_div.style.color = color;
    new_div.innerText = "New Connection";
    new_div.onclick = () => {
        var connect_div = document.getElementById("connect");
        if (connect_div.style.display == "block") {
            connect_div.style.display = "none";

        } else {
            connect_div.style.display = "block";
        }

    };
    starts_div.appendChild(new_div);

    var open_div = document.createElement("div");

    open_div.className = "link";
    open_div.style.color = color;
    open_div.innerText = "New Editor";
    open_div.onclick = () => {
        var key="Untitled"+"-"+(editor_count+1);
        newEditor(key,key,[""]);

    };
    starts_div.appendChild(open_div);



    var new_db_div = document.createElement("div");

    new_db_div.className = "link";
    new_db_div.style.color = color;
    new_db_div.innerText = "New Database";
    new_db_div.onclick = () => {
        newEditor(
            "Create Database","Create Database",
            [
            "CREATE DATABASE IF NOT EXISTS database_name",
            "DEFAULT CHARACTER SET utf8 "
        ]);


    };
    starts_div.appendChild(new_db_div);


    left.appendChild(starts_div);
    //
    left.appendChild(document.createElement("br"));
    left.appendChild(document.createElement("br"));
    //
    var recent = document.createElement("h3");
    recent.innerText = "Recent";
    left.appendChild(recent);

    var recents_div = document.createElement("div");

    left.appendChild(recents_div);

    ipcRenderer.send("recent");
    ipcRenderer.on("_recent", (event: any, recentData: any) => {
        recentConfig=recentData;
        recentData.recent.forEach((item: any) => {
            var recent_div = document.createElement("div");
            recent_div.className = "link";
            recent_div.style.color = color;
            recent_div.innerText = item.host;
            recent_div.onclick = () => {
                var config: ConnectionConfig = {
                    host: item.host,
                    user: item.user,
                    port:item.port,
                    password: item.password
                }
                testConnect(config, (message?: string, stack?: any) => {
                    if (message) {
                        connect_div.style.display="block";
                        load_div.style.display="none";
                        var color = "darkred";
                        openMessage(message, stack, color);
                    } else {
                        setTimeout(() => {
                            loadDatabases(config);
                        
                        }, 1);
                    }});
             

            };
            recents_div.appendChild(recent_div);

        });


    });



    var connect_div = document.createElement("div");
    connect_div.className = "connect";
    connect_div.id = "connect";
    var connect_h = document.createElement("h3");
    connect_h.innerText = "Connect";
    connect_div.appendChild(connect_h);


    var host_input = document.createElement("input");
    host_input.placeholder = "host | ip | : port";
    host_input.id = "connect-host";
    connect_div.appendChild(host_input);
    connect_div.appendChild(document.createElement("br"));


    var user_input = document.createElement("input");
    user_input.placeholder = "user";
    user_input.id = "connect-user";
    connect_div.appendChild(user_input);
    connect_div.appendChild(document.createElement("br"));


    var password_input = document.createElement("input");
    password_input.type = "password";
    password_input.id = "connect-password";
    password_input.placeholder = "password";
    connect_div.appendChild(password_input);
    connect_div.appendChild(document.createElement("br"));


    var connect_input = document.createElement("input");
    connect_input.type = "button";
    connect_input.id = "connect-button";
    connect_input.value = "Connect";
    connect_input.style.backgroundColor = color;
    connect_div.appendChild(connect_input);
    connect_div.appendChild(document.createElement("br"));
    connect_input.onclick = () => {
        console.log("connect_input");
        var host = host_input.value.trim();
        var port=3306;
        if(host.indexOf(":")>0){
            var vals=host.split(":");
            host=vals[0];
            port=parseInt(vals[1]);
        }

        var user = user_input.value.trim();
        var pwd = password_input.value.trim();
        if (host.length == 0 || user.length == 0 || pwd.length == 0) {
            alert("Please check your information");
        } else {

            connect_div.style.display="none";
            load_div.style.display="block";

            setTimeout(() => {

                var config: ConnectionConfig = {
                    host: host, user: user, password: pwd,port:port
                }
                testConnect(config, (message?: string, stack?: any) => {
                    if (message) {
                        connect_div.style.display="block";
                        load_div.style.display="none";
            
                        var color = "darkred";
                        openMessage(message, stack, color);
                    } else {
                        load_div.style.display="none";
                        setTimeout(()=>{
                            var isExit=false;
                            recentConfig.recent.forEach((recent:any)=>{
                                if(recent.host==host){
                                    isExit=true;
                                    recent.user=user;
                                    recent.port=port;
                                    recent.password=pwd;
                                    recent.date=getTime();
                                }
                            })
                            if(!isExit){
                                recentConfig.recent.push({
                                    host: host, user: user, password: pwd,date:getTime(),port:port
                                })
                            }
                            ipcRenderer.send("save_recent",recentConfig);
                            
                        },1);
                        
                        loadDatabases(config);
               
                    }

                });

            }, 1000)
        }

    };


    right.appendChild(connect_div);



    var load_div = document.createElement("div");
    var load_h = document.createElement("h3");
    load_h.innerText = "Connectting";
    load_div.className = "connectting";
    load_div.id = "connectting";
    load_div.appendChild(load_h);
    var load_svg = document.createElement("div");
    load_svg.className = "loadding";
    load_div.appendChild(load_svg);

    right.appendChild(load_div);


    var learn = document.createElement("h3");
    learn.innerText = "Learn";
    right.appendChild(learn);
    var card = document.createElement("div");
    card.innerHTML = "<a target='blank' href='https://www.violetime.com/product/vtsql'>Instructions for use!</a>";
    card.className = "card";
    right.appendChild(card);


    return root;
}

