import { Cursor, Db, MongoClient,ObjectID } from "mongodb";
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
import { Chat_Obj, DBOBJ,POST_DATA_OBJ,POST_IV_OBJ, PLAYLIST} from "./type";
const client = new MongoClient(url, { useUnifiedTopology: true });
import crypto from "crypto";
import {v4 as uuidV4} from 'uuid';
import { webrtcfunc } from "./server";
import { send_mail } from "./emil";
import cookieParser from "cookie-parser";
import {Get_jungbo,FindUser,postthedata,search} from "./splite";
import path from 'path';
const viewroot = {root:'C:/Users/zergk/Desktop/git_project/dproject/front/dist'}
console.log("sex")
let postobj:any={}
let DBObj:DBOBJ = {
    Videodata:null,
    Vu: null,
    Users:null,
    DB:null,
    Email:null,
    Broadcasting:null,
    PLAYLIST:null
}
client.connect(async e=>{
    if(e){
        
    }
    console.log('connection_complete!')
    DBObj.DB=client.db('streamingdata')
    DBObj.Videodata=DBObj.DB.collection("videodataup")
    DBObj.Email=DBObj.DB.collection("email")
    DBObj.Users=DBObj.DB.collection("userdata")
    DBObj.Vu = DBObj.DB.collection("videodataup")
    DBObj.PLAYLIST = DBObj.DB.collection('playlist');
    DBObj.Broadcasting = DBObj.DB.collection('broadcasting')
    
})
import { Server, Socket } from "socket.io";
import express, { json } from 'express';
const app = express();
const filelist=[];
const front = path.resolve(__dirname, '..', '..', 'front');
// import hls from 'hls-server';
import fs from 'fs/promises';
import { remove } from "jszip";
import e from "express";
app.use(express.text())
app.use(cookieParser())
app.use('/node_modules',express.static('../node_modules'))
app.use(express.raw({limit:'1gb'}))//이거 꼭설정 해야함
app.use(express.json());
app.use('/img',express.static('../img'))
app.use('/videos',express.static("../videos"))
app.get('/search',async(req,res)=>{
    const searche = req.query.search as unknown as string
    res.send(await search(searche,5))
})
app.get("/", async(req,res)=>{
    let resultPath = ""
    if(req.cookies.id){
        resultPath = path.resolve(front, `./dist/logined/mainview.html`) 
        
    }else{
        resultPath = path.resolve(front, `./dist/login.html`) 
    }
    res.sendFile(resultPath)
})
app.use('/', async (req, res, next) => {
    
    if(req.query.view){ 
        req.url = req.url.split("?")[0]
    }
    let resultPath = '';
    
    if(!req.cookies.logined){
        if(req.method=="POST"&&(req.url==="/login"||req.url=="/email_send"||req.url.indexOf("/id_unique")>-1||req.url=="/certpost"||req.url.indexOf("/signinconfirm")>-1||req.url=='/broadcasting')){
            next()
            console.log(req.url)
            return;
            
        }
        if(path.basename(req.url).indexOf('.') === -1){
            resultPath = path.resolve(front, `./dist${req.url}.html`) 
        } else {
            resultPath = path.resolve(front, `./dist${req.url}`);
        }
        try{
            await fs.access(resultPath)
            res.sendFile(resultPath)
        }catch(e){
            res.send("error")
        }
        return;
    }else if(req.method=="POST"){
        next()
        return; 
    }
    else{
        if(req.url=="/logout"||req.url=="/viewlist"||req.url.indexOf("getuserlist")>-1||req.url.indexOf("getvideoinfo")>-1||req.url.indexOf('getuserid')>-1||req.url=="/getlplaylist"||req.url.indexOf("/broadcasting")>-1||req.url=="/userlistvideolist"||req.url=="/getsubuserlist"||req.url=="/topvideolist"){
            try{
               next()
               console.log(req.url)
            }catch(e){
                res.send("")
            }
            return;
        }
        console.log(path.basename(req.url))
        if(path.basename(req.url).indexOf("js")>-1){
            resultPath = path.resolve(front, `./dist/${req.url}`,)
             
        }
        else if(path.basename(req.url).indexOf('.') === -1){
            resultPath = path.resolve(front, `./dist/logined${req.url}.html`)
        } 
        else {
            resultPath = path.resolve(front, `./dist/logined${req.url}`);
        }
        if(path.basename(req.url).split(".")[0]=="watchview"){
            const diew = req.query.view as string
            if(diew){
                
                DBObj.Videodata.updateOne({_id: new ObjectID(diew)},{$inc:{views:+1}})

            }
        }
        try{
            await fs.access(resultPath);
            res.sendFile(resultPath)
        }catch(e){
            res.send("error")
        } 
        return;
    }
    
});

const loginedfunc =(req:any,res:any,next:Function)=>{
    if(req.cookies.logined){
        res.redirect("/main")
        return;
    }
    next();
}



app.use("/login",loginedfunc)
app.use("/signin",loginedfunc)

app.post("/id_unique",async(req,res)=>{
    console.log("Er")
    if(await DBObj.Users.findOne({ID:req.body})){
        res.send("")
        console.log("weree")
        
    }else {
        res.send("좋아요")
        console.log("good")
    };
})
app.post("/email_send",async(req,res)=>{
    console.log("werewrer")
    const number = JSON.stringify(Math.floor(Math.random()*1000000));
    
    try{
        console.log(req.body.email)
        const info = await DBObj.Users.findOne({email:req.body.email})
        if(info){
            throw new Error("이미 이메일 주인이 있음")
        }
        await DBObj.Email.insertOne({date:new Date(),EmailAdr:req.body.email,number})
    }catch(e){
        
        res.send("")
        return;
    }
    
    console.log(req.body.email,number)
    send_mail(req.body.email,number)
    res.send("성공")
    
})
app.post("/certpost",async(req,res)=>{
    
    let d = await DBObj.Email.findOne(req.body)
    
    if(d)
    {
        res.send("성공")
        
        DBObj.Email.deleteOne(req.body)
        return;
    }
    else res.send("");
})
app.post("/signinconfirm",async(req,res)=>{
    
    req.body.passwords=crypto.createHash("sha256").update(req.body.passwords).digest('base64');
    try{
        const upobj = await DBObj.Users.insertOne(req.body)
    }catch (e){
        res.send("")
        return;
    }
    res.send("성공")
})
app.post("/lplaylistvideolist",async(req,res)=>{
    const videolist = (await DBObj.PLAYLIST.findOne({NAME:req.body.name})).videos
    res.json(videolist)
})
app.post("/userlistvideolist",async(req,res)=>{
    const videolist = (await DBObj.Users.findOne({ID:req.body.name})).videolist
    res.json(videolist)
})
app.post("/login",async(req,res)=>{
    
    const userobj = await FindUser(req.body.userid)
   
    if(!userobj){
        res.send("falseid")
        return;
    }
    if(userobj.passwords==crypto.createHash("sha256").update(req.body.passwords).digest('base64')){
        res.cookie("id",req.body.userid)
        res.cookie("passwords",crypto.createHash("sha256").update(req.body.passwords).digest('base64'))
        res.cookie("logined","true")
        
        res.send("good")
        
    }else{
        res.send("falsepassword")
    }
})

app.get("/logout",(req,res)=>{
    try{
        res.clearCookie('id')
        res.clearCookie("passwords")
        res.clearCookie("logined")
        res.redirect("/login")
    }
    catch(e){
        res.send("")
    }
    
}) 
app.get('/getuserid',async(req,res)=>{
    console.log(req.cookies.id)
    res.send(req.cookies.id)
})
app.get("/getlplaylist",async(req,res)=>{
    const list = (await DBObj.Users.findOne({ID:req.cookies.id})).subplaylist
    res.json(list)
})
app.get('/getsubuserlist',async(req,res)=>{
    const list =  (await DBObj.Users.findOne({ID:req.cookies.id})).subuserlist
    res.json(list)
})
app.get('/broadcasting',async(req,res)=>{
    let letv:Cursor;
    if (!req.query.e) {
        letv = await DBObj.Broadcasting.find({}).limit(10)
    }else{
        letv = await DBObj.Broadcasting.find({$or:[{host_id:req.query.e},{broadname:req.query.e}]}).limit(10)
    }
    
    const arr:Array<any> = [];
    for await(let i of letv){
        arr.push(i)
    }
    res.json(arr) 
})
app.get('/viewlist',async(req,res)=>{
    let dd =  await DBObj.Videodata.find().limit(30).sort({views:-1});
    let List_Arr:Array<object>=[]
    for await(let i of dd){
        List_Arr.push(i)
    }
    res.json(List_Arr)
})
app.get('/getvideoinfo',async(req,res)=>{
    const text : string = req.query.id as string
    console.log(text)
    let obj:any  = await DBObj.Videodata.findOne({"_id":new ObjectID(text)})
    console.log(obj)
    //obj = {vname:obj.title,typeofi : obj.typeofi,ID: obj.ID,subj : obj.subj,views:obj.views}
    res.json(obj)
})
app.get("/getuserlist",async (req,res)=>{
    const text = req.cookies.id as string
    console.log(text)
    const obj = await DBObj.Users.findOne({ID:text})
    console.log(obj,text)
    res.json(obj) 
    console.log("Er")
})
app.get("/topvideolist",async(req,res)=>{
    const obj = await DBObj.Vu.find({}).sort({views:-1}).limit(10)
    const array=[]
    for await(let i of obj){
        array.push(i._id)
    }
    console.log(array)
    res.json(array)
})
app.get("/login",(req,res)=>{
    res.sendFile("login.html",viewroot)
})

app.post("/sub",async(req,res)=>{
    console.log("were")
    if (req.query.suj !== "user") {
        console.log("Wer")
        console.log(req.body.ifsub==false)
        if(req.body.ifsub){
            await DBObj.Users.updateOne({ID:req.cookies.id},{$push:{subplaylist:req.body.text}})
        }else{
            await DBObj.Users.updateOne({ID:req.cookies.id},{$pull:{subplaylist:req.body.text}})
           
        }
    }
    else if (req.query.suj == "user") {
        console.log("Wer")
        console.log(req.body.ifsub==false)
        if(req.body.ifsub){
            await DBObj.Users.updateOne({ID:req.cookies.id},{$push:{subuserlist:req.body.text}})
        }else{
            await DBObj.Users.updateOne({ID:req.cookies.id},{$pull:{subuserlist:req.body.text}})
           
        }
    }
    res.send("true")
})
app.use('/webscript/:filename',(req,res,next)=>{
    const splited:Array<string> = req.params.filename.split(".")
    const splitedst = splited[splited.length-1]
    if(splitedst!=='js'){
        res.send("")
        return;
    }else{
        next()
    }
})
app.use('/webscript',express.static('C:/Users/zergk/Desktop/git_project/dproject/front/dist'))
app.post('/playlistget',async(req,res)=>{
    console.log(req.body.ID)
    const obj:any = await DBObj.PLAYLIST.find({ownerID:req.body.ID});
    const arr : Array<object>=[];

    for await(let i of obj){
        arr.push(i)
    }
    res.json(arr)
})
app.post('/playlistpost',async(req,res)=>{
    try{
        const obj:PLAYLIST = {
            NAME:req.body.name,
            videos:[],
            ownerID:req.body.id,
            USERS:[]
        }
        await DBObj.PLAYLIST.insertOne(obj)
        res.send("성공")
    }catch(e){
        res.send("실패")
    }
})
app.post("/postid",(req,res)=>{
    const password = JSON.stringify(Math.random()).split(".")[1];
    const hashed = crypto.createHash("sha256").update(password).digest('base64');
    postobj[hashed]=true;
    console.log(hashed)
    res.send(hashed)
})

app.post("/videopost",async(req,res)=>{
    
    const obj:POST_IV_OBJ = req.query as unknown as POST_IV_OBJ;
    
   
    
    postobj[obj.name]=[]
    postobj[obj.name].push(req.body)
    
    res.send("ok")
})
app.post("/imgpost",async(req,res)=>{
    const obj:POST_IV_OBJ = req.query as unknown as POST_IV_OBJ;
    if(!postobj[obj.name]){
        res.send("요청이 잘못되었습니다")
        return;
    }
    postobj[obj.name].push(req.body)
    
    res.send("ok")
})
app.post("/objpost",async(req,res)=>{
    let obj:POST_DATA_OBJ = req.body
    obj.ip = req.socket.remoteAddress
    obj.ID=req.cookies.id
    const Qobj = req.query as unknown as POST_IV_OBJ
    const nameqe:string = Qobj.name
    
    if(!postobj[nameqe]){
        res.send("요청이 잘못되었습니다")
        return;
    }
    postobj[nameqe].push(obj) 
    
    if(await post_func(postobj[nameqe])){
        res.send("true")
    }
    delete postobj[nameqe];
    
    
})

const server= app.listen(3000,async()=>{
    let impsy = await fs.readdir(path.resolve(__dirname, '..', 'savefiles'))
    impsy.forEach((e:string)=>{
        let earr:Array<any>=[];
        earr=e.split(".")
        earr.pop()
        e=earr.join('')
        filelist.push(e)
    })
    
})
// new hls(server,{
//     provider:{
//         exists:(req:any,cb:any)=>{
//             const ext = req.url.split('.').pop()
//             if(ext!=='m3u8'&&ext!=='ts'){
//                 return cb(null,true)
//             }
//             fs.access(__dirname+req.url,fs.constants.F_OK,(e)=>{
//                 if(e){
//                     console.log("err")
//                     return cb(null,false)
//                 }
//                 cb(null,true)
//             })
//         },
//         getManifestStream:(req:any,cb:any)=>{
//             const stream =fs.createReadStream(__dirname+req.url);
//             cb(null,stream)
//         },
//         getSegmentStream:(req:any,cb:any)=>{
//             const stream = fs.createReadStream(__dirname+req.url)
//             cb(null,stream)
//         }
//     }   
// })
const io = new Server(server)
let infoarr=[];
io.of("/wrtc").on("connection",webrtcfunc)
io.of("/wrtc").setMaxListeners(2000)
io.of("/chat").on("connection",(socket)=>{
    console.log("se")
    let serverid:string;
    socket.on("joinchat",(e:string)=>{
        serverid = e
        socket.join(e)
        console.log(e ,"ewre") 
    })
    socket.on('sendchat',(e:Chat_Obj)=>{
        socket.to(serverid).emit("sendchat",e)
    })
})
io.on("connection",socket =>{
    let socketid:any;
    socket.on('startchat',e=>{
        //console.log(e)
        socket.join(e)
        socketid = e
    })
    socket.on("takepoststart",async v=>{
        console.log("dj")
        const postarr:Array<Buffer> = [];
        let postimg:string;
        const Nick = uuidV4();
        socket.emit("id",Nick)
        await fs.writeFile(`../buffer/${Nick}.webm`,Buffer.from(""))
        socket.on("takepost",async e=>{
            console.log("werr")
            postarr.push(e)
            await fs.appendFile(`../buffer/${Nick}.webm`,e)
        })
        socket.on("takehw",e=>{
            postimg=e
        })
        socket.on("takeend",async e=>{
            
            
            await fs.writeFile(`../buffer/${Nick}.${postimg}`,e)
            //console.log(postvid,'\n',postimg) 
        })
        socket.on("takeobj",async e=>{
            post_func([await fs.readFile(`../buffer/${Nick}.webm`),await fs.readFile(`../buffer/${Nick}.${postimg}`),e])
            socket.disconnect()
        })
    })
    
    socket.on('postchat',async e=>{
        
        let jungbo = await DBObj.Videodata.findOne({_id:new ObjectID(e.id)});
        
        if(jungbo.chat){
            if(jungbo.chat[e.time]){
                jungbo.chat[e.time].push(e.obj)
                console.log("이벤트 실행!!")
                socket.to(socketid).emit(socketid,e.obj)
            }else{
                jungbo.chat[e.time]=[e.obj]
            }
            
        }
        
        DBObj.Videodata.updateOne({_id:new ObjectID(e.id)},{$set:{chat : jungbo.chat}});
    })
    /*socket.on("startvideo",async e=>{
        let chatobj = (await Get_jungbo(e)).chat
        socket.emit(e,chatobj)
    })*/
    
})
async function post_func(obj:Array<any|File>){
    console.log("werer")
    let videod = obj[0];
    let imgd = obj[1]
    let vobjd = obj[2] 
    try{
        await postthedata(videod,imgd,vobjd);
        return true;
    }catch(e){
        console.log("dfs")
        return false;
    }
    
    
}