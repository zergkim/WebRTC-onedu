import io from 'socket.io-client';
import './chat.css'
const socket = io('/chat')
socket.emit('joinchat',"wer")
const input:HTMLInputElement = document.querySelector("#bar")
input.addEventListener("click",(e)=>{
    let date:any = new Date()
    date = date.toString()
    socket.emit("sendchat",{
        text:input.value,
        user:"엠뒤",
        time:date
    })
})
socket.on('se',e=>{
    console.log(e)
})