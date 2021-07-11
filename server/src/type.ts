import {Db,Collection, ObjectID} from 'mongodb'
export interface DBOBJ {
    Videodata:Collection<POST_DATA_OBJ>;
    Vu:Collection;
    Users:Collection;
    DB:Db;
    Email:Collection;
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
}
export interface POST_IV_OBJ{
    name:string
}
export interface PPOBJ{
    chat : any
}