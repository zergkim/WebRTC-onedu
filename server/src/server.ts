
//const express = require("express")
//const {Server}= require("socket.io")
//const path = require("path");
//const app = express();
const {v4:uuidV4} = require('uuid');
//const { on } = require("events");
//const e = require("express");
const roomobj:any = {}
const hostobj:any = {}
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