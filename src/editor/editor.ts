import { KeyCode, KeyMod } from "monaco-editor";

function newEditor(ele:any,sql:any){
    var fun = function () {
        setTimeout(() => {
            var monaco1 = eval("monaco");
            var editor = monaco1.editor.create(ele, {
                value: sql.join('\n'),
                language: 'sql',
                theme: theme
            });
    
            const myAction = {
                id: "formatsql",
                label: "Format SQL",
                 keybindings: [
                // // eslint-disable-next-line no-bitwise
                // KeyMod.CtrlCmd | KeyCode.Enter, // Ctrl + Enter or Cmd + Enter
                // // eslint-disable-next-line no-bitwise
                2048|1024|42, // Ctrl + R or Cmd + R
                 ],
                run: () => {
                    console.log("sadasda");
                    editor.setValue(eval("vkbeautify").sql(editor.getValue()));
                },
            }
            
            editor.addAction(myAction);
    
    
        }, 1);
    }
    eval("require(['vs/editor/editor.main'],fun);")
}