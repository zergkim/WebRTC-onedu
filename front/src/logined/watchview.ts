import io  from 'socket.io-client'
import Hls from 'hls.js'

const socket = io()
let animationnumb:any;
let chatan;
const video:HTMLVideoElement =document.querySelector("#videoplayer")
const videodiv:HTMLDivElement = document.querySelector("#videodiv")
const input = document.querySelector('input')
videodiv.style.display="none"
const videomuk = document.querySelector('#videomuk')
const button:HTMLButtonElement = document.querySelector("#textbutton>button")
const textbutton_Div:HTMLDivElement = document.querySelector("#textbutton")
const urlpraa = new URLSearchParams(location.search)
const urlpra:string=urlpraa.get("view")
socket.emit("startchat",urlpra)
interface targett{
    remove:Function;
}
interface eventtarget{
    target:targett;
}
interface chatobject{
    text:string,
    xy:Array<string>
}
socket.on(urlpra,(e:chatobject)=>{
    chatanimationfunc(e.text,e.xy[0],e.xy[1])
})
let chatobj=[];
let chatdata:any;
async function getchat(){
    //chatdata =  await (await fetch("/chat/"+urlpra)).json()
}
getchat()
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
const chatanimationfunc = (text:string,x:string|number,y:string|number)=>{
    const span = document.createElement("span") 
    span.innerHTML=text
    span.style.position="absolute"
    span.style.transform = `translate(calc(${x}px - 50%), calc(${y}px - 50%))`;
    span.classList.add("videospan");
    videomuk.appendChild(span)
}
videodiv.onclick=(e)=>{
    
    const intext = input.value;
    if(!intext){
        alert("글자를 쓰시오")
        return;
    }
    chatanimationfunc(intext,e.offsetX,e.offsetY)
    input.value=""
    /*span.innerHTML=intext
    input.value = ""
    span.style.position="absolute"
    span.style.transform = `translate(calc(${e.offsetX}px - 50%), calc(${e.offsetY}px - 50%))`;
    span.classList.add("videospan");*/
    const textobj = {
        obj:{
            
            xy : [e.offsetX,e.offsetY],
            text : intext,
            user:"qwr"
        },
        time : Math.floor(video.currentTime),
        id : urlpra
    }
    chatobj.push(textobj.obj)
    /*videomuk.appendChild(span)*/
    postchat(textobj)
}
videomuk.addEventListener('animationend',(e:any)=>{
    e.target.remove()
})
video.addEventListener("pause",e=>{
    textbutton_Div.style.display="none"
    console.log("wr")
    clearInterval(animationnumb)
})
video.addEventListener("ended",e=>{
    videodiv.style.display = "none"
    textbutton_Div.style.display="none"
    console.log("wr")
    clearInterval(animationnumb)
})
video.addEventListener("play",e=>{
    button.innerHTML="만들기"
    textbutton_Div.style.display="inline-block"
    //chat()
})
button.addEventListener("click",e=>{
    if(video.paused){
        alert("비디오를 플레이 하십시오")
        return;
    }
    if(videodiv.style.display=="none"){
        button.innerText = "끄기"
        videodiv.style.display = "inline-block"
    }
    else{
        videodiv.style.display = "none";
        button.innerHTML="만들기"
    }
})
async function postchat(obj:any){
    socket.emit("postchat",obj)
}
socket.on("chatsend"+urlpra,(e:any)=>{
    console.log(e)
})
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