const {MongoClient, ObjectID} = require("mongodb");
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
const crypto = require('crypto');

const cookieParser = require("cookie-parser")
const {Get_jungbo,FindUser,postthedata} = require("./new_js/splite")
const viewroot = {root:"./view"}
let postobj={}
let DBObj = {
}
client.connect(async e=>{
    if(e){
        console.error(e)
    }
    console.log('connection_complete!')
    DBObj["db"]=client.db('streamingdata')
    DBObj["Video"]=DBObj["db"].collection("videodata")
     
})
const {Server} = require("socket.io")
const express =require('express');
const app = express();
const filelist=[];
const hls = require("hls-server")
const fs=require('fs');

app.use('/img',express.static('./img'))
app.use(cookieParser())
app.use('/node_modules',express.static('./node_modules'))
app.use(express.raw({limit:'1gb'}))//이거 꼭설정 해야함
app.use(express.json())
app.use("/login",(req,res,next)=>{
    next();
})
app.post("/login",async(req,res)=>{
    console.log(req.body)
    const userobj = await FindUser(req.body.userid)
    console.log(userobj)
    if(!userobj){
        res.send("false")
        return;
    }
    if(userobj.passwords==req.body.passwords){
        res.cookie("id",req.body.userid)
        res.cookie("passwords",req.body.passwords)
        res.cookie("logined","true")
        res.send("good")
        console.log("dfdf")
    }else{
        res.send("false")
    }
})
app.get("/logout",(req,res)=>{
    res.clearCookie('id')
    res.clearCookie("passwords")
    res.clearCookie("logined")
    res.send("Dfdf")
})
app.get("/signin",(req,res)=>{
    res.sendFile("signin.html",viewroot)
})
app.get("/login",(req,res)=>{
    res.sendFile("login.html",viewroot)
})
app.use((req,res,next)=>{
    console.log("Weff",req.cookies)
    if(req.cookies.logined){
        next()
    }else{
        res.redirect("/login")
    }
    
})
app.get("/postid",(req,res)=>{
    const password = JSON.stringify(Math.random()).split(".")[1];
    const hashed = crypto.createHash("sha256").update(password).digest('base64');
    postobj[hashed]=true;
    res.send(hashed)
})
app.get("/userip",(req,res)=>{
    res.send(req.socket.remoteAddress)
    
})
app.get("/post",(req,res)=>{
    
    res.sendFile("post.html",viewroot)
})
app.get("/main",(req,res)=>{
    res.sendFile("mainview.html",viewroot)
})
app.get("/watch",(req,res)=>{
    res.sendFile("watchview.html",viewroot)
})
app.get("/main/filelist",async(req,res)=>{
    res.json(await(await DBObj.Video.find({}).toArray()))
})
app.use("/objget/:filename",async(req,res,next)=>{
    const filename = req.params.filename
    let obj =await Get_jungbo(filename)
    res.json(obj)
    
})
app.use("/objget",async(req,res)=>{
    res.json((await(await DBObj.Video.find({})).toArray()))
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
    
    socket.on('postchat',async e=>{
        let jungbo = (await Get_jungbo(e.id));
        if(jungbo.chat){
            jungbo.chat.push(e.obj);
            console.log("Wer");
        }else{
            console.log('else');
            jungbo.chat=[e.obj];
        }
        console.log(jungbo.chat)
        DBObj.Video.updateOne({_id:ObjectID('6083b180c97a9339404da12d')},{$set:{wer:{"Werrwe":"Werr"}}}); 
        DBObj.Video.updateOne({_id:ObjectID(e.id)},{$set:{chat : jungbo.chat}});
    })
    socket.on("startvideo",async e=>{
        let chatobj = (await Get_jungbo(e)).chat
        socket.emit(e,chatobj)
    })
    
})
function post_func(obj){
    let videod = obj[0];
    let imgd = obj[1]
    let vobjd = obj[2]
    console.log(vobjd)
    postthedata(videod,imgd,vobjd)
}