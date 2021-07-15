import { Theme } from "../theme";
import { addResultView, addTab, addTablesView, getSelectedObj, newEditor, renderTabs } from "../protal";
import { addTableInfoView } from "../protal";
import { getActiveTab } from "../protal";
import { IDrapActon } from "./IDrapActon";
export const da_viewdata: IDrapActon = {
  id: "viewdata",
  title: "View Data",
  svg: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-list-ul" viewBox="0 0 16 16">    <path fill-rule="evenodd" d="M5 11.5a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1-.5-.5zm-3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2zm0 4a1 1 0 1 0 0-2 1 1 0 0 0 0 2z"/>  </svg>',
  tabs: ["tables"],
  action: (data) => {
    var tab_active = getActiveTab();
    var sql = "select * from " + data.table + " limit 0,100";
    var key = "View Data:" + tab_active.database + "." + data.table;
    addTab({ key: key, active: true, color: Theme.randomColor(), title: key, type: "result", database: tab_active.database, table: data.table });
    renderTabs();
    addResultView(key, sql, tab_active.database, true);

  }
}