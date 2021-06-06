const $= document.querySelector.bind(document);
const constraints = {audio: true, video: true};
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const remoteView = $('#remote');
const selfView = $('#self');
let fir = false;
let stream=null;
async function getstream(){
    stream = await navigator.mediaDevices.getUserMedia(constraints)
    selfView.srcObject = stream;
}
getstream()
const pcarr=[];
let socket;
function createsocket(text){
    socket = io("/"+text);
    socket.on('dis', e => {
        document.body.innerHTML = '<h1 style="color:red">연결이 끊겼습니다.</h1>';
    });
    
    socket.on('start', async (string) => {
        const pc = main();
        try {
            // Get local stream, show it in self-view, and add it to be sent.
            
            stream.getTracks().forEach((track) => {
            
                pc.addTrack(track, stream)
            });
            
            
        } catch (err) {
            console.error(err);
        }
    });
    console.log(text)
    socket.on('desc', async e => {
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
    socket.on('cand', async e => {
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
createsocket("room")