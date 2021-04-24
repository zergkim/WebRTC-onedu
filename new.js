const {MongoClient} = require("mongodb");
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
const crypto = require('crypto');
const idar= []
const {splite}=require("./new_js/splite")
const {postthedata}=require("./new_js/splite")
let postobj={}
let dbobj = {
}
client.connect(async e=>{
    if(e){
        console.error(e)
    }
    console.log('connection_complete!')
    dbobj["db"]=client.db('streamingdata')
    dbobj["df"]=dbobj["db"].collection("videodata")
    
})
const {Server} = require("socket.io")
const express =require('express');
const app = express();
const filelist=[];
const juso = "mongodb+srv://zergkim:<password>@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const hls = require("hls-server")
const fs=require('fs');


app.use('/img',express.static('./img'))
app.use('/node_modules',express.static('./node_modules'))
app.use(express.raw({limit:'1gb'}))//이거 꼭설정 해야함
app.use(express.json())
app.get("/postid",(req,res)=>{
    const password = JSON.stringify(Math.random()).split(".")[1];
    const secret = 'kopqqqwi!!';

    const hashed = crypto.createHmac('sha256', secret).update(password).digest('hex');
    postobj[hashed]=true;
    res.send(hashed)
})
app.get("/userip",(req,res)=>{
    res.send(req.socket.remoteAddress)
})
app.get("/post",(req,res)=>{
    
    res.sendFile("post.html",{root:"./view"})
})
app.get("/main",(req,res)=>{
    res.sendFile("mainview.html",{root:"./view"})
})
app.get("/watch",(req,res)=>{
    res.sendFile("watchview.html",{root:"./view"})
})
app.get("/main/filelist",async(req,res)=>{
    res.json(await dbobj.df.find({}).toArray())
})

app.post("/videopost",async(req,res)=>{
    
    const obj = req.query
    console.log("erwre")
    if(!postobj[obj.name]){
        console.log("노답qffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff")
        res.send("요청이 잘못되었습니다")
    }
    console.log("hi")
    postobj[obj.name]=new Array()
    postobj[obj.name].push(req.body)
    
    console.log(req.query.name)
    res.send("ok")
})
app.post("/imgpost",async(req,res)=>{
    const obj = req.query
    if(!postobj[obj.name]){
        res.send("요청이 잘못되었습니다")
    }
    postobj[obj.name].push(req.body)
    console.log(req.query.name)
    console.log("fwef:",postobj[obj.name])
    res.send("ok")
})
app.post("/objpost",async(req,res)=>{
    let obj = req.body
    obj.ip = req.socket.remoteAddress
    const nameqe = req.query.name
    console.log("df:",postobj[nameqe])
    if(!postobj[nameqe]){
        res.send("요청이 잘못되었습니다")
    }
    postobj[nameqe].push(obj)
    console.log("\n",postobj[nameqe])
    
    await post_func(postobj[nameqe])
    delete postobj[nameqe];
    res.send("good")
    
})
const server= app.listen(3000,async()=>{
    let impsy = await fs.promises.readdir("./savefiles")
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
const io = new Server(server)
let infoarr=[];
io.on("connection",socket =>{
    socket.on('postvideo',e=>{
        infoarr.push(e)
    })
    socket.on('postimg',e=>{
        infoarr.push(e)
    })
    socket.on('postobj', async e=>{
        infoarr.push(e)
        console.log(infoarr)
        await postthedata(infoarr)
        
        infoarr=[]
    })
    
})
function post_func(obj){
    let videod = obj[0];
    let imgd = obj[1]
    let vobjd = obj[2]
    console.log(vobjd)
    postthedata(videod,imgd,vobjd)
}

