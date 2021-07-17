const isMac = process.platform === 'darwin';
export const Theme = {
    background:"",
    color:"",
    hover:"",
    bar:"",
    isDark:false,

    randomColor(): string {
        var index = Math.floor(Math.random() * Theme.colors.length);
        return Theme.colors[index];
    },
    themeDark():void {
        Theme.isDark=true;
        Theme.background="rgb(30,30,30)";
        Theme.color="rgba(255,255,255,0.7)";
        Theme.hover="rgba(175,175,175,0.2)";
        Theme.bar="#444";

     
    },
    themeLight() :void{
        Theme.isDark=false;
        Theme.background="#fff";
        Theme.color="#444";
        Theme.hover="rgba(175,175,175,0.2)";
        Theme.bar="rgba(240,240,240,0.8)";



    },
    action():void{
        if(!isMac){
            document.body.style.backgroundColor = Theme.background;
            document.getElementById("sidebar").style.backgroundColor = Theme.bar;
        }
    
        document.body.style.color =Theme.color;
     //  
        document.getElementById("titlebar").style.backgroundColor = Theme.background;
        document.getElementById("views").style.backgroundColor = Theme.background;
       // document.getElementById("statusbar").style.backgroundColor = Theme.background;
    },
    load() :void{
        /*判断是否支持主题色*/

        if (window.matchMedia('(prefers-color-scheme)').media === 'not all') {
            alert('Browser doesn\'t support dark mode');
        }

        /*判断是否处于深色模式*/
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            Theme.themeDark();
        }

        /*判断是否处于浅色模式*/
        if (window.matchMedia('(prefers-color-scheme: light)').matches) {
            Theme.themeLight();
        }
        Theme.action();

        /*模式切换听器*/
        var listeners = {
            dark: function (mediaQueryList: any) {
                if (mediaQueryList.matches) {
                    //Do some thing
                    Theme.themeDark();
                    Theme.action();
                }
            },
            light: function (mediaQueryList: any) {
                if (mediaQueryList.matches) {
                    //Do some thing
                    Theme.themeLight();
                    Theme.action();
                }
            }
        }
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener("change", listeners.dark);
        window.matchMedia('(prefers-color-scheme: light)').addEventListener("change", listeners.light);

    },
    colors: ["#2ec7c9",
        "#b6a2de",
        "#5ab1ef",
        "#ffb980",
        "#d87a80",
        "#8d98b3",
        "#e5cf0d",
        "#97b552",
        "#95706d",
        "#dc69aa",
        "#07a2a4",
        "#9a7fd1",
        "#588dd5",
        "#f5994e",
        "#c05050",
        "#59678c",
        "#c9ab00",
        "#7eb00a",
        "#6f5553",
        "#c14089", "#516b91",
        "#59c4e6",
        "#edafda",
        "#93b7e3",
        "#a5e7f0",
        "#cbb0e3", "#4ea397",
        "#22c3aa",
        "#7bd9a5",
        "#d0648a",
        "#f58db2",
        "#f2b3c9"]

}