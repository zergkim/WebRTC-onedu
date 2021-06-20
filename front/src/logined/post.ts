import { Socket } from "dgram"
import io from "socket.io-client"
const timpar:HTMLDivElement = document.querySelector('#timestampdiv>div')
const sstart:HTMLButtonElement = document.querySelector("#start")
const send:HTMLButtonElement = document.querySelector("#end")
const timestd:HTMLDivElement = document.querySelector("#timestampdiv")
const button:HTMLButtonElement = document.querySelector("#button")
const videoinp:HTMLInputElement = document.querySelector("#video")
const imginp:HTMLInputElement = document.querySelector("#img")
const videosource:HTMLSourceElement = document.querySelector("source");
const video:HTMLVideoElement = document.querySelector("video")
const socket = io(location.origin);
const timestparr:Array<any> = [];
const getid = async()=>{
    let d = await(await fetch("/postid")).text()
    console.log()
    return d;
    
};
const timestamp_func=(n:number)=>{
    
    n=Math.floor(n)
    timestd.style.display="inherit"
    const input_Tag:HTMLInputElement = timestd.querySelector("#numb_t")
    const bttof_t = timestd.querySelector("button")
    const text_t:HTMLInputElement = timestd.querySelector("#timetext")
    const span_t = timestd.querySelector("span")
    const t_Table = document.querySelector("#timestampview")
    const viewdiv:HTMLDivElement = document.querySelector("#viewdiv")
    viewdiv.style.display='inherit'
    input_Tag.max=JSON.stringify(n)
    input_Tag.min='0'
    bttof_t.addEventListener("click",e=>{
        if(Number(input_Tag.value)>Number(input_Tag.max)){
            console.log(input_Tag.value,input_Tag.max)
            timestd.style.display="none"
            return;
        }
        if(input_Tag.value==span_t.innerText){
            return;
        }
        console.log("d")
        let tr = document.createElement("tr")
        let t_ar = [span_t.innerText,input_Tag.value,text_t.value]
        t_ar.forEach(v=>{
            tr.innerHTML+=`<td>${v}</td>`
        })
        t_Table.appendChild(tr)
        timestparr.push(t_ar)
        span_t.innerText = input_Tag.value
        if(input_Tag.value==input_Tag.max){
            timestd.style.display="none"
            return;
        }else{
            input_Tag.min=`${Number(input_Tag.value)+1}`
            input_Tag.value=`${Number(input_Tag.value)+1}`;
        }
    })
}
videoinp.addEventListener('change',async e => {
    const file1 = videoinp.files[0]
    const flink = URL.createObjectURL(file1);
    videosource.src=flink
    videosource.type=file1.type
    video.load();
    await video.play();
    setTimeout(() => {
        timestamp_func(video.duration)
    }, 380);
})
button.addEventListener("click",async e=>{
    if(!confirm("진짜 올리시겠습니까?")){
        return
    }
    
    
    const file1 = videoinp.files[0]
    
    
    const file2 = imginp.files[0]
    if(file1.type.split("/")[0]!=="video"){
        alert("비디오 또는 사진이 아닙니다")
        return;
    }
    if(file2.type.split("/")[0]!=="image"){
        alert("사진이 아닙니다")
        return;
    }
    const infobj={}
    const user_ip = await(await fetch("/userip")).text()
    const typeofv = file1.type.split("/")[1]
    const typeofi = file2.type.split("/")[1]
    const name = await getid()
    
    let objed = JSON.stringify({
        "user":user_ip,
        typeofv,
        typeofi,
        timestparr,
        chat :[]
    });
    (async function(){
        const arr:[File|string, string, string][] = [
            [file1, "application/octet-stream","/videopost"],
            [file2, "application/octet-stream","/imgpost"],
            [objed, "application/json","/objpost"]
        ];
        for(let v of (arr)){

            let message = await fetch(`${v[2]}?name=${name}`,{
            method:"POST",
            headers:{
                "Content-Type":v[1]
            },
            body:v[0]
            
            })
            if(v[1]=="application/json"){
                alert(await message.text())
            }
        }
    })();
    
    
})


