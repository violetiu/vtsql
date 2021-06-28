export const Theme = {
    randomColor(): string {
        var index = Math.floor(Math.random() * Theme.colors.length);
        return Theme.colors[index];
    },
    themeHoverColor : "#fff",
    themeDark():void {
        document.body.style.backgroundColor = "rgb(30,30,30)";
        document.body.style.color = "rgba(255,255,255,0.7)";
        document.getElementById("sidebar").style.backgroundColor = "#444";

    },
    themeLight() :void{
        document.body.style.backgroundColor = "#fff";
        document.body.style.color = "#444";
        document.getElementById("sidebar").style.backgroundColor = "#f3f3f3";

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


        /*模式切换听器*/
        var listeners = {
            dark: function (mediaQueryList: any) {
                if (mediaQueryList.matches) {
                    //Do some thing
                    Theme.themeDark();
                }
            },
            light: function (mediaQueryList: any) {
                if (mediaQueryList.matches) {
                    //Do some thing
                    Theme.themeLight();
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