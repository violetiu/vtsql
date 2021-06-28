export interface ITab{
    key:string;
    title:string;
    color:string;
    type:"tables"|"databases"|"columns"|"editor"|"result"|"welcome"|"message"|"web",
    active:boolean,
    database?:string,
    table?:string,

}