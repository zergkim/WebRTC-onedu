
const express = require("express")
const {Server}= require("socket.io")
const path = require("path");
const app = express();
const roomobj = {}
const hostobj = {}
app.use('/node_modules', express.static("./node_modules"));
app.use('/script', express.static("./script"));
const viewroot = {
    root : "./view"
}
let one;
app.get('/', (req, res) => {
    res.sendFile("admin.html",viewroot)
    start_connection("room")
});
app.get("/c",(req,res)=>{
    res.sendFile("client.html",viewroot)
    
    
})
app.get("/wer",(req,res)=>{
    res.sendFile("clien.html",viewroot)
    
})


const server = app.listen(8080);

const io = new Server(server);
function start_connection(room){
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
}
