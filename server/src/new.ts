import { Cursor, Db, MongoClient,ObjectID } from "mongodb";//몽고디비에서 object ID클래스와 mongodb의 dbms를 사용할 수 있게 해주는 인터페이스인 mongodblclient를 가져옴
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
import { Chat_Obj, DBOBJ,POST_DATA_OBJ,POST_IV_OBJ, PLAYLIST} from "./type";//오브젝트 타입
const client = new MongoClient(url, { useUnifiedTopology: true });//몽고디비클라이언트 클래스에서 객체 생성
import crypto from "crypto";//그립토 라이브러리 가져옴
import {v4 as uuidV4} from 'uuid';//ID생성 api
import { webrtcfunc } from "./server";
import { send_mail } from "./emil";
import cookieParser from "cookie-parser";//express cookieparser
import {Get_jungbo,FindUser,postthedata,search} from "./splite";
import path from 'path';//path 라이브러리
const viewroot = {root:'../../front/dist'}//html파일 들의 루트
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
    DBObj.DB=client.db('streamingdata')//클라이언트에서 db함수로 db를 관리할 수 있는 객체 불러옴
    DBObj.Videodata=DBObj.DB.collection("videodataup")//db에서 컬렉션을 관리할 수 있는 객체를 불러옴 이하 동문
    DBObj.Email=DBObj.DB.collection("email")
    DBObj.Users=DBObj.DB.collection("userdata")
    DBObj.Vu = DBObj.DB.collection("videodataup")
    DBObj.PLAYLIST = DBObj.DB.collection('playlist');
    DBObj.Broadcasting = DBObj.DB.collection('broadcasting')
    //await DBObj.Users.updateOne({$and:[{ID:"opop065"}]},{$set:{passwords:crypto.createHash("sha256").update('12345678').digest('base64')}})
})
import { Server, Socket } from "socket.io";//socket.io를 가져옴
import express, { json } from 'express';//express를 가져옴
const app = express();//app객체 를 생성
const filelist=[];
const front = path.resolve(__dirname, '..', '..', 'front');//front패스
// import hls from 'hls-server';
import fs from 'fs/promises';//fs 프로미스를 받아옴
import { remove } from "jszip";
import e from "express";
app.use(express.text())//텍스트를 받아올 수 있도록 셋해놈
app.use(cookieParser())//쿠키를 읽을 수있도록 셋 해놈 
app.use('/node_modules',express.static('../node_modules'))//스태틱으로 파일을 읽을 수 있도록 셋해놈
app.use(express.raw({limit:'1gb'}))//이거 꼭설정 해야함
app.use(express.json());//json형식의 파일을 읽을 수 있도록 셋 해놈
app.use('/img',express.static('../img'))//img 폴더를 img링크와 연결 하는 static코드
app.use('/videos',express.static("../videos"))//videos폴더와 videos링크를 연결하는 static 코드
app.use('/userimg',express.static("../userimg"))//userimg와 userimg폴더를 연결하는 static코드
app.get('/search',async(req,res)=>{//search링크의 get요청
    const searche = req.query.search as unknown as string//search를 할 텍스트를 쿼리 스트링에서 추출
    let bul = true;//불리안
    if (req.query.again) {
        
    }else{
        bul=false;
    }
    res.send(await search(searche,10,bul))//좀있다 확인하기
})
app.get("/playlistname",async(req,res)=>{//playlistname가져오기
    const idid = req.query.id as string//쿼리에서 아이디 추출하기
    const name = (await DBObj.PLAYLIST.findOne({_id: new ObjectID(idid)})).NAME//findOne에서 네임을 가져오기
    res.send(name)
})
app.get("/", async(req,res)=>{// url에서 디렉토리가 '/'일 때
    let resultPath = ""
    if(req.cookies.id){
        resultPath = path.resolve(front, `./dist/logined/mainview.html`) //만약 쿠키가 있다면 메인뷰페이지를 보내주기
        
    }else{
        resultPath = path.resolve(front, `./dist/login.html`) //아니라면 로그인 페이지로 이동 시키기 
    }
    res.sendFile(resultPath)//sendfile
})
app.use('/', async (req, res, next) => {
    
    if(req.query.view){ 
        req.url = req.url.split("?")[0]//쿼리는 분리
    }
    let resultPath = '';
    
    if(!req.cookies.logined){//로그인이 아닐때
        if(req.method=="POST"&&(req.url==="/login"||req.url=="/email_send"||req.url.indexOf("/id_unique")>-1||req.url=="/certpost"||req.url.indexOf("/signinconfirm")>-1||req.url=='/broadcasting'||req.url=='/userimgpost')){
            next()//만약 위 조건을 만족한다면 처리
            console.log(req.url)
            return;
            
        }
        if(path.basename(req.url).indexOf('.') === -1){//링크
            resultPath = path.resolve(front, `./dist${req.url}.html`) //파일 디렉토리를 dist안의 logined폴더가 아닌 밖으로 설정해 일부러 오류 내기
        } else {
            resultPath = path.resolve(front, `./dist${req.url}`);//일부러 오류내기
        }
        try{
            await fs.access(resultPath)//엑세스하기(오류내기)
            res.sendFile(resultPath)
        }catch(e){
            res.send("error")
        }
        return;
    }else if(req.method=="POST"){//메소드가 post면 보내주기
        next()//보내기
        return; //함수 실행 종료
    }
    else{
        if(req.url=="/logout"||req.url=="/viewlist"||req.url.indexOf("getuserlist")>-1||req.url.indexOf("getvideoinfo")>-1||req.url.indexOf('getuserid')>-1||req.url=="/getlplaylist"||req.url.indexOf("/broadcasting")>-1||req.url.indexOf("/userlistvideolist")>-1||req.url=="/getsubuserlist"||req.url=="/topvideolist"||req.url.indexOf("/changepassword")>-1||req.url=='/usersplaylist'){//파일 위치가 없는 것들
            try{
               next()
               console.log(req.url)
            }catch(e){
                res.send("")
            }
            return;
        }
        console.log(path.basename(req.url))
        if(path.basename(req.url).indexOf("js")>-1){//자바스크립트는 그렇게 안함
            resultPath = path.resolve(front, `./dist/${req.url}`,)
        }
        else if(path.basename(req.url).indexOf('.') === -1){//html, html아닐 경우 구분
            resultPath = path.resolve(front, `./dist/logined${req.url}.html`)
        } 
        else {
            resultPath = path.resolve(front, `./dist/logined${req.url}`);
        }
        if(path.basename(req.url).split(".")[0]=="watchview"){//watchview파일을 사용할 수 있도록 해주는 파일 디렉토리
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

const loginedfunc =(req:any,res:any,next:Function)=>{//login되었을 경우에 처리 함수
    if(req.cookies.logined){
        res.redirect("/main")
        return;
    }
    next();
}



app.use("/login",loginedfunc)
app.use("/signin",loginedfunc)

app.post("/id_unique",async(req,res)=>{//idunique플래그 함수
    if(await DBObj.Users.findOne({ID:req.body})){
        res.send("")
    }else {
        res.send("좋아요")
    };
})
app.post("/email_send",async(req,res)=>{//인증번호
    const number = JSON.stringify(Math.floor(Math.random()*1000000));
    
    try{
        console.log(req.body.email)
        const info = await DBObj.Users.findOne({email:req.body.email})//이메일 주인찾기
        if(info){
            throw new Error("이미 이메일 주인이 있음")
        }
        await DBObj.Email.insertOne({date:new Date(),EmailAdr:req.body.email,number})//없으면 괜찮음
    }catch(e){
        
        res.send("")
        return;
    }
    
    console.log('인증번호',number)//인증번호
    send_mail(req.body.email,number)//인증번호 보내기
    res.send("성공")
    
})
app.post("/userimgpost",async(req,res)=>{
    try{
        const er = await fs.writeFile(`../userimg/${req.cookies.id}.jpg`,req.body)//쓰기
        res.json("성공")
    }catch(e){
        res.json("")
    }
    
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
    const fetchedvidelist = (await DBObj.PLAYLIST.findOne({_id:new ObjectID(req.body.name)}))
    console.log("VideoList",fetchedvidelist)
    const videolist = fetchedvidelist.videos
    console.log(videolist,"VideoList")
    videolist.push(fetchedvidelist.ownerID)
    res.json(videolist)
})
app.post('/deleteplaylist',(req,res)=>{
    
    req.body.forEach(async(v:string)=>{
        
        
        const _id = v
        
        if (!_id) {
            return;
        }
        console.log(_id)
        const pobj:PLAYLIST = await DBObj.PLAYLIST.findOne({_id:new ObjectID(v)})
        pobj.videos.forEach(v=>{
            DBObj.Vu.deleteOne({_id: new ObjectID(v)})
        })
        DBObj.PLAYLIST.deleteOne({_id:new ObjectID(v)})
        DBObj.Users.updateMany({},{$pull:{subplaylist:v}})
        res.send("text")
    })
})
app.post("/userlistvideolist",async(req,res)=>{
    console.log("Userlistname:",req.body.name)
    let videolist = (await DBObj.Users.findOne({ID:req.body.name})).videolist
    if (!videolist) {
        videolist=[]
    } 
    res.json(videolist)
    console.log("굳")
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
app.get("/usersplaylist",async(req,res)=>{
    try{
        const playlists = await DBObj.PLAYLIST.find({ownerID:req.cookies.id})
        console.log(req.cookies.id,"WEr")
        const array:Array<any> = []
        for await(let i of playlists){
            array.push(i)
        }
        res.json(array)
    }catch(e){
        console.log(e)
    }
})
app.get("/logout",(req,res)=>{
    try{
        res.clearCookie('id')//쿠키 클리어
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
    if (!list) {
        res.json([])
        return;
    }
    res.json(list)
})
app.get('/getsubuserlist',async(req,res)=>{
    const list =  (await DBObj.Users.findOne({ID:req.cookies.id})).subuserlist
    console.log("wer:",list)
    if (!list) {
        res.json([])
        return;
    }
    res.json(list)
})
app.get('/broadcasting',async(req,res)=>{
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
    
    let letv:Cursor;

    if (!req.query.e) {
        let d = (await DBObj.Users.findOne({ID:req.cookies.id})).subuserlist
        let arre = [];
        for(let et of d){
            arre.push({host_id:et})
        }
        letv = await DBObj.Broadcasting.find({$or:arre}).limit(10)
    }else{
        const textte = req.query.e as string
        const regexe = funce(textte)
        letv = await DBObj.Broadcasting.find({$or:[{host_id:{$regex:regexe}},{broadname:{$regex:regexe}}]}).limit(10)
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
app.get("/changepassword",async(req,res)=>{
    console.log("애미")
    const string = req.query.change as string
    const changepassword = crypto.createHash("sha256").update(string).digest('base64') as string
    const string2 = req.query.pre as string;
    const prepassword = crypto.createHash("sha256").update(string2).digest('base64') as string
    console.log(string,string2)
    const idid = req.cookies.id as string
    console.log(idid)
    if (!(await DBObj.Users.findOne({$and:[{ID:idid},{passwords:prepassword}]}))) {
        console.log("false")
        res.json("")
        return;
    }
    const ami = await DBObj.Users.updateOne({$and:[{ID:idid},{passwords:prepassword}]},{$set:{passwords:changepassword}})
    console.log(ami)
    res.json("Were")
}) 
app.get('/changeid',async(req,res)=>{
    const changeid = req.query.id as string;
    const firstid = req.cookies.id as string;
    try{
        await DBObj.Users.updateOne({ID:firstid},{$set:{ID:changeid}})
        res.send("true")
    }catch(e){
        console.log(e)
        res.send("")
    }
    
})
app.get("/topvideolist",async(req,res)=>{
    const obj = await DBObj.Vu.find({}).sort({views:-1}).limit(12)
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
            ownerID:req.cookies.id,
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