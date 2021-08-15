import Hls from 'hls.js'
import './client.css'
import './mainview.css'
import './watchview.css'
const video:HTMLVideoElement =document.querySelector(".video>video")

const urlpraa = new URLSearchParams(location.search)
const urlpra:string=urlpraa.get("view")

async function infoload() {
    let obj = await (await fetch("/getvideoinfo?id="+urlpra)).json()
    document.querySelector(".retextcon>.title").textContent=obj.vname
    document.querySelector(".retextcon>.subject").textContent=obj.subj
    document.querySelector(".retextcon>.user").textContent=obj.ID
    document.querySelector("strong").textContent = obj.views
}
infoload()
const videoSrc=`/videos/${urlpra}.m3u8`;
if(Hls.isSupported()){
    console.log(Hls.isSupported())
    const hls:Hls = new Hls();
    hls.loadSource(videoSrc);
    hls.attachMedia(video)
    hls.on(Hls.Events.MANIFEST_PARSED,video.play)
}else if(video.canPlayType('application/vnd.apple.mpegurl')){
    video.src=videoSrc;
    video.addEventListener('loadedmetadata',()=>{
        video.play()
    })
}




/*async function chat(){
    const array = [0]
    let k = setInterval(() => {
        const datac = chatdata[Math.floor(video.currentTime)]
        //console.log(datac,Math.floor(video.currentTime))
        if(datac){
            datac.forEach((v:chatobject)=>{
                chatanimationfunc(v.text,v.xy[0],v.xy[1])
            })
        }
    }, 999);
    animationnumb=k;
}*/