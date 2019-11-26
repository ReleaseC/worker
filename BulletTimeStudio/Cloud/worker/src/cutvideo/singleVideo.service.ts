import { Component } from '@nestjs/common';
import { IWorkerCallback, IEngine } from '../common/worker.interface';
import * as child from "child_process";
import { WorkerUtil } from '../common/worker.util';
import { callbackify } from 'util';
import httpclient from "../oss/siiva-oss/httpclient";
import {HttpClientCallback} from "../oss/siiva-oss/httpclient.interface";
const config = require(`../../config/${process.env.NODE_ENV || 'production'}.json`);

const util = require('util');
const bluebird = require('bluebird');
const request = require('request');
const path = require('path');
const fs=require('fs');

const concat=require('ffmpeg-concat')
class MomentParams {
    src_video: string;
    dst_video: string;
    light: number;
    rmboard: boolean;
    rmturn: boolean;
    rmbgm: boolean;
    music: string;
  }

@Component()
export class SingleVideoService implements IEngine {
    param: MomentParams;

    constructor() {}
  
    initParamFromTask(task: any) {
    //   task.param = task.param || {};
  
      // Init param from task. If no set in task, use default param (right side)
      this.param = new MomentParams();
    //   this.param.src_video = task.fileName1 || "";
    //   this.param.light = task.param["light"] || 0;
    //   this.param.rmboard = (task.param["rmboard"] as boolean) || false;
    //   this.param.rmbgm = (task.param["rmbgm"] as boolean) || false;
    //   this.param.rmturn = (task.param["rmturn"] as boolean);

       this.param.src_video = task.fileName1 || "";
      this.param.light = task.light || 0;
      this.param.rmboard = (task.rmborder as boolean) || false;
      this.param.rmbgm = (task.rmbgm as boolean) || false;
      this.param.rmturn = (task.rmturn as boolean)||false;
    }
    async cut_video(data, cb: IWorkerCallback) {
        console.log(data)
        const task = data.task;
        console.log(task)
        console.log('进singleVideoService了')
        let workerUtil = new WorkerUtil();

        data['worker_id']=WorkerUtil.getWorkerId()
        this.initParamFromTask(data.task);
        console.log(this.param)
        console.log('----------------------');
        // 匹配活动模板和音乐
        switch(data.activity_id)
        {
           case '1545000008gx':
                 task.templatefileName=`template${Math.floor(Math.random() *4  + 14)}.png`;    //小课堂专用
                 task.music=`assets/overlay/soccer/music${Math.floor(Math.random() * 2 + 10)}.mp3`; 
                 break;
           case '1545000008ll':
                 task.templatefileName=`template${Math.floor(Math.random() *4  + 14)}.png`;    //小课堂专用
                 task.music=`assets/overlay/soccer/music${Math.floor(Math.random() * 2 + 10)}.mp3`; 
                 break;
          case '1545000008mm':
                 task.templatefileName=`template${Math.floor(Math.random() *4  + 14)}.png`;    //小课堂专用
                 task.music=`assets/overlay/soccer/music${Math.floor(Math.random() * 2 + 10)}.mp3`; 
                 break;
          case '1545000008nn':
                 task.templatefileName=`template${Math.floor(Math.random() *4  + 14)}.png`;    //小课堂专用
                 task.music=`assets/overlay/soccer/music${Math.floor(Math.random() * 2 + 10)}.mp3`; 
                 break;
           case  '1541382417':
                task.templatefileName=`template19.png`;    //凯迪猫专用
                task.music=`assets/overlay/soccer/music${Math.floor(Math.random() * 5 + 1)}.mp3`; 
                break;
         case  '1541382418':
                task.templatefileName=`template19.png`;    //本地凯迪猫专用
                task.music=`assets/overlay/soccer/music_kitty.mp3`; 
                break;
           case  '1544761333ky':
                task.templatefileName=`template18.png`;    //路人王专用
                task.music=`assets/overlay/soccer/musiclu.mp3`; 
                break;
           default:
                task.templatefileName=`template${Math.floor(Math.random() * 10 + 1)}.png`;
                task.music=`assets/overlay/soccer/music${Math.floor(Math.random() * 5 + 1)}.mp3`; 
        }
        // 匹配照片或者视频处理
        switch(task.mode)
        {
            case 'photo':
                try{
                    mkdirp(data.task);    //以taskId为名创建文件夹
                    let frame_jpg = `assets/video/soccer/${data.task.taskId}/${data.task.taskId}.jpg`;
                    let frame_jpg_min=`assets/video/soccer/${data.task.taskId}/${data.task.taskId}_min.jpg`;
                    await ossDownloadPhoto(data,frame_jpg,cb);
                    await scalePic(data,frame_jpg,frame_jpg_min,cb);
                    await ossUpload(data,frame_jpg_min,`soccer_${task.taskId}_min.jpg`);
                     const uploadResult=await ossUpload(data,frame_jpg,`soccer_${data.task.taskId}.jpg`);
                    if (cb) {
                        removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
                        cb.onStop(data, 'error', null, null);
                    }
                    console.log(uploadResult);
                    console.log('----------------------'); 
                }catch (err) {
                  console.error(err);
                }
                break;
            default:
                try{
                     let l = "";
                    let t = Date.now()
                    let start = Date.now()

                    //以taskId为名创建文件夹
                     mkdirp(data.task);
      
                     //准备模板
                     if (!this.param.rmboard) {
                        let src =`${data.task.templatefileName}`;
                        await ossDownloadTemplate(data,src, cb);
                      }
                    l = l + "Step 1: Download template -" + String(Date.now() - t) + "\n"; t = Date.now();

                    //   准备视频源
                    const downloadMsg = await videoDownload(data, cb);
                    l = l + "Step 2: Download video -" +  String(Date.now() - t) + "\n"; t = Date.now();
                    let dst=`assets/video/soccer/${data.task.taskId}/${data.task.taskId}.mp4`;
                    let time= await getVideoTimeLength(data,dst,cb);  
                    console.log('视频总时长为:'+String(time).split(" ")[3])
                    let video_time=String(time).split(" ")[3];
                    // 剪切music匹配video长度
                    let music = `${task.music}`;
                    let dst_music=`assets/video/soccer/${data.task.taskId}/music.mp3`;
                    await doMusic(data,music,video_time,dst_music,cb)
                    // 是否需要转场
                    // if (!this.param.rmturn) {
                    //    console.log('----------------------')
                    //    console.log('需要转场')
                    //    console.log('----------------------')
                    //    let video_time=String(time).split(" ")[3];
                    //     let src=`assets/video/soccer/${data.task.taskId}/${data.task.taskId}.mp4`
                    //     let dst_1 = `assets/video/soccer/${data.task.taskId}/tx.mp4`;
                        // await doTx(data,video_time.split(':')[video_time.split(':').length-1], src,dst_1,cb);
                    //     dst = dst_1;
                    // }
                    l = l + "Step 3:  doTx- " + String(Date.now() - t) + "\n"; t = Date.now();

                    // 是否需要贴模板
                    if (!this.param.rmboard) {
                        console.log('----------------------')
                        console.log('需要贴模板')
                        console.log('----------------------')
                        let dst_1 = `assets/video/soccer/${data.task.taskId}/overlay.mp4`;
                        let board = `assets/video/soccer/${data.task.taskId}/template.png`;
                        await overlayVideo(data,dst, board, dst_1,cb);
                        dst = dst_1;
                    }
                    l = l + "Step 4:  overlayVideo- " + String(Date.now() - t) + "\n"; t = Date.now();

                    // 是否需要加音乐
                    if (!this.param.rmbgm) {
                        console.log('----------------------')
                        console.log('需要加音乐')
                        console.log('----------------------')
                        let dst_1 = `assets/video/soccer/${data.task.taskId}/music.mp4`;
                        let music = `assets/video/soccer/${data.task.taskId}/music.mp3`;
                        await applyMusic(data,dst, music, dst_1,cb);
                        dst = dst_1;
                      }
                    l = l + "Step 5:  applyMusic- " + String(Date.now() - t) + "\n"; t = Date.now();

                    //  准备两张封面图（一大一小）
                      let frame_jpg = `assets/video/soccer/${data.task.taskId}/${data.task.taskId}.jpg`;
                      let frame_jpg_min=`assets/video/soccer/${data.task.taskId}/${data.task.taskId}_min.jpg`;
                       await interceptFrame(data,dst,frame_jpg,cb);
                       await scalePic(data,frame_jpg,frame_jpg_min,cb);
                      l = l + "Step 6:  interceptFrame & scalePic- " + String(Date.now() - t) + "\n"; t = Date.now(); 

                    // 准备上传（两张图、一个视频）
                    await ossUpload(data,frame_jpg,`soccer_${task.taskId}.jpg`);
                    await ossUpload(data,frame_jpg_min,`soccer_${task.taskId}_min.jpg`);
                    l = l + "Step 7:  ossUpload images- " + String(Date.now() - t) + "\n"; t = Date.now(); 
                    const uploadResult = await ossUpload(data,dst, `soccer_${task.taskId}.mp4`);
                    l = l + "Step 8:  ossUpload video- " + String(Date.now() - t) + "\n"; t = Date.now(); 
                    l = l + "Total: " + String(Date.now() - start) + "\n";
                    console.log("Result: \n" + l);

                     if (cb) {
                        removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
                        // cb.onStop(data, downloadMsg=='error' ? `finish task, lack video ${downloadMsg}` : `finish task`, null, null);
                        cb.onStop(data, l, null, null);
                    }
                    console.log(uploadResult);
                    console.log('----------------------'); 




                     //未使用的方法              
                    // await streamingVideo(data, cb);
          
                    // await addVideoBrightness(data,0.2,cb);

                    // await addeffect(data,cb);
                
                    // await goToGIF(data,cb)
         
                }catch (err) {
                    console.error(err);
                }
        }
    }
}

// 获取视频总时长  
async function getVideoTimeLength(data,dst,cb){
    const input=`${dst}`;
    const getVideoTimeLengthCmd = `ffmpeg -i ${input} 2>&1 | grep 'Duration'|cut -d '' -f 4|sed s/,//`;
    // console.log(getVideoTimeLengthCmd)
    try {
        return await promiseFromChildProcess(child.exec(getVideoTimeLengthCmd));
    } catch (err) {
        if (cb) {
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `getVideoTimeLength video  error`, null, null);
        }
        return Promise.reject('');
    }
}

async function doMusic(data,music,video_time,dst_music,cb){
    if(video_time==undefined){
        removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
        cb.onAbort(data, `doMusic video  error`, null, null);
    }else{
        let length=video_time.split(':')[video_time.split(':').length-1];
        const addOptions = `-ss 0 -t ${length} -acodec copy`;
        const cmd = `ffmpeg -i ${music} ${addOptions} ${dst_music}`;
        console.log('doMusic command = ' + cmd);
        try {
          return await promiseFromChildProcess(child.exec(cmd));
        } catch (err) {
            console.log(`doMusic video error`); 
            if (cb) {
                removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
                cb.onAbort(data, `doMusic video  error`, null, null);
            }
            return Promise.reject('');
        }
    }
    // const addOptions = `-ss 0 -t ${length} -acodec copy`;
    // const cmd = `ffmpeg -i ${music} ${addOptions} ${dst_music}`;
    // console.log('doMusic command = ' + cmd);
    // try {
    //   return await promiseFromChildProcess(child.exec(cmd));
    // } catch (err) {
    //     console.log(`doMusic video error`); 
    //     if (cb) {
    //         removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
    //         cb.onAbort(data, `doMusic video  error`, null, null);
    //     }
    //     return Promise.reject('');
    // }
}

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

async function ossDownloadPhoto(data,frame_jpg,cb) {
return await new Promise((resolve, reject) => {
    let localFileName = `${frame_jpg}`; ;
    let originFileName = `${data.task.fileName1}`;
    let callback = {
        onSuccess: result => {
            console.log(`图片下载成功`);
            resolve(`${originFileName} upload done`);
        },
        onError: err => {
            console.log(`图片下载失败`);
            if (cb) cb.onAbort(data, `download pic error`, null, null);
            return Promise.reject('');
        }
    } as HttpClientCallback;

    console.log(`开始下载： ${originFileName}`);
  httpclient.get(originFileName, localFileName, callback);
})
}

async function ossDownloadTemplate(data,src,cb) {
    return await new Promise((resolve, reject) => {
    let localFileName = `assets/video/soccer/${data.task.taskId}/template.png`;
    let originFileName = `${src}`;
    let callback = {
        onSuccess: result => {
            // console.log(`模板下载成功`);
            // return Promise.resolve();
            console.log(`图片下载成功`);
            resolve(`${originFileName} upload done`);
        },
        onError: err => {
            // console.log(`模板下载失败`);
            // return Promise.reject('');
            console.log(`图片下载失败`);
            if (cb) cb.onAbort(data, `download pic error`, null, null);
            return Promise.reject('');
        }
    } as HttpClientCallback;

    console.log(`开始下载： ${originFileName}`);
    httpclient.get(originFileName, localFileName, callback);
})
}

async function doTx(data,video_time, src,dst,cb) {
    console.log(video_time/3)
    console.log(`${video_time}`)

    let dst1 = `assets/video/soccer/${data.task.taskId}/trim1.mp4`;
    let dst2 = `assets/video/soccer/${data.task.taskId}/trim2.mp4`;
    let dst3 = `assets/video/soccer/${data.task.taskId}/trim3.mp4`;
    // await trimVideo(data,src, dst1, 0, 4,cb);
    await trimVideo(data,src, dst1, 0, video_time/3+1,cb);
    console.log('----------1成功----------------')
    // await trimVideo(data,src, dst2, 3, 5,cb);
    await trimVideo(data,src, dst2, video_time/3, video_time/3+1,cb);
    console.log('----------2成功----------------')
    // await trimVideo(data,src, dst3, 6, 4,cb);
    await trimVideo(data,src, dst3, video_time*2/3-1, video_time/3,cb);
    console.log('----------3成功----------------')
    await applyTx(data,[dst1, dst2, dst3], dst,cb);
  }
  
  async function trimVideo(data,src, dst, start, duration,cb) {
    const addOptions = `-ss ${start} -t ${duration} -i`;
    const cmd = `ffmpeg ${addOptions} ${src} -y -hide_banner -loglevel panic ${dst}`;
    console.log('trimVideo command = ' + cmd);
    try {
      return await promiseFromChildProcess(child.exec(cmd));
    } catch (err) {
        console.log(`trimVideo video error`); 
        if (cb) {
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `trimVideo video  error`, null, null);
        }
        return Promise.reject('');
    }
  }
  
  async function applyTx(data,src: string[], dst: string,cb) {
    const options = [
      { name: "crosswarp", duration: 1500 },
      { name: "cube", duration: 1500 }
    ];
    try{
       await concat({
          output: dst,
          videos: src,
          transitions: options
        });
     } catch(err){
     console.log(`add applyTx video error`); 
    if (cb) { 
        removeFileName(data.task.taskId)  //删除以taskId为名的文件夹 
        cb.onAbort(data, `add effect_one video error`, null, null); 
     } 
        return Promise.reject(''); 
    }
  }

// async function rotateVideo(data,cb, videoNum: number) { 
//     const input = `assets/video/soccer/${data.task.taskId}_${videoNum}.mp4`; 
//     const output = `assets/video/soccer/${data.task.taskId}_${videoNum}_rotate.mp4`; 
//     // const addOptions = `-vf "rotate=90"`; 
//     const scaleCmd = `ffmpeg -i ${input} -vf "transpose=2" -y -hide_banner -loglevel panic ${output}`;
//     console.log('----------------------');
//     console.log('rotate command = ' + scaleCmd);
//     console.log('----------------------');
//     try {
//         return await promiseFromChildProcess(child.exec(scaleCmd));
//     } catch (err) {
//         console.log(`rotate video ${videoNum} error`); 

//         if (cb) {
//             // removeFile();
//             removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
//             cb.onAbort(data, `rotate video ${videoNum} error`, null, null);
//         }
//         return Promise.reject('');
//     }
// }

// async function scaleVideo(data,value, cb, videoNum: number) { 
//     // console.log('进scale了')
//     const input = `assets/video/soccer/${data.task.taskId}_${videoNum}_rotate.mp4`; 
//     const output = `assets/video/soccer/${data.task.taskId}_${videoNum}_scale.mp4`; 
//     // const addOptions = `-vf scale=iw*1.2:ih*1.2,crop=iw/1.2:ih/1.2 -y -hide_banner -loglevel panic`; 
//     const addOptions = `-vf scale=iw*${value}:ih*${value},crop=iw/${value}:ih/${value} -y -hide_banner -loglevel panic`; 
//     const scaleCmd = `ffmpeg -i ${input} ${addOptions} ${output}`;
//     console.log('----------------------');
//     console.log('scale command = ' + scaleCmd);
//     console.log('----------------------');
//     try {
        
//        // worker第二步完成与否
//        if(videoNum==1){
//         const scaleVideoSuccess=await promiseFromChildProcess(child.exec(scaleCmd))
//         if(scaleVideoSuccess==0){
//             console.log('30%')
//             const body_status={
//                 'taskId':data.task.taskId,
//                 'role':'worker',
//                 'position':data['worker_id'],
//                 'msg':'30%'
//            }
//            request({
//                url: `${config.apiServer}/task/update_status`,
//                method: "POST",
//                json: true,
//                body: body_status
//            }, (error, response, body) => { })
//         }
//        }

//         return await promiseFromChildProcess(child.exec(scaleCmd));
//     } catch (err) {
//         console.log(`scale video ${videoNum} error`); 

//         const body_status={
//             'taskId':data.task.taskId,
//             'role':'worker',
//             'position':data['worker_id'],
//             'msg':'scale video'+videoNum+' fail'
//        }
//        request({
//            url: `${config.apiServer}/task/update_status`,
//            method: "POST",
//            json: true,
//            body: body_status
//        }, (error, response, body) => { })
        
//         if (cb) {
//             // removeFile();
//             removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
//             cb.onAbort(data, `scale video ${videoNum} error`, null, null);
//         }
//         return Promise.reject('');
//     }
// }

async function interceptVideo(data,starttime,seconds,cb, videoNum: number) {
    // const input=`assets/video/soccer/${data.task.taskId}/streaming.mp4`;
    const input=`assets/video/soccer/${data.task.taskId}/${data.task.taskId}.mp4`;
    // let file = `-ss ${await getVideoTime(file_path, 5.5)} -t ${seconds} -i ${file_path} -y -hide_banner -loglevel panic`;
    const output = `assets/video/soccer/${data.task.taskId}/trim${videoNum}.mp4`; 
    // const addOptions = `-ss ${await getVideoTime(file_path, 5.5 + shift)} -t ${seconds} -i` ;
    const addOptions = `-ss ${starttime} -t ${seconds} -i` ;
    const interceptCmd = `ffmpeg ${addOptions} ${input} -y -hide_banner -loglevel panic ${output}`;
    console.log('----------------------');
    console.log('intercept command = ' + interceptCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(interceptCmd));
    } catch (err) {
        console.log(`intercept video ${videoNum} error`); 
        if (cb) {
            // removeFile();
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `intercept video ${videoNum} error`, null, null);
        }
        return Promise.reject('');
    }
}

/**
 * get the value of shift according its position info
 * @param data the object contains task structure
 * @param {number} videoNum range in [1 ~ 3]
 * @returns {number} value of shift, its default value is 0
 */
function getShift(data, videoNum: number): number {
    let detail = data.task.detail || [];
    let shift = 0.0;

    for (let obj of detail) {
        if (obj['position'] == `${videoNum - 1}`) {
            try {
                obj['shift'] && (shift = parseFloat(obj['shift']));
            } catch (e) {  // when obj['shift'] is not a string contained number, it will throw an error, parse error
                console.log(`getShift parseFloat error >>> position: ${videoNum - 1} obj['shift']: ${obj['shift']}`);
            }
        }
    }

    shift /= 1000;  //  将单位从毫秒转化成秒

    return shift;
}

async function ffmpegconcat(data,dst,cb){
    const output = `assets/video/soccer/${data.task.taskId}/tx.mp4`;
    let fileName1=`assets/video/soccer/${data.task.taskId}/trim1.mp4`;
    let fileName2=`assets/video/soccer/${data.task.taskId}/trim2.mp4`;
    let fileName3=`assets/video/soccer/${data.task.taskId}/trim3.mp4`;
   console.log(`${dst}`)
   console.log(dst)
   console.log(`${output}`)

    
    try{
         await concat({
        output:`${dst}`,
        videos:[`${fileName1}`,`${fileName2}`,`${fileName3}`],
        transitions:[
            // {
            //     name:'circleopen',
            //     duration:1500
            // },
            // {
            //     name:'swap',
            //     duration:1500
            // },
            {
                name:'crosswarp',
                duration:1500
            },
            // {
            //     name:'dreamy',
            //     duration:1500
            // },
            // {
            //     name:'directionalwipe',
            //     duration:1500
            // },
            // {
            //     name:'crosszoom',
            //     duration:1500
            // },
            // {
            //     name:'directionalwarp',
            //     duration:2000
            // },
            {
                name:'cube',
                duration:1500
            }
            // {
            //     name:'fadegrayscale',
            //     duration:1500
            // }
            // {
            //     name:'squareswire',
            //     duration:1500
            // },     //单视频不明显
            // {
            //     name:'angular',
            //     duration:1500
            // },     //单视频不明显
            // {
            //     name:'radial',
            //     duration:1500
            // },       //单视频不明显
            // { 
            //     name:'fade',
            //     duration:100
            // }
        ]
    })
    }
    catch(err){
        console.log(`add ffmpegconcat video error`); 
        if (cb) { 
            // removeFile();
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹 
            cb.onAbort(data, `add effect_one video error`, null, null); 
        } 
        return Promise.reject(''); 
    }




    // const output = `assets/video/soccer/concat.mp4`;
    // let fileName1=`assets/video/soccer/${data.task.taskId}_1_intercept.mp4`;
    // let fileName2=`assets/video/soccer/${data.task.taskId}_2_intercept.mp4`;
    // let fileName3=`assets/video/soccer/${data.task.taskId}_3_intercept.mp4`;
    // const ffmpegconcatCmd=`ffmpeg-concat -t circleopen -d 750 -o ${output} ${fileName1} ${fileName2} ${fileName3}`;
    // // const ffmpegconcatCmd=`ffmpeg -i ${file1} -i ${file2} -filter_complex "gltransition=duration=4:offset=1.5:source=crosswarp.glsl" -y ${output}`
    // console.log('ffmpegconcat command = ' + ffmpegconcatCmd);
    // console.log('----------------------');
    // try {
    //     const ffmpegconcatVideo=await promiseFromChildProcess(child.exec(ffmpegconcatCmd))
    //             if(ffmpegconcatVideo==0){
    //                 console.log('ffmpegconcatVideo success!!!!!!!!!!!!!!!!!!!!!!')
    //             }
    //     return await promiseFromChildProcess(child.exec(ffmpegconcatCmd));
    // } catch (err) {
    //     console.log('ffmpegconcatVideo error')
    //     if (cb) {
    //         removeFile();
    //         cb.onAbort(data, `concat video error`, null, null);
    //     }
    //     return Promise.reject('');
    // }
}



async function addVideoBrightness(data,brightness_value,cb){
    const input = `assets/video/soccer/concat.mp4`;
    const output = `assets/video/soccer/brightness.mp4`;
    const addOptions=`-vf eq=brightness=${brightness_value} -y -hide_banner -loglevel panic`;
    const addVideoBrightnessCmd=`ffmpeg -i ${input} ${addOptions} ${output}`;
    console.log('add videoBrightness command = ' + addVideoBrightnessCmd); 
    console.log('----------------------'); 
    try {   
        return await promiseFromChildProcess(child.exec(addVideoBrightnessCmd)); 
    } catch (err) { 
        console.log(`add videoBrightness video error`); 
        if (cb) { 
            // removeFile(); 
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `add videoBrightness video error`, null, null); 
        } 
        return Promise.reject(''); 
    } 
}



async function addeffect_one(data,cb){
    const input = `assets/video/soccer/${data.task.taskId}_4_intercept.mp4`;
    const output = `assets/video/soccer/${data.task.taskId}_4_intercept1.mp4`;
    // const output = `assets/video/soccer/effect.mp4`;
    // const addOptions = `-vf hue=s=0`;    //黑白特效
    // const addOptions = `-filter_complex colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131`;    //棕褐色特效
    const addOptions = `-vf frei0r=vertigo:0.2`;    //残影特效
    // const addOptions = `-vf frei0r=glow:1`;    //光晕特效
    // const addOptions = `-vf frei0r=3dflippo:0.85:0.85:0.85:0.85:0.85:0.85:0.85:0.85:y:y:n`; //旋转
    // const addOptions = `-vf frei0r=c0rners:0.444:0.777:0.555:0.111:0.888:0.111:0.222:0.666:y:0.5:0.5:0.1:y:0.5:0.5`; 
    const addeffect_oneCmd = `ffmpeg -i ${input} ${addOptions} ${output}`; 
    console.log('add effect_one command = ' + addeffect_oneCmd); 
    console.log('----------------------'); 
    try {   
        return await promiseFromChildProcess(child.exec(addeffect_oneCmd)); 
    } catch (err) { 
        console.log(`add effect_one video error`); 
        if (cb) { 
            // removeFile(); 
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `add effect_one video error`, null, null); 
        } 
        return Promise.reject(''); 
    } 
}
async function addeffect(data,cb){
    const input = `assets/video/soccer/concat.mp4`;
    const output = `assets/video/soccer/effect.mp4`;
    const addOptions = `-vf hue=s=0`;    //黑白特效
    // const addOptions = `-filter_complex colorchannelmixer=.393:.769:.189:0:.349:.686:.168:0:.272:.534:.131`;    //棕褐色特效
    // const addOptions = `-vf frei0r=vertigo:0.2`;    //残影特效
    // const addOptions = `-vf frei0r=glow:1`;    //光晕特效
    const addeffectCmd = `ffmpeg -i ${input} ${addOptions} ${output}`; 
    console.log('add effect command = ' + addeffectCmd); 
    console.log('----------------------'); 
    try {   
        return await promiseFromChildProcess(child.exec(addeffectCmd)); 
    } catch (err) { 
        console.log(`add effect video error`); 
        if (cb) { 
            // removeFile(); 
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `add effect video error`, null, null); 
        } 
        return Promise.reject(''); 
    } 
}







/*拼接3段3+3+4*/ 
async function concatVideo(data, cb, msg) { 
    let file1_path = `assets/video/soccer/${data.task.taskId}_1.mp4`; 
    let file2_path = `assets/video/soccer/${data.task.taskId}_2.mp4`; 
    let file3_path = `assets/video/soccer/${data.task.taskId}_3.mp4`;
    // let file_start = `assets/overlay/soccer/start.mp4`;
    // let file_end = `assets/overlay/soccer/end.mp4`;
    // let file3=`-ss ${await getVideoTime(file3_path, 5.5 + getShift(data, 3))} -t 4 -i ${file3_path}`;
    // let file2=`-ss ${await getVideoTime(file2_path, 5.5 + getShift(data, 2))} -t 3 -i ${file2_path}`;
    // let file1=`-ss ${await getVideoTime(file1_path, 5.5 + getShift(data, 1))} -t 3 -i ${file1_path}`;
    let file3=`-ss ${4.5 + getShift(data, 3)} -t 4 -i ${file3_path}`;
    let file2=`-ss ${4.5 + getShift(data, 2)} -t 3 -i ${file2_path}`;
    let file1=`-ss ${4.5 + getShift(data, 1)} -t 3 -i ${file1_path}`;
    const output = `assets/video/soccer/concat.mp4`;
    const addOptions = `-filter_complex "[0:v:0][1:v:0][2:v:0]concat=n=3:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`;
    const concatCmd = `ffmpeg ${file3} ${file2} ${file1} ${addOptions} ${output}`;
    // const concatCmd = `ffmpeg ${file1} ${file2} ${file3} ${addOptions} ${output}`;
    console.log('concat command = ' + concatCmd);
    console.log('----------------------');
    try {
         //  worker第三步完成与否
        const concatVideoSuccess=await promiseFromChildProcess(child.exec(concatCmd));
         console.log(concatVideoSuccess)
         if(concatVideoSuccess==0){
             console.log('75%')
             const body_status={
                'taskId':data.task.taskId,
                'role':'worker',
                'position':data['worker_id'],
                'msg':'75%'
           }
           request({
               url: `${config.apiServer}/task/update_status`,
               method: "POST",
               json: true,
               body: body_status
           }, (error, response, body) => { })
         }
        return await promiseFromChildProcess(child.exec(concatCmd));
    } catch (err) {
        console.log(`concat video error: ${err}`);
        const body_status={
            'taskId':data.task.taskId,
            'role':'worker',
            'position':data['worker_id'],
            'msg':'concatVideo fail'
       }
       request({
           url: `${config.apiServer}/task/update_status`,
           method: "POST",
           json: true,
           body: body_status
       }, (error, response, body) => { })
        if (cb) {
            // removeFile();
            cb.onAbort(data, `concat video error`, null, null);
        }
        return Promise.reject('');
    }
}

    //   拼接2段视频
// async function concatVideo(data, cb, msg) {
//     let file1_path = `assets/video/soccer/${data.task.taskId}_1_intercept.mp4`; 
//     let file2_path = `assets/video/soccer/${data.task.taskId}_2_slowDown.mp4`; 
//     // let file3_path = `assets/video/soccer/${data.task.taskId}_3.mp4`;
//     const output = `assets/video/soccer/concat.mp4`;
//     const addOptions = `-filter_complex "[0:v:0][1:v:0]concat=n=2:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`;
//     const concatCmd = `ffmpeg -i ${file1_path} -i ${file2_path} ${addOptions} ${output}`;
//     console.log('concat command = ' + concatCmd);
//     console.log('----------------------');
//     try {
//          // worker第三步完成与否
//          const concatVideoSuccess=await promiseFromChildProcess(child.exec(concatCmd));
//          if(concatVideoSuccess==0){
//              console.log('step5/8:concatVideo complete')
//              const body_status={
//                 'taskId':data.task.taskId,
//                 'role':'worker',
//                 'position':data['worker_id'],
//                 'msg':'step5/8:concatVideo complete'
//            }
//            request({
//                url: `${config.apiServer}/task/update_status`,
//                method: "POST",
//                json: true,
//                body: body_status
//            }, (error, response, body) => { })
//          }

//         return await promiseFromChildProcess(child.exec(concatCmd));
//     } catch (err) {
//         console.log(`concat video error`);
//         const body_status={
//             'taskId':data.task.taskId,
//             'role':'worker',
//             'position':data['worker_id'],
//             'msg':'step5/8:concatVideo fail'
//        }
//        request({
//            url: `${config.apiServer}/task/update_status`,
//            method: "POST",
//            json: true,
//            body: body_status
//        }, (error, response, body) => { })
//         if (cb) {
//             removeFile();
//             cb.onAbort(data, `concat video error`, null, null);
//         }
//         return Promise.reject('');
//     }
// }

async function applyMusic(data,dst, music, dst_1,cb) { 
    const addOptions = `-shortest -strict -2`;
    const musicCmd = `ffmpeg -i ${music} -i ${dst} ${addOptions} ${dst_1}`; 
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

async function overlayVideo(data,dst, board, dst_1,cb){
    // const input = `assets/video/soccer/${data.task.taskId}/music.mp4`;
    // const output = `assets/video/soccer/${data.task.taskId}/upload.mp4`;
    // 5 templates, from template1.png to template5.png
    // const overlay = `assets/overlay/soccer/template${Math.floor(Math.random() * 5 + 1)}.png`;
    // const overlay = `assets/overlay/soccer/template7.png`;
    // const overlay = `assets/video/soccer/${data.task.taskId}/template.png`;
    const addOptions = `-filter_complex "[0:v][1:v] overlay=0:0" -strict -2 -y -hide_banner -loglevel panic`;
    const overlayCmd = `ffmpeg -i ${dst} -i ${board} ${addOptions} ${dst_1}`;
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
// 串流视频
async function streamingVideo(data, cb) {
    const input = `assets/video/soccer/${data.task.taskId}/${data.task.taskId}.mp4`;
    const output = `assets/video/soccer/${data.task.taskId}/streaming.mp4`;
    const addOptions = `-movflags faststart -acodec copy -vcodec copy`;
    // const addOptions = `-c copy -movflags faststart`;
    const streamingCmd = `ffmpeg -i ${input} ${addOptions} ${output}`;
    console.log('streaming command = ' + streamingCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(streamingCmd)); 
    } catch (err) {
        console.log(`streaming video error`);
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


async function addtextVideo(data,cb){
    const input = `assets/video/soccer/text.mp4`;
    const output = `assets/video/soccer/upload.mp4`;
    const fontDHfile = path.join(__dirname, "../data/font/FZZDHJW.ttf");
    const start_time = `-ss 00:00:00`;
    const time_length = `-t 00:00:10`;
    let drawtextName=`${fontDHfile}:text=洛克公园:fontcolor=white: fontsize=40:x=190:y=1580:enable='between(t,0,10)'`;
    let dramtextAge=`${fontDHfile}:text=动感篮球，快乐我秀:fontcolor=white: fontsize=40:x=190:y=1640:enable='between(t,0,10)'`;
    // let drawtextName=`${fontDHfile}:text=乐刻炫跑马拉松NO.1:fontcolor=white: fontsize=40:x=190:y=1580:enable='between(t,0,10)'`;
    // let dramtextAge=`${fontDHfile}:text=5分20秒完成1公里:fontcolor=white: fontsize=40:x=190:y=1640:enable='between(t,0,10)'`;
    // console.log(drawtextName)
    const addOptions = `-vf "drawtext=${drawtextName},drawtext=${dramtextAge}"`;
    const addtextVideoCmd = `ffmpeg -nostats -loglevel verbose -y ${start_time} -i ${input} ${addOptions} ${time_length} ${output}`;
    console.log('addtextVideo command = ' + addtextVideoCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(addtextVideoCmd)); 
    } catch (err) {
        console.log(`addtextVideo video error`);
        if (cb) {
            // removeFile();
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `addtextVideo video error`, null, null);
        }
        return Promise.reject('');
    }
}

async function interceptFrame(data,dst,frame_jpg,cb){
    const interceptFrameCmd = `ffmpeg -i ${dst} -y -f image2 -ss 00:00:01 -vframes 1 -hide_banner -loglevel panic -y ${frame_jpg}`;
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
// 缩图
async function scalePic(data,farme_jpg,frame_jpg_min,cb){
    const scalePicCmd = `ffmpeg -i ${farme_jpg} -vf scale=iw*0.25:ih*0.25 -y -hide_banner -loglevel panic ${frame_jpg_min}`;
    console.log('scalePicCmd command = ' + scalePicCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(scalePicCmd)); 
    } catch (err) {
        console.log(`scalePicCmd video error`);
        if (cb) {
            // removeFile();
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `scalePicCmd video error`, null, null);
        }
        return Promise.reject('');
    }
}
//  视频变GIF
async function goToGIF(data,cb){
    const input = `assets/video/soccer/${data.task.taskId}/upload.mp4`;
    const output = `assets/video/soccer/${data.task.taskId}/${data.task.taskId}.gif`;
    const goToGIFCmd = `ffmpeg -i ${input} -t 10 -s 320*240 -pix_fmt rgb24 -hide_banner -loglevel panic -y ${output}`;
    console.log('goToGIFCmd command = ' + goToGIFCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(goToGIFCmd)); 
    } catch (err) {
        console.log(`goToGIFCmd video error`);
        if (cb) {
            // removeFile();
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `goToGIFCmd video error`, null, null);
        }
        return Promise.reject('');
    }
}
async function compressFrame(data,cb){
    const input = `assets/video/soccer/${data.task.taskId}.jpg`;
    const output = `assets/video/soccer/${data.task.taskId}_compress.png`;
    const compressFrameCmd = `ffmpeg -hide_banner -i ${input} -pix_fmt pal8 ${output}`;
    console.log('compressFrame command = ' + compressFrameCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(compressFrameCmd)); 
    } catch (err) {
        console.log(`compressFrame video error`);
        if (cb) {
            // removeFile();
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `compressFrame video error`, null, null);
        }
        return Promise.reject('');
    }
}



async function ossUpload(data, localFileName, originFileName) {
    return await new Promise((resolve, reject) => {
        // let originFileName = `${originFileName}`;
        // let localFileName = `${localFileName}`;
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

async function removeFile() {
    return await promiseFromChildProcess(child.exec('rm assets/video/soccer/*'));
}
async function removeFileName(fileName) {
    return await promiseFromChildProcess(child.exec(`rm -r assets/video/soccer/${fileName}`));
}

function promiseFromChildProcess(child) {
    return new Promise((resolve, reject) => {
        child.stdout.on('data', res => resolve(res));  
        child.on('close', res => {
            res === 0 ? resolve(res) : reject(res); 
        });
    });
}

function executeCmd(cmd) {
    let c = child.exec(cmd);
    return new Promise((resolve, reject) => {
      c.stderr.on("data", res => {
          console.log(res);
      });
      c.stdout.on("data", res => {
          console.log(res);
          resolve(res);
      });
      c.on("close", res => {
        res === 0 ? resolve(res) : reject(res);
      });
    });
  }

// function getParams(item,index){
//    console.log(index+item) 
// }

async function getVideoTime(filePath: string, time) {
    const duration = await promiseFromChildProcess(child.exec(`ffmpeg -i ${filePath} 2>&1 | grep "Duration"| cut -d ' ' -f 4 | sed s/,//`));
    console.log(`duration = ${duration}`);
    console.log(`String(duration).substring(6) = ${String(duration).substring(6)}`);
    console.log(`parseFloat(String(duration).substring(6)) = ${parseFloat(String(duration).substring(6))}`);
    console.log(`parseFloat(String(duration).substring(6)) - time = ${parseFloat(String(duration).substring(6)) - time}`);
    return Promise.resolve(parseFloat(String(duration).substring(6)) - time);
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
