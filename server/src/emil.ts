import nodemailer from "nodemailer";
let transporter = nodemailer.createTransport({
    service : 'gmail',
    host : 'imap.gmail.com',
    port : 993,
    secure : false,
    auth:{
        user : "dogmansik06@gmail.com",
        pass : "kimsh060525~$$"
    }
});
export async function send_mail(e:string,text:string){
    let info = await transporter.sendMail({
        'from' : '인증번호자동메일러',
        'to' : e,
        'subject' : '인증번호',
        'text' :text,
        'html' : text 
    })
    console.log(info.messageId)
    return info; 
}