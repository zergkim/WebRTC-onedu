import './mainview.css'
import './userpage.css'
const sidebar = document.querySelector(".sidemenu-bar")
const nonebar = document.querySelector("#nonebar")
const mainview:HTMLDivElement = document.querySelector(".mainview")

const inputsearch:HTMLInputElement = document.querySelector(".inputsearch>input")
const inputbutton:HTMLButtonElement = document.querySelector(".inputsearch>button")
inputbutton.addEventListener("click",e=>{
    location.href=`/search.html?view=${inputsearch.value}`
})
inputsearch.addEventListener("keydown",(e)=>{
    if(e.key=='Enter'){inputbutton.click()}
})
const sidbtt = document.querySelector(".sbt-r>div")
const urlpraa = new URLSearchParams(location.search)
const h3:HTMLHeadElement = document.querySelector(".subj>h3")
const urlpra:string=urlpraa.get("view")

async function loding() {
    const videolist = await (await fetch("/lplaylistvideolist",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({name:urlpra})
    })).json()
    videolist.pop()
    console.log(videolist)
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
    const temp:HTMLTemplateElement = document.querySelector(".contemp")
    const de:HTMLDivElement = document.querySelector(".sumblist")
    const playlistname = await (await fetch("playlistname?id="+urlpra)).text()
    h3.innerText = "재생목록 '"+playlistname+"'의 동영상"
    videolist.forEach(async(e:string)=>{
        const videoinfo = await (await fetch(`/getvideoinfo?id=${e}`)).json()
        
        
        const clon2 = temp.content.cloneNode(true) as DocumentFragment
                    const img:HTMLImageElement = clon2.querySelector(".sumb>img")
                    const img2:HTMLImageElement = clon2.querySelector('.vinfo>img')
                    img2.src=`/userimg/${videoinfo.ID}.jpg`
                    img.src = `/img/${e}.${videoinfo.typeofi}`
                    const vtitle = clon2.querySelector(".erti")
                    const vtitlea=vtitle.parentElement as HTMLAnchorElement;
                    console.log(vtitlea)
                    vtitlea.href=`/watchview?view=${e}`
                    console.log(e)
                    const usertitle = clon2.querySelector('.userti')
                    usertitle.textContent = videoinfo.ID;
                    const usertitlea =  usertitle.parentElement as HTMLAnchorElement
                    usertitlea.href = "/"
                    vtitle.textContent = videoinfo.title;
                    const sumb = clon2.querySelector('.sumb')
                    console.log(sumb)
                    const sumba:any = sumb.parentElement as HTMLAnchorElement
                    sumba.href = `/watchview?view=${e}`
                    de.appendChild(clon2)
    })
    
   
    
}
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