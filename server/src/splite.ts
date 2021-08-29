import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import mongodb from "mongodb";
import fs from 'fs';
//import {func} from './resoultionget';
import {DBOBJ, POST_DATA_OBJ,PLAYLIST} from './type'
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new mongodb.MongoClient(url, { useUnifiedTopology: true });
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
console.log(ffmpegInstaller.path)
const {ObjectID} = mongodb; 
let DBobj:DBOBJ = {
    Videodata:null,
    DB:null,
    Vu:null,
    Users:null,
    Email:null,
    Broadcasting:null,
    PLAYLIST:null
} 

client.connect(async e=>{
    if(e){
        console.error(e)
    }
    console.log('connection_complete!')
    DBobj.DB=client.db('streamingdata') as mongodb.Db
    DBobj.Videodata=DBobj.DB.collection("videodata") 
    DBobj.Vu=DBobj.DB.collection("videodataup")
    DBobj.Broadcasting = DBobj.DB.collection('broadcasting')
    DBobj.Users=DBobj.DB.collection('userdata')
    DBobj.PLAYLIST = DBobj.DB.collection("playlist")
    search("opop065",50)
})
export const Get_jungbo = async(filename:string)=>{
    const ObjID:mongodb.ObjectID= new ObjectID(filename)
    return await DBobj.Videodata.findOne({_id:ObjID})
}
export const FindUser = async(ID:string) => await DBobj.Users.findOne({ID});
export const splite = async(name:string,d:string)=>{
    await new Promise((res,rej)=>{
        
        ffmpeg('../savefiles/'+name+'.'+d,{timeout:432000}).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 100',//10초 단위임
            '-hls_list_size 0',
            '-f hls'  
        ]).size('30%').output("../videos/"+name+'(30p)'+'.m3u8').on('end',()=>{
            res("end") 
        }).run()   
    })
    await new Promise((res,rej)=>{
        
        ffmpeg('../savefiles/'+name+'.'+d,{timeout:432000}).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 100',//10초 단위임
            '-hls_list_size 0',
            '-f hls'  
        ]).size('70%').output("../videos/"+name+'(70p)'+'.m3u8').on('end',()=>{
            res("end") 
        }).run()   
    })  
    await new Promise((res,rej)=>{
        
        ffmpeg('../savefiles/'+name+'.'+d,{timeout:432000}).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 100',//10초 단위임
            '-hls_list_size 0',
            '-f hls'  
        ]).size('100%').output("../videos/"+name+'(100p)'+'.m3u8').on('end',()=>{
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
            //func(`../savefiles/${file_name}`)
            
            await splite(videoid.toHexString(),typename)
            post_data_obj.views=0;
            console.log("성공")
            let id = (await DBobj.Vu.insertOne(post_data_obj)).insertedId
            await DBobj.Videodata.deleteOne({_id:new ObjectID(videoid)})
            console.log(id)
            await DBobj.Users.updateOne({ID:post_data_obj.ID},{$push:{videolist:videoid.toHexString()}})            
            await DBobj.PLAYLIST.updateOne({ownerID:post_data_obj.ID,NAME:post_data_obj.PLAYLIST},{$push:{videos:videoid}})
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
export async function search(params:string,gasu:number) {
    const efunc = (e:string)=>{
        return `\\${e}`
    }
    const funce = (str:String)=>{
        console.log(str)
        let text = ''
        let first = true
        str.split(" ").forEach(v=>{
            if (first) {
                text="("+v.replace(/[.*+?^${}()|[\]\\]/g,efunc)+")"
                first=false
            }else{
                text=text+"|"+"("+v.replace(/[.*+?^${}()|[\]\\]/g,efunc)+")"
            }
        })
        return new RegExp(`${text}`,'i')
    }
    const texte = funce(params)
    const searchobject:any={
        Users:[],
        Broadcasting:[],
        PLAYLIST:[],
        Videodata:[]
    }
    console.log(texte)
    let d = await DBobj.Users.find({ID:{$regex:texte}}).limit(gasu)
    for await(let er of d){
        searchobject.Users.push(er)
    }
    d=await DBobj.Broadcasting.find({$or:[{host_id:{$regex:texte}},{broadname:{$regex:texte}},{subj:{$regex:texte}}]}).limit(gasu)
    for await(let er of d){
        searchobject.Broadcasting.push(er)
        console.log(er,texte)
    }
    d =await DBobj.PLAYLIST.find({$or:[{NAME:{$regex:texte}},{ownerID:{$regex:texte}}]}).limit(gasu)
    for await(let er of d){
        searchobject.PLAYLIST.push(er)
    }
    d= await DBobj.Vu.find({$or:[{ID:{$regex:texte}},{title:{$regex:texte}},{subj:{$regex:texte}}]}).limit(gasu)
    for await(let er of d){
        searchobject.Videodata.push(er)
    }
    return searchobject
}
module.exports={splite, postthedata,Get_jungbo,FindUser,search} 