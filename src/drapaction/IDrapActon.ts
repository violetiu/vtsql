import { ITabType } from "../ITab";

export interface IDrapActon{
    id:string;
    title:string;
    svg:string;
    tabs:ITabType[];
    action(data:any):void;
}
