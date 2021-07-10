import './mainview.css';
const sidebar:HTMLDivElement = document.querySelector('#sidebar')
sidebar.classList.add('bfcksidbar')
const arr:Array<HTMLVideoElement> = Array.from(document.querySelectorAll('.sumbv'))
const temp:HTMLTemplateElement = document.querySelector("template")
const bodycol:HTMLDivElement = document.querySelector("#body-col")
let fetcedata : Array<any>=null;
(async()=>{
    fetcedata = await(await fetch("/viewlist")).json()
    fetcedata.forEach(h=>{
        const clone = temp.content.cloneNode(true) as HTMLElement
        
        const sumb = `/img/${h._id}.${h.typeofi}`
        const newim = document.createElement("img")
        newim.src=sumb
        newim.style.width="100%"
        newim.style.height="100%"
        //sumbimg userimg videojemok userinfo
        clone.querySelector('.sumbimg').appendChild(newim)
        bodycol.appendChild(clone)
    })
})()

arr[1].style.backgroundColor="red"
arr[2].style.backgroundColor="black"
arr[0].classList.add('top')
arr[1].classList.add('center')
let bul:boolean=false;
arr[2].classList.add("bottom")
let ere = 0
const buttone:HTMLButtonElement = document.querySelector("#button")
buttone.addEventListener("click",e=>{
    arr[0].classList.remove('top')
    arr[1].classList.remove("center")
    arr[2].classList.remove("bottom")
    arr.push(arr.shift())
    arr[0].classList.add("top")
    arr[1].classList.add("center")
    arr[2].classList.add("bottom")
})
let but : HTMLImageElement = document.querySelector(".topbar>img")
but.addEventListener("click",e=>{
    let ttxt:string;
    const spp:Array<HTMLSpanElement>= Array.from(document.querySelectorAll(".topbar>span,.listtext"))
    if(bul){
        ttxt=""
        
        arr.forEach(v=>{
            v.classList.add("jungsangsu")
            v.classList.remove("notjungsangsu")
        })
        
    }else{
        ttxt="true"
        
        arr.forEach(v=>{
            v.classList.remove("jungsangsu")
            v.classList.add("notjungsangsu")
        })
        
    }
    bul = !bul
    spp.forEach(h=>{
        if(ttxt){
            h.classList.add("nono")
            sidebar.classList.add("afcksidebar")
        }else{
            h.classList.remove("nono")
            sidebar.classList.remove('afcksidebar')
            
        }
    })
    const ew:Array<HTMLDivElement>=Array.from(document.querySelectorAll(".listtext"))
    ew.forEach(v=>{
        v.style.display=ttxt
    })
    
},)

