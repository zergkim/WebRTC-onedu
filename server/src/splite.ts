import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import mongodb from "mongodb";
import fs from 'fs';
import {DBOBJ, POST_DATA_OBJ} from './type'
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(url, { useUnifiedTopology: true });
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
const {ObjectID} = mongodb;
let DBobj:DBOBJ = {
    Videodata:null,
    DB:null,
    Vu:null,
    Users:null,
    Email:null,
    Broadcasting:null
}

client.connect(async e=>{
    if(e){
        console.error(e)
    }
    console.log('connection_complete!')
    DBobj.DB=client.db('streamingdata') as mongodb.Db
    DBobj.Videodata=DBobj.DB.collection("videodata") 
    DBobj.Vu=DBobj.DB.collection("videodataup")
    DBobj.Users=DBobj.DB.collection('userdata')
    
})
export const Get_jungbo = async(filename:string)=>{
    const ObjID:mongodb.ObjectID= new ObjectID(filename)
    return await DBobj.Videodata.findOne({_id:ObjID})
}
export const FindUser = async(username:string) => await DBobj.Users.findOne({username});
export const splite = (name:string,d:string)=>{
    return new Promise((res,rej)=>{
        ffmpeg('../savefiles/'+name+'.'+d,{timeout:432000}).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 100',//10초 단위임
            '-hls_list_size 0',
            '-f hls'
        ]).output("../videos/"+name+'.m3u8').on('end',()=>{
            res("end")
        }).run() 
    })
    
}
export function postthedata(vdata:Buffer,idata:Buffer,post_data_obj:POST_DATA_OBJ){
    
    return new Promise(async(res,rej)=>{
        let d = async function(){
            console.log(post_data_obj)
            let typename = post_data_obj.typeofv
            let typename2 = post_data_obj.typeofi
            const upobj = await DBobj.Videodata.insertOne(post_data_obj)
            const videoid = upobj.insertedId;
            const file_name=videoid+"."+typename
            const file_name2=videoid+"."+typename2
            await fs.promises.writeFile(`../savefiles/${file_name}`, vdata);
            await fs.promises.writeFile(`../img/${file_name2}`,idata)
            await splite(videoid.toHexString(),typename)
            post_data_obj.views=0;
            console.log("성공")
            let id = await DBobj.Vu.insertOne(post_data_obj)
            console.log(id.insertedId, videoid)
            await DBobj.Videodata.deleteOne({_id:new ObjectID(videoid)})
            console.log(post_data_obj.username)
            await DBobj.Users.updateOne({"username":post_data_obj.username},{$push:{videolist:videoid.toHexString()}})
            await fs.promises.unlink(`../savefiles/${file_name}`);
            res("성공")
        }
        try{
            d()
        }catch(e){
            console.log("실패")
            rej("실패")
        }
        
        
    })
}
module.exports={splite, postthedata,Get_jungbo,FindUser}