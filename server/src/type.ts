import {Db,Collection, ObjectID} from 'mongodb'
export interface DBOBJ {
    Videodata:Collection<POST_DATA_OBJ>;
    Vu:Collection;
    Users:Collection;
    DB:Db;
    Email:Collection;
    Broadcasting:Collection;
}
export interface broadcastobj{
    host_id:string;
    clientsid:Array<string>;
    views:number;
    Rooms_ID:string;
}
export interface POST_DATA_OBJ{
    user:string;
    typeofv : string;
    typeofi : string;
    timestparr:string;
    chat:Array<any>;
    ip:string;
    views:number
    subj:string;
    _id:ObjectID;
    username:string;
    title :string;
}
export interface POST_IV_OBJ{
    name:string
}
export interface Chat_Obj{
    text:string;
    user:string;
    time:string;
}
export interface PPOBJ{
    chat : any
}