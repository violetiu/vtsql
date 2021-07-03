
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


