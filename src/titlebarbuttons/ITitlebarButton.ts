import { ITabType } from "../ITab";

export interface ITitlebarButton{
    id:string;
    title:string;
    svg:string;
    tabs:ITabType[];
    align:"start"|"end";
    action():void;
    selected?:boolean;
}
