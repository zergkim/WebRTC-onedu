const realname:HTMLInputElement = document.querySelector("#realname")
const birth:HTMLInputElement = document.querySelector("#jumindrungrok")
let flag={
    idbul :false,
    emailbul :false
}
const mail:HTMLInputElement = document.querySelector('#e-mail');
const cbtt:HTMLButtonElement = document.querySelector('#Certificationbtt')
const cerdiv:HTMLDivElement = document.querySelector("#emailcer")
const cerbtt:HTMLButtonElement = document.querySelector("#emailcer>button")
const cerinput:HTMLButtonElement  = document.querySelector("#emailcer>div>input")
const userimgbut:HTMLButtonElement = document.querySelector("button.userimg")
const filee:HTMLInputElement = document.querySelector(".file")
userimgbut.addEventListener("click",e=>{
    filee.click()
})
const emailar:Array<any> = [];
const idconfirm:HTMLButtonElement = document.querySelector(".idconfirm")
const idinp:HTMLInputElement =document.querySelector("#IDINPUT")
const passwordinp:HTMLInputElement = document.querySelector("#PASSWORDINPUT")
passwordinp.minLength=8;
const reqer = /^\S*[A-Za-z]{3,50}\S*/
passwordinp.pattern=reqer.source
const allbutton:HTMLButtonElement = document.querySelector("#allconfirm")
const inputcheck:HTMLInputElement = document.querySelector(".inputcheck")
inputcheck.addEventListener("change",e=>{
    inputcheck.pattern = passwordinp.value
})
idconfirm.addEventListener("click",async e=>{
    const id_Text = idinp.value
    console.log(id_Text)
    let fetch_id = await fetch("/id_unique",{
        method:"POST",
        headers:{
            "Content-type":"text/plain"
        },
        body:id_Text
    })
    if(await fetch_id.text()){
        alert("사용가능한 id")
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
    if (!inputcheck.validity) {
        alert("비밀번호 확인 제대로 입력")
        return;
    }
    if (!filee.files[0]) {
        alert("유저이미지 파일확인")
        return;
    }
    interface Fetch_Promise{
        text:Function;
    }
    let sexvalue:string = ""
    if (Number(birth.value[birth.value.length-1])%2==1) {
        sexvalue="남"
    }else{
        sexvalue="여"
    }
    let reqt:Fetch_Promise = await fetch("/signinconfirm",
    {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            
            ID:idinp.value,
            sex:sexvalue,
            birth : birth.value,
            passwords:passwordinp.value,
            name:realname.value,
            email : emailar[0],
            videolist:[],
            lplaylist:[],
            broadcastlist:[],
            subplaylist:[],
            subuserlist:[]
        })
    })
    let reeqt:Fetch_Promise = await fetch("/userimgpost",
    {
        method:"POST",
        headers:{
            "Content-Type":"application/octet-stream"
        },
        body:filee.files[0]
    })
    const returntext:string = await reqt.text()
    const reeqtt:string=await reeqt.text()
    if(returntext=="성공"&&reeqt){
        alert("성공!! 로그인창으로 가겠습니다")
        location.href="/login"
    }else{
        alert("실패 다시시도 해주세요")
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
    console.log(',werer',d)
    if(d==="성공"){
        alert("성공")
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
    let feewf = await(await fetch("/email_send",post_obj({email},"json"))).text()
    console.log(feewf)
    if(feewf){
        
        
        cerbtt.addEventListener("click",checkfunc)
        emailar.push(email)
    }else{
        alert("이메일 중복")
        cbtt.addEventListener("click",cerefunc,{once:true})
    }
    
};

cbtt.addEventListener("click",cerefunc,{once:true})