eval("require.config({ paths: { 'vs': './node_modules/monaco-editor/min/vs' }});");
var theme = "vs";
function themeDark(): void {
    theme = "vs-dark";
    var fun = function () {

        var monaco1 = eval("monaco");
        monaco1.editor.setTheme(theme);
    };
    eval("require(['vs/editor/editor.main'],fun);")

}
function themeLight(): void {
    theme = "vs";
    var fun = function () {

        var monaco1 = eval("monaco");
        monaco1.editor.setTheme(theme);
    };
    eval("require(['vs/editor/editor.main'],fun);")
}
if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {
    alert('Browser doesn\'t support dark mode');
}
/*判断是否处于深色模式*/
if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    themeDark();
}
/*判断是否处于浅色模式*/
if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    themeLight();
}
/*模式切换听器*/
var listeners = {
    dark: function (mediaQueryList: any) {
        if (mediaQueryList.matches) {
            //Do some thing
            themeDark();
        }
    },
    light: function (mediaQueryList: any) {
        if (mediaQueryList.matches) {
            //Do some thing
            themeLight();
        }
    }
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", listeners.dark);
window.matchMedia('(prefers-color-scheme: light)').addEventListener("change", listeners.light);




document.body.addEventListener("DOMNodeInserted", (e) => {
    var ele: any = e.target;
    var className = ele.className;
    if (ele.id == "data-tab-sug") {
        var statusbar_database = document.getElementById("statusbar-database");
        var fun = function () {
            setTimeout(() => {
                var monaco1 = eval("monaco");
                var tab_sug = ele.innerText;

                var sqlKeys = ["select", "show","databases","tables","processlist","reset master","from", "insert into", "where", "values()", "columns()", "sum()", "min()", "max()", "len()", "group by", "order by", "limit 0,10", "substr(0,1)", "substring(0,1)", "count(*)"];

                monaco1.languages.registerCompletionItemProvider('sql', {

                    provideCompletionItems: (model: any, position: any, context: any, token: any) => {
                        var suggestions: Array<any> = [];
                        suggestions.push({
                            label: "sf",
                            kind: monaco1.languages.CompletionItemKind.Function,
                            insertText: "select * from ",
                            detail: "select * from"
                        });
                        sqlKeys.forEach(key => {
                            suggestions.push({
                                label: key,
                                kind: monaco1.languages.CompletionItemKind.Function,
                                insertText: key,
                                detail: key,
                                filterText: key,
                                insertTextRules: monaco1.languages.CompletionItemInsertTextRule.InsertAsSnippet
                            });
                        })
                        tab_sug.split("[n]").forEach((row: any) => {
                            var cols = row.split("[t]");
                            if (cols.length == 3) {
                                if (statusbar_database.innerText == cols[0]) {
                                    var suggestion = {
                                        label: cols[1],
                                        kind: monaco1.languages.CompletionItemKind.Class,
                                        insertText: cols[1],
                                        detail: cols[2],
                                        insertTextRules: monaco1.languages.CompletionItemInsertTextRule.InsertAsSnippet
                                    };
                                    suggestions.push(suggestion);
                                }


                            }

                        });
                        return {
                            suggestions: JSON.parse(JSON.stringify(suggestions))
                        };
                    }
                });



            }, 1);

        }
        eval("require(['vs/editor/editor.main'],fun);")


    }
    if (ele.id == "data-col-sug") {
        var statusbar_database = document.getElementById("statusbar-database");
        var fun = function () {
            setTimeout(() => {
                var monaco1 = eval("monaco");
                var col_sug = ele.innerText;

                monaco1.languages.registerCompletionItemProvider('sql', {

                    provideCompletionItems: (model: any, position: any, context: any, token: any) => {
                        var suggestions: Array<any> = [];
                        col_sug.split("[n]").forEach((row: any) => {
                            var cols = row.split("[t]");
                            if (cols.length == 4) {
                                if (statusbar_database.innerText == cols[0]) {
                                    var suggestion = {
                                        label: cols[1] + "." + cols[2],
                                        kind: monaco1.languages.CompletionItemKind.Field,
                                        insertText: cols[1] + "." + cols[2],
                                        detail: cols[3],
                                        insertTextRules: monaco1.languages.CompletionItemInsertTextRule.InsertAsSnippet
                                    };
                                    suggestions.push(suggestion);
                                }


                            }

                        });
                        return {

                            suggestions: JSON.parse(JSON.stringify(suggestions))
                        };
                    }
                });
            }, 1);
        }
        eval("require(['vs/editor/editor.main'],fun);")
    }
});
var views_div = document.getElementById("views");
views_div.addEventListener("DOMNodeInserted", (e) => {
    var ele: any = e.target;
    var className = ele.className;
    if (className === "editor_container") {
        console.log("editor_container");
        var view = ele.parentElement;

        var database = view.getAttribute("data-database");
        var table = view.getAttribute("data-table");
        var sqls = view.getAttribute("data-sql");
        var sql:string[]=[];
        if(sqls!="undefined"&&sqls.length>5){
            sqls.split("[n]").forEach((line: any) => {
                if(line.trim().length>0){
                    sql.push(line);
                }
            });

        }else{
            if (table != "undefined") {
                sql.push("select * from " + table + "  limit 0,100;");
            } else {
                sql.push("");
            }
    
        }
        var fun = function () {
            setTimeout(() => {
                var monaco1 = eval("monaco");
                var editor = monaco1.editor.create(ele, {
                    value:sql.join('\n'),
                    language: 'sql',
                    theme: theme
                });
            }, 1);
        }
        eval("require(['vs/editor/editor.main'],fun);")
    }

});
