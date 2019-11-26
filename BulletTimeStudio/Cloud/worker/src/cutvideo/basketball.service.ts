import { Component } from '@nestjs/common';
import { IWorkerCallback, IEngine } from '../common/worker.interface';
import * as child from "child_process";
import { WorkerUtil } from '../common/worker.util';
import { callbackify } from 'util';
import httpclient from "../oss/siiva-oss/httpclient";
import {HttpClientCallback} from "../oss/siiva-oss/httpclient.interface";
const config = require(`../../config/${process.env.NODE_ENV || 'production'}.json`);

const HttpRequest = require('ufile').HttpRequest;
const AuthClient = require('ufile').AuthClient;
const helper = require('ufile').helper;
const util = require('util');
const bluebird = require('bluebird');

const request = require('request');

const path = require('path');
const fs=require('fs');
const crypto=require('crypto');
const urlencode=require('urlencode');

@Component()
export class BasketballService implements IEngine {
    async cut_video(data, cb: IWorkerCallback) {
        console.log('------------------------------------')
        console.log('------------------------------------')
        console.log('进BasketballService')
        console.log(data)
        const task = data.task;
        console.log(task)
        let workerUtil = new WorkerUtil();
     
        data['worker_id']=WorkerUtil.getWorkerId()

        console.log('----------------------');
        try {
            mkdirp(data.task);    //以taskId为名创建文件夹
            // var a='2014-04-23 00:00:05'
           
            // await findVideoSource(data,data.task.frame,cb);

            //下载源视频
            // await videoDownload(data, '视频名称',cb); 
            // if(data.task.frame/30-9<0){   //左边缘端 
            //     await interceptVideo(data,'181228',0,10,cb,1);  
            // }else{
            //     if(data.task.frame/30+1>)
            // }
            // 按照-8+2剪切视频 
            await interceptVideo(data,'181228',data.task.frame/30-8,10,cb,1);
            // 贴文字
            // await addtextVideo(data,`${data.task.taskId}_1_intercept`,cb);
          
            await interceptFrame(data,cb);
            await scalePic(data,cb);
            
         // 准备上传（两张图、一个视频）
            await ossUpload(data,`assets/video/soccer/${data.task.taskId}/${data.task.taskId}.jpg`,`soccer_${task.taskId}.jpg`);
             await ossUpload(data,`assets/video/soccer/${data.task.taskId}/${data.task.taskId}_min.jpg`,`soccer_${task.taskId}_min.jpg`);
            const uploadResult = await ossUpload(data,`assets/video/soccer/${data.task.taskId}/${data.task.taskId}_1_intercept.mp4`, `${task.siteId}/soccer_${task.taskId}.mp4`);
            if (cb) {
                removeFileName(data.task.taskId) 
                // cb.onStop(data, downloadMsg.length > 0 ? `finish task, lack video ${downloadMsg}` : `finish task`, null, null);
                cb.onStop(data, null, null, null);
            }
            console.log(uploadResult);

        } catch (err) {
            console.error(err);
        }
    }
}

async function interceptFrame(data,cb){
    const input = `assets/video/soccer/${data.task.taskId}/${data.task.taskId}_1_intercept.mp4`; 
    const output=`assets/video/soccer/${data.task.taskId}/${data.task.taskId}.jpg`
    const interceptFrameCmd = `ffmpeg -i ${input} -y -f image2 -ss 00:00:01 -vframes 1 -hide_banner -loglevel panic -y ${output}`;
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

async function scalePic(data,cb){
    const input = `assets/video/soccer/${data.task.taskId}/${data.task.taskId}.jpg`; 
    const output=`assets/video/soccer/${data.task.taskId}/${data.task.taskId}_min.jpg`
    const scalePicCmd = `ffmpeg -i ${input} -vf scale=iw*0.25:ih*0.25 -y -hide_banner -loglevel panic ${output}`;
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

async function findVideoSource(data,frame,cb){

//根据 start\end计算video
    // var number=Math.ceil(frame/30);     //该frame_no在视频第 number 秒处
    // var video_index;
    // console.log(number)
    // for(let i=0;i<=data.videolist.length-1;i++){
    //     if(number>=data.videolist[i]['start']&&number<data.videolist[i]['end']){
    //         video_index=i;       //找到第几个video
    //     }
    // }
    // console.log('是第'+video_index+'个视频')
    //  if(Number(number-9-data.videolist[video_index]['start'])>=0){
    //    if(Number(number+1-data.videolist[video_index]['end'])>0){
    //        console.log('截取视频段='+video_index+','+video_index+1)
    //        let vidoe_index_start=number-9-data.videolist[video_index]['start'];
    //        let video_index_seconds=data.videolist[video_index]['end']-(number-9)         //该段视频从vidoe_index_start开始截取的秒数
    //        let video_index_next_start=0;
    //        let video_index_next_seconds=number+1-data.videolist[video_index+1]['start'];    //下一段视频从video_index_next_start开始截取的秒数
    //       //  下载两段视频
    //        await videoDownload(data, data.videolist[video_index]['src'],cb); 
    //        await videoDownload(data, data.videolist[video_index+1]['src'],cb);
    //       // 剪切两段视频对应部分
    //       await interceptVideo(data,data.videolist[video_index]['src'],vidoe_index_start,video_index_seconds,cb,1);
    //       await interceptVideo(data,data.videolist[video_index+1]['src'],video_index_next_start,video_index_next_seconds,cb,2);
    //       await concatVideo(data,cb);
    //       await addtextVideo(data,'concat',cb)
    //    }else{
    //       console.log('截取视频段video_index')
    //       let video_index_start=number-data.videolist[video_index]['start']-9;
    //       let video_index_seconds=10;    //从该视频video_index_start开始截取的秒数 
    //       //  下载一段视频
    //       await videoDownload(data, data.videolist[video_index]['src'],cb); 
    //       await interceptVideo(data,data.videolist[video_index]['src'],video_index_start,video_index_seconds,cb,1);
    //       await addtextVideo(data,`${data.task.taskId}_1_intercept`,cb)
    //    }
    //  }else{
    //        console.log('截取视频段='+Number(video_index-1)+','+video_index)
    //       let video_index_pre_start=data.videolist[video_index-1]['end']-data.videolist[video_index-1]['start']-(data.videolist[video_index]['start']-(number-9));
    //        let video_index_pre_seconds=data.videolist[video_index]['start']-(number-9);    //上一段视频从video_index_pre_start开始截取的秒数
    //        let vidoe_index_start=0
    //        let video_index_seconds=number+1-data.videolist['video_index']['start']         //该段视频从vidoe_index_start开始截取的秒数
    //        //  下载两段视频
    //        await videoDownload(data, data.videolist[video_index-1]['src'],cb); 
    //        await videoDownload(data, data.videolist[video_index]['src'],cb); 
    //        // 剪切两段视频对应部分
    //       await interceptVideo(data,data.videolist[video_index-1]['src'],video_index_pre_start,video_index_pre_seconds,cb,1);
    //       await interceptVideo(data,data.videolist[video_index]['src'],vidoe_index_start,video_index_seconds,cb,2);
    //       await concatVideo(data,cb);
    //       await addtextVideo(data,'concat',cb)
    //  }


    // 根据每段60秒计算
  var number=Math.ceil(frame/30);     //该frame_no在视频第 number 秒处
  console.log(number)
  var video_index=Math.floor(Number(number)/60);   //该frame_no在第 video_index 段视频中(video_index从0开始)
  console.log('是第'+video_index+'个视频')
   if(Number(number-9-video_index*60)>0){
     if(Number(number+1-(video_index+1)*60)>0){
         console.log('截取视频段='+video_index+','+video_index+1)
         let vidoe_index_start=51+number-(video_index+1)*60
         let video_index_seconds=9-number+(video_index+1)*60          //该段视频从vidoe_index_start开始截取的秒数
         let video_index_next_start=0;
         let video_index_next_seconds=number+1-(video_index+1)*60;    //下一段视频从video_index_next_start开始截取的秒数
        //  下载两段视频
         await videoDownload(data, '00000000.mp4',cb); 
         await videoDownload(data, '00000001.mp4',cb);
        // 剪切两段视频对应部分
        await interceptVideo(data,'00000000',vidoe_index_start,video_index_seconds,cb,1);
        await interceptVideo(data,'00000001',video_index_next_start,video_index_next_seconds,cb,2);
        await concatVideo(data,cb);
        await addtextVideo(data,'concat',cb)
     }else{
        console.log('截取视频段video_index')
        let video_index_start=number-video_index*60-9;
        let video_index_seconds=10;    //从该视频video_index_start开始截取的秒数 
        //  下载一段视频
        await videoDownload(data, '00000000.mp4',cb); 
        await interceptVideo(data,'00000000',video_index_start,video_index_seconds,cb,1);
        await addtextVideo(data,`${data.task.taskId}_1_intercept`,cb)
     }
   }else{
         console.log('截取视频段='+Number(video_index-1)+','+video_index)
        let video_index_pre_start=51+number-video_index*60;
         let video_index_pre_seconds=9+video_index*60-number;    //上一段视频从video_index_pre_start开始截取的秒数
         let vidoe_index_start=0
         let video_index_seconds=number+1-video_index*60          //该段视频从vidoe_index_start开始截取的秒数
         //  下载两段视频
         await videoDownload(data, '00000000.mp4',cb); 
         await videoDownload(data, '00000001.mp4',cb); 
         // 剪切两段视频对应部分
        await interceptVideo(data,'00000000',video_index_pre_start,video_index_pre_seconds,cb,1);
        await interceptVideo(data,'00000001',vidoe_index_start,video_index_seconds,cb,2);
        await concatVideo(data,cb);
        await addtextVideo(data,'concat',cb)
   }
  

    
}
// 获取视频总时长   let time= await getVideoTimeLength(data,cb);  console.log('视频总时长为:'+String(time).split(" ")[3])
async function getVideoTimeLength(data,cb){
    const input=`assets/video/soccer/181228.mp4`;
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
// 获取视频分辨率  let size= await getVideoSize(data,cb);   console.log('视频分辨率为:'+String(size).split(",")[1])
async function getVideoSize(data,cb){
    const input=`assets/video/soccer/181228.mp4`;
    const getVideoSizeCmd = `ffmpeg -i ${input} 2>&1 | grep 'Video'|cut -d '' -f 10|sed s/,//`;
    // console.log(getVideoSizeCmd)
    try {
        return await promiseFromChildProcess(child.exec(getVideoSizeCmd));
    } catch (err) {
        if (cb) {
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `getVideoSizeCmd video  error`, null, null);
        }
        return Promise.reject('');
    }
}

async function interceptVideo(data,inputFile,starttime,seconds,cb, videoNum: number) {
    console.log('进interceptVideo了')
    console.log(starttime+'????????????'+seconds)
    // const input=`assets/video/soccer/${data.task.taskId}/streaming.mp4`;
    const input=`assets/video/soccer/${inputFile}.mp4`;
    const output = `assets/video/soccer/${data.task.taskId}/${data.task.taskId}_${videoNum}_intercept.mp4`; 
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
            removeFileName(data.task.taskId)  //删除以taskId为名的文件夹
            cb.onAbort(data, `intercept video ${videoNum} error`, null, null);
        }
        return Promise.reject('');
    }
}
// async function changeHHMMSSToSeconds(date){
//     let time=date;
//     let seconds;
//     let hh=time.split(':')[0]
//     if(hh.split("")[0]==0){
//         seconds=Number(hh.split("")[1])*60*60;
//     }else{
//         seconds=Number(hh)*60*60;   
//     }
//     let mm=time.split(':')[1]
//     if(mm.split("")[0]==0){
//         seconds=Number(mm.split("")[1])*60*60;
//     }else{
//         seconds=Number(mm)*60*60;   
//     }
//     let ss=time.split(':')[2]

// }



async function changeToHHMMSS(seconds){
   var hourTime = 0;
    var minuteTime = 0;
    var secondTime = 0;
    if (seconds > 60) {  //如果秒数大于60
      minuteTime = Math.floor(seconds / 60);
      secondTime = Math.floor(seconds % 60);
      if (minuteTime >= 60) {  //如果分钟大于60
        hourTime = Math.floor(minuteTime / 60);
        minuteTime = Math.floor(minuteTime % 60);
      } else {
        hourTime = 0;
      }
    } else {
      hourTime = 0;
      minuteTime = 0;
      if (seconds == 60) {  //如果秒数等于60
        minuteTime = 1;
        secondTime = 0;
      } else {
        secondTime = seconds;
      }
    }
    var timeResult = await addZero(hourTime) + ':' +await addZero(minuteTime) + ':' + await addZero(secondTime);
    return timeResult;
  }

  async function addZero(time) {
    let str = time;
    if (time < 10) {
      str = '0' + time;
    }
    return str;
  }


  async function videoDownload(data,fileName,cb) {
    let count = 0;
    let msg = '';
    let ufileDownloadRes = await ossDownloadVideo(data.task,fileName);
    console.log(ufileDownloadRes)
     msg=ufileDownloadRes==`assets/video/soccer/${data.task.taskId}/${fileName}`?'':'error'

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

async function ossDownloadVideo(task,fileName) {
        return new bluebird(async (resolve) => {
            let originFileName = `${task.siteId}/${fileName}`;
            // let localFileName = `assets/video/soccer/${task.taskId}_${index + 1}.mp4`;
            let localFileName = `assets/video/soccer/${task.taskId}/${fileName}`;
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






    //   拼接2段视频
async function concatVideo(data,cb) {
    let file1_path = `assets/video/soccer/${data.task.taskId}/${data.task.taskId}_1_intercept.mp4`; 
    let file2_path = `assets/video/soccer/${data.task.taskId}/${data.task.taskId}_2_intercept.mp4`; 
    const output = `assets/video/soccer/${data.task.taskId}/concat.mp4`;
    const addOptions = `-filter_complex "[0:v:0][1:v:0]concat=n=2:v=1[outv]" -map "[outv]" -y -r 30 -hide_banner -loglevel panic`;
    const concatCmd = `ffmpeg -i ${file1_path} -i ${file2_path} ${addOptions} ${output}`;
    console.log('concat command = ' + concatCmd);
    console.log('----------------------');
    try {
         // worker第三步完成
        return await promiseFromChildProcess(child.exec(concatCmd));
    } catch (err) {
        console.log(`concat video error`);
        const body_status={
            'taskId':data.task.taskId,
            'role':'worker',
            'position':data['worker_id'],
            'msg':'step5/8:concatVideo fail'
       }
       request({
           url: `${config.apiServer}/task/update_status`,
           method: "POST",
           json: true,
           body: body_status
       }, (error, response, body) => { })
        if (cb) {
            removeFileName(data.task.taskId) 
            cb.onAbort(data, `concat video error`, null, null);
        }
        return Promise.reject('');
    }
}

 




async function addtextVideo(data,inputFile,cb){
    console.log('--------------------')
    console.log('进addTextVideo了')
    console.log(`${data.task.player}`)
    console.log(`${data.task.team}`)
    console.log(`${data.task.goalType}`)
    const input = `assets/video/soccer/${data.task.taskId}/${inputFile}.mp4`;
    const output = `assets/video/soccer/${data.task.taskId}/addText.mp4`;
    const fontDHfile = path.join(__dirname, "../data/font/FZZDHJW.ttf");
    const start_time = `-ss 00:00:00`;
    const time_length = `-t 00:00:10`;
    let drawtextteamName=`${fontDHfile}:text=${data.task.player}:fontcolor=white: fontsize=40:x=190:y=150:enable='between(t,0,10)'`;
    let drawtextplayerName=`${fontDHfile}:text=${data.task.team}:fontcolor=white: fontsize=40:x=190:y=200:enable='between(t,0,10)'`;
    let drawtextType=`${fontDHfile}:text=${data.task.goalType}:fontcolor=white: fontsize=40:x=190:y=250:enable='between(t,0,10)'`;
    const addOptions = `-strict -2 -vf "drawtext=${drawtextteamName},drawtext=${drawtextplayerName},drawtext=${drawtextType}"`;
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
    // return await promiseFromChildProcess(child.exec('rm assets/video/soccer/*.mp4')); 
    return await promiseFromChildProcess(child.exec('rm assets/video/soccer/*'));
}

function promiseFromChildProcess(child) {
    return new Promise((resolve, reject) => {
        child.stdout.on('data', res => resolve(res));  
        child.on('close', res => {
            res === 0 ? resolve(res) : reject(res); 
        });
    });
}
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

async function removeFileName(fileName) {
    return await promiseFromChildProcess(child.exec(`rm -r assets/video/soccer/${fileName}`));
}


 


