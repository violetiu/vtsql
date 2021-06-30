import { ITab } from "./ITab";
import { exec, getColumnSuggestions, getDatabases, getTabels, getTablesColumn, showDatabases } from "./service";
import { Theme } from "./theme";
import welcome from "./welcome";
export var open_tabs: Array<ITab> = [];
export var sidebarVisiable: boolean = false;
import * as mysql from 'mysql';
import { ipcRenderer } from "electron";
import { layoutToolButton } from "./titlebarbuttons/titlebarButtonManager";
import { onDrapActionElement } from "./drapaction/darpActionManager";
import { statusInfo } from "./statusbar";
const isMac = process.platform === 'darwin'
export var basebase_active: string;
export type noArgCallback = () => void;
export var selectedMap: Map<string, string[]>;
export function selectedObj(objs: string[]) {
    var tab = getActiveTab();
    if (tab != undefined) {
        if (selectedMap == undefined) {
            selectedMap = new Map();
        }
        selectedMap.set(tab.key, objs);
        layoutToolButton(tab);
    }
    var statusbar_selected = document.getElementById("statusbar-selected");
    if (objs != undefined && objs.length > 0) {
      
        statusbar_selected.innerText = objs.length + " " + objs[0];
    }else{
        statusbar_selected.innerText = "";
    }

}
export function getSelectedObj(tab?: ITab): string[] {
    if (selectedMap == undefined) {
        return undefined;
    }
    if (tab == undefined) {
        var tab = getActiveTab();
        if (tab != undefined) {
            if (selectedMap == undefined) {
                return undefined;
            }
            return selectedMap.get(tab.key);
        }
    } else {
        return selectedMap.get(tab.key);
    }

    return undefined;
}


export function activeBasebase(database: string) {
    var statusbar_database = document.getElementById("statusbar-database");
    statusbar_database.innerText = database;
    basebase_active = database;
  

}

export function openWeb(url: string): void {

    var color = Theme.randomColor();
    var key = url;
    addTab({ key: key, active: true, color: color, title: key, type: "web" });
    renderTabs();
    addWebView(key, color);

}
export function openWelcome(): void {

    var color = Theme.randomColor();
    var key = "Welcome";
    addTab({ key: key, active: true, color: color, title: key, type: "welcome" });
    renderTabs();
    addWecomeView(key, color);

}

export function openMessage(title: string, message: any, color: string): void {

    var key = title;
    addTab({ key: key, active: true, color: color, title: title, type: "message" });
    renderTabs();
    addMessageView(key, color, title, message);

}
export function addMessageView(key: string, color: string, title: string, message: any) {

    var views_div = checkView(key);

    var view_div = document.createElement("div");
    view_div.setAttribute("data-key", key);
    view_div.className = "view";

    views_div.appendChild(view_div);
    view_div.style.padding = "50px";

    var title_div = document.createElement("h1");
    title_div.innerHTML = title;
    view_div.appendChild(title_div);

    message = message.replace(/at /g, "<br/>at ");
    message = message.replace(/--------------------/g, "<br/>--------------------");
    message = message.replace(/\(/g, "(<highlight>");
    message = message.replace(/\)/g, "</highlight>)");
    var message_div = document.createElement("p");
    message_div.innerHTML = message;
    message_div.className = "message";
    view_div.appendChild(message_div);


    activeView(key);

}

export function addWecomeView(key: string, color: string) {
    var views_div = checkView(key);

    var view_div = document.createElement("div");
    view_div.setAttribute("data-key", key);
    view_div.className = "view";

    views_div.appendChild(view_div);
    view_div.style.padding = "50px";

    view_div.appendChild(welcome(color));
    activeView(key);

}
export function checkView(key: string): HTMLElement {
    var views_div = document.getElementById("views");
    var children = views_div.children;

    for (var i = 0; i < children.length; i++) {
        var child = children.item(i);
        var key0 = child.getAttribute("data-key");
        if (key0 == key) {
            child.remove();
        }
    }
    return views_div;
}
export function addWebView(key: string, color: string) {

    var views_div = checkView(key);

    var view_div = document.createElement("div");
    view_div.setAttribute("data-key", key);
    view_div.setAttribute("data-web", "true");
    view_div.className = "view";

    views_div.appendChild(view_div);



    var webIframe = document.createElement("iframe");
    webIframe.src = key;
    webIframe.setAttribute("sandbox", "allow-scripts allow-same-origin allow-popups");
    view_div.appendChild(webIframe);
    activeView(key);

}
export function setSidebarVisiable(visiale: boolean) {
    sidebarVisiable = visiale;
}
export function loadDatabases(config: mysql.ConnectionConfig) {


    var databases_div = document.getElementById("databases");

    var load_svg = document.createElement("div");
    load_svg.className = "loadding";
    databases_div.innerHTML = "";
    databases_div.appendChild(load_svg);
    if (!sidebarVisiable) {
        sidebarVisiable = true;
        var sidebar = document.getElementById("sidebar");
        sidebar.style.display = "block";

        layout();
    }

    var statusbar_connect = document.getElementById("statusbar-connect");
    statusbar_connect.innerText = config.host;


    var databaseMap: Map<string, number> = new Map();
    showDatabases(config, (error1, result1, fields1) => {
        if (error1) {
            openMessage(error1.message, error1.stack, "darkred");
            return;
        };
        result1.forEach((row: any, index: number) => {

            databaseMap.set(row.Database, 0);
        });
        getDatabases(config, (error, result, fields) => {
            if (error) {
                openMessage(error.message, error.stack, "darkred");
                return;
            }
            databases_div.innerHTML = "";
            result.forEach((row: any, index: number) => {
                var database = row.database;
                var size = row.size;
                var rows = row.rows;
                databaseMap.set(database, size);
            });
            var index: number = 0;
            databaseMap.forEach((size, database) => {
                if (database !== "information_schema" && database !== "performance_schema"
                    && database !== "mysql" && database !== "sys" && database !== "profile") {
                    var color = Theme.colors[index];
                    var database_div = document.createElement("div");
                    database_div.className = "database";
                    database_div.style.background = color;
                    var database_name_div = document.createElement("div");
                    database_name_div.className = "database-name";
                    database_name_div.innerText = database;
                    var database_info_div = document.createElement("div");
                    database_info_div.className = "database-info";
                    database_info_div.innerHTML = size + "<span style='font-size:6px;'>Mb</span>";
                    database_info_div.style.background=Theme.bar;
                    database_info_div.style.color=color;
                    database_div.appendChild(database_name_div); database_div.appendChild(database_info_div);
                    databases_div.appendChild(database_div);
                    database_div.onclick = () => { openDatabase(database, color) };

                    database_div.oncontextmenu = (e) => {
                        e.preventDefault();
                        ipcRenderer.send('show-sidebar-menu', database);
                    }
                }
                index++;
            });

        });

    });




}
export function openDatabase(database: string, color: string): void {


    var key = database;
    addTab({ key: key, active: true, color: color, title: database, type: "tables", database: database });
    renderTabs();
    addTablesView(database, key,true);

}

export function renderTabs() {
    var tabsbar = document.getElementById("tabsbar");
    tabsbar.innerHTML = "";

    if (open_tabs != undefined) {
        var tabsbar_width = tabsbar.clientWidth;
        var tab_width = (tabsbar_width) / (open_tabs.length + 2) - 25;
        var tab_active_width = tab_width * 3;
        if (tab_width > 200) {
            tab_width = 200;
        }
        if (tab_active_width > 400) {
            tab_active_width = 400;
        }

        open_tabs.forEach((tab) => {
            var tab_div = document.createElement("div");
            tab_div.setAttribute("data-key", tab.key);
            var tab_context_div = document.createElement("div");

            tab_context_div.className = "tab-context";
            tab_context_div.title = tab.title;

            var close = document.createElement("span");
            close.className = "tab-close";
            close.onclick = () => { closeTab(tab) };
            tab_context_div.appendChild(close);


            var title = document.createElement("span");
            title.className = "tab-title";
            title.innerText = tab.title;
            tab_context_div.appendChild(title);

            tab_div.appendChild(tab_context_div);

            if (tab.active) {

                tab_div.className = "tab tab-active";
                tab_context_div.style.width = tab_active_width + "px";
                if (tab.database != undefined) {
                    activeBasebase(tab.database);
                }
                themeColor(tab.color);
                activeView(tab.key);
                layoutToolButton(tab);
            }
            else {
                tab_div.className = "tab";
                tab_context_div.style.width = tab_width + "px";
            }



            tabsbar.appendChild(tab_div);
            tab_div.onclick = () => { activeTab(tab) };
        })
    }

}

export function renderTab(tab: ITab) {
    var tabsbar = document.getElementById("tabsbar");
    var children = tabsbar.children;
    for (var i = 0; i < children.length; i++) {
        var tab_div = children[i];
        var tabKey = tab_div.getAttribute("data-key");
        if (tabKey == tab.key) {
            var tabtitle = tab_div.getElementsByClassName("tab-title").item(0);

            tabtitle.textContent = tab.title;
            themeColor(tab.color);
            break;
        }

    }

}
export function themeColor(color: string) {
    var titlebar = document.getElementById("titlebar");
    titlebar.style.backgroundColor = color;
    // var statusbar = document.getElementById("statusbar");
    // statusbar.style.backgroundColor = color;

}

export function activeTab(tab: ITab) {
    layoutToolButton(tab);
    if (tab.database != undefined) {
        activeBasebase(tab.database);
    }
    if (open_tabs != undefined) {
        var tabsbar = document.getElementById("tabsbar");

        var tabs = tabsbar.children;

        var tabsbar_width = tabsbar.clientWidth;
        var tab_width = (tabsbar_width) / (tabs.length + 2) - 25;
        var tab_active_width = tab_width * 3;
        if (tab_width > 200) {
            tab_width = 200;
        }
        if (tab_active_width > 400) {
            tab_active_width = 400;
        }


        for (var index = 0; index < tabs.length; index++) {
            var tabT: any = tabs[index];
            var tabTkey = tabT.getAttribute("data-key");

            for (var key in open_tabs) {
                var tabO = open_tabs[key];

                if (tabO.key == tabTkey) {
                    if (tab.key == tabO.key) {
                        tabO.active = true;
                    } else {
                        tabO.active = false;
                    }
                    if (tabO.active) {
                        tabT.className = "tab tab-active";
                        tabT.children.item(0).style.width = tab_active_width + "px";
                        themeColor(tabO.color);
                        setTimeout(() => {
                            activeView(tab.key);
                        }, 1);


                    } else {
                        tabT.children.item(0).style.width = tab_width + "px";
                        tabT.className = "tab";
                    }

                }

            }

        }
    }
}
export function addTab(new_tab: ITab) {
    var isExit = false;
    if (open_tabs != undefined) {
        open_tabs.forEach((tab) => {
            tab.active = false;
            if (tab.key == new_tab.key) {
                tab.active = true;
                isExit = true;
            }
        })
    }
    if (!isExit)
        open_tabs.push(new_tab);
}
export function activeView(key: string) {
    var views_div = document.getElementById("views");
    var children = views_div.children;
    for (var i = 0; i < children.length; i++) {
        var child = children.item(i);
        var key0 = child.getAttribute("data-key");
        if (key0 == key) {
            child.className = "view view-active";
        } else {
            child.className = "view";
        }
    }
    selectedObj(undefined);

}
export function layout() {
    var titlebarStart = document.getElementById("titlebar-start");
    var titlebarEnd = document.getElementById("titlebar-end");

    var sidebarWidth = 200;
    if (sidebarVisiable) {
        sidebarWidth = 200;
        titlebarStart.style.paddingLeft="0px";
        titlebarEnd.style.paddingRight="0px";
    } else {
        sidebarWidth = 0;
        if (isMac) {
            titlebarStart.style.paddingLeft="60px";
            titlebarEnd.style.paddingRight="0px";
        } else {
            titlebarStart.style.paddingLeft="0px";
            titlebarEnd.style.paddingRight="60px";
        }

    }
    var views_div = document.getElementById("views");
    views_div.style.height = (window.innerHeight - 50 - 24) + "px";
    views_div.style.width = (window.innerWidth - sidebarWidth) + "px";
    var titlebar = document.getElementById("titlebar");
    titlebar.style.width = (window.innerWidth - sidebarWidth) + "px";

}

export function addTablesView(database: string, key: string,isGrid?:boolean) {

    var views_div = checkView(key);



    var view_div = document.createElement("div");
    view_div.setAttribute("data-key", key);
    view_div.className = "view";

    views_div.appendChild(view_div);

    if(isGrid){
        var grids_div = document.createElement("table");
        grids_div.className = "view_grids";
        view_div.appendChild(grids_div);

        getTabels(database, (error, result, fields) => {
            //分组
            statusInfo(result.length);
            var groupData:Map<string,any>=new Map();
            result.forEach((row: any, index: number) => {
                var table:string= row.table;
                var key=table;
                if(table.indexOf("_")>0){
                    key=table.split("_")[0];
                }
                var data=groupData.get(key);
                if(data==undefined){
                    data=[];
                    groupData.set(key,data);
                }
                data.push(row);


            });
            //绘制
            groupData.forEach((data,key)=>{

                var groupColor=Theme.randomColor();

                var grid_div=document.createElement("div");
                grid_div.className="grid_group";
     
                grid_div.style.backgroundColor=Theme.background;
                grid_div.style.borderBottom="1px solid "+groupColor;
                grids_div.appendChild(grid_div);

                var grid_tile_div=document.createElement("div");
                grid_tile_div.innerText=key;
                grid_tile_div.style.backgroundColor=groupColor;
                grid_div.appendChild(grid_tile_div);

                var group_div=document.createElement("div");
            

                grids_div.appendChild(group_div);


                
                data.forEach((row: any, index: number) => {
                    var grid_div=document.createElement("div");
                    grid_div.className="grid";
                    var table = row.table;
                    var grid_title=document.createElement("div");
                    grid_title.className="grid_title";
                    grid_title.innerText=table;
                    var grid_info=document.createElement("div");
                    grid_info.className="grid_info";
                    grid_info.innerText=row.comment;
                    grid_div.appendChild(grid_title);
                    grid_div.appendChild(grid_info);
    
                    group_div.appendChild(grid_div);
                   
                    onDrapActionElement(grid_div,row);
                 
                    grid_div.onclick = () => {
                        selectedObj([table]);
                    };
                    grid_div.ondblclick = () => {
                        openColumns(database, table);
                    };
                    grid_div.oncontextmenu = (e) => {
                        e.preventDefault();
                        ipcRenderer.send('show-tables-menu', table);
                    };
        
                   
                });
            })

           
        })




    }else{

        var table_div = document.createElement("table");
        table_div.className = "view_table_list";
        view_div.appendChild(table_div);
        createTheadElement(table_div, ["Table", "Rows", "Size", "Index_size", "Comment"]);
       
        var tbody_div = document.createElement("tbody");
        table_div.appendChild(tbody_div);
    
        getTabels(database, (error, result, fields) => {
    
            result.forEach((row: any, index: number) => {
    
                var table = row.table;
                var tr = createTrElement(row, index+1);
                tr.onclick = () => {
                    selectedObj([table]);
                };
                tr.ondblclick = () => {
                    openColumns(database, table);
                };
                tr.oncontextmenu = (e) => {
                    e.preventDefault();
                    ipcRenderer.send('show-tables-menu', table);
                };
    
                tbody_div.appendChild(tr);
            });
        })
    
    }


    activeView(key);

}
export function openColumns(database: string, table: string): void {


    var key = database + "." + table;
    addTab({ key: key, title: table, active: true, color: Theme.randomColor(), type: "columns", database: database, table: table });
    renderTabs();
    addTableInfoView(database, table, key);
}
export function addTableInfoView(database: string, table: string, key: string) {

    var views_div = checkView(key);
    var view_div = document.createElement("div");
    view_div.setAttribute("data-key", key);
    view_div.className = "view";

    views_div.appendChild(view_div);

    var table_div = document.createElement("table");
    table_div.className = "view_table_list";
    view_div.appendChild(table_div);
    createTheadElement(table_div,["Column_Name", "Column_Type", "Column_Default", "Character_Maximum_Length", "Column_Key", "Column_Comment"]);
  
    var tbody_div = document.createElement("tbody");
    table_div.appendChild(tbody_div);

    getTablesColumn(database, table, (error, result, fields) => {
        statusInfo(result.length);
        result.forEach((row: any, index: number) => {

            var column = row.COLUMN_NAME;
            var type=row.COLUMN_TYPE;
            var tr = createTrElement(row, index+1);
            tr.onclick = () => {
                selectedObj([column,type]);
            }

            tbody_div.appendChild(tr);
        });
    })


    activeView(key);

}
export function createTheadElement(table_div:HTMLElement,columns:Array<string>){
    var color=Theme.randomColor();
    var thead_div = document.createElement("thead");
    table_div.appendChild(thead_div);
    var th = document.createElement("th");
    th.innerText = "";
    th.className = "th-tow";
  
    th.style.backgroundColor=Theme.background;
    thead_div.appendChild(th);
    columns.forEach(item => {
        var color=Theme.randomColor();
        var th = document.createElement("th");
        th.innerText = item;
        th.style.color=color;
        th.style.borderBottom="1px solid "+color;
        th.style.backgroundColor=Theme.background;
        thead_div.appendChild(th);
    })
}
export function createTrElement(data: any, index: number): HTMLElement {
    var tr = document.createElement("tr");

    var color=Theme.randomColor();
    var td = document.createElement("td");
    td.innerText = index + "";
    td.className = "td-tow";
    td.style.borderRight="1px solid "+color;
    td.style.color=color;
    td.style.backgroundColor=Theme.background;
    tr.appendChild(td);

    for (var key in data) {
        var item = data[key];
        var td = document.createElement("td");
        td.innerText = item;

        tr.appendChild(td);
    }
    onDrapActionElement(tr,data);

    return tr;
}
export function closeTab(tab: ITab) {
    var start = 0;
    for (var i = 0; i < open_tabs.length; i++) {
        if (tab.key == open_tabs[i].key) {
            start = i;
            break;
        }
    }

    open_tabs.splice(start, 1);


    var tabsbar = document.getElementById("tabsbar");
    var tabs = tabsbar.children;
    for (var index = 0; index < tabs.length; index++) {
        var item = tabs[index];
        var itemKey = item.getAttribute("data-key");
        if (itemKey == tab.key) {
            item.remove();
            break;
        }
    }

    var views_div = checkView(tab.key);
    // if(tabs.length>0){
    //     var tab1= tabs.item(0);
    //     eval("tab1.click();");
    // }
    if (open_tabs != undefined && open_tabs.length > 0) {
        if (start >= open_tabs.length) {
            start = open_tabs.length - 1;
        }
        var atab = open_tabs[start];
        setTimeout(() => { activeTab(atab); }, 1)

    }



}
export function getActiveTab(): ITab {
    var tab_active: ITab = undefined;
    if (open_tabs != undefined && open_tabs.length > 0) {

        open_tabs.forEach((tab => {
            if (tab.active) {
                tab_active = tab;
            }

        }));
    } else {

    }
    return tab_active;
}
export function getActiveView(tab: ITab): Element {
    var views_div = document.getElementById("views");
    var children = views_div.children;

    for (var i = 0; i < children.length; i++) {
        var child = children.item(i);
        var key0 = child.getAttribute("data-key");
        if (key0 == tab.key) {
            return child;
        }
    }
    return undefined;
}
export var editor_count: number = 0;
export function newEditor(key: string, title: string, sql: string[]) {
    if (open_tabs != undefined && open_tabs.length > 0) {
        var tab_active: ITab = null;
        open_tabs.forEach((tab => {
            if (tab.active) {
                tab_active = tab;
            }
        }));
        if (tab_active != undefined && tab_active != null) {
            addTab({ key: key, active: true, color: Theme.randomColor(), title: title, type: "editor", database: tab_active.database });
            renderTabs();
            addEditorView(tab_active.database, tab_active.table, sql, key);
        }

    } else {

    }

    editor_count = editor_count + 1;



}


export function addEditorView(database: string, table: string, sql: string[], key: string) {

    var views_div = checkView(key);

    var view_div = document.createElement("div");
    view_div.setAttribute("data-key", key);
    view_div.setAttribute("data-database", database);
    view_div.setAttribute("data-table", table);
    var sqlAttr = "";
    sql.forEach((line) => {
        sqlAttr += line + "[n]";
    });
    view_div.setAttribute("data-sql", sqlAttr);
    view_div.className = "view";

    views_div.appendChild(view_div);
    //loadedit
    var editor = document.createElement("div");
    editor.className = "editor_container";
    editor.id = key;
    editor.style.width = "100%";
    editor.style.height = (window.innerHeight - 50 - 24) + "px";
    view_div.appendChild(editor);
    // createEdior(editor);

    activeView(key);

}

export function openViewData(): void {
    var tab_active = getActiveTab();
    if (tab_active != undefined && tab_active != null) {
        if (tab_active.type == "columns") {
            var sql = "select * from " + tab_active.table + " limit 0,100";
            var key = "View Data:" + tab_active.database + "." + tab_active.table;
            addTab({ key: key, active: true, color: Theme.randomColor(), title: key, type: "result" });
            renderTabs();
            addResultView(key, sql, tab_active.database);
        }
    }



}

export function getTitle(longTitle: string) {
    var title = longTitle;
    if (title.length > 10) {
        title = title.substring(0, 10) + "...";
    }
    return title;
}
export function openSqlResult(sql: string): void {
    var statusbar_database = document.getElementById("statusbar-database");
    var database: string = basebase_active + "";

    var key = "SQL.RESULT-" + (editor_count + 1);
    editor_count++;
    var title = getTitle(sql);
    addTab({ key: key, active: true, color: Theme.randomColor(), title: sql, type: "result" });
    renderTabs();
    setTimeout(() => {
        addResultView(key, sql, database);
    }, 10);


}
export function addResultView(key: string, sql: string, database: string) {

    var views_div = checkView(key);

    var view_div = document.createElement("div");
    view_div.setAttribute("data-key", key);
    view_div.className = "view";

    views_div.appendChild(view_div);

    var table_div = document.createElement("table");
    table_div.className = "view_table_list";
    view_div.appendChild(table_div);

    var thead_div = document.createElement("thead");
    table_div.appendChild(thead_div);
    // ["Table","Rows","Size","Index_size","Comment"].forEach(item=>{
    //     var th=document.createElement("th");
    //     th.innerText=item;
    //     thead_div.appendChild(th);
    // })

    var tbody_div = document.createElement("tbody");
    table_div.appendChild(tbody_div);

    var th = document.createElement("th");
    th.innerText = "";
    th.style.backgroundColor=Theme.background;
    th.className = "th-tow";
    thead_div.appendChild(th);
    console.log("key", key);
    //loadedit
    exec(key, database, sql, (error, result, fields, callBackKey) => {

        if (error) {

            var tab_active: ITab;
            console.log("key", callBackKey);
            open_tabs.forEach((tab => {
                console.log(tab.key, callBackKey);
                if (tab.key == callBackKey) {
                    tab_active = tab;
                }

            }));
            console.log("tab_active", tab_active);
            if (tab_active != undefined && tab_active != null) {
                tab_active.color = "darkred";
                tab_active.title = "Exec Error:" + getTitle(sql);
                renderTab(tab_active);

            }
            view_div.style.padding = "50px";

            var title_div = document.createElement("h1");
            title_div.innerHTML = error.message;
            view_div.appendChild(title_div);
            var message = error.stack;
            message = message.replace(/at /g, "<br/>at ");
            message = message.replace(/--------------------/g, "<br/>--------------------");
            message = message.replace(/\(/g, "(<highlight>");
            message = message.replace(/\)/g, "</highlight>)");
            var message_div = document.createElement("p");
            message_div.innerHTML = message;
            message_div.className = "message";
            view_div.appendChild(message_div);

            return;
        }
        if (fields != undefined)
            fields.forEach((row: any) => {
                var color=Theme.randomColor();
                var th = document.createElement("th");
                th.innerText = row.name;
                th.style.color=color;
                th.style.borderBottom="1px solid "+color;
                th.style.backgroundColor=Theme.background;
                thead_div.appendChild(th);
            });
        if (result instanceof Array) {
            statusInfo(result.length+"");
            result.forEach((row: any, index: number) => {
                var table = row.table;
                var tr = createTrElement(row, index + 1);
                tr.onclick = () => {
                    var where: string = "";
                    for (var key in row) {
                        var item = row[key];
                        where += " key='" + item + "' and";
                    }
                    if (where.endsWith("and")) {
                        where = where.substring(0, where.length - 4);
                    }
                    selectedObj([where]);
                }

                tbody_div.appendChild(tr);
            });

        } else {
            var success_div = document.createElement("success");
            success_div.className = "success";
            for (var key in result) {
                var item = result[key];
                if (item instanceof Function) {

                } else {
                    success_div.innerHTML += key + ":" + item + "<br/>";
                }


            }

            view_div.appendChild(success_div);
        }





    })

    //
    activeView(key);

}
