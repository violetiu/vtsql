import { addTablesView, openSqlResult } from "../protal";
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
            text.split(";").forEach((sql) => {
                if (sql.trim().length > 1)
                    openSqlResult(sql.trim());
            })
       
    }
}