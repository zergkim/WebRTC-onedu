import io from 'socket.io-client';
declare const MediaRecorder:any;
const socket:any = io(location.origin)
const video = document.querySelector('video');
const button = document.querySelector('button');
const finp = document.querySelector("input")
let stream:MediaStream = null;
let mediaRecord:any = null;
const main = async () => {
    const mdui:any =navigator.mediaDevices;
    stream = await mdui.getDisplayMedia({audio: true, video: true});
    video.srcObject = stream;
};
button.addEventListener('click', async e => {
    if(button.innerHTML === '녹화하기'){
        await main();
        socket.emit("takepoststart","")
        mediaRecord = new MediaRecorder(stream, {
            mimeType:'video/webm;codecs=vp9'
        });
        mediaRecord.addEventListener('dataavailable', (e:any) => {
            socket.emit("takepost",e.data)
            console.log(e.data)
        });
        mediaRecord.addEventListener('stop', (e:any) => {
            socket.emit("takeend", finp.files[0])
            const obj = {
                typeofv : "webm" ,
                typeofi : (finp.files[0].type.split("/"))[1],
                user:"none",
                ip:"none"
            }
            socket.emit('takeobj',obj)
        });
        mediaRecord.start(3000);
        button.innerHTML = '저장하기';
    } else {
        mediaRecord.stop();
        button.innerHTML = '녹화하기';
    }
});