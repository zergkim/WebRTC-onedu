
const express =require('express');
const app = express();
const filelist=[];

const juso = "mongodb+srv://zergkim:<password>@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const hls = require("hls-server")
const fs=require('fs');


const ffmpeg = require('fluent-ffmpeg');
const ffmpegInstaller=require("@ffmpeg-installer/ffmpeg")
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
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
app.use('/img',express.static(__dirname+'/img'))
app.use(express.raw({limit:'1gb'}))//이거 꼭설정 해야함
app.use(express.json())
app.get("/main",(req,res)=>{
    res.sendFile("mainview.html",{root:"./view"})
})
app.get("/watch",(req,res)=>{
    res.sendFile("watchview.html",{root:"./view"})
})
app.get("/main/filelist",(req,res)=>{
    res.send(filelist)
})
app.post("/test",async(req,res)=>{
    console.log(req.query)
    if(fs.existsSync('savefiles/'+req.query.name)){
        
        
        
    }
    req.query.name=req.query.name.replace(/\s/gi,'_')
    await fs.writeFileSync('savefiles/'+req.query.name,req.body)
    let name = req.query.name.split('.')
    let d = name.pop()
    name = name.join("")
    await splite(name,d)
    console.log("성공!!")
    
    filelist.push(name)
    
    
    
    res.send("good")
})
const server= app.listen(3000,()=>{
    let impsy = [...fs.readdirSync("./savefiles")]
    impsy.forEach(e=>{
        e=e.split(".")
        e.pop()
        e=e.join('')
        filelist.push(e)
    })
    console.log(filelist)
})
new hls(server,{
    provider:{
        exists:(req,cb)=>{
            const ext = req.url.split('.').pop()
            if(ext!=='m3u8'&&ext!=='ts'){
                return cb(null,true)
            }
            fs.access(__dirname+req.url,fs.constants.F_OK,(e)=>{
                if(e){
                    console.log("err")
                    return cb(null,false)
                }
                cb(null,true)
            })
        },
        getManifestStream:(req,cb)=>{
            const stream =fs.createReadStream(__dirname+req.url);
            cb(null,stream)
        },
        getSegmentStream:(req,cb)=>{
            const stream = fs.createReadStream(__dirname+req.url)
            cb(null,stream)
        }
    }   
})