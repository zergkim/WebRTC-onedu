const nodemailer = require("nodemailer");
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
async function send_mail(e,text){
    let info = await transporter.sendMail({
        from : 'um',
        to : e,
        subject : '인증번호',
        text :text,
        html : text
    })
    return info;
}
module.exports={send_mail}