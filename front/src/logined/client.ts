const $= document.querySelector.bind(document);
import io from 'socket.io-client'
import { NoEmitOnErrorsPlugin } from 'webpack';
import './client.css';
import './mainview.css'
const chatinput:HTMLInputElement = document.querySelector(".chatinput>input")
let mute:boolean = false;
let stream:MediaStream;
const urlpraa = new URLSearchParams(location.search)
const qbtn:HTMLButtonElement = document.querySelector(".qbtn")
const roomnaame:string=urlpraa.get("view")
let first:boolean = true;
const constraints = {audio: true, video: false};
const configuration = {iceServers: [{urls: 'stun:stun.l.google.com:19302'},{
    urls: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
	username: 'webrtc@live.com'
    }]};
let remoteView = $('#remote') as HTMLVideoElement;
const sidebar:HTMLDivElement = document.querySelector(".sidemenu-bar")
const chatemp:HTMLTemplateElement = document.querySelector(".chatcont>template")
const chatcont:HTMLDivElement = document.querySelector(".chatcont")
const nonebar = document.querySelector("#nonebar")
const usercolor ="#"+((1<<24)*Math.random()|0).toString(16)
let textt=""
let thisobj:any={};
async function loding() {
    const temp:HTMLTemplateElement = document.querySelector(".sumbtemp")
    const sidebartemp:HTMLTemplateElement = document.querySelector(".sidebartemp")
    const broadarr:Array<any> = await(await fetch("/broadcasting")).json()
    console.log(broadarr)
    broadarr.forEach(v=>{
        const sideclone= sidebartemp.content.cloneNode(true) as DocumentFragment;
        sideclone.querySelector(".names").textContent = v.host_id
        sideclone.querySelector(".namec").textContent = v.broadname
        sideclone.querySelector("a").href = `/client.html?view=${v.Rooms_ID}`
        sidebar.appendChild(sideclone)
        if(v.Rooms_ID==roomnaame){
            thisobj = v
        }
        document.querySelector(".contentinf>strong").textContent = v.views+1
    })
    document.querySelector(".rename").textContent = thisobj.host_id
    document.querySelector(".retitle").textContent = thisobj.broadname
    document.querySelector(".broadinf").textContent = thisobj.info
    document.querySelector(".resub").textContent = thisobj.subj
}

const pl = async (e:Event)=>{
    try{
        await remoteView.play()
    } catch(err){
        await new Promise((res, rej) => setTimeout(res)).then(pl);
    }
};
/*let stream=null;
async function getstream(){
    stream = await navigator.mediaDevices.getUserMedia(constraints)
}
getstream()*/
let clientpc:RTCPeerConnection;
const socket = io("/wrtc");
const chat = io("/chat");
let bulina = false;
let clientnumb:number=null;
function main(){
    const pc = new RTCPeerConnection(configuration);
    stream.getTracks().forEach((track:any) => {
            
        pc.addTrack(track, stream)
    });
    pc.addEventListener('icecandidate', e => {
        if(e.candidate){
            const data = e.candidate.toJSON() as unknown as any;
            if((typeof clientnumb)=="number"){
                console.log(clientnumb)
                data.numbe=clientnumb; 
            }
            socket.emit('cand', data);
        }
    },{once:true});
    
    pc.addEventListener('track', e => {
        if (remoteView.srcObject){
            console.log("false")
            return;
        }
        console.log("true")
        remoteView.srcObject = e.streams[0];
        remoteView.addEventListener("loadstart", pl,{once:true});
        if (first) {
            startchat()
            first = false;   
        }
        
    });
    console.log(pc)
    return pc;
    
}



// Send any ice candidates to the other peer.
socket.emit("Start_Connection",roomnaame);
(async function() {
    textt = await (await fetch('/getuserid')).text()
    socket.emit('sendid',textt)
})();
socket.on('dis', (e:any) => {
    document.body.innerHTML = '<h1 style="color:red">연결이 끊겼습니다.</h1>';
});

socket.on('desc', async (e:any) => {
    if(bulina){
        return
    }
    if (e.type === 'offer') {
        if (first) {
            await getstream("")    
        }
        
        bulina=true
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
        
    } else {
        console.log('Unsupported SDP type.');
    }
});
socket.on('cand', async (e:any) => {
    try{
        if(clientpc){
          
            await clientpc.addIceCandidate(e);
        }
        
    } catch(err){
        console.log(err, e);
    }
});
socket.on("changed",async(e:any)=>{
    console.log('changed')
    socket.emit("sendid",roomnaame)
    remoteView.srcObject=null;
    bulina=false;
    (async function() {
        textt = await (await fetch('/getuserid')).text()
        socket.emit('sendid',textt)
        console.log("Qrewr")
    })();
})
loding()
const sidbtt = document.querySelector(".sbt-r>div")
sidbtt.addEventListener("click",sidbarclick)
function startchat(){
    chat.emit("joinchat", roomnaame)
    chat.on("sendchat",(e:any)=>{
        makechat(e)
        
    })
    qbtn.addEventListener("click", e=>{
        
        const chatobj = {
            text : chatinput.value,
            user :textt,
            time:'오조오억년',
            color:usercolor
        }
        chat.emit("sendchat",chatobj)
        makechat(chatobj)
        chatinput.value=""
    })

}
function makechat(e:any){
    const chattemp = chatemp.content.cloneNode(true) as DocumentFragment 
    const idofchat:HTMLDivElement = chattemp.querySelector(".ID")
    idofchat.textContent = e.user;
    idofchat.style.color = e.color
    chattemp.querySelector(".chatcontext").textContent=e.text
    chatcont.appendChild(chattemp)
}
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
    }
}
async function getstream(e:any){
    
    const meobj:any = navigator.mediaDevices;
    
    stream = await meobj.getUserMedia(constraints)
    clientaudio.srcObject = stream;
    const eventer = document.querySelector(".emie>div")
    eventer.addEventListener("click",e=>{
        const none = eventer.querySelector(".none") as SVGAElement
        const notnone = eventer.querySelector(".notnone") as SVGAElement
        if (none.classList.contains('mute')) {
            stream.getTracks().forEach(e=>{
                e.enabled=false
                mute=true;
            })
            none.classList.contains("mute")
            
        }else{
            stream.getTracks().forEach(e=>{
                e.enabled=true
                mute=false
            })
        }
        none.classList.add("notnone")
        none.classList.remove("none")
        notnone.classList.add("none")
        notnone.classList.remove("notnone")
    })
    
}
const clientaudio:HTMLAudioElement = document.querySelector("#clientaudio")