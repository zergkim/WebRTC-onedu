import { MongoClient,ObjectID } from "mongodb";
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
import { DBOBJ,POST_DATA_OBJ,POST_IV_OBJ, PPOBJ } from "./type";
const client = new MongoClient(url, { useUnifiedTopology: true });
import crypto from "crypto";
import { webrtcfunc } from "./server";
import { send_mail } from "./emil";
import cookieParser from "cookie-parser";
import {Get_jungbo,FindUser,postthedata} from "./splite";
import path from 'path';
const viewroot = {root:'C:/Users/zergk/Desktop/git_project/dproject/front/dist'}
let postobj:any={}
let DBObj:DBOBJ = {
    Videodata:null,
    Vu:null,
    Users:null,
    DB:null,
    Email:null,
}
client.connect(async e=>{
    if(e){
        
    }
    console.log('connection_complete!')
    DBObj.DB=client.db('streamingdata')
    DBObj.Videodata=DBObj.DB.collection("videodataup")
    DBObj.Email=DBObj.DB.collection("email")
    DBObj.Users=DBObj.DB.collection("userdata")
    send_mail("sanhaekim06@naver.com","wrefe")
    
})
import { Server, Socket } from "socket.io";
import express from 'express';
const app = express();
const filelist=[];
const front = path.resolve(__dirname, '..', '..', 'front');
// import hls from 'hls-server';
import fs from 'fs/promises';

app.use(cookieParser())
app.use('/node_modules',express.static('../node_modules'))
app.use(express.raw({limit:'1gb'}))//이거 꼭설정 해야함
app.use(express.json());
app.use("/videos",(req,res,next)=>{
    console.log(req.url)
    next()
})
app.use('/videos',express.static("../videos"))
app.use('/', async (req, res, next) => {
    
    if(req.query.view){ 
        req.url = req.url.split("?")[0]
    }
    let resultPath = '';
    
    if(!req.cookies.logined){
        if(req.method=="POST"&&req.url==="/login"){
            next()
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
        if(req.url=="/logout"){
            try{
                res.clearCookie("logined")
                res.clearCookie("id")
                res.clearCookie("passwords")
                res.send("true")
            }catch(e){
                res.send("")
            }
            return;
        }
        if(path.basename(req.url).indexOf("js")>-1){
            resultPath = path.resolve(front, `./dist/${req.url}`,)
            
        }
        else if(path.basename(req.url).indexOf('.') === -1){
            resultPath = path.resolve(front, `./dist/logined${req.url}.html`)
        } else {
            resultPath = path.resolve(front, `./dist/logined${req.url}`);
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


app.use('/view', (req, res, next) => {
    console.log(req.url);
    next();
});
app.use("/login",loginedfunc)
app.use("/signin",loginedfunc)
app.post("/id_unique",async(req,res)=>{
    if(DBObj.Users.findOne({username:req.body})){
        res.send("")
    }else res.send("좋아요");
})
app.post("/email_send",async(req,res)=>{
    
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
        res.send("true")
    }
    catch(e){
        res.send("")
    }
    
})
app.get("/signin",(req,res)=>{
    res.sendFile("signin.html",viewroot)
})
app.get("/login",(req,res)=>{
    res.sendFile("login.html",viewroot)
})

app.use('/img',express.static('./img'))
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
app.get("/takepost",(req,res)=>{
    res.sendFile("takepost.html",viewroot)
})
app.get("/main",(req,res)=>{
    res.sendFile("mainview.html",viewroot)
})
app.get("/watch",(req,res)=>{
    res.sendFile("watchview.html",viewroot)
})
app.get("/main/filelist",async(req,res)=>{
    res.json(await(await DBObj.Videodata.find({}).toArray()))
})
app.use("/objget",async(req,res)=>{
    res.json((await(await DBObj.Videodata.find({})).toArray()))
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
app.use("/chat/:filename",async(req,res,next)=>{
    
    try{
        const filename = req.params.filename
        let djk:any= await Get_jungbo(filename)
        const dop:any = djk.chat
        
        res.json(dop)
    }catch(e){
        console.log("err")
    }
    
    
})
app.get('/webrtadmin', (req:any, res:any) => {
    res.sendFile("admin.html",viewroot)
    //start_connection("room")
});
app.get("/webrtclient",(req:any,res:any)=>{
    res.sendFile("client.html",viewroot)
    
    
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
io.on("connection",socket =>{
    let socketid:any;
    socket.on('startchat',e=>{
        //console.log(e)
        socket.join(e)
        socketid = e
    })
    socket.on("takepoststart",async v=>{
        const postarr:Array<Buffer> = [];
        let postvid:any;
        let postimg:any;
        socket.on("takepost",async e=>{
            console.log(e)
            postarr.push(e)
        })
        socket.on("takeend",e=>{
            
            postvid = Buffer.concat(postarr)
            postimg = e;
            //console.log(postvid,'\n',postimg) 
        })
        socket.on("takeobj",e=>{
            const last_arr = [postvid,postimg,e]
            post_func(last_arr)
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