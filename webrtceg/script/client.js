const $= document.querySelector.bind(document);

const remoteView = $('#remote');


const constraints = {audio: true, video: true};
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const pc = new RTCPeerConnection(configuration);

// Send any ice candidates to the other peer.

/*const start = async () => {
    try {
        // Get local stream, show it in self-view, and add it to be sent.
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        stream.getTracks().forEach((track) => {
            pc.addTrack(track, stream)
        });
        
    } catch (err) {
        console.error(err);
    }
};*/

/*pc.addEventListener('negotiationneeded', async () => {
    try {
        await pc.setLocalDescription(await pc.createOffer());
        // Send the offer to the other peer.
        const data = pc.localDescription.toJSON();
        console.log(data.streams[0])
        socket.emit('desc', data);
    } catch (err) {
        console.error(err);
    }
});*/
const socket = io(`/api`);
pc.addEventListener('icecandidate', e => {
    if(e.candidate){
        const data = e.candidate.toJSON();
        socket.emit('cand', data);
    }
});

pc.addEventListener('track', e => {
    if (remoteView.srcObject) return;
    remoteView.srcObject = e.streams[0];
});

socket.on('desc', async e => {
    if (e.type === 'offer') {
        // 제안 받음
        await pc.setRemoteDescription(e);
        await pc.setLocalDescription(await pc.createAnswer());
        const data = pc.localDescription.toJSON();
        socket.emit('return', data);
    } else {
        console.log('Unsupported SDP type.');
    }
});

socket.on('dis', e => {
    document.body.innerHTML = '<h1 style="color:red">연결이 끊겼습니다.</h1>';
});

socket.on('cand', async e => {
    try{
        await pc.addIceCandidate(e);
    } catch(err){
        console.log(err, e);
    }
});const $= document.querySelector.bind(document);
const constraints = {audio: true, video: true};
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'}]};
const remoteView = $('#remote');
const selfView = $('#self');

let stream=null;
async function getstream(){
    stream = await navigator.mediaDevices.getUserMedia(constraints)
}
getstream()
let clientpc;
const pcarr=[];
const socket = io("/erwe");
let clientnumb;
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
            if(clientnumb){
                data.numbe=clientnumb; 
            }
            socket.emit('cand', data);
        }
    });
    
    pc.addEventListener('track', e => {
        if (remoteView.srcObject) return;
        console.log("true")
        remoteView.srcObject = e.streams[0];
    });
    return pc;
    
}



// Send any ice candidates to the other peer.

const start = (pc1)=> {
    delete pc;
    console.log(stream)
    return async (string) => {
        try {
            // Get local stream, show it in self-view, and add it to be sent.
            
            stream.getTracks().forEach((track) => {
                pc1.addTrack(track, stream)
            });
            selfView.srcObject = stream;
        } catch (err) {
            console.error(err);
        }
    }
}


socket.on('dis', e => {
    document.body.innerHTML = '<h1 style="color:red">연결이 끊겼습니다.</h1>';
});

socket.on('start', start(main()));

socket.on('desc', async e => {
    
    if (e.type === 'offer') {
        const pc = main()
        clientpc = pc;
        // 제안 받음
        const pcnumb = e.numb;
        clientnumb=pcnumb
        delete e.numb;
        pc.setRemoteDescription(e)
        await pc.setLocalDescription(await pc.createAnswer());
        const data = pc.localDescription.toJSON();
        data.numb = pcnumb;
        socket.emit('desc', data);
        console.log('offer')
    } else if (e.type === 'answer') {
        const pcnumb = e.numb;
        delete e.numb;
        const pc = pcarr[pcnumb]
        console.log(pc,pcnumb)
        await pc.setRemoteDescription(e);
        // 받았음
    
    } else {
        console.log('Unsupported SDP type.');
    }
});
socket.on('cand', async e => {
    try{
        if(clientpc){
            await clientpc.addIceCandidate(e);
        }else{
            const clientnumbe=e.numbe;
            delete e.numbe;
            console.log(clientnumbe)
            await pcarr[clientnumbe].addIceCandidate(e);
        }
        
        
    } catch(err){
        console.log(err, e);
    }
});