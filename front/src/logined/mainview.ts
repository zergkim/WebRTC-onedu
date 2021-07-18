import './mainview.css';
const sidebar:HTMLDivElement = document.querySelector('#sidebar')
sidebar.classList.add('bfcksidbar')
const arr:Array<HTMLVideoElement> = Array.from(document.querySelectorAll('.sumbv'))
const temp:HTMLTemplateElement = document.querySelector("template")
const bodycol:HTMLDivElement = document.querySelector("#body-col")
const butarr:Array<HTMLElement> = [document.querySelector("#firstin"),document.querySelector("#secondin")]
const Sbtt : HTMLDivElement = document.querySelector("#searchbtt")

butarr[1].style.display="none"
let bule :boolean = true
let fetcedata : Array<any>=null;
(async()=>{
    fetcedata = await(await fetch("/viewlist")).json()
    fetcedata.forEach(h=>{
        const clone = temp.content.cloneNode(true) as HTMLElement
        const sumb = `/img/${h._id}.${h.typeofi}`
        const href =`/watchview?view=${h._id}`
        const werr = Array.from(clone.querySelectorAll(".sumbody, .infobar, .videojemok")) as Array<HTMLElement> 
        werr.forEach(v=>{
            v.dataset.href=href
        })
        const newim:HTMLImageElement = document.createElement("img")
        newim.dataset.href=href
        newim.src=sumb
        newim.style.width="100%"
        newim.style.height="100%"
        //sumbimg userimg videojemok userinfo
        clone.querySelector('.userinfo').textContent=h.username
        if(!h.title){
            clone.querySelector('.videojemok').textContent = "개꿀"
        }else{
            clone.querySelector('.videojemok').textContent = h.title
        }
        clone.querySelector('.sumbimg').appendChild(newim)
        bodycol.appendChild(clone)
    })
    document.body.addEventListener("click", (v:Event)=>{
        const target = v.target as HTMLElement;
        if(!target.dataset.href){
            return;
        }
        location.href = target.dataset.href
    });
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
let but : HTMLElement = document.querySelector(".topbar>svg")
but.addEventListener("click",e=>{
    if(bule){
        butarr[1].style.display='inherit'
        butarr[0].style.display='none'
    }else{
        butarr[0].style.display='inherit'
        butarr[1].style.display='none'
    }
    bule = !bule
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

