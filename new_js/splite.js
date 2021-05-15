const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller=require("@ffmpeg-installer/ffmpeg");
const {MongoClient,ObjectID} = require("mongodb");
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
const fs = require('fs');
const { file } = require('jszip');
let dbobj = {}
client.connect(async e=>{
    if(e){
        console.error(e)
    }
    console.log('connection_complete!')
    dbobj["db"]=client.db('streamingdata')
    dbobj["df"]=dbobj["db"].collection("videodata")
    dbobj["users"]=dbobj.db.collection('userdata')
    
})
const Get_jungbo = async(filename)=>await dbobj.df.findOne({_id:ObjectID(filename)});
const FindUser = async(username) => await dbobj.users.findOne({username});
const splite = (name,d)=>{
    return new Promise((res,rej)=>{
        ffmpeg('./savefiles/'+name+'.'+d,{timeout:432000}).addOptions([
            '-profile:v baseline',
            '-level 3.0',
            '-start_number 0',
            '-hls_time 10',//10초 단위임
            '-hls_list_size 0',
            '-f hls'
        ]).output("videos/"+name+'.m3u8').on('end',()=>{
            res("end")
        }).run() 
    })
    
}
function postthedata(vdata,idata,dobj){
    
    return new Promise(async(res,rej)=>{
        let d = async function(){
            console.log(dobj)
            let typename = dobj.typeofv
            let typename2 = dobj.typeofi
            const upobj = await dbobj.df.insertOne(dobj)
            const videoid = upobj.insertedId;
            const file_name=videoid+"."+typename
            const file_name2=videoid+"."+typename2
            await fs.promises.writeFile(`savefiles/${file_name}`, vdata);
            fs.promises.writeFile(`img/${file_name2}`,idata)
            await splite(videoid,typename)
            console.log("성공")
            
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