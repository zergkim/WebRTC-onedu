
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
    Broadcasting:null
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
    console.log("연결")
    const fun = (str:string,one:typeof socket,other:typeof socket,so:typeof socket) => (e:string) => {
            
        if(one === so){
            other.emit(str, e);
        } else if(other === so){
            one.emit(str, e);
        }
    };
    socket.on("Start_Room", async(obj:object)=>{
        const Rooms_ID:string=uuidV4();
        socket.join(Rooms_ID);
        console.log(typeof Rooms_ID)
        socket.emit("Get_RoomsID",Rooms_ID);
        let id:string;
        socket.on("get_id",async(e:any)=>{
            console.log(e,"rw")
            id = e
            const broadcastobj:broadcastobj = {
                host_id:id,
                clientsid:[]
            }
            await DBObj.Broadcasting.insertOne(broadcastobj)
            socket.on("OtherSocket",(e:any)=>{
                const one = socket;
                const other = roomobj[Rooms_ID][e].socket
                console.log('de')
                socket.on('cand', fun('cand',one,other,socket));
                socket.on('desc', fun('desc',one,other,socket));    
            })
            socket.on("disconnect",(e:any)=>{
                DBObj.Broadcasting.deleteOne({host_id:id})
                delete hostobj[Rooms_ID];
                delete roomobj[Rooms_ID];
            })
            
            hostobj[Rooms_ID]={socket,id};
            roomobj[Rooms_ID]=[]
        })
        
    })
    socket.on("Start_Connection",(RoomName:string)=>{
        socket.join(RoomName);
        let one:Socket;
        let hid : string;
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
            other.emit("dis","e")
            other.disconnect()
            
        })
        socket.on("sendid",async(e:any)=>{
            console.log(e, "Wr")
            try{
                const id = e;
                const socknumb = roomobj[RoomName].push({socket,id})-1
                const d= await DBObj.Broadcasting.updateOne({host_id:hid},{$push:{clientsid:id}});
                console.log(d)
                one.emit("OtherSocket",socknumb)
                socket.on('disconnect',async(e:any)=>{
                    console.log("애미뒤진")
                    await DBObj.Broadcasting.updateOne({host_id:hid},{$pull:{clientsid:id}})
                })
            }catch(e){
                return
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
