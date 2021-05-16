const {MongoClient, ObjectID} = require("mongodb");
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
const crypto = require('crypto');
const {send_mail} = require("./new_js/emil")
const cookieParser = require("cookie-parser")
const {Get_jungbo,FindUser,postthedata} = require("./new_js/splite")
const viewroot = {root:"./view"}
let postobj={}
let DBObj = {
}
client.connect(async e=>{
    if(e){
        
    }
    console.log('connection_complete!')
    DBObj["db"]=client.db('streamingdata')
    DBObj["Video"]=DBObj["db"].collection("videodata")
    DBObj["email"]=DBObj["db"].collection("email")
    DBObj["Userdata"]=DBObj.db.collection("userdata")
    send_mail("sanhaekim06@naver.com","wrefe")
    
})
const {Server} = require("socket.io")
const express =require('express');
const app = express();
const filelist=[];
const hls = require("hls-server")
const fs=require('fs');
const { S_IFCHR } = require("constants");
const e = require("express");
app.use('/img',express.static('./img'))
app.use(cookieParser())
app.use('/node_modules',express.static('./node_modules'))
app.use(express.raw({limit:'1gb'}))//이거 꼭설정 해야함
app.use(express.json())
const loginedfunc =(req,res,next)=>{
    if(req.cookies.logined){
        res.redirect("/main")
        return;
    }
    next();
}
app.use("/login",loginedfunc)
app.use("/signin",loginedfunc)
app.post("/id_unique",async(req,res)=>{
    if(DBObj.Userdata.findOne({username:req.body})){
        res.send("")
    }else res.send("좋아요");
})
app.post("/email_send",async(req,res)=>{
    
    const number = JSON.stringify(Math.floor(Math.random()*1000000));
    
    try{
        console.log(req.body.email)
        const info = await DBObj.Userdata.findOne({email:req.body.email})
        if(info){
            
            throw new Error("이미 이메일 주인이 있음")
        }
        await DBObj.email.insertOne({date:new Date(),EmailAdr:req.body.email,number})
    }catch(e){
        
        res.send("")
        return;
    }
    
    
    send_mail(req.body.email,number)
    res.send("성공")
    
})
app.post("/certpost",async(req,res)=>{
    
    let d = await DBObj.email.findOne(req.body)
    
    if(d)
    {
        res.send("성공")
        
        DBObj.email.deleteOne(req.body)
    }
    else res.send("");
})
app.post("/signinconfirm",async(req,res)=>{
    
    req.body.passwords=crypto.createHash("sha256").update(req.body.passwords).digest('base64');
    try{
        const upobj = await DBObj.Userdata.insertOne(req.body)
    }catch (e){
        res.send("")
        return;
    }
    res.send("성공")
})
app.post("/login",async(req,res)=>{
    
    const userobj = await FindUser(req.body.userid)
   
    if(!userobj){
        res.send("falseid")
        return;
    }
    if(userobj.passwords==crypto.createHash("sha256").update(req.body.passwords).digest('base64')){
        res.cookie("id",req.body.userid)
        res.cookie("passwords",req.body.passwords)
        res.cookie("logined","true")
        
        res.send("good")
        
    }else{
        res.send("falsepassword")
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
    
    if(req.cookies.logined){
        next()
    }else{
        res.redirect("/login")
    }
    
})
app.get("/",(req,res)=>[
    res.redirect("/main")
])
app.get("/postid",(req,res)=>{
    const password = JSON.stringify(Math.random()).split(".")[1];
    const hashed = crypto.createHash("sha256").update(password).digest('base64');
    postobj[hashed]=true;
    res.send(hashed)
})
app.get("/userip",(req,res)=>{
    res.send(req.socket.remoteAddress)
    
})
app.get("/werr",async(req,res)=>{
    
    res.send(await Get_jungbo('608505c3ab56100b7cf12dd7'))
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


app.use("/objget",async(req,res)=>{
    res.json((await(await DBObj.Video.find({})).toArray()))
})

app.post("/videopost",async(req,res)=>{
    
    const obj = req.query
    
    if(!postobj[obj.name]){
        
        res.send("요청이 잘못되었습니다")
    }
    
    postobj[obj.name]=new Array()
    postobj[obj.name].push(req.body)
    
    res.send("ok")
})
app.post("/imgpost",async(req,res)=>{
    const obj = req.query
    if(!postobj[obj.name]){
        res.send("요청이 잘못되었습니다")
    }
    postobj[obj.name].push(req.body)
    
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
   
    
    await post_func(postobj[nameqe])
    delete postobj[nameqe];
    res.send("good")
    
})
app.use("/chat/:filename",async(req,res,next)=>{
    
    try{
        const filename = req.params.filename
        let djk= (await Get_jungbo(filename)).chat
        
        res.json(djk)
    }catch(e){
        console.log("err")
    }
    
    
})
const server= app.listen(3000,async()=>{
    let impsy = await fs.promises.readdir("./savefiles")
    impsy.forEach(e=>{
        e=e.split(".")
        e.pop()
        e=e.join('')
        filelist.push(e)
    })
    
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
    let socketid;
    socket.on('startchat',e=>{
        console.log(e)
        socket.join(e)
        socketid = e
    })
    
    
    socket.on('postchat',async e=>{
        
        let jungbo = await DBObj.Video.findOne({_id:ObjectID(e.id)});
        
        if(jungbo.chat){
            if(jungbo.chat[e.time]){
                jungbo.chat[e.time].push(e.obj)
                console.log("이벤트 실행!!")
                socket.to(socketid).emit(socketid,e.obj)
            }else{
                jungbo.chat[e.time]=[e.obj]
            }
            
        }
        
        DBObj.Video.updateOne({_id:ObjectID(e.id)},{$set:{chat : jungbo.chat}});
    })
    /*socket.on("startvideo",async e=>{
        let chatobj = (await Get_jungbo(e)).chat
        socket.emit(e,chatobj)
    })*/
    
})
function post_func(obj){
    let videod = obj[0];
    let imgd = obj[1]
    let vobjd = obj[2]
    postthedata(videod,imgd,vobjd)
}