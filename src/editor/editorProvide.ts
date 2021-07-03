function loadEditorSuggestions(suggestions:any){
    var fun = function () {
        setTimeout(() => {
            var monaco1 = eval("monaco");
            monaco1.languages.registerCompletionItemProvider('sql', {
                provideCompletionItems: (model: any, position: any, context: any, token: any) => {           
                    return {
                        suggestions: JSON.parse(JSON.stringify(suggestions))
                    };
                }
            });
        }, 1);
    }
    eval("require(['vs/editor/editor.main'],fun);")
}