declare const MediaRecorder:any;
import "./admin.css"
const finp:HTMLButtonElement = document.querySelector("#buttonn")
document.body.appendChild(finp)
const finp2:HTMLInputElement = document.querySelector("#inputt")
document.body.appendChild(finp2)

import io  from 'socket.io-client';
import './index.css';
const $= document.querySelector.bind(document);
const constraints = {audio: true, video: true};
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const remoteView = $('#remote');
const selfView = $('#self');
let fir = false;
let stream:any=null;
const socket2 = io()
async function getstream(){
    stream = await navigator.mediaDevices.getUserMedia(constraints)
    selfView.srcObject = stream;
    const mediaRecord = new MediaRecorder(stream, {
        mimeType:'video/webm;codecs=vp9'
    });
    
    socket2.emit("takepoststart","")
    mediaRecord.addEventListener('dataavailable', (e:any) => {
        finp2.addEventListener("change",v=>{
            socket2.emit("takepost",e.data)
            console.log(e.data)
        })
        
    });
    finp.addEventListener('click',e=>{
        mediaRecord.stop()
    })
    mediaRecord.addEventListener('stop', (e:any) => {
        const hwte:string=(finp2.files[0].type.split("/"))[1]
        socket2.emit('takehw',hwte)
        socket2.emit("takeend", finp2.files[0])
        const obj = {
            typeofv : "webm" ,
            typeofi : (finp2.files[0].type.split("/"))[1],
            user:"none",
            ip:"none"
        }
        socket2.emit('takeobj',obj)
    });
    mediaRecord.start(3000);
}
getstream()
const pcarr:Array<webkitRTCPeerConnection>=[];
const socket = io('/wrtc');
/*socket.on("OtherSocket",(e:any)=>{
    socket.emit("OtherSocket",e)
})*/
function createsocket(){
    socket.emit("Start_Room","start")
    
    socket.on("OtherSocket",(e:any)=>{
    
        socket.emit("OtherSocket",e)
    })
    socket.on('dis', (e:any) => {
        document.body.innerHTML = '<h1 style="color:red">연결이 끊겼습니다.</h1>';
    });
    socket.on("Get_RoomsID",(e:any)=>{
        alert(e)
    })
    socket.on('start', async (string:string) => {
        const pc = main();
        try {
            // Get local stream, show it in self-view, and add it to be sent.
            
            stream.getTracks().forEach((track:any) => {
            
                pc.addTrack(track, stream)
            });
            
            
        } catch (err) {
            console.error(err);
        }
    });
    socket.on('desc', async (e:any) => {
        if (e.type === 'answer') {
            const pcnumb = e.numb;
            delete e.numb;
            const pc = pcarr[pcnumb]
            alert(e)
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
            console.log(e)
            
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
    });
    
    pc.addEventListener('icecandidate', e => {
        if(e.candidate){
            const data = e.candidate.toJSON();
            socket.emit('cand', data);
        }
    });
    
    return pc;
    
}



// Send any ice candidates to the other peer.
createsocket()