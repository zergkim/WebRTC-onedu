const realname:HTMLInputElement = document.querySelector("#realname")
const birth:HTMLInputElement = document.querySelector("#jumindrungrok")
const sex:HTMLInputElement = document.querySelector("#sexselector")
let flag={
    idbul :false,
    emailbul :false
}
const mail:HTMLInputElement = document.querySelector('#e-mail');
const cbtt:HTMLButtonElement = document.querySelector('#Certificationbtt')
const cerdiv:HTMLDivElement = document.querySelector("#emailcer")
const cerbtt:HTMLButtonElement = document.querySelector("#emailcer>button")
const cerinput:HTMLButtonElement  = document.querySelector("#emailcer>input")
const emailar:Array<any> = [];
const passwordaid:HTMLDivElement = document.querySelector("#passwordaid")
const idconfirm:HTMLButtonElement = passwordaid.querySelector("button")
const idinp:HTMLInputElement =passwordaid.querySelector("input[type='text']")
const passwordinp:HTMLInputElement = passwordaid.querySelector("input[type='password']")
const allbutton:HTMLButtonElement = document.querySelector("#allconfirm")
idconfirm.addEventListener("click",async e=>{
    const id_Text = idinp.value
    let fetch_id = await fetch("/id_unique",{
        method:"POST",
        headers:{
            "Content-type":"text/plain"
        },
        body:id_Text
    })
    if(fetch_id.text()){
        flag.idbul=true;
        idinp.addEventListener("change",e=>{
            flag.idbul=false
        })
    }
})
allbutton.addEventListener("click",async e=>{
    if(!flag.idbul){
        alert("id다시확인")
        return;
    }
    if(!flag.emailbul){
        alert("email다시확인")
        return;
    }
    interface Fetch_Promise{
        text:Function;
    }
    let reqt:Fetch_Promise = await fetch("/signinconfirm",
    {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            
            username:idinp.value,
            sex:sex.value,
            birth : birth.value,
            passwords:passwordinp.value,
            name:realname.value,
            email : emailar[0]
        })
    })
    const returntext:string = await reqt.text()
    if(returntext=="성공"){
        location.href="/login"
    }
})
const reg = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
mail.pattern = reg.source;
const post_obj = function(body:any,type:string){
    const type_obj:any = {"file":"application/octet-stream","json":"application/json"}
    let temple = {
        method:"POST",
        headers:{
            "Content-Type":type_obj[type]
        },
        body:JSON.stringify(body)
    }
    return temple;

}
const checkfunc = async (e:any)=>{
    let d = await(await fetch("/certpost",post_obj({EmailAdr:emailar[0],number:cerinput.value},"json"))).text()
    console.log(d)
    if(d){
        alert("성공")
        emailar
        flag.emailbul=true
    }
}
const cerefunc = async (e:any)=>{
    if(!mail.validity.valid){
        alert("이메일주소가 잘못됨!!!");
        cbtt.addEventListener("click",cerefunc,{once:true})
        return;
    }
    const email:string = mail.value;
    console.log(email)
    console.log(post_obj({email},"json"))
    if(await(await fetch("/email_send",post_obj({email},"json"))).text()){
        cerdiv.style.display="inherit"
        cerbtt.addEventListener("click",checkfunc)
        emailar.push(email)
    }else{
        alert("이메일 중복이다 애미뒤진년아 다른거 써라")
        cbtt.addEventListener("click",cerefunc,{once:true})
    }
    
};

cbtt.addEventListener("click",cerefunc,{once:true})