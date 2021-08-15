import {Db,Collection, ObjectID} from 'mongodb'
export interface DBOBJ {
    Videodata:Collection<POST_DATA_OBJ>;
    Vu:Collection;
    Users:Collection;
    DB:Db;
    Email:Collection;
    Broadcasting:Collection;
    PLAYLIST:Collection;
}
export interface broadcastobj{
    host_id:string;
    clientsid:Array<string>;
    views:number;
    Rooms_ID:string;
    broadname:string;
    info:string;
    subj : string;
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
    ID:string;
    title :string;
    PLAYLIST:string;
}
export interface POST_IV_OBJ{
    name:string
}
export interface Chat_Obj{
    text:string;
    user:string;
    time:string;
}
export interface USEROBJ{
    ID : "string"

}
export interface PPOBJ{
    chat : any
}
export interface PLAYLIST{
    NAME:string;
    videos:Array<string>;
    ownerID:string;
    USERS:Array<string>
}