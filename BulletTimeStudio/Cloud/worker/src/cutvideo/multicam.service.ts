import { Component } from '@nestjs/common';
import { IWorkerCallback, IEngine } from '../common/worker.interface';
import * as child from "child_process";
import { WorkerUtil } from '../common/worker.util';
import httpclient from "../oss/siiva-oss/httpclient";
import {HttpClientCallback} from "../oss/siiva-oss/httpclient.interface";
const config = require(`../../config/${process.env.NODE_ENV || 'production'}.json`);

const util = require('util');
const bluebird = require('bluebird');
const request = require('request');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs=require('fs');


@Component()
export class MulticamService implements IEngine {
    async cut_video(data, cb: IWorkerCallback) {     
        console.log('MulticamService')
        console.log(data)
        const task = data.task;
        console.log(task)
        let workerUtil = new WorkerUtil();   
        data['worker_id']=WorkerUtil.getWorkerId()
        console.log('----------------------');

        // const start_video  = data.task.src.beginning;
        // const end_video    = data.task.src.end;
        // const video_ttf    = data.task.src.ttf;
        // const video_place  = data.task.src.Place;
        // const video = {
        //     main:data.taskid,
        //     taskId:data.task.taskId,
        //     video: data.task.src.video,
        // }
        try{
           //以taskId为名创建文件夹
            mkdirp(data.task);

            //准备模板

           //   准备视频源
           const downloadMsg = await videoDownload(data, cb);
        //    // 是否需要转场
        //    if (!this.param.rmturn) {
        //       console.log('----------------------')
        //       console.log('需要转场')
        //       console.log('----------------------')
        //       let video_time=String(time).split(" ")[3];
        //        let src=`assets/video/soccer/${data.task.taskId}/${data.task.taskId}.mp4`
        //        let dst_1 = `assets/video/soccer/${data.task.taskId}/tx.mp4`;
        //        await doTx(data,video_time.split(':')[video_time.split(':').length-1], src,dst_1,cb);
        //        dst = dst_1;
        //    }

            //    //贴字 
            //    let addText_input=`assets/video/soccer/${data.task.taskId}/${data.task.taskId}.mp4`;
            //    let addText_output = `assets/video/soccer/${data.task.taskId}/addText.mp4`;
            //    await addtextVideo(data,addText_input,addText_output,cb)
               //贴图片和LOGO
               let addPic_input=`assets/video/soccer/${data.task.taskId}/${data.task.taskId}.mp4`;
               let pic1=`assets/overlay/soccer/cartoon_logo.png`;
            //    let pic2=`assets/overlay/soccer/cartoon.png`;
               let addPic1_output = `assets/video/soccer/${data.task.taskId}/addPic1.mp4`;
            //    let addPic2_output = `assets/video/soccer/${data.task.taskId}/addPic2.mp4`;
               await addPictoVideo(data,addPic_input, pic1, 100,100,addPic1_output,cb);
            //    await addPictoVideo(data,addPic1_output, pic2, 100,700,addPic2_output,cb);
            //   //贴字 
            //     let addText_input=addPic2_output;
            //     let addText_output = `assets/video/soccer/${data.task.taskId}/addText.mp4`;
            //    await addtextVideo(data,addText_input,addText_output,cb)
                //贴边框
                let overlay_input=addPic1_output;
               let overlay_output = `assets/video/soccer/${data.task.taskId}/overlay.mp4`;
               let board=`assets/overlay/soccer/kitty_car_template.png`;
               await overlayVideo(data,overlay_input, board, overlay_output,cb);
              // 贴音乐
               let applyMusic_input = overlay_output;
               let music = `assets/overlay/soccer/car_music.mp3`;
               let applyMusic_outputput=`assets/video/soccer/${data.task.taskId}/music.mp4`
               await applyMusic(data,applyMusic_input, music, applyMusic_outputput,cb);
        
           //  准备封面图
             let frame_jpg = `assets/video/soccer/${data.task.taskId}/${data.task.taskId}.jpg`;
              await interceptFrame(data,applyMusic_outputput,frame_jpg,cb);
           // 准备上传（两张图、一个视频）
           await ossUpload(data,frame_jpg,`soccer_${task.taskId}.jpg`);
           const uploadResult = await ossUpload(data,applyMusic_outputput, `soccer_${task.taskId}.mp4`);
          if (cb) {
               removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
               // cb.onStop(data, downloadMsg=='error' ? `finish task, lack video ${downloadMsg}` : `finish task`, null, null);
               cb.onStop(data, '', null, null);
           }
           console.log(uploadResult);
           console.log('----------------------'); 
       }catch (err) {
           console.error(err);
       }

    }
}

async function addPictoVideo(data,input,pic,x,y,output,cb){
    const addPictovideoCmd = `ffmpeg -i ${input} -i ${pic} -filter_complex "[0:v][1:v] overlay=${x}:${y}" -hide_banner -loglevel panic -y ${output}`;
    console.log('addPictovideo command = ' + addPictovideoCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(addPictovideoCmd)); 
    } catch (err) {
        console.log(`addPictovideo video error`);
        if (cb) {
            // removeFile();
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `addPictovideo video error`, null, null);
        }
        return Promise.reject('');
    } 
}

async function interceptFrame(data,input,output,cb){
    const interceptFrameCmd = `ffmpeg -i ${input} -y -f image2 -ss 00:00:03 -vframes 1 -hide_banner -loglevel panic -y ${output}`;
    console.log('interceptFrame command = ' + interceptFrameCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(interceptFrameCmd)); 
    } catch (err) {
        console.log(`interceptFrame video error`);
        if (cb) {
            // removeFile();
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `interceptFrame video error`, null, null);
        }
        return Promise.reject('');
    }
}
async function applyMusic(data,input, music, output,cb) { 
    // const addOptions = `-c copy -y -hide_banner -loglevel panic`; 
    const addOptions = `-shortest -strict -2 -y -hide_banner -loglevel panic`; 
    const musicCmd = `ffmpeg -i ${music} -i ${input} ${addOptions} ${output}`; 
    console.log('add music command = ' + musicCmd); 
    console.log('----------------------'); 
    try {   
        return await promiseFromChildProcess(child.exec(musicCmd)); 
    } catch (err) { 
        console.log(`add music video error`); 
        if (cb) { 
            // removeFile(); 
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `add music video error`, null, null); 
        } 
        return Promise.reject(''); 
    } 
} 
async function overlayVideo(data,input, board, output,cb){
    const addOptions = `-filter_complex "[0:v][1:v] overlay=0:0" -hide_banner -loglevel panic -y`;
    const overlayCmd = `ffmpeg -i ${input} -i ${board} ${addOptions} ${output}`;
    console.log('overlay command = ' + overlayCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(overlayCmd)); 
    } catch (err) {
        console.log(`overlay video error`);
        const body_status={
            'taskId':data.task.taskId,
            'role':'worker',
            'position':data['worker_id'],
            'msg':'overlayVideo fail'
       }
       request({
           url: `${config.apiServer}/task/update_status`,
           method: "POST",
           json: true,
           body: body_status
       }, (error, response, body) => { })
        if (cb) {
            // removeFile();
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `overlay video error`, null, null);
        }
        return Promise.reject('');
    }

}
async function addtextVideo(data,input,output,cb){
    console.log('--------------------')
    console.log('进addTextVideo了')
    const fontDHfile = path.join(__dirname, "../data/font/FZZDHJW.ttf");
    const start_time = `-ss 00:00:00`;
    const time_length = `-t 00:00:24`;
    let drawtextaddress1=`${fontDHfile}:text=总统山:fontcolor=white: fontsize=60:x=280:y=825:enable='between(t,1,6)'`;
    let drawtextaddress2=`${fontDHfile}:text=金字塔:fontcolor=white: fontsize=60:x=280:y=825:enable='between(t,7,12)'`;
    let drawtextaddress3=`${fontDHfile}:text=艾菲尔铁塔:fontcolor=white: fontsize=60:x=250:y=825:enable='between(t,13,18)'`;
    let drawtextaddress4=`${fontDHfile}:text=自由女神像:fontcolor=white: fontsize=60:x=250:y=825:enable='between(t,19,24)'`;
    const addOptions = `-strict -2 -vf "drawtext=${drawtextaddress1},drawtext=${drawtextaddress2},drawtext=${drawtextaddress3},drawtext=${drawtextaddress4}"`;
    const addtextVideoCmd = `ffmpeg -nostats -loglevel verbose -y ${start_time} -i ${input} ${addOptions} ${time_length} ${output}`;
    console.log('addtextVideo command = ' + addtextVideoCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(addtextVideoCmd)); 
    } catch (err) {
        console.log(`addtextVideo video error`);
        if (cb) {
            removeFileName(data.task.taskId) 
            cb.onAbort(data, `addtextVideo video error`, null, null);
        }
        return Promise.reject('');
    }
}

// async function add_word( video_list,video_place ,video_ttf) {
//     const ttf = `assets/video/soccer/${video_list.main}/${video_list.taskId}/${video_ttf}`
    
//     return new Promise((resolve, reject) => {
//         var count = 0;
//         for ( var i = 0 ; i < video_list.video.length ; i++){
//             console.log(video_list.video[i],video_place[i])
//             new ffmpeg()
//                 .input(`assets/video/soccer/${video_list.main}/${video_list.taskId}/${video_list.video[i]}`)
//                 .addOptions([
//                     `-vf drawtext=fontcolor=white:fontsize=40:fontfile=${ttf}:text=\'${video_place[i]}\':x=0:y=900`
//                 ])
//                 .on('start', (cmd) => {
//                     console.log('----------------------');
//                     console.log('scaleVideo ffmpeg command = ' + cmd);
    
//                 })
//                 .on('error', (err) => {
//                     console.log(err)
//                     reject();
//                 })
//                 .on('end', (end) => {
//                     count+=1;
//                     if ( count == 4){
//                         console.log('out')
//                         resolve();
//                     }
//                 })
//                 .save(`assets/video/soccer/${video_list.main}/${video_list.taskId}/word_${video_list.video[i]}`)
//         }
//     })
//   }
//   async function merged_Video( video_list,start_video,end_video) {
//     console.log('=========Splicing===========')
//     const start   = (`./assets/video/soccer/${video_list.main}/${video_list.taskId}/${start_video}`);
//     const video_1 = (`./assets/video/soccer/${video_list.main}/${video_list.taskId}/word_${video_list.video[0]}`);
//     const video_2 = (`./assets/video/soccer/${video_list.main}/${video_list.taskId}/word_${video_list.video[1]}`);
//     const video_3 = (`./assets/video/soccer/${video_list.main}/${video_list.taskId}/word_${video_list.video[2]}`);
//     const video_4 = (`./assets/video/soccer/${video_list.main}/${video_list.taskId}/word_${video_list.video[3]}`);
//     const end = (`./assets/video/soccer/${video_list.main}/${video_list.taskId}/${end_video}`);

//     return new Promise((resolve, reject) => {
        
//         var mergedVideo = ffmpeg();
//         var videoNames = [ start,video_1,video_2,video_3,video_4,end];
//         console.log(videoNames)
//         videoNames.forEach(function(videoName){
//             mergedVideo = mergedVideo.addInput(videoName);
//         });
//         mergedVideo.mergeToFile(`assets/video/soccer/${video_list.main}/${video_list.taskId}/mergedVideo.mp4`)
//         .on('error', function(err) {
//             console.log('Error ' + err.message);
//             reject();
//         })
//         .on('end', function() {
//             resolve();
//         });
        
//     })
// }



async function videoDownload(data, cb) {
    let count = 0;
    let msg = '';
    let ufileDownloadRes = await ossDownloadVideo(data.task);
    console.log(ufileDownloadRes)
     msg=ufileDownloadRes==`assets/video/soccer/${data.task.taskId}/${data.task.taskId}.mp4`?'':'error'

    if (msg == '') {
        return Promise.resolve(msg);
    } else {
        const body_status={
            'taskId':data.task.taskId,
            'role':'worker',
            'position':data['worker_id'],
            'msg':'download fail'
       }
       request({
           url: `${config.apiServer}/task/update_status`,
           method: "POST",
           json: true,
           body: body_status
       }, (error, response, body) => { })
        console.log('----------------------');
        console.log(`lack video ${msg}`);
        if (cb) cb.onAbort(data, `lack video ${msg}`, null, null);
        // if (cb) cb.onAbort(array, `lack video ${msg}`, null, null);
        return Promise.reject('');
    }
}

async function ossDownloadVideo(task) {
        return new bluebird(async (resolve) => {
            let originFileName = `${task.fileName1}`;
            // let localFileName = `assets/video/soccer/${task.taskId}_${index + 1}.mp4`;
            let localFileName = `assets/video/soccer/${task.taskId}/${task.taskId}.mp4`;
            let callback = {
                onSuccess: result => {
                    let localFileSize = `${fs.statSync(localFileName).size}`;
                    let originFileSize = result.res.headers['content-length'];

                    if (localFileSize == originFileSize) {
                        console.log(`成功下载：${result.res.requestUrls}`);
                        resolve(localFileName);
                    } else {
                        resolve(false);
                    }
                },
                onError: err => {
                    console.error(`下载失败： ${err}`);
                    resolve(false);
                }
            } as HttpClientCallback;

            console.log(`开始下载： ${originFileName}`);
            httpclient.get(originFileName, localFileName, callback);
        });
}

async function ossUpload(data, localFileName, originFileName) {
    return await new Promise((resolve, reject) => {
        let callback = {
            onSuccess: result => {
                const body_status={
                    'taskId':data.task.taskId,
                    'role':'worker',
                    'position':data['worker_id'],
                    'msg':'100%'
                };
                request({
                    url: `${config.apiServer}/task/update_status`,
                    method: "POST",
                    json: true,
                    body: body_status
                }, (error, response, body) => {
                    const data=body;
                    if(data.code==0 || data.result.ok == 1){
                        resolve(`${originFileName} upload done`);
                    }
                });
            },
            onError: err => {
                console.error(`上传失败[${originFileName}]: ${err}`);
                reject(util.inspect(err));
            },
            onProgress: percentage => {
                console.log(`${originFileName} is uploading: ${percentage * 100}%`);
            }
        } as HttpClientCallback;

        httpclient.breakPointUpload(
            originFileName,
            localFileName,
            callback
        )
    })
}


function promiseFromChildProcess(child) {
    return new Promise((resolve, reject) => {
        child.stdout.on('data', res => resolve(res));  
        child.on('close', res => {
            res === 0 ? resolve(res) : reject(res); 
        });
    });
}


function mkdirp(task) {
    let rootPath = path.join(__dirname, `../../assets/video`);
    const folderName = String(`soccer/${task.taskId}`).split('/');
    folderName.forEach(folder => {
        rootPath = path.join(rootPath, '/', folder);
        if (!fs.existsSync(rootPath)) {
            fs.mkdirSync(rootPath);
        }
    });
    return rootPath;
}

async function removeFileName(fileName) {
    return await promiseFromChildProcess(child.exec(`rm -r assets/video/soccer/${fileName}`));
}


 


