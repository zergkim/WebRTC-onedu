declare const MediaRecorder:any;
import "./admin.css"
import "./client.css"
import "./mainview.css"
let roomid:string;
let muted:boolean = false;
const chat = io("/chat");
const broadcastart:HTMLDivElement = document.querySelector('#broadcastart')
const broadcastbody:HTMLDivElement = document.querySelector('#broadcastbody')
const quibtt:HTMLButtonElement = document.querySelector(".edit.quit>button")
let started:boolean = false;
let idtext:string = null;
const changebut = document.querySelector(".change>div")
const changefunc = async (e:any)=>{
    stream.getTracks().forEach((v:any)=>{
        v.stop()
    })
    try{
        await getstream(e)
    }catch(e){
        alert("다시시도하거나 브라우저 업데이트")
        changebut.addEventListener("click",e=>{
            changefunc(null)
        },{once:true});
        return; 
    }
    
    socket.emit("changed","")
    console.log("werr")
    changebut.addEventListener("click",e=>{
        changefunc(null)
    },{once:true})
}
changebut.addEventListener("click",async e=>{
    await changefunc(null)
},{once:true})
quibtt.addEventListener("click",(e)=>{
    if(confirm("정말로 방송을 끝내시겠습니까?")){
        console.log("quit")
    }else{
        return;
    }
    location.href = "/"
})
Array.from(document.querySelectorAll(".edit.reed")).forEach((v:HTMLDivElement)=>{
    const gooyfunc=(e:Event)=>{
        const but = e.target as HTMLButtonElement
        const type:String =  but.dataset.type
        let elemet:any;
        if (!v.querySelector("input")) {
            elemet = v.querySelector("select")
        }else{
            elemet = v.querySelector("input")
        }
        if (!elemet.value) {
            alert("값을 입력하시오")
            return;
        }
        socket.emit("editinfo",{
            type:type,
            content : elemet.value
        })
    }
    v.querySelector("button").addEventListener("click",gooyfunc)
})
console.log(broadcastbody)
broadcastbody.style.display="none";
import io  from 'socket.io-client';
import './index.css';
import HtmlWebpackPlugin from "html-webpack-plugin";
const $= document.querySelector.bind(document);
const subtitle:HTMLInputElement = document.querySelector("#subtitle")
const pasbut = Array.from(document.getElementsByName("radio")) as Array<HTMLInputElement>
pasbut[0].click()
const startbroad:HTMLButtonElement = document.querySelector("#startbroad")
const info : HTMLInputElement = document.querySelector('#info')
const getuserm:HTMLButtonElement = document.querySelector('#getuserm')
// chwal:HTMLButtonElement = document.querySelector('button')
const constraints = 
{
    audio: true, 
    video: { 
        frameRate: { ideal: 60, max: 60 } ,
        width:{ideal:1920},
        height:{
            ideal:1080
        }
    }
};
const configuration = {iceServers: [
    {urls: 
    'stun:stun.l.google.com:19302'
    },
    {
	urls: 'turn:numb.viagenie.ca',
    credential: 'muazkh',
	username: 'webrtc@live.com'
    }]};
const selfView = $('#self');
let fir = false;
let stream:any=null;
let stre:any;
async function getstream(e:any){
    
    const meobj:any =navigator.mediaDevices;
    
    stream = await meobj.getDisplayMedia(constraints)
    selfView.srcObject = stream;
    if (!started) {
        broadcastart.appendChild(selfView)
        stre = await navigator.mediaDevices.getUserMedia({
            audio: true, 
            video: false
        })
        if (muted) {
            stre.getTracks().forEach((e:any)=>{
                e.enabled=false;
            })
        }
        const eventer = document.querySelector(".emie>div")
        eventer.addEventListener("click",e=>{
            const none = eventer.querySelector(".none") as SVGAElement
            const notnone = eventer.querySelector(".notnone") as SVGAElement
            if (none.classList.contains('mute')) {
                stre.getTracks().forEach((e:any)=>{
                    e.enabled=false
                    muted = true;
                })
                none.classList.contains("mute")
                
            }else{
                stre.getTracks().forEach((e:any)=>{
                    e.enabled=true
                    muted = false;
                })
            }
            none.classList.add("notnone")
            none.classList.remove("none")
            notnone.classList.add("none")
            notnone.classList.remove("notnone")
        })
        
    }
    
    selfView.play()
}
const pcarr:Array<webkitRTCPeerConnection>=[];
const socket = io('/wrtc'); 

async function createsocket(subtitle:string){
    
    socket.on("OtherSocket",(e:any)=>{
    
        socket.emit("OtherSocket",e)
    })
    socket.on("Get_RoomsID",(e:any)=>{
        roomid = e;
        console.log(e, "Wrerrewre")
        startchat()
    })
    socket.on('start', async (string:string) => {
        const pc = main();
        try {
            // Get local stream, show it in self-view, and add it to be sent.
            
            const good = stream.getTracks()
            const good2 = stre.getTracks()
            good.push(good2[0])
            good.forEach((track:any) => {
            
                pc.addTrack(track, stream)
                console.log(track)
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
    socket.emit("Start_Room","")
    const text = await (await fetch("/getuserid")).text()
    idtext = text;
    socket.emit("get_id",{
        name:subtitle,
        id:text,
        info : info.value,
        subj : opt.value
    })
}
function main(){
    const pc = new RTCPeerConnection(configuration);
    pc.addEventListener('negotiationneeded', async () => {
        console.log("sdp",Date.now())
        try {
            const off = await pc.createOffer()
            console.log(off)
            await pc.setLocalDescription(off);
            
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
            console.log("icde",e.candidate)
            const data = e.candidate.toJSON();
            socket.emit('cand', data);
        }
    },{once:true});
    pc.addEventListener('track', e => {
        const remoteView:HTMLAudioElement = document.createElement("audio")
        remoteView.style.display="none";
        document.body.appendChild(remoteView)
        if (remoteView.srcObject){
            console.log("false")
            return;
        }
        console.log("true")
        remoteView.srcObject = e.streams[0];
        remoteView.addEventListener("loadstart", (e)=>{
            remoteView.play()
        },{once:true});
    });
    return pc;
    
}
getuserm.addEventListener('click',getuserfunc,{once:true});



async function getuserfunc(){
    try{
        await getstream("e")
    }
    catch(e){
        alert("오류!!! 브라우저 버전이 낮을경우 업데이트후 실행");
        return
    }
    startbroad.addEventListener('click',startbroadfunc,{once:true})
    if (!started) {
        started = true;
    }
}
const opt:HTMLSelectElement = document.querySelector("#optioner")
async function startbroadfunc(e:any){
    console.log(subtitle)
    const title = subtitle.value;
    let bul:boolean = false
    let pasbutvalue:string = ""
    for(let i of pasbut){
        if(i.checked){
            pasbutvalue = i.value
            break;
        }
    }
    try{
        if(!title){
            alert('잘못된제목')
            
            bul = true
        }
        if(!info.value){
            bul = true;
            alert("정보입력")
        }
        if (!opt.value) {
            bul=true
            alert("과목선택")
        }
        if(bul){
            startbroad.addEventListener('click',startbroadfunc,{once:true})
            return;
        }

        await createsocket(title)
        alert("성공적으로 방송을 열었습니다")
        broadcastbody.style.display="flex"
        document.querySelector(".videocont>.re").appendChild(selfView)
        broadcastart.style.display="none"
        
    }catch(e){
        alert('방송을 여는데 문제가 생겼습니다 !!! \n다시 시도하거나 다른브라우저를 이용해주세요')
    }
}
const chatemp:HTMLTemplateElement = document.querySelector(".chatcont>template")
const chatcont:HTMLDivElement = document.querySelector(".chatcont")
const qbtn:HTMLButtonElement = document.querySelector('.chatbtn')

const chatinput:HTMLInputElement = document.querySelector(".chatinput>input")
const usercolor ="#"+((1<<24)*Math.random()|0).toString(16)
function makechat(e:any){   
    const chattemp = chatemp.content.cloneNode(true) as DocumentFragment 
    const idofchat:HTMLDivElement = chattemp.querySelector(".ID")
    idofchat.textContent = e.user;
    idofchat.style.color = e.color
    chattemp.querySelector(".chatcontext").textContent=e.text
    chatcont.appendChild(chattemp)
    
}
function startchat(){
    console.log("good")
    qbtn.addEventListener('click', (e)=>{
        const chatobj = {
            text : chatinput.value,
            user :idtext+" (방송자)",
            time:'오조오억년',
            color:usercolor
        }
        chat.emit("sendchat",chatobj)
        makechat(chatobj)
        chatinput.value=""
    })
    chat.emit("joinchat", roomid)
    chat.on("sendchat",(e:any)=>{
        makechat(e)
        
    })
    console.log(qbtn)
    

}
// Send any ice candidates to the other peer.
