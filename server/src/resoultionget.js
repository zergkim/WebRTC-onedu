const install = require('@ffprobe-installer/ffprobe')
const ffmpeg = require('fluent-ffmpeg')
ffmpeg.setFfprobePath(install.path)
module.exports.func = (path)=>{
    ffmpeg.ffprobe(path,(err,metadata)=>{
        if(err){

        }else{
            console.log(metadata)
        }
    })
}