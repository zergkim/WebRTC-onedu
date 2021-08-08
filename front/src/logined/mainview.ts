import './mainview.css';/*
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
    
},)*/
async function loding() {
    const temp:HTMLTemplateElement = document.querySelector(".sumbtemp")
    const listarr:Array<string> = await(await fetch("/getlplaylist")).json()
    const temp2:HTMLTemplateElement = document.querySelector(".contemp")
    console.log(listarr)
    for(let i of listarr){
        const videolist:Array<string> = await(await fetch("/lplaylistvideolist",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body: JSON.stringify({name:i})
        })).json()
        
        const clon = temp.content.cloneNode(true) as DocumentFragment
        const title = clon.querySelector<HTMLHeadingElement>(".subj>h1")
        console.log(videolist)
        console.log(clon)
        const de = clon.querySelector(".sumblist")
        console.log(videolist)
        const videolistfor=async ()=>{
            
            for (let v of videolist){
                const videoinfo = await (await fetch(`/getvideoinfo?id=${v}`)).json()
                const clon2 = temp2.content.cloneNode(true) as DocumentFragment
                const img:HTMLImageElement = clon2.querySelector(".sumb>img")
                img.src = `/img/${v}.${videoinfo.typeofi}`
                const vtitle = clon2.querySelector(".erti")
                const vtitlea=vtitle.parentElement as HTMLAnchorElement;
                console.log(vtitlea)
                vtitlea.href=`/watchview?view=${v}`
                console.log(v)
                const usertitle = clon2.querySelector('.userti')
                usertitle.textContent = videoinfo.ID;
                const usertitlea =  usertitle.parentElement as HTMLAnchorElement
                usertitlea.href = "/"
                vtitle.textContent = videoinfo.vname;
                const sumb = clon2.querySelector('.sumb')
                console.log(sumb)
                const sumba:any = sumb.parentElement as HTMLAnchorElement
                sumba.href = `/watchview?view=${v}`
                de.appendChild(clon2)
            }
        }
        videolistfor()
        console.log(title)
        title.textContent = `${i} (수강중인 강의 영상)`
        mainview.appendChild(clon)
    }
}

const sidbtt = document.querySelector(".sbt-r>div")
const sidebar = document.querySelector(".sidemenu-bar")
const nonebar = document.querySelector("#nonebar")
const mainview = document.querySelector(".mainview")
const vdrbar = document.querySelector(".vdrbar")
const divarr:Array<HTMLDivElement> = [document.querySelector(".top"),document.querySelector(".center"),document.querySelector(".bottom")]
const svgbutton:HTMLDivElement = document.querySelector("#animbut")
divarr.forEach(v=>{
    console.log(v)
})
svgbutton.addEventListener("click",(e:any)=>{
    
    divarr[0].classList.remove('top')
    divarr[1].classList.remove("center")
    divarr[2].classList.remove("bottom")
    divarr.push(divarr.shift())
    divarr[0].classList.add("top")
    divarr[1].classList.add("center")
    divarr[2].classList.add("bottom")
})
mainview.classList.add("or")
nonebar.classList.add("or")
console.log(sidebar)
sidbtt.addEventListener("click",sidbarclick)
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
        vdrbar.classList.remove("sc")
        smb.style.width='240px'
        arrw.forEach(v=>{v.classList.remove("jcent")})
    }else{
        arr.forEach(v=>{
            v.classList.add('none')
           
        })
        vdrbar.classList.add("sc")
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
loding()