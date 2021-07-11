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
const inputer:HTMLSelectElement = document.querySelector("#er")

const timestparr:Array<any> = [];
const getid = async()=>{
    let d = await(await fetch("/postid",{
        method:"POST",
        headers:{
            "Content-Type":"application/text"
        },
        body:""
        
        })).text()
    console.log()
    return d;
    
};

videoinp.addEventListener('change',async e => {
    const file1 = videoinp.files[0]
    const flink = URL.createObjectURL(file1);
    videosource.src=flink
    videosource.type=file1.type
    video.load();
    await video.play();
})
button.addEventListener("click",async e=>{
    if(!confirm("진짜 올리시겠습니까?")){
        return
    }
    
    
    const file1 = videoinp.files[0]
    
    
    const file2 = imginp.files[0]
    if(!inputer.value){
        alert("과목선택하시오")
        return;
    }
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
    alert(name)
    let objed = JSON.stringify({
        "user":user_ip,
        typeofv,
        typeofi,
        timestparr,
        chat :[],
        subj : inputer.value
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


