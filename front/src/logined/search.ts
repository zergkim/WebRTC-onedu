import './mainview.css';
import './user.css'
/*
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
const urlpraa = new URLSearchParams(location.search)
const urlpra:string=urlpraa.get("view")
let searched:any;
async function loding() {
    const userid = await (await fetch("/getuserlist")).json()
    console.log(userid)
    searched = await (await fetch("/search?search="+urlpra)).json()
    console.log(searched)
    const temp:HTMLTemplateElement = document.querySelector(".sumbtemp")
    const videocontdiv=mainview.querySelector('div.videocontdiv')
    const sidebartemp:HTMLTemplateElement = document.querySelector(".sidebartemp")
    const broadarr:Array<any> = await(await fetch(`/broadcasting?e=${"op"}`)).json()
    console.log("wer:",broadarr)
    broadarr.forEach(v=>{
        const sideclone= sidebartemp.content.cloneNode(true) as DocumentFragment;
        sideclone.querySelector(".names").textContent = v.host_id
        sideclone.querySelector('.namec').textContent = v.broadname
        sideclone.querySelector("a").href = `/client.html?view=${v.Rooms_ID}`
        sideclone.querySelector('img').src = `/userimg/${v.host_id}.jpg`
        sidebar.appendChild(sideclone)
    })
    const temp2:HTMLTemplateElement = document.querySelector(".contemp")
    const usersumbconte = document.querySelector(".usersumbcont")
    const playlisttemp:HTMLTemplateElement = document.querySelector(".playlisttemp")
    const playlistcont = document.querySelector(".playlistcont")
    const playlistfor=async (userlist:any)=>{
        const length_numb = userlist.length
        let count = 0;
        for(let cont of userlist){
            console.log(cont)
            const ID = cont.NAME
            const _id = cont._id
            const host_id = cont.ownerID;
            const usersumbcont:HTMLTemplateElement = document.querySelector('#usersumbcont')
            const doccont = playlisttemp.content.cloneNode(true) as DocumentFragment
            const username:HTMLSpanElement = doccont.querySelector(".usernamed>a>span")
            const buttoning = doccont.querySelector("button")
            let bulina = false;
            console.log(cont.subplaylist)
            for(let i of userid.subplaylist){
                
                if (i==_id) {
                    bulina = true;
                    break;
                }
            }
            if (bulina) {
                buttoning.classList.add("sub")
                buttoning.textContent="구독중"
            }
            buttoning.dataset.text=_id
            console.log(username)
            username.textContent = ID
            const dogtext = doccont.querySelector(".userinfo>span")
            dogtext.textContent = host_id
            Array.from(doccont.querySelectorAll("a")).forEach(v=>v.href="/user?user="+_id)
            playlistcont.appendChild(doccont)
            console.log(doccont)
            count++;
        }
        
    }
    playlistfor(searched.PLAYLIST)
    const usermore:HTMLDivElement = document.querySelector(".usermore")
    
    const userlistfor=async (userlist:any)=>{
        let bull = false;
        console.log(searched)
        for(let c=0;c<9;c++){
            const cont = searched.Users[c]
            if (!cont) {
                bull = true;
                usermore.style.display='none'
                break;
            }
            const ID = cont.ID
            const _id = cont._id
            const videogasu = cont.videolist.length
            const usersumbcont:HTMLTemplateElement = document.querySelector('#usersumbcont')
            const doccont = usersumbcont.content.cloneNode(true) as DocumentFragment
            const imgcont:HTMLImageElement =  doccont.querySelector(".divimgcont>a>img")
            const buttoning = doccont.querySelector("button")
            let bulina = false;
            
            for(let i of userid.subuserlist){
                if (i==ID) {
                    bulina = true;
                    break;
                }
            }
            if (bulina) {
                buttoning.classList.add("sub")
                buttoning.textContent="구독중"
            }
            buttoning.dataset.text=ID
            console.log(imgcont)
            imgcont.src = '/userimg/'+ID+".jpg"
            const username:HTMLSpanElement = doccont.querySelector(".usernamed>a>span")
            username.textContent = ID
            const dogtext = doccont.querySelector(".dogtext")
            dogtext.textContent = videogasu
            Array.from(doccont.querySelectorAll("a")).forEach(v=>v.href="/user?user="+_id)
            usersumbconte.appendChild(doccont)
            console.log(doccont)
        }
        if (!bull) {
            return userlist.slice(9)
        }
    }
    searched.Users = await userlistfor(searched.Users)
    usermore.addEventListener("click",async e=>{
        searched.Users = await userlistfor(searched.Users)
    })
    const videomore:HTMLDivElement = document.querySelector(".videomore")
    const videolistfor=async (videolist:any)=>{
       
        console.log(videolist)
        let count = 0;
        let bulll = false;  
        for (let c=0;c<12;c++){
            const ve = videolist[c]
            if (!ve) {
                
                bulll = true;
                videomore.style.display='none'
                break;
            }
            const v = ve._id
            const videoinfo = await (await fetch(`/getvideoinfo?id=${v}`)).json()
            const clon2 = temp2.content.cloneNode(true) as DocumentFragment
            const img:HTMLImageElement = clon2.querySelector(".sumb>img")
            const vimg:HTMLImageElement = clon2.querySelector(".vinfo>img")
            img.src = `/img/${v}.${videoinfo.typeofi}`
            vimg.src = `/userimg/${videoinfo.ID}.jpg`
            const vtitle = clon2.querySelector(".erti")
            const vtitlea=vtitle.parentElement as HTMLAnchorElement;
            console.log(vtitlea)
            vtitlea.href=`/watchview?view=${v}`
            console.log(v)
            const usertitle = clon2.querySelector('.userti')
            usertitle.textContent = videoinfo.ID;
            const usertitlea =  usertitle.parentElement as HTMLAnchorElement
            usertitlea.href = "/"
            vtitle.textContent = videoinfo.title;
            const sumb = clon2.querySelector('.sumb')
            console.log(sumb)
            console.log(clon2)
            const sumba:any = sumb.parentElement as HTMLAnchorElement
            sumba.href = `/watchview?view=${v}`
            videocontdiv.appendChild(clon2)
            
        }
        if (!bulll) {
            return videolist.slice(12);
        }
    }
    searched.Videodata = await videolistfor(searched.Videodata)
    videomore.addEventListener("click",async e=>{
        console.log(searched)
        searched.Videodata = await videolistfor(searched.Videodata)
    })
    playlistcont.addEventListener("click",(e:Event)=>{
        const targ = e.target as unknown as HTMLElement
        if(targ.nodeName=='BUTTON'){
            if (targ.classList.contains("sub")) {
                targ.textContent="구독"
                targ.classList.remove('sub')
                
                fetch("/sub?suj=66564",{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        ifsub:"",
                        text:targ.dataset.text
                    })
                })
            }else{
                fetch("/sub?suj=66564",{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        ifsub:"true",
                        text:targ.dataset.text
                    })
                })
                targ.textContent="구독중"
                targ.classList.add('sub')
            }
        }
    })
    usersumbconte.addEventListener("click",(e:Event)=>{
        const targ = e.target as unknown as HTMLElement
        if(targ.nodeName=='BUTTON'){
            if (targ.classList.contains("sub")) {
                targ.textContent="구독"
                targ.classList.remove('sub')
                fetch("/sub?suj=user",{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        ifsub:"",
                        text:targ.dataset.text
                    })
                })
            }else{
                targ.textContent="구독중"
                targ.classList.add('sub')
                fetch("/sub?suj=user",{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        ifsub:"true",
                        text:targ.dataset.text
                    })
                })
            }
        }
    })
}

const sidbtt = document.querySelector(".sbt-r>div")
const sidebar = document.querySelector(".sidemenu-bar")
const nonebar = document.querySelector("#nonebar")
const mainview = document.querySelector(".mainview")


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
loding()