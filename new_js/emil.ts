import nodemailer from "nodemailer";
let transporter = nodemailer.createTransport({
    service : 'gmail',
    host : 'smtp.gmail.com',
    port : 587,
    secure : false,
    auth:{
        user : "dogmansik06@gmail.com",
        pass : "ohkim680928~^^"
    }
});
export async function send_mail(e:string,text:string){
    let info = await transporter.sendMail({
        'from' : '인증번호자동메일러',
        'to' : e,
        'subject' : '인증번호',
        'text' :text,
        'html' : text
    },(e)=>{
        console.log(e)
    })
    return info;
}