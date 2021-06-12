/*const $= document.querySelector.bind(document);
const roomnaame = prompt("","")
const constraints = {audio: true, video: true};
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const remoteView = $('#remote');
const selfView = $('#self');
/*let stream=null;
async function getstream(){
    stream = await navigator.mediaDevices.getUserMedia(constraints)
}
getstream()*//*
let clientpc;
const socket = io("");
let bulina = false;
let clientnumb;
function main(){
    const pc = new RTCPeerConnection(configuration);
    pc.addEventListener('icecandidate', e => {
        if(e.candidate){
            const data = e.candidate.toJSON();
            if((typeof clientnumb)=="number"){
                console.log(clientnumb)
                data.numbe=clientnumb; 
            }
            socket.emit('cand', data);
        }
    });
    
    pc.addEventListener('track', e => {
        if (remoteView.srcObject) return;
        console.log("true")
        remoteView.srcObject = e.streams[0];
        document.addEventListener('click', e=>{
            remoteView.play()
        });
    });
    console.log(pc)
    return pc;
    
}
/*


// Send any ice candidates to the other peer.
socket.emit("Start_Connection",roomnaame)
socket.on('dis', e => {
    document.body.innerHTML = '<h1 style="color:red">연결이 끊겼습니다.</h1>';
});

socket.on('desc', async e => {
    if(bulina){
        return
    }
    if (e.type === 'offer') {
        bulina=true
        const pc = main()
        alert(bulina)
        clientpc = pc;
        // 제안 받음
        const pcnumb = e.numb;
        clientnumb=pcnumb
        delete e.numb;
        pc.setRemoteDescription(e)
        await pc.setLocalDescription(await pc.createAnswer());
        const data = pc.localDescription.toJSON();
        data.numb = pcnumb;
        console.log("desc",data)
        socket.emit('desc', data);
        console.log('offer')
        
    } else {
        console.log('Unsupported SDP type.');
    }
});
socket.on('cand', async e => {
    try{
        if(clientpc){
            console.log(clientpc)
            await clientpc.addIceCandidate(e);
        }
        
    } catch(err){
        console.log(err, e);
    }
});*/