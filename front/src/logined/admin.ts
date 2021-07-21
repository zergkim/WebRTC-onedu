declare const MediaRecorder:any;
import "./admin.css"


let roomid:string;
const broadcastart:HTMLDivElement = document.querySelector('#broadcastart')
const broadcastbody:HTMLDivElement = document.querySelector('#broadcastbody')
console.log(broadcastbody)
broadcastbody.style.display="none";

import io  from 'socket.io-client';
import './index.css';
const $= document.querySelector.bind(document);
const subtitle:HTMLInputElement = document.querySelector("#subtitle")
const password:HTMLInputElement = document.querySelector('#password')
const pasbut:HTMLButtonElement = document.querySelector('#radio')
pasbut.click()
const startbroad:HTMLButtonElement = document.querySelector("#startbroad")
const getuserm:HTMLButtonElement = document.querySelector('#getuserm')
// chwal:HTMLButtonElement = document.querySelector('button')
const constraints = {audio: true, video: true};
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const remoteView = $('#remote');
const selfView = $('#self');
let fir = false;
let stream:any=null;
const socket2 = io()
async function getstream(){
    const meobj:any =navigator.mediaDevices;
    stream = await meobj.getDisplayMedia(constraints)
    selfView.srcObject = stream;
    
}
const pcarr:Array<webkitRTCPeerConnection>=[];
const socket = io('/wrtc');

async function createsocket(subtitle:string, pw:string){
    const text = await (await fetch("/getuserid")).text()
    socket.emit("Start_Room","start")
    socket.emit("get_id",text)
    socket.on("OtherSocket",(e:any)=>{
    
        socket.emit("OtherSocket",e)
    })
    socket.on("Get_RoomsID",(e:any)=>{
        roomid = e;
        console.log(e)
    })
    socket.on('start', async (string:string) => {
        const pc = main();
        try {
            // Get local stream, show it in self-view, and add it to be sent.
            
            stream.getTracks().forEach((track:any) => {
            
                pc.addTrack(track, stream)
            });
            socket.emit('broadname',subtitle)
            socket.emit('broadpw',pw)
        } catch (err) {
            console.error(err);
        }
    });
    socket.on('desc', async (e:any) => {
        if (e.type === 'answer') {
            const pcnumb = e.numb;
            delete e.numb;
            const pc = pcarr[pcnumb]
            await pc.setRemoteDescription(e);
            // 받았음
        } else {
            console.log('Unsupported SDP type.');
        }
    });
    socket.on('cand', async (e:any) => {
        
        try{
            const clientnumbe=e.numbe;
            delete e.numbe;
            
            
            await pcarr[clientnumbe].addIceCandidate(e)
        } catch(err){
            console.log(err, e);
        }
    });
}
function main(){
    const pc = new RTCPeerConnection(configuration);
    pc.addEventListener('negotiationneeded', async () => {
        try {
            await pc.setLocalDescription(await pc.createOffer());
            // Send the offer to the other peer.
            const data = pc.localDescription.toJSON();
            pcarr.push(pc)
            const numb = pcarr.length-1
            data.numb = numb
            socket.emit('desc', data);
            
        } catch (err) {
            console.error(err);
        }
    },{once:true});
    
    pc.addEventListener('icecandidate', e => {
        if(e.candidate){
            const data = e.candidate.toJSON();
            socket.emit('cand', data);
        }
    },{once:true});
    
    return pc;
    
}
getuserm.addEventListener('click',getuserfunc,{once:true});



async function getuserfunc(){
    try{
        await getstream()
    }
    catch(e){
        alert("오류!!! 브라우저 버전이 낮을경우 업데이트후 실행");
        return
    }
    startbroad.addEventListener('click',startbroadfunc,{once:true})
}
async function startbroadfunc(e:any){
    console.log(subtitle)
    const title = subtitle.value;
    let passworde:string =""
    let bul:boolean = false
    try{
        if(!title){
            alert('잘못된제목')
            
            bul = true
        }else if(pasbut&&password.value.length<8){
            alert('패스워드 길이를 늘리거나 설정하지 마시오')
            bul = true
        }else if(pasbut){
            passworde = password.value
        }
        if(bul){
            startbroad.addEventListener('click',startbroadfunc,{once:true})
            return;
        }
        
        await createsocket(title,passworde)
        alert("성공적으로 방송을 열었습니다")
        broadcastbody.style.display="inherit"
        broadcastart.style.display="none"
    }catch(e){
        alert('방송을 여는데 문제가 생겼습니다 !!! \n다시 시도하거나 다른브라우저를 이용해주세요')
    }
}
// Send any ice candidates to the other peer.
