export interface ITab{
    key:string;
    title:string;
    color:string;
    type:ITabType,
    active:boolean,
    database?:string,
    table?:string,

}
export type ITabType="tables"|"databases"|"columns"|"editor"|"result"|"welcome"|"message"|"web";
