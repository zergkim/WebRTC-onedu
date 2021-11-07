import { Fragment } from "hls.js";

const templat:HTMLTemplateElement = document.querySelector("template");
const tbody:HTMLTableSectionElement = document.querySelector("tbody");
tbody.addEventListener("click",e=>{
    const target = e.target as HTMLElement;
    if (target.tagName=='INPUT') {
        return;
    }else if (target.tagName=='TR') {
        location.href=target.dataset.link
    }else{
        target.parentElement.click()
    }
})
const button:HTMLButtonElement = document.querySelector("button.btn-danger");
const main = async function () {
    let count = 1;
    for(let v of (await(await fetch("/usersplaylist")).json())){
        const template:any = templat.content.cloneNode(true)
        const numb =  template.querySelector('.videonumb')
        numb.textContent = `${v.videos.length}`
        const sooncer = template.querySelector('.numb')
        sooncer.textContent = `${count}`;
        const name = template.querySelector(".name")
        name.textContent=v.NAME
        const check = template.querySelector("input")
        check.dataset.name = v._id
        console.log(template)
        template.querySelector("tr").dataset.link = `/playlistpage?view=${v._id}`
        tbody.appendChild(template)
        count++;
        
        
        
    }
}
main()
document.body.addEventListener("click",(e:Event)=>{
    const tag = e.target as HTMLElement
    if(tag.tagName=='INPUT'){
        const tge = tag as HTMLInputElement
        if (tge.classList.contains('checked')) {
            tge.classList.remove("checked")
        }else{
            tge.classList.add("checked")
        }
    }
})
button.addEventListener("click",async e=>{
    console.log('ewr')
    let array = Array.from(document.querySelectorAll(".checked"))
    const array2 = array.map((v:HTMLElement)=>v.dataset.name) as any
    console.log(array2)
    location.reload()
    await fetch("/deleteplaylist",{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify(array2)});
    
})
const button2 = document.querySelector("button.btn-primary")
button2.addEventListener("click",async(e)=>{
    const text:HTMLInputElement = document.querySelector("input.form-control")
    const etext = text.value
    if (!text) {
        alert("플레이리스트 이름입력")
    }
    await fetch('/playlistpost',{method:'POST',headers:{"Content-Type":"application/json"},body:JSON.stringify({
        name:etext
    })})
    location.reload()
})