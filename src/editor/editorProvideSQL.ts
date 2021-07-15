
var load = ()=> {
    setTimeout(() => {
        var monaco1 = eval("monaco");
   
        var sqlKeys = [
            "show databases;",
            "use",
            "select",
            "drop",
            "show tables;",
            "show processlist;",
            "kill",
            "select user,host from mysql.user; ",
            "reset master;",
            "select version();",
            "insert into () values();",
            "desc",
            "comment ''",
            "limit 0,10",
            "DISTINCT()",
            "CONCAT(,)",
            "ifnull(,)",
            "between and ",
            "in()",
            "is null",
            "is not null",
            "order by",
            "group by",
            "length()",
            "upper()",
            "lower()",
            "substr(,,)",
            "subString(,,)",
            "instr(,)",
            "trim()",
            "replace(,,,)",
            "round()",
            "ceil()",
            "floor()",
            "truncate",
            "now()",
            "curdate()",
            "curtime()",
            "year()",
            "month()",
            "str_to_data(,)",
            "data_format(,)",
            "varchar(64)",
            "double()",
            "int()",
            "alter table ",
            "PRIMARY KEY()",
            "not null",
            "like",
            "column",
            "table",



        ];

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
                return {
                    suggestions: JSON.parse(JSON.stringify(suggestions))
                };
            }
        });
    }, 1);
}
eval("require(['vs/editor/editor.main'],load);")