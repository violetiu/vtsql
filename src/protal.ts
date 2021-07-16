import { ITab,ITabType } from "./ITab";
import { exec, getColumnSuggestions, getDatabases, getTabels, getTabelsSuggestions, getTablesColumn, showDatabases } from "./sqlservice";
import { Theme } from "./theme";
import welcome from "./welcome";
export var open_tabs: Array<ITab> = [];
export var sidebarVisiable: boolean = false;
import * as mysql from 'mysql';
import { ipcRenderer } from "electron";
import { layoutToolButton } from "./titlebarbuttons/titlebarButtonManager";
import { onDrapActionElement } from "./drapaction/darpActionManager";
import { statusInfo } from "./statusbar";
import { pushEditorAction } from "./preload/editorServer";
import { SidebarModels } from "./SidebarModels";
const isMac = process.platform === 'darwin';
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
    } else {
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

    var sidebar_welcome = document.getElementById("sidebar_welcome");
    sidebar_welcome.appendChild(welcome(Theme.randomColor()));

    // var color = Theme.randomColor();
    // var key = "Welcome";
    // addTab({ key: key, active: true, color: color, title: key, type: "welcome" });
    // renderTabs();
    // addWecomeView(key, color);

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


    var title_div = document.createElement("h1");
    title_div.style.paddingLeft = "20px";
    title_div.innerHTML = title;
    view_div.appendChild(title_div);

    message = message.replace(/at /g, "<br/>at ");
    message = message.replace(/--------------------/g, "<br/>--------------------");
    message = message.replace(/\(/g, "(<highlight>");
    message = message.replace(/\)/g, "</highlight>)");
    var message_div = document.createElement("p");
    message_div.innerHTML = message;
    message_div.style.paddingLeft = "20px";
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


    var databases_div = document.getElementById("sidebar_databases");

    var load_svg = document.createElement("div");
    load_svg.className = "loadding";
    databases_div.innerHTML = "";
    databases_div.appendChild(load_svg);
    if (!sidebarVisiable) {
        sidebarVisiable = true;
        // var sidebar = document.getElementById("sidebar");
        // sidebar.style.display = "block";

        layout();
    }

    var statusbar_connect = document.getElementById("statusbar-connect");
    statusbar_connect.innerText = config.host;


    var databaseMap: Map<string, number> = new Map();
    var databaseList: Array<string> = [];
    showDatabases(config, (error1, result1, fields1) => {
        if (error1) {
            openMessage(error1.message, error1.stack, "darkred");
            return;
        };
        result1.forEach((row: any, index: number) => {
            if (databaseList.indexOf(row.Database) < 0) {
                databaseList.push(row.Database);
            }
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
                if (databaseList.indexOf(database) < 0) {
                    databaseList.push(database);
                }
                var size = row.size;
                var rows = row.rows;
                databaseMap.set(database, size);
            });
            var index: number = 0;
            databaseList.sort((a, b) => {
                var aCount = pullUsedDatabase(a);
                var bCount = pullUsedDatabase(b);
                return bCount - aCount;
            });
            databaseList.forEach((database) => {
                if (database !== "information_schema" && database !== "performance_schema"
                    && database !== "mysql" && database !== "sys" && database !== "profile") {
                    var color = Theme.colors[index];
                    var database_div = document.createElement("div");
                    database_div.className = "sidebar_item";
                    database_div.style.background = color;
                    var database_name_div = document.createElement("div");
                    database_name_div.className = "sidebar_item_name";
                    database_name_div.innerText = database;
                    var database_info_div = document.createElement("div");
                    database_info_div.className = "sidebar_item_info";

                    database_info_div.innerHTML = databaseMap.get(database) + "<span style='font-size:6px;'>Mb</span>";
                    database_info_div.style.background = Theme.bar;
                    database_info_div.style.color = color;
                    database_div.appendChild(database_name_div); database_div.appendChild(database_info_div);
                    databases_div.appendChild(database_div);
                    database_div.onclick = () => {

                        openDatabase(database, color);
                    };

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
    pushUsedDatabase(database);
    var key = database;
    addTab({ key: key, active: true, color: color, title: database, type: "tables", database: database });
    renderTabs();
    addTablesView(database, key, true);

}

export function renderTabs() {
    var tabsbar = document.getElementById("tabsbar");
    var sidebar = document.getElementById("sidebar");
    var tabsbar_width = window.innerWidth-sidebar.clientWidth;
    tabsbar.innerHTML = "";

    if (open_tabs != undefined) {
   
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
            // if(tab.loadding)
            //     tab_div.setAttribute("data-loadding","true");
            var tab_context_div = document.createElement("div");

            tab_context_div.className = "tab-context";
            tab_context_div.title = tab.title;

            // var tab_loadding=document.createElement("div");
            // tab_loadding.className="tab-loadding";
            // tab_div.appendChild(tab_loadding)

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
            // if(tab.loadding)
            //     tab_div.setAttribute("data-loadding","true");
            // else
            //      tab_div.setAttribute("data-loadding","false");

            tabtitle.textContent = tab.title;
            themeColor(tab.color);
            break;
        }

    }

}
export function themeColor(color: string) {
    var titlebar = document.getElementById("titlebar");
    if(Theme.isDark){
        titlebar.style.backgroundColor = "";
    }else{
        titlebar.style.backgroundColor = color;
    }

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
        var sidebar = document.getElementById("sidebar");
        var tabsbar_width = window.innerWidth-sidebar.clientWidth;
    
     
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
var sidebarModel: SidebarModels = SidebarModels.welcome;
export function layoutModel(model: SidebarModels) {
    sidebarModel = model;
    layout();

}
export function layout() {
    var titlebarStart = document.getElementById("titlebar-start");
    var titlebarEnd = document.getElementById("titlebar-end");
    var views_div = document.getElementById("views");
    var titlebar = document.getElementById("titlebar");
    var sidebar = document.getElementById("sidebar");
    var sidebar_databases = document.getElementById("sidebar_databases");
    var sidebar_tables = document.getElementById("sidebar_tables");
    var sidebar_welcome = document.getElementById("sidebar_welcome");

    var main = document.getElementById("main");

    if (sidebarModel == SidebarModels.welcome) {

        sidebar.style.width = "100%";
        sidebar_databases.style.display = "none";
        sidebar_tables.style.display = "none";
        sidebar_welcome.style.display = "block";
        main.style.display = "none";
    } else if (sidebarModel == SidebarModels.datebases) {
        // var sidebarWidth = 200;

        //    sidebar.style.width=(sidebarWidth)+"px";
        sidebar.style.width = "300px";
        sidebar_databases.style.display = "block";
     
        sidebar_databases.setAttribute("data-model","l");
        sidebar_tables.style.display = "none";
        sidebar_welcome.style.display = "none";


        main.style.display = "block";
        //  main.style.width=(window.innerWidth-sidebarWidth)+"px";
        views_div.style.height = (innerHeight - 100 - 24) + "px";

        main.style.width=(window.innerWidth-sidebar.clientWidth)+"px";
        views_div.style.width=(window.innerWidth-sidebar.clientWidth)+"px";
        titlebar.style.width=(window.innerWidth-sidebar.clientWidth)+"px";

    } else if (sidebarModel == SidebarModels.tables) {
        //  var sidebarWidth = 400;

        //sidebar.style.width=(sidebarWidth)+"px";
        sidebar.style.width = "300px";
        sidebar_databases.style.display = "block";
   
        sidebar_databases.setAttribute("data-model","s");
        sidebar_tables.style.display = "block";
        sidebar_welcome.style.display = "none";

  
        //  main.style.width=(window.innerWidth-sidebarWidth)+"px";
        views_div.style.height = (innerHeight - 100 - 24) + "px";
        main.style.display = "block";
        main.style.width=(window.innerWidth-sidebar.clientWidth)+"px";
        views_div.style.width=(window.innerWidth-sidebar.clientWidth)+"px";
        titlebar.style.width=(window.innerWidth-sidebar.clientWidth)+"px";
    }




}

export function addTablesView(database: string, key: string, isGrid?: boolean) {

    var views_div = checkView(key);
    var sidebar_tables = document.getElementById("sidebar_tables");


    var view_div = document.createElement("div");
    view_div.setAttribute("data-key", key);
    view_div.className = "view";

    views_div.appendChild(view_div);

    if (isGrid) {
        var grids_div = document.createElement("table");
        grids_div.className = "view_grids";
        view_div.appendChild(grids_div);

        getTabels(database, (error, result, fields) => {
            //分组
            statusInfo(result.length);
            var groupData: Map<string, any> = new Map();
            result.forEach((row: any, index: number) => {
                var table: string = row.table;
                var key = table;
                if (table.indexOf("_") > 0) {
                    key = table.split("_")[0];
                }
                var data = groupData.get(key);
                if (data == undefined) {
                    data = [];
                    groupData.set(key, data);
                }
                data.push(row);

            });
            //排序
            var groupSort: Array<string> = [];
            var groupSortMap: Map<string, number> = new Map();
            groupData.forEach((data, key) => {
                var groupUsed: number = 0;
                var groupTable: string;
                data.forEach((row: any, index: number) => {
                    var tableName = row.table;
                    var tableUsed = pullUsedTable(tableName);
                    if (groupTable == undefined) {
                        groupTable = tableName;
                        groupUsed = tableUsed;
                    } else if (tableUsed > groupUsed) {
                        groupTable = tableName;
                        groupUsed = tableUsed;
                    }

                });
                groupSort.push(key);
                groupSortMap.set(key, groupUsed);

            });
            groupSort.sort((a, b) => (groupSortMap.get(b) - groupSortMap.get(a)));
            groupSort.forEach((key) => {
                var data = groupData.get(key);
                var groupColor = Theme.randomColor();

                var grid_div = document.createElement("div");
                grid_div.className = "grid_group";

                grid_div.style.backgroundColor = Theme.background;
                grid_div.style.borderBottom = "1px solid " + groupColor;
                grids_div.appendChild(grid_div);

                var grid_tile_div = document.createElement("div");
                grid_tile_div.innerText = key;
                grid_tile_div.style.backgroundColor = groupColor;
                grid_div.appendChild(grid_tile_div);

                var group_div = document.createElement("div");


                grids_div.appendChild(group_div);
                
                var sidebar_group=document.createElement("div");
                sidebar_group.className="sidebar_group";
                sidebar_group.innerText=key;
                sidebar_tables.appendChild(sidebar_group);


                data.sort((a: any, b: any) => (pullUsedTable(b.table) - pullUsedTable(a.table)));

                data.forEach((row: any, index: number) => {
                    var grid_div = document.createElement("div");
                    grid_div.className = "grid";
                    var table = row.table;
                    var grid_title = document.createElement("div");
                    grid_title.className = "grid_title";
                    grid_title.innerText = table;
                    var grid_info = document.createElement("div");
                    grid_info.className = "grid_info";
                    grid_info.innerText = row.comment;
                    grid_div.appendChild(grid_title);
                    grid_div.appendChild(grid_info);

                    group_div.appendChild(grid_div);

                    onDrapActionElement(grid_div, row,"tables");

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

                    var database_div = document.createElement("div");
                    database_div.className = "sidebar_item";
                    database_div.style.background = groupColor;
                    var database_name_div = document.createElement("div");
                    database_name_div.className = "sidebar_item_name";
                    database_name_div.innerText = row.table;
                    var database_info_div = document.createElement("div");
                    database_info_div.className = "sidebar_item_info";

                    database_info_div.innerHTML = row.size + "<span style='font-size:6px;'>Mb</span>";
                    database_info_div.style.background = Theme.bar;
                    database_info_div.style.color = groupColor;
                    database_div.appendChild(database_name_div); database_div.appendChild(database_info_div);
                    sidebar_tables.appendChild(database_div);
                    database_div.onclick = () => {
                        openColumns(database, table);
                    };
                    database_div.ondblclick = () => {
                        var sql = "select * from " + table + " limit 0,100";
                        var key = "View Data:" + database + "." + table;
                        addTab({ key: key, active: true, color: Theme.randomColor(), title: key, type: "result", database: database, table: table });
                        renderTabs();
                        addResultView(key, sql, database, true);
                    };
                    onDrapActionElement(database_div, row,"tables");
                });
            });



        })


        layoutModel(SidebarModels.tables);

    } else {

        var table_div = document.createElement("table");
        table_div.className = "view_table_list";
        view_div.appendChild(table_div);
        createTheadElement(table_div, ["Table", "Rows", "Size", "Index_size", "Comment"]);

        var tbody_div = document.createElement("tbody");
        table_div.appendChild(tbody_div);

        getTabels(database, (error, result, fields) => {
            result.sort((a: any, b: any) => (pullUsedTable(b.table) - pullUsedTable(a.table)));
            result.forEach((row: any, index: number) => {

                var table = row.table;
                var tr = createTrElement(row, index + 1);
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

    pushUsedTable(table);
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
    createTheadElement(table_div, ["Column_Name", "Column_Type", "Column_Default", "Character_Maximum_Length", "Column_Key", "Column_Comment"]);

    var tbody_div = document.createElement("tbody");
    table_div.appendChild(tbody_div);

    getTablesColumn(database, table, (error, result, fields) => {
        statusInfo(result.length);
        result.forEach((row: any, index: number) => {

            var column = row.COLUMN_NAME;
            var type = row.COLUMN_TYPE;
            var tr = createTrElement(row, index + 1);
            tr.onclick = () => {
                //  pushUsedColumn(column);
                selectedObj([column, type]);
            }

            tbody_div.appendChild(tr);
        });
    })


    activeView(key);

}
export function createTheadElement(table_div: HTMLElement, columns: Array<string>) {
    var color = Theme.randomColor();
    var thead_div = document.createElement("thead");
    table_div.appendChild(thead_div);
    var th = document.createElement("th");
    th.innerText = "";
    th.className = "th-tow";

    th.style.backgroundColor = Theme.background;
    thead_div.appendChild(th);
    columns.forEach(item => {
        var color = Theme.randomColor();
        var th = document.createElement("th");
        th.innerText = item;
        th.style.color = color;
        th.style.borderBottom = "1px solid " + color;
        th.style.backgroundColor = Theme.background;
        thead_div.appendChild(th);
    })
}
export function createTrElement(data: any, index: number, editable?: boolean): HTMLElement {
    var tr = document.createElement("tr");

    var color = Theme.randomColor();
    var td = document.createElement("td");
    td.innerText = index + "";
    td.className = "td-tow";
    td.style.borderRight = "1px solid " + color;
    td.style.color = color;
    td.style.backgroundColor = Theme.background;

    tr.appendChild(td);

    for (var key in data) {
        var item = data[key];
        var td = document.createElement("td");
        td.setAttribute("data-key", key);
        td.innerText = item;
        if (editable) {
            td.ondblclick = (event) => {
                var td_div: any = event.target;
                var edit_input = document.createElement("input");
                edit_input.value = td_div.innerText;
                td_div.innerHTML = "";
                var rd_key = td_div.getAttribute("data-key");
                td_div.appendChild(edit_input);
                edit_input.focus();
                edit_input.onblur = () => {
                    td_div.innerHTML = edit_input.value;

                    var where: string = "";
                    var values: string = "";
                    for (var key in data) {
                        var item = data[key];

                        if (item == null) {
                            where += " " + key + " is null and";
                        } else {
                            where += " " + key + "='" + item + "' and";
                        }
                        if (key == rd_key) {
                            values += " " + key + "='" + edit_input.value + "' ,";
                        } else {
                            if (item != null) {

                                values += " " + key + "='" + item + "' ,";
                            }

                        }

                    }
                    if (where.endsWith("and")) {
                        where = where.substring(0, where.length - 4);
                    }
                    if (values.endsWith(",")) {
                        values = values.substring(0, values.length - 1);
                    }
                    data[rd_key] = edit_input.value;
                    var tab = getActiveTab();
                    var editSQl = "update " + tab.table + "  set " + values + " where  " + where;
                    exec(tab.key, tab.database, editSQl, (error, result, fuelds) => {
                        if (error) {
                            openMessage(error.message, error.stack, "darkred");
                        }
                    })


                };
            }
        }

        tr.appendChild(td);
    }
    onDrapActionElement(tr, data,"columns");

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
export function getTabCount(): number {
    editor_count++;
    return editor_count;
}
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
    view_div.style.overflow = "hidden";

    views_div.appendChild(view_div);
    //loadedit
    var editor = document.createElement("div");
    editor.className = "editor_container";
    editor.id = key;
    editor.style.width = (views_div.clientWidth) + "px";
    editor.style.height = (views_div.clientHeight) + "px";
    view_div.appendChild(editor);
    pushEditorAction({ action: "new_editor", key: key, sql: sql });
    if (loadedSugg.indexOf(database) < 0) {
        loadSuggestions(database);
        loadedSugg.push(database);
    }

    // createEdior(editor);

    activeView(key);

}
var loadedSugg: Array<string> = [];

export function openViewData(): void {
    var tab_active = getActiveTab();
    if (tab_active != undefined && tab_active != null) {
        if (tab_active.type == "columns") {
            var sql = "select * from " + tab_active.table + " limit 0,100";
            var key = "View Data:" + tab_active.database + "." + tab_active.table;
            addTab({ key: key, active: true, color: Theme.randomColor(), title: key, type: "result", database: tab_active.database, table: tab_active.table });
            renderTabs();
            addResultView(key, sql, tab_active.database, true);
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
export function openLoaddingView(key: string, title: string, database?: string, table?: string): HTMLElement {
    var statusbar_database = document.getElementById("statusbar-database");
    if (database == undefined)
        database = basebase_active + "";
    editor_count++;
    var title = title;
    addTab({ key: key, active: true, color: Theme.randomColor(), title: title, type: "loadding", database: database, table: table, loadding: true });
    renderTabs();
    var views_div = checkView(key);
    var view_div = document.createElement("div");
    view_div.setAttribute("data-key", key);
    view_div.className = "view";
    views_div.appendChild(view_div);

    activeView(key);
    return view_div;


}
export function openSqlResult(sql: string, database?: string, table?: string, result?: any, fields?: any): void {
    var statusbar_database = document.getElementById("statusbar-database");
    if (database == undefined)
        database = basebase_active + "";

    var key = "SQL.RESULT-" + (editor_count + 1);
    editor_count++;
    var title = getTitle(sql);
    addTab({ key: key, active: true, color: Theme.randomColor(), title: sql, type: "result", database: database, table: table });
    renderTabs();
    setTimeout(() => {
        addResultView(key, sql, database, false, result, fields);
    }, 10);


}



export function addResultView(key: string, sql: string, database: string, editable?: boolean, result?: any, fields?: any) {

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
    th.style.backgroundColor = Theme.background;
    th.className = "th-tow";
    thead_div.appendChild(th);
    console.log("key", key);
    if (result && fields) {
        if (fields != undefined)
            fields.forEach((row: any) => {
                var color = Theme.randomColor();
                var th = document.createElement("th");
                th.innerText = row.name;
                th.style.color = color;
                th.style.borderBottom = "1px solid " + color;
                th.style.backgroundColor = Theme.background;
                thead_div.appendChild(th);
            });
        console.log(result, fields);
        if (result instanceof Array) {
            statusInfo(result.length + "");
            result.forEach((row: any, index: number) => {
                var table = row.table;
                var tr = createTrElement(row, index + 1, editable);
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

        }


    } else
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


                var title_div = document.createElement("h1");
                title_div.innerHTML = error.message;
                title_div.style.paddingLeft = "20px";
                view_div.appendChild(title_div);
                var message = error.stack;
                message = message.replace(/at /g, "<br/>at ");
                message = message.replace(/--------------------/g, "<br/>--------------------");
                message = message.replace(/\(/g, "(<highlight>");
                message = message.replace(/\)/g, "</highlight>)");
                var message_div = document.createElement("p");
                message_div.style.paddingLeft = "20px";
                message_div.innerHTML = message;
                message_div.className = "message";
                view_div.appendChild(message_div);

                return;
            }
            if (fields != undefined)
                fields.forEach((row: any) => {
                    var color = Theme.randomColor();
                    var th = document.createElement("th");
                    th.innerText = row.name;
                    th.style.color = color;
                    th.style.borderBottom = "1px solid " + color;
                    th.style.backgroundColor = Theme.background;
                    thead_div.appendChild(th);
                });
            console.log(result, fields);
            if (result instanceof Array) {
                statusInfo(result.length + "");
                result.forEach((row: any, index: number) => {
                    var table = row.table;
                    var tr = createTrElement(row, index + 1, editable);
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

var usedData: any;
export function pushUsedDatabase(database: string): void {
    var count = usedData.databases[database];
    if (count == undefined) {
        usedData.databases[database] = 1;
    } else {
        usedData.databases[database] = count + 1;
    }
    saveUsed();
}
export function pushUsedTable(table: string): void {
    var count = usedData.tables[table];
    if (count == undefined) {
        usedData.tables[table] = 1;
    } else {
        usedData.tables[table] = count + 1;
    }
    saveUsed();
}
export function pushUsedColumn(column: string): void {
    var count = usedData.columns[column];
    if (count == undefined) {
        usedData.columns[column] = 1;
    } else {
        usedData.columns[column] = count + 1;
    }
    saveUsed();
}
export function pullUsedDatabase(database: string): number {
    var count = usedData.databases[database];
    if (count == undefined) {
        return 0;
    } else {
        return count;
    }
}
export function pullUsedTable(table: string): number {
    var count = usedData.tables[table];
    if (count == undefined) {
        return 0;
    } else {
        return count;
    }
}
export function pullUsedColumn(column: string): number {
    var count = usedData.columns[column];
    if (count == undefined) {
        return 0;
    } else {
        return count;
    }
}
export function loadUsed() {

    ipcRenderer.send("used");
    ipcRenderer.on("_used", (event, usedData0) => {
        usedData = usedData0;
    });
}
export function saveUsed() {

    if (usedData != undefined) {
        ipcRenderer.send("save_used", usedData);
    }
}

export function loadSuggestions(database: string) {
    setTimeout(() => {
        var suggestions: Array<any> = [];


        getColumnSuggestions((error, result, fields) => {
            if (error) {

                return;
            }

            result.forEach((row: any) => {
                //TABLE_NAME,COLUMN_NAME, COLUMN_COMMENT       
                //  row.database+"[t]"+row.TABLE_NAME + "[t]" + row.COLUMN_NAME + "[t]" + row.COLUMN_COMMENT + "[n]";
                //Method = 0,Function = 1,Constructor = 2,Field = 3,Variable = 4,Class = 5,Struct = 6,Interface = 7,Module = 8,Property = 9,Event = 10,Operator = 11,Unit = 12,Value = 13,Constant = 14,Enum = 15,EnumMember = 16,Keyword = 17,Text = 18,Color = 19,File = 20,Reference = 21,Customcolor = 22,Folder = 23,TypeParameter = 24,User = 25,Issue = 26,Snippet = 27
                if (database == row.database) {

                    suggestions.push({
                        label: row.TABLE_NAME + "." + row.COLUMN_NAME,
                        kind: 3,
                        insertText: row.TABLE_NAME + "." + row.COLUMN_NAME,
                        detail: row.COLUMN_COMMENT,
                        insertTextRules: 4,

                    });
                }
            });


            getTabelsSuggestions((error1, result1, fields1) => {
                if (error1) {

                    return;
                };
                var tableSort: Array<string> = [];
                result1.forEach((row: any) => {
                    if (database == row.database) {
                        tableSort.push(row.table);
                    }

                });
                tableSort.sort((a, b) => (pullUsedTable(b) - pullUsedTable(a)));

                result1.forEach((row: any) => {

                    //row.database + "[t]" + row.table + "[t]" + row.comment + " " + "[n]";
                    if (database == row.database) {
                        var index = tableSort.indexOf(row.table);

                        var sort = getSortTextByNumber(index);
                        suggestions.push({
                            label: row.table,
                            kind: 5,
                            insertText: row.table,
                            detail: row.comment,
                            insertTextRules: 4,
                            sortText: sort

                        });
                    }

                });
                pushEditorAction({ action: "suggestions", suggestions: suggestions });

            })
        })
    }, 10);
}

export function getSortTextByNumber(sort: number): string {
    if (sort < 26) {

        return String.fromCharCode(sort);
    } else {
        return "";
    }





}