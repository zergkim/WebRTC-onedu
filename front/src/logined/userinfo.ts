
const prepass:HTMLInputElement = document.querySelector(".prepass")
const passch:HTMLInputElement = document.querySelector(".passch")
const passconf:HTMLInputElement = document.querySelector(".passconf")
const passwordconfbut = document.querySelector(".passwordconfbut")
const select = document.querySelector(".select")
const file:HTMLInputElement = document.querySelector(".file")
select.addEventListener('click',(e)=>{file.click()})
const upload = document.querySelector('.upload')

upload.addEventListener("click", async e=>{
    if (!file.files[0]) {
        alert("파일을 선택하시오")
    }
    if(await (await fetch("/userimgpost",{
        'method':'POST',
        headers:{
            'Content-Type':"application/octet-stream"
        },
        body:file.files[0]
    })).text()){
        alert("성공")
    }else{
        alert('실패')
    }
})
const reqere = /[0-9]*[A-Za-z]{3,50}[0-9\!\^\*]*/ 
passch.pattern=reqere.source;
passch.minLength=8
prepass.pattern = reqere.source
prepass.minLength=8
passconf.addEventListener('change',e=>{
    passconf.pattern=passch.value
})

passwordconfbut.addEventListener("click",async e=>{
    if (passconf.validity&&passconf.validity&&prepass.validity) {
        
    }else{
        alert("비밀번호는 8자리이상 영문 3개 이상이 섞여야합니다")
        return;
    }
    if(!await (await fetch(`/changepassword?change=${passch.value}&&pre=${prepass.value}`)).text()){
        alert("비밀번호가 틀림!!!")
    }
})
