import './login.css';
import io  from 'socket.io-client';
console.log(io);
const id:HTMLInputElement = document.querySelector("#id")
const password:HTMLInputElement = document.querySelector("#password")
const but:HTMLButtonElement  = document.querySelector("button")
but.addEventListener("click",async e=>{
    const text = await (await fetch("/login",{
        method:"POST",
        headers:{
            "Content-Type":'application/json'
        },
        body:JSON.stringify({
            userid:id.value,
            passwords:password.value
        })
    })).text()
    if(text==="good"){
        location.href="/main"
    }else{
        alert(text)
    }
})