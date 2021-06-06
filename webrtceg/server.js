
const express = require("express")
const {Server}= require("socket.io")
const path = require("path");
const app = express();
const roomobj = {}
app.use('/node_modules', express.static("./node_modules"));
app.use('/script', express.static("./script"));
const viewroot = {
    root : "./view"
}
let one;
app.get('/', (req, res) => {
    res.sendFile("admin.html",viewroot)
    start_connection('erwe')
});
app


const server = app.listen(8080);

const io = new Server(server);
function start_connection(room){
    console.log(roomobj)
    if(!roomobj[room]){
        console.log("Er")
        roomobj[room]={}
        roomobj[room].one=false;
        roomobj[room].other=false;
    }
    
    let one;
    let other;
    io.of("/"+room).on('connection', socket => {

        console.log('연결');

        const fun = (str) => (e) => {
            console.log(e);
            if(one === socket){
                other.emit(str, e);
            } else if(other === socket){
                one.emit(str, e);
            }
        };

        if(!roomobj[room].one){
            roomobj[room].one=socket
        } else if(!roomobj[room].other){
            roomobj[room].other=socket;
            
            roomobj[room].one.emit('start','start');
            one=roomobj[room].one;
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
