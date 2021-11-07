
//const express = require("express")
//const {Server}= require("socket.io")
//const path = require("path");

import { Socket } from "socket.io";
import { Db, MongoClient,ObjectID } from "mongodb";
import { DBOBJ,broadcastobj} from "./type";
//const app = express();
const {v4:uuidV4} = require('uuid');
const url = "mongodb+srv://zergkim:kimsh060525@cluster0.55ags.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(url, { useUnifiedTopology: true });
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
    DBObj.Broadcasting=DBObj.DB.collection("broadcasting")
    DBObj.Email=DBObj.DB.collection("email")
    DBObj.Users=DBObj.DB.collection("userdata")
})
//const { on } = require("events");
//const e = require("express");
const roomobj:any = {}
const hostobj:any = {}
const idobj:any = {}
/*app.use('/node_modules', express.static("./node_modules"));
app.use('/script', express.static("./script"));
const viewroot = {
    root : "./view"
}
let one;
app.get('/', (req:any, res:any) => {
    res.sendFile("admin.html",viewroot)
    //start_connection("room")
});
app.get("/c",(req:any,res:any)=>{
    res.sendFile("client.html",viewroot)
    
    
})
app.get("/www",(req:any,res:any)=>{
    res.send(uuidV4())
})
app.get("/wer",(req:any,res:any)=>{ 
    res.sendFile("clien.html",viewroot)
    
})


const server = app.listen(8080);

const io = new Server(server);
io.on("connection",(socket:any) =>{
    console.log("연결")
    const fun = (str:string,one:typeof socket,other:typeof socket,so:typeof socket) => (e:string) => {
            
        if(one === so){
            other.emit(str, e);
        } else if(other === so){
            one.emit(str, e);
        }
    };
    socket.on("Start_Room", (obj:object)=>{
        const Rooms_ID:string=uuidV4();
        socket.join(Rooms_ID);
        console.log(typeof Rooms_ID)
        socket.emit("Get_RoomsID",Rooms_ID);
        //
        socket.on("OtherSocket",(e:any)=>{
            const one = socket;
            const other = roomobj[Rooms_ID][e]
            
            socket.on('cand', fun('cand',one,other,socket));
            socket.on('desc', fun('desc',one,other,socket));

        })
        hostobj[Rooms_ID]=socket;
        roomobj[Rooms_ID]=[]
    })
    socket.on("Start_Connection",(RoomName:string)=>{
        socket.join(RoomName);
        const Its_ID = uuidV4()
        socket.emit("Its_ID",Its_ID)
        const one = hostobj[RoomName]
        const other = socket;
        
        try{
            const socknumb = roomobj[RoomName].push(socket)-1
            one.emit("OtherSocket",socknumb)
        }catch(e){
            return
        }
        one.emit("start","start")
        
        socket.on('cand', fun('cand',one,other,socket));
        socket.on('desc', fun('desc',one,other,socket));
        
    })


})*/
export function webrtcfunc(socket:any){
    let first:boolean = true;
    console.log("연결")
    const fun = (str:string,one:typeof socket,other:typeof socket,so:typeof socket) => (e:string) => {
            
        if(one === so){
            other.emit(str, e);
        } else if(other === so){
            one.emit(str, e);
        }
    };
    socket.on("Start_Room", async(obj:object)=>{
        let one:Socket;
        let other:Socket;
        const Rooms_ID:string=uuidV4();
        socket.join(Rooms_ID);
        socket.emit("Get_RoomsID",Rooms_ID);
        let id=""
        socket.on("get_id",async(e:any)=>{
            id = e.id
            DBObj.Users.updateOne({ID:e.id},{$push:{broadcastlist:Rooms_ID}})
            console.log('password',e.password)
            const broadcastobj:broadcastobj = {
                host_id:e.id,
                clientsid:[],
                views:0,
                Rooms_ID,
                broadname:e.name,
                info : e.info,
                subj : e.subj
            }
            await DBObj.Broadcasting.insertOne(broadcastobj)
            socket.on("OtherSocket",(e:any)=>{
                one = socket;
                other = roomobj[Rooms_ID][e].socket;
                socket.on('cand', fun('cand',one,other,socket));
                socket.on('desc', fun('desc',one,other,socket));    
            })
            socket.on("OtherSocket2",(e:any)=>{
                socket.on('cand', fun('cand',one,other,socket));
                socket.on('desc', fun('desc',one,other,socket));   
            })
            socket.on("disconnect",(e:any)=>{
                console.log("endbroad")
                DBObj.Broadcasting.deleteOne({Rooms_ID})
                DBObj.Users.updateOne({ID:id},{$pull:{broadcastlist:Rooms_ID}})
                delete hostobj[Rooms_ID];
                delete roomobj[Rooms_ID];
            })
            socket.on("editinfo",async(e:any)=>{
                const obj:any = {}
                console.log(e.type)
                obj[e.type]=e.content
                console.log(obj)
                DBObj.Broadcasting.updateOne({Rooms_ID},{$set:obj})
                
            })
            hostobj[Rooms_ID]={socket,id};
            roomobj[Rooms_ID]=[]
        })
        
    })
    socket.on("Start_Connection",(RoomName:string)=>{
        let one:Socket;
        let hid : string;
        let bulina:boolean = false;
        
        try{
            one = hostobj[RoomName].socket
            hid = hostobj[RoomName].id
        
        }catch(e){
            console.log(e)
            socket.emit("dis","e")
            return;
        }
        const other = socket;
        one.on("disconnect",(e:any)=>{
            DBObj.Broadcasting.deleteOne({host_id:hid})
            DBObj.Users.updateOne({ID:hid},{$pull:{broadcastlist:RoomName}})
            other.emit("dis","e")
            other.disconnect()
            
        })
        one.on("changed",e=>{
            console.log("changed")
            socket.emit("changed","")
            bulina=false 
        })
        socket.on("sendid",async(e:any)=>{
            if (bulina) {
                return;
            }
            console.log(e, "Wr")
            try{
                bulina = true;
                const id = e;
                const socknumb = roomobj[RoomName].push({socket,id})-1
                await DBObj.Broadcasting.updateOne({Rooms_ID:RoomName},{$push:{clientsid:id}});
                await DBObj.Broadcasting.updateOne({Rooms_ID:RoomName},{$inc:{views:1}})
                if (first) {
                    one.emit("OtherSocket",socknumb)
                    first = false
                }else{
                    one.emit("OtherSocket2",socknumb)
                }
                
                socket.on('disconnect',async(e:any)=>{
                    await DBObj.Broadcasting.updateOne({Rooms_ID:RoomName},{$pull:{clientsid:id}})
                    await DBObj.Broadcasting.updateOne({Rooms_ID:RoomName},{$inc:{views:-1}})
                }) 
            }catch(e){
                console.log("qwrqre")
                return;
            }
            one.emit("start","start")
            
            socket.on('cand', fun('cand',one,other,socket));
            socket.on('desc', fun('desc',one,other,socket));
            
        })
        
    })


}
/*function start_connection(room){
    console.log(room)
    
    if(!roomobj[room]){
        roomobj[room]=[]
        roomobj[room].push({one:false,other:false});
    }
    
    let one;
    let other;
    io.of("/"+room).on('connection', socket => {

        console.log('연결');

        const fun = (str) => (e) => {
            
            if(one === socket){
                other.emit(str, e);
            } else if(other === socket){
                one.emit(str, e);
            }
        };

        if(!roomobj[room][0].one){
            console.log('a')
            roomobj[room][0]={one:socket,other:false}
            hostobj[room]=socket
        } else{
            console.log('b')
            let length = roomobj[room].length-1
            if(!roomobj[room][length].other){
                roomobj[room][length].other=socket;
                roomobj[room].push({one:hostobj[room],other:false})
            }else{
                console.log('err')
                return;
            }
            console.log(roomobj[room][length].one)
            roomobj[room][length].one.emit('start','start');

            one=roomobj[room][length].one;
            other=socket
        }

        socket.on('cand', fun('cand'));
        socket.on('desc', fun('desc'));
        socket.on('disconnect', e => {
            if(one === socket || other === socket){
                one?.emit?.('dis');
                other?.emit?.('dis');
                one = null;
                other = null;
            }
            
        });
    });
}*/
