import HtmlWebpackPlugin from 'html-webpack-plugin';
import './user.css';
const urlpraa = new URLSearchParams(location.search)
const urlpra:string=urlpraa.get("view")
const user = document.querySelector("#usercontent")
const temp:HTMLTemplateElement = document.querySelector("#good")
let arr:Array<string>;
const start = async ()=>{
    const fetarr = await (await fetch("/getuserlist?user="+urlpra)).json()
    arr= fetarr.videolist.map((v:string)=>v)
    for (let v of arr){
        const clone = temp.content.cloneNode(true) as HTMLElement
        const de:any = await (await fetch(`/getvideoinfo?id=${v}`)).json()
        clone.querySelector("img").src=`/img/${v}.${de.typeofi}`
        clone.querySelector(".videojemok").textContent = de.vname
        user.appendChild(clone)
    }
}

start()
