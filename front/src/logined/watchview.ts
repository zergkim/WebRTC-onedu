import Hls from 'hls.js';
import './client.css';
import './mainview.css';
import './watchview.css';
import videojs  from 'video.js';
import videojsqualityselector from 'videojs-hls-quality-selector';
import 'videojs-contrib-quality-levels';
import { isArrayLiteralExpression } from 'typescript';
/*player.hlsQualitySelector({
    displayCurrentQuality: true,
});*/
const inputsearch:HTMLInputElement = document.querySelector(".inputsearch>input")
const inputbutton:HTMLButtonElement = document.querySelector(".inputsearch>button")
inputbutton.addEventListener("click",e=>{
    location.href=`/search.html?view=${inputsearch.value}`
})
inputsearch.addEventListener("keydown",(e)=>{
    if(e.key=='Enter'){inputbutton.click()}
})
interface selecq {
    hls30:Hls,
    hls70 :Hls,
    hls100:Hls,
    selected:Hls
}
const urlpraa = new URLSearchParams(location.search)
const urlpra:string=urlpraa.get("view")
const goodie:HTMLImageElement = document.querySelector('.reimgcont>img')

let options = {
    aspectRatio: '16:9',
    fluid: true,
    poster: "./6120719e65aa8705305a208f.jpeg",
    controls : true, 
    playsinline : true, 
    muted : true, 
    preload : "metadata", 
    controlBar : { playToggle : true, pictureInPictureToggle : false, remainingTimeDisplay : true, progressControl : {seekBar:false}},
    html5: {
        vhs: {
          overrideNative: true 
        },
        nativeAudioTracks: false,
        nativeVideoTracks: false
    },
    
};


const video:HTMLVideoElement =document.querySelector(".video>video")
const player = videojs('myvideo', options)
let presentdu = 0;





  
let first=true

video.addEventListener("pause",e=>{
    if (!first) {
        return;
    }else{
        first = false

    }
    const func = async (e:any)=>{
        if (video.paused) {
            await video.play()
        }else{
            await video.pause()
        }
        
        setTimeout(()=>{
            document.querySelector('.vjs-play-control.vjs-control.vjs-button').addEventListener("click",func,{once:true})
        },600)
    }
    const func2 = async (e:Event)=>{
        setTimeout(async()=>{
            alert(video.paused)
            if (video.paused) {
            
                await video.play()
                
            }else{
                await video.pause()
                
            }
            setTimeout(()=>{
                document.querySelector("#myvideo_html5_api").addEventListener("click",func2,{once:true})
            },600)
        },1)
        
          
    }
    document.querySelector('.vjs-play-control.vjs-control.vjs-button').addEventListener("click",func,{once:true})
    document.querySelector("#myvideo_html5_api").addEventListener("click",func2,{once:true})
    //document.querySelector("#myvideo_html5_api").addEventListener("click",func2,{once:true})
    document.addEventListener("click",e=>{
        console.log("Werr")
    })
})
const sidebar = document.querySelector(".sidemenu-bar")

async function infoload() {
    let obj = await (await fetch("/getvideoinfo?id="+urlpra)).json()
    document.querySelector(".retextcon>.title").textContent=obj.vname
    document.querySelector(".retextcon>.subject").textContent=obj.subj
    document.querySelector(".retextcon>.user").textContent=obj.ID
    document.querySelector("strong").textContent = obj.views
    goodie.src="/userimg/"+obj.ID+".jpg"
    const broadarr:Array<any> = await(await fetch("/broadcasting")).json()
    console.log(broadarr)
    const sidebartemp:HTMLTemplateElement = document.querySelector(".sidebartemp")
    broadarr.forEach(v=>{
        const sideclone= sidebartemp.content.cloneNode(true) as DocumentFragment;
        console.log(v)
        sideclone.querySelector(".names").textContent = v.host_id
        sideclone.querySelector('.namec').textContent = v.broadname
        sideclone.querySelector("a").href = `/client.html?view=${v.Rooms_ID}`
        sideclone.querySelector("img").src=`/userimg/${v.host_id}.jpg`
        sidebar.appendChild(sideclone)
    })
}
infoload()
const sidbtt = document.querySelector(".sbt-r>div")
sidbtt.addEventListener("click",sidbarclick)
const mainview = document.querySelector(".mainview")
const nonebar = document.querySelector('#nonebar')
function sidbarclick(e:any){
    const arrw = Array.from(document.querySelectorAll(".sbd"))
    const arr = Array.from(document.querySelectorAll('.sbd>div'))
    const smb:HTMLDivElement = document.querySelector(".sidemenu-bar")
    const sbtr:HTMLDivElement = document.querySelector(".sbt-r")
    if(arr[0].classList.contains('none')){
        arr.forEach(v=>{
            v.classList.remove('none')
        })
        console.log("Ew")
        sidebar.classList.remove('jcent')
        document.querySelector("#open").classList.remove("notnone")
        document.querySelector("#close").classList.remove("none")
        document.querySelector(".sbt-l").classList.remove("none")
        
        sbtr.style.width="50%"
        nonebar.classList.add("or")
        nonebar.classList.remove("sc")
        mainview.classList.add("or")
        mainview.classList.remove("sc")
        smb.style.width='240px'
        arrw.forEach(v=>{v.classList.remove("jcent")})
    }else{
        arr.forEach(v=>{
            v.classList.add('none')
           
        })
        sidebar.classList.add('jcent')
        document.querySelector("#open").classList.add("notnone")
        document.querySelector("#close").classList.add("none")
        smb.style.width='50px'
        document.querySelector(".sbt-l").classList.add('none')
        sbtr.style.width="100%"
        arrw.forEach(v=>{v.classList.add("jcent")})
        nonebar.classList.add("sc")
        nonebar.classList.remove("or")
        mainview.classList.add("sc")
        mainview.classList.remove("or")
    }
}
const videoSrc30=`/videos/${urlpra}(30p).m3u8`;

const videoSrc70=`/videos/${urlpra}(70p).m3u8`;

const videoSrc100=`/videos/${urlpra}(100p).m3u8`;

let hlsobj:any={
    hls30:null,
    hls100:null,
    hls70:null,
    selected:null
};
if(Hls.isSupported()){
    console.log(Hls.isSupported())
    hlsobj.hls30 = new Hls();
    hlsobj.hls30.loadSource(videoSrc30);
    hlsobj.hls30.attachMedia(video)
    hlsobj.hls70 = new Hls();
    hlsobj.hls70.loadSource(videoSrc70);
    hlsobj.hls100 = new Hls();
    hlsobj.hls100.loadSource(videoSrc100);
    hlsobj.selected=hlsobj.hls30
}else if(video.canPlayType('application/vnd.apple.mpegurl')){
    video.src=videoSrc30;
    
}
let time = 0;
video.addEventListener("play",e=>{
        //video.play()
        const q_select = document.createElement("select")
        
        const option30 = document.createElement("option")
        const option70 = document.createElement("option")
        const option100 = document.createElement("option")
        option30.innerText="30%"
        option70.innerText="70%"
        option100.innerText="100%"
        q_select.appendChild(option30)
        q_select.appendChild(option70)
        q_select.appendChild(option100)
        const div = document.createElement("div")
        div.style.width="80%"
        
        document.querySelector('.vjs-control-bar').appendChild(q_select)
        q_select.addEventListener("change",async e=>{
            const currnet = video.currentTime;
            hlsobj.selected.detachMedia()
            let arr:Array<string> = q_select.value.split("")
            arr.pop()
            let stra:String = arr.join("")
            hlsobj[`hls${stra}`].attachMedia(video)
            hlsobj.selected = hlsobj[`hls${stra}`]
            await video.play();
            video.currentTime=currnet
        })
    
},{once:true})


