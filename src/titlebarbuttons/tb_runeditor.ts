import { exec } from "../service";
import { addTablesView, closeTab, editor_count, getActiveView, getTabCount, openLoaddingView, openSqlResult } from "../protal";
import { addTableInfoView } from "../protal";
import { getActiveTab } from "../protal";
import { ITitlebarButton } from "./ITitlebarButton";
export const tb_runeditor: ITitlebarButton = {
    id: "runeditor",
    title: "Run Editor",
    svg: '<svg xmlns="http://www.w3.org/2000/svg " width="24 " height="24 " fill="currentColor " class="bi bi-play " viewBox="0 0 16 16 ">    <path d="M10.804 8 5 4.633v6.734L10.804 8zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696l6.363 3.692z "/>  </svg>',
    tabs: ["editor"],
    align: "start",
    action: () => {

        var selection = window.getSelection();
        var text = selection.toString();
        if (text == undefined || text.length == 0) {
            alert("Please select SQL you want to execute first.");
            return;
        }
        var tab = getActiveTab();
        var key = "loading-" + getTabCount();
        var database = tab.database;
        var table = tab.table;
        var view: HTMLElement = undefined;


        var sqls: Array<string> = [];
        text.split(";").forEach((sql) => {

            if (sql.trim().length > 1) {
                sqls.push(sql);
            }
        });

        sqls.forEach((sql) => {


            exec(key, database, sql, (error: any, result: any, fields: any, callBackKey: any) => {

                if (error) {
                    if (view == undefined) {
                        view = openLoaddingView(callBackKey, "Run SQL", tab.database, tab.table);
                    }
                    var p = document.createElement("p")
                    p.innerHTML = error.stack;
                    view.appendChild(p);



                } else {

                    if (result instanceof Array) {


                        openSqlResult(sql, database, table, result, fields);
                    } else {
                        if (view == undefined) {
                            view = openLoaddingView(callBackKey, "Run SQL", tab.database, tab.table);
                        }
                        var success_div = document.createElement("success");
                        success_div.className = "success";
                        for (var key in result) {
                            var item = result[key];
                            if (item instanceof Function) {

                            } else {
                                success_div.innerHTML += key + ":" + item + ",";
                            }


                        }

                        view.appendChild(success_div);
                    }

                }

            });


        });

    }
}