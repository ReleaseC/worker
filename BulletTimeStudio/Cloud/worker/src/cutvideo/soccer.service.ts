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
export class SoccerService implements IEngine {
    async cut_video(data, cb: IWorkerCallback) {
        /*worker开始时间 */
        var t_start=new Date().getTime(); 
        const task = data.task;
        console.log(task)
        // console.log(typeof task.cameraSetting)
        task.templatefileName=`leke_template${Math.floor(Math.random() * 4 + 1)}.png`;
        let workerUtil = new WorkerUtil();
        let videoCam_1_scale_value=1.2;
        let videoCam_1_rotation_value=0;
        let videoCam_2_scale_value=1;
        let videoCam_2_rotation_value=0;
        let videoCam_3_scale_value=1;
        let videoCam_3_rotation_value=0;
        data['worker_id']=WorkerUtil.getWorkerId()
        // const cameraSetting=data.task.cameraSetting;
        // for(let i=0;i<=cameraSetting.length-1;i++){
        //     console.log(cameraSetting[i]['role'])
        //     if(cameraSetting[i]['role']=='VideoCam_0'){
        //        videoCam_1_scale_value =Number(cameraSetting[i].scale.split('%')[0])/100;
        //        videoCam_1_rotation_value=cameraSetting[i]['rotation'];
        //     }
        //     if(cameraSetting[i]['role']=='VideoCam_1'){
        //          videoCam_2_scale_value=Number(cameraSetting[i].scale.split('%')[0])/100;
        //          videoCam_2_rotation_value=cameraSetting[i]['rotation'];
        //     }
        //     if(cameraSetting[i]['role']=='VideoCam_2'){
        //         videoCam_3_scale_value =Number(cameraSetting[i].scale.split('%')[0])/100;
        //         videoCam_3_rotation_value=cameraSetting[i]['rotation'];
        //      }
        // }


        // 将msg置空
    //     const body_status={
    //         'taskId':data.task.taskId,
    //         'role':'worker',
    //         'position':data['worker_id'],
    //         'msg':''
    //    }
    //    request({
    //        url: `${config.apiServer}/task/update_status`,
    //        method: "POST",
    //        json: true,
    //        body: body_status
    //    }, (error, response, body) => { })

        console.log('----------------------');
        try {
            // await upload_init();
            // await md5File('assets/video/soccer/upload.mp4',upload_init)
            var download_t_start=new Date().getTime(); 
            
            const downloadMsg = await videoDownload(data, cb);
            
            var download_t_end=new Date().getTime();
            
            await ossDownloadTemplate(task.templatefileName);
            
            var rotate_t_start=new Date().getTime();
    
            // await rotateVideo(data,cb, 1);
            // await rotateVideo(data,cb, 2);
            // await rotateVideo(data,cb, 3);
           
            var rotate_t_end=new Date().getTime(); 
            
            // await scaleVideo(data,videoCam_1_scale_value,cb, 1); 
           
            var scale_t_end=new Date().getTime();
           
            // await scaleVideo(data,videoCam_2_scale_value,cb, 2); 
            // await scaleVideo(data,videoCam_3_scale_value,cb, 3);
            // await interceptVideo(data,4,cb, 1);
            // await interceptVideo(data,3,cb, 2);
            // await slowDownVideo(data,cb, 2); 
            await concatVideo(data, cb, downloadMsg);
           
            var concat_t_end=new Date().getTime(); 
            
            await addMusic(data, cb);
            await overlayVideo(data, cb);
            await addtextVideo(data,cb);
            await interceptFrame(data,cb);
            // await compressFrame(data,cb)

            var videoUpload_t_start=new Date().getTime(); 
            await ossUpload(data,`assets/video/soccer/${data.task.taskId}.jpg`,`soccer_${task.taskId}.jpg`);
            const uploadResult = await ossUpload(data,'assets/video/soccer/upload.mp4', `soccer_${task.taskId}.mp4`);
            // await shareweibo(task.taskId);
            if (cb) {
                removeFile();
                cb.onStop(data, downloadMsg.length > 0 ? `finish task, lack video ${downloadMsg}` : `finish task`, null, null);
            }
            console.log(uploadResult);
            var t_end=new Date().getTime();
            var downloadVideo_t_process=(download_t_end-download_t_start)/1000;
            var downloadTemplate_t_process=(rotate_t_start-download_t_end)/1000;
            var rotate_t_process=(rotate_t_end-rotate_t_start)/1000;
            var scale_t_process=(scale_t_end-rotate_t_end)/1000;
            var concat_t_process=(concat_t_end-scale_t_end)/1000;
            var videoUpload_t_process=(t_end-videoUpload_t_start)/1000;
            var t_process=(t_end-t_start)/1000;
            console.log('worker处理downloadVideo时长：'+downloadVideo_t_process+'秒') 
            console.log('worker处理downloadTemplate时长：'+downloadTemplate_t_process+'秒')
            console.log('worker处理rotateVideo时长：'+rotate_t_process+'秒') 
            console.log('worker处理scaleVideo时长：'+scale_t_process+'秒') 
            console.log('worker处理concatVideo时长：'+concat_t_process+'秒') 
            console.log('worker处理videoUpload时长：'+videoUpload_t_process+'秒') 
            console.log('worker处理该task所费总时长：'+t_process+'秒') 
            console.log('----------------------');
        } catch (err) {
            console.error(err);
        }
    }
}

async function videoDownload(data, cb) {
    // async function videoDownload(array, cb) {
    // console.log('进videodownload')
    // console.log(data)
    let count = 0;
    let msg = '';
    // let ufileDownloadRes = await ufileDownload(data.task);
    let ufileDownloadRes = await ossDownloadVideo(data.task);
    // let ufileDownloadRes = await ufileDownload(array);
    // console.log('ufileDownloadRes='+ufileDownloadRes);

    ufileDownloadRes.forEach((isVideoExist, index) => {
        if (!isVideoExist) {
            count++;
            msg += `${index + 1},`;
        }
    })
    msg = msg.length > 0 ? msg.substring(0, msg.length - 1) : '';

    // worker第一步完成与否
    if(count==0){
        console.log('25%:download complete')
    const body_status={
         'taskId':data.task.taskId,
         'role':'worker',
         'position':data['worker_id'],
         'msg':'25%'
    }
    request({
        url: `${config.apiServer}/task/update_status`,
        method: "POST",
        json: true,
        body: body_status
    }, (error, response, body) => { })
   }

    if (count < 3) {
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

async function ufileDownload(task) {
    // async function ufileDownload(array) {
    return new bluebird.map([task.fileName1,task.fileName2,task.fileName3], (file, index) => {
        return new bluebird(async (resolve) => {
            const bucket = 'eee',
                key = `${file}`,
                file_path = `assets/video/soccer/${task.taskId}_${index + 1}.mp4`,
                // file_path = `assets/video/soccer/${index + 1}.mp4`,
                method = 'GET',
                url_path_params = '/' + key;
                console.log(url_path_params);
                console.log(file_path);
            const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
            // console.log(req)
            const client = new AuthClient(req);
            // console.log(client)
            const result = await client.SendRequest(callback);
            // console.log(result+'zzzzzzzzzzzzzzzzzzzzzzzzz')
            if (result.statusCode !== 200) {
                return resolve(false);
            }
            const ufileHash = result.header.etag.replace(/\"/g, '');
            let localHash = await helper.UFileEtag(file_path, helper.GetFileSize(file_path));
            console.log('ufileHash = ' + ufileHash);
            console.log('localHash = ' + localHash);
            const waitInterval = setInterval(async () => {
                if (ufileHash != localHash) {
                    console.log('ufileHash != localHash');
                    localHash = await helper.UFileEtag(file_path, helper.GetFileSize(file_path));
                    console.log('ufileHash = ' + ufileHash);
                    console.log('localHash = ' + localHash);
                } else {
                    resolve(file_path);
                    clearInterval(waitInterval);
                }
            }, 3000);

            function callback(res) {
                if (res instanceof Error) {
                    console.log(util.inspect(res));
                }
            }
        })
    })
}

async function ossDownloadVideo(task) {
    return new bluebird.map([task.fileName1,task.fileName2,task.fileName3], (file, index) => {
        return new bluebird(async (resolve) => {
            let originFileName = `${file}`;
            let localFileName = `assets/video/soccer/${task.taskId}_${index + 1}.mp4`;
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
    });
}


async function downloadTemplate(data) {
    const bucket = 'eee',
        key = `${data}`,
        file_path = `assets/video/soccer/template.png`,
        method = 'GET',
        url_path_params = '/' + key;
    const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
    const client = new AuthClient(req);
    const res = await client.SendRequest(() => { });
    if (res.statusCode === 200) {
        console.log('----------------------');
        console.log('模板下载成功'); 
        return Promise.resolve();
    } else {
        console.log('----------------------');
        console.log('模板下载失败'); 
        return Promise.reject('');
    }
}

async function ossDownloadTemplate(data) {
    let localFileName = `assets/video/soccer/template.png`;
    let originFileName = `${data}`;
    let callback = {
        onSuccess: result => {
            console.log(`模板下载成功`);
            return Promise.resolve();
        },
        onError: err => {
            console.log(`模板下载失败`);
            return Promise.reject('');
        }
    } as HttpClientCallback;

    console.log(`开始下载： ${originFileName}`);
    httpclient.get(originFileName, localFileName, callback);
}

async function rotateVideo(data,cb, videoNum: number) { 
    const input = `assets/video/soccer/${data.task.taskId}_${videoNum}.mp4`; 
    const output = `assets/video/soccer/${data.task.taskId}_${videoNum}_rotate.mp4`; 
    // const addOptions = `-vf "rotate=90"`; 
    const scaleCmd = `ffmpeg -i ${input} -vf "transpose=2" -y -hide_banner -loglevel panic ${output}`;
    console.log('----------------------');
    console.log('rotate command = ' + scaleCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(scaleCmd));
    } catch (err) {
        console.log(`rotate video ${videoNum} error`); 

        if (cb) {
            removeFile();
            cb.onAbort(data, `rotate video ${videoNum} error`, null, null);
        }
        return Promise.reject('');
    }
}

async function scaleVideo(data,value, cb, videoNum: number) { 
    // console.log('进scale了')
    const input = `assets/video/soccer/${data.task.taskId}_${videoNum}_rotate.mp4`; 
    const output = `assets/video/soccer/${data.task.taskId}_${videoNum}_scale.mp4`; 
    // const addOptions = `-vf scale=iw*1.2:ih*1.2,crop=iw/1.2:ih/1.2 -y -hide_banner -loglevel panic`; 
    const addOptions = `-vf scale=iw*${value}:ih*${value},crop=iw/${value}:ih/${value} -y -hide_banner -loglevel panic`; 
    const scaleCmd = `ffmpeg -i ${input} ${addOptions} ${output}`;
    console.log('----------------------');
    console.log('scale command = ' + scaleCmd);
    console.log('----------------------');
    try {
        
       // worker第二步完成与否
       if(videoNum==1){
        const scaleVideoSuccess=await promiseFromChildProcess(child.exec(scaleCmd))
        if(scaleVideoSuccess==0){
            console.log('30%')
            const body_status={
                'taskId':data.task.taskId,
                'role':'worker',
                'position':data['worker_id'],
                'msg':'30%'
           }
           request({
               url: `${config.apiServer}/task/update_status`,
               method: "POST",
               json: true,
               body: body_status
           }, (error, response, body) => { })
        }
       }
    //    if(videoNum==2){
    //     const scaleVideoSuccess=await promiseFromChildProcess(child.exec(scaleCmd))
    //     if(scaleVideoSuccess==0){
    //         console.log('40%')
    //         const body_status={
    //             'taskId':data.task.taskId,
    //             'role':'worker',
    //             'position':data['worker_id'],
    //             'msg':'40%'
    //        }
    //        request({
    //            url: `${config.apiServer}/task/update_status`,
    //            method: "POST",
    //            json: true,
    //            body: body_status
    //        }, (error, response, body) => { })
    //     }
    //    }
    //    if(videoNum==3){
    //     const scaleVideoSuccess=await promiseFromChildProcess(child.exec(scaleCmd))
    //     if(scaleVideoSuccess==0){
    //         console.log('50%')
    //         const body_status={
    //             'taskId':data.task.taskId,
    //             'role':'worker',
    //             'position':data['worker_id'],
    //             'msg':'50%'
    //        }
    //        request({
    //            url: `${config.apiServer}/task/update_status`,
    //            method: "POST",
    //            json: true,
    //            body: body_status
    //        }, (error, response, body) => { })
    //     }
    //    }


        return await promiseFromChildProcess(child.exec(scaleCmd));
    } catch (err) {
        console.log(`scale video ${videoNum} error`); 

        const body_status={
            'taskId':data.task.taskId,
            'role':'worker',
            'position':data['worker_id'],
            'msg':'scale video'+videoNum+' fail'
       }
       request({
           url: `${config.apiServer}/task/update_status`,
           method: "POST",
           json: true,
           body: body_status
       }, (error, response, body) => { })
        
        if (cb) {
            removeFile();
            cb.onAbort(data, `scale video ${videoNum} error`, null, null);
        }
        return Promise.reject('');
    }
}

async function interceptVideo(data,seconds,cb, videoNum: number) {
    
    // ToDo: 
    // let shift = getShift(data, videoNum);
    let shift = 0;

    let file_path = `assets/video/soccer/${data.task.taskId}_${videoNum}_scale.mp4`;
    const input=`assets/video/soccer/${data.task.taskId}_${videoNum}_scale.mp4`;
    // let file = `-ss ${await getVideoTime(file_path, 5.5)} -t ${seconds} -i ${file_path} -y -hide_banner -loglevel panic`;
    const output = `assets/video/soccer/${data.task.taskId}_${videoNum}_intercept.mp4`; 
    const addOptions = `-ss ${await getVideoTime(file_path, 5.5 + shift)} -t ${seconds} -i` ;
    const interceptCmd = `ffmpeg ${addOptions} ${input} -y -hide_banner -loglevel panic ${output}`;
    console.log('----------------------');
    console.log('intercept command = ' + interceptCmd);
    console.log('----------------------');
    try {
        if(videoNum==1){
            const interceptSuccess=await promiseFromChildProcess(child.exec(interceptCmd))
            if(interceptSuccess==0){
                    console.log('step3/8:intercept video1 complete')
                    const body_status={
                        'taskId':data.task.taskId,
                        'role':'worker',
                        'position':data['worker_id'],
                        'msg':'step3/8:intercept video1 complete'
                   }
                   request({
                       url: `${config.apiServer}/task/update_status`,
                       method: "POST",
                       json: true,
                       body: body_status
                   }, (error, response, body) => { })
            }
        }
        if(videoNum==2){
            const interceptSuccess=await promiseFromChildProcess(child.exec(interceptCmd))
            if(interceptSuccess==0){
                console.log('step3/8:intercept video2 complete')
                const body_status={
                    'taskId':data.task.taskId,
                    'role':'worker',
                    'position':data['worker_id'],
                    'msg':'step3/8:intercept video2 complete'
               }
               request({
                   url: `${config.apiServer}/task/update_status`,
                   method: "POST",
                   json: true,
                   body: body_status
               }, (error, response, body) => { })
            }
       }
        return await promiseFromChildProcess(child.exec(interceptCmd));
    } catch (err) {
        console.log(`intercept video ${videoNum} error`); 
        if (cb) {
            removeFile();
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

// async function slowDownVideo(data,cb, videoNum: number) { 
//     // console.log('进scale了')
//     const input = `assets/video/soccer/${data.task.taskId}_${videoNum}_intercept.mp4`; 
//     const output = `assets/video/soccer/${data.task.taskId}_${videoNum}_slowDown.mp4`;  
//     const addOptions = `-filter:v "setpts=2*PTS" -y -hide_banner -loglevel panic`; 
//     const slowDownCmd = `ffmpeg -i ${input} ${addOptions} ${output}`;
//     console.log('----------------------');
//     console.log('slowDown command = ' + slowDownCmd);
//     console.log('----------------------');
//     try {
//         const scaleVideoSuccess=await promiseFromChildProcess(child.exec(slowDownCmd))
//         if(scaleVideoSuccess==0){
//             console.log('slowDown Video complete')
//             const body_status={
//                 'taskId':data.task.taskId,
//                 'role':'worker',
//                 'position':data['worker_id'],
//                 'msg':'step4/8:slowDown Video'+videoNum+' complete'
//            }
//            request({
//                url: `${config.apiServer}/task/update_status`,
//                method: "POST",
//                json: true,
//                body: body_status
//            }, (error, response, body) => { })
//         }
//         return await promiseFromChildProcess(child.exec(slowDownCmd));
//     } catch (err) {
//         const body_status={
//             'taskId':data.task.taskId,
//             'role':'worker',
//             'position':data['worker_id'],
//             'msg':'step4/8:slowDown Video'+videoNum+' fail'
//        }
//        request({
//            url: `${config.apiServer}/task/update_status`,
//            method: "POST",
//            json: true,
//            body: body_status
//        }, (error, response, body) => { })
//         console.log(`slowDown video ${videoNum} error`); 
//         if (cb) {
//             removeFile();
//             cb.onAbort(data, `slowDown video ${videoNum} error`, null, null);
//         }
//         return Promise.reject('');
//     }
// }




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

async function addMusic(data, cb) { 
    const music = `assets/overlay/soccer/music1.mp3`; 
    const input = `assets/video/soccer/concat.mp4`; 
    const output = `assets/video/soccer/music.mp4`; 
    const addOptions = `-c copy -y -hide_banner -loglevel panic`; 
    const musicCmd = `ffmpeg -i ${music} -i ${input} ${addOptions} ${output}`; 
    console.log('add music command = ' + musicCmd); 
    console.log('----------------------'); 
    try {   
        return await promiseFromChildProcess(child.exec(musicCmd)); 
    } catch (err) { 
        console.log(`add music video error`); 
        const body_status={
            'taskId':data.task.taskId,
            'role':'worker',
            'position':data['worker_id'],
            'msg':'addMusic fail'
       }
       request({
           url: `${config.apiServer}/task/update_status`,
           method: "POST",
           json: true,
           body: body_status
       }, (error, response, body) => { })
        if (cb) { 
            removeFile(); 
            cb.onAbort(data, `add music video error`, null, null); 
        } 
        return Promise.reject(''); 
    } 
} 

async function overlayVideo(data, cb) {
    const input = `assets/video/soccer/music.mp4`;
    const output = `assets/video/soccer/text.mp4`;
    // 5 templates, from template1.png to template5.png
    // const overlay = `assets/overlay/soccer/template${Math.floor(Math.random() * 5 + 1)}.png`;
    // const overlay = `assets/overlay/soccer/template7.png`;
    const overlay = `assets/video/soccer/template.png`;
    const addOptions = `-filter_complex "[0:v][1:v] overlay=0:0" -hide_banner -loglevel verbose -strict -2 -y`;
    const overlayCmd = `ffmpeg -i ${input} -i ${overlay} ${addOptions} ${output}`;
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
            removeFile();
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
    const addOptions = `-strict -2 -vf "drawtext=${drawtextName},drawtext=${dramtextAge}"`;
    const addtextVideoCmd = `ffmpeg -nostats -loglevel verbose -y ${start_time} -i ${input} ${addOptions} ${time_length} ${output}`;
    console.log('addtextVideo command = ' + addtextVideoCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(addtextVideoCmd)); 
    } catch (err) {
        console.log(`addtextVideo video error`);
        if (cb) {
            removeFile();
            cb.onAbort(data, `addtextVideo video error`, null, null);
        }
        return Promise.reject('');
    }
}

async function interceptFrame(data,cb){
    const input = `assets/video/soccer/upload.mp4`;
    const output = `assets/video/soccer/${data.task.taskId}.jpg`;
    // const addOptions = `-filter_complex "[0:v][1:v] overlay=0:0" -hide_banner -loglevel panic -y`;
    const interceptFrameCmd = `ffmpeg -i ${input} -y -f image2 -ss 00:00:02 -vframes 1 -hide_banner -loglevel panic -y ${output}`;
    console.log('interceptFrame command = ' + interceptFrameCmd);
    console.log('----------------------');
    try {
        return await promiseFromChildProcess(child.exec(interceptFrameCmd)); 
    } catch (err) {
        console.log(`interceptFrame video error`);
        if (cb) {
            removeFile();
            cb.onAbort(data, `interceptFrame video error`, null, null);
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
            removeFile();
            cb.onAbort(data, `compressFrame video error`, null, null);
        }
        return Promise.reject('');
    }
}

async function FrameCloudUpload(data,FramePath, uploadName) {
    return await new Promise((resolve, reject) => {
        const bucket = 'siiva',
            key = uploadName,
            file_path = FramePath,
            method = 'PUT',
            url_path_params = '/' + key;

        const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
        const client = new AuthClient(req);
        client.SendRequest(callback);

        function callback(res) {
            if (res instanceof Error) {
                reject(util.inspect(res));
            } else {
                 resolve(`${key} upload done`);
            }
        }
    })
}

async function videoCloudUpload(data,videoPath, uploadName) {
    return await new Promise((resolve, reject) => {
        const bucket = 'siiva',
            key = uploadName,
            file_path = videoPath,
            method = 'PUT',
            url_path_params = '/' + key;

        const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
        const client = new AuthClient(req);
        client.SendRequest(callback);

        function callback(res) {
            if (res instanceof Error) {
                reject(util.inspect(res));
            } else {
                const body_status={
                    'taskId':data.task.taskId,
                    'role':'worker',
                    'position':data['worker_id'],
                    'msg':'100%'
               }
               request({
                   url: `${config.apiServer}/task/update_status`,
                   method: "POST",
                   json: true,
                   body: body_status
               }, (error, response, body) => {
                //    console.log(body)
                   const data=body;
                   if(data.code==0){
                    resolve(`${key} upload done`);
                   }
                })
            }
        }
    })
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
        // const bucket = 'siiva',
        //     key = uploadName,
        //     file_path = videoPath,
        //     method = 'PUT',
        //     url_path_params = '/' + key;
        //
        // const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
        // const client = new AuthClient(req);
        // client.SendRequest(callback);
        //
        // function callback(res) {
        //     if (res instanceof Error) {
        //         reject(util.inspect(res));
        //     } else {
        //         const body_status={
        //             'taskId':data.task.taskId,
        //             'role':'worker',
        //             'position':data['worker_id'],
        //             'msg':'100%'
        //         }
        //         request({
        //             url: `${config.apiServer}/task/update_status`,
        //             method: "POST",
        //             json: true,
        //             body: body_status
        //         }, (error, response, body) => {
        //             //    console.log(body)
        //             const data=body;
        //             if(data.code==0){
        //                 resolve(`${key} upload done`);
        //             }
        //         })
        //     }
        // }
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

// async function md5File(videoPath,upload_init){
//     fs.readFile(videoPath,function(err,data){
//         if(err) return;
//         var md5Value=crypto.createHash('md5').update(data,'utf8').digest('hex');
//         console.log(md5Value)
//         upload_init(md5Value)
//     });  
// }
// async function upload_init(data){
//     console.log(data)
//     const size=fs.statSync('assets/video/soccer/upload.mp4').size;
//     console.log(size)
// //     const body_init={
// //         'access_token':'2.00kfeEmDLa62EDf7f7c786eaNqennC',
// //         'length':size,
// //         'check':data,
// //         'name':'upload.mp4',
// //         'client':'other',
// //         'type':'video'

// //    }
// //    console.log(body_init)
//    request({
//        url:'https://multimedia.api.weibo.com/2/multimedia/open_init.json?access_token=2.00kfeEmDLa62EDf7f7c786eaNqennC&length='+size+'&check='+data+'&name=upload.mp4&client=other&type=video',
//        method: "POST",
//        json: true
//    }, (error, response, body) => {
//        console.log(body)
//        if(body.urlTag==1){
//            console.log('进来了')
//            console.log(body.fileToken)
//            console.log(body.length)
//            const shardCount=size/(body.length*1024)
//         //    console.log('shardCount:'+shardCount)
//         //         const body_upload={
//         //             'access_token':'2.00kfeEmDLa62EDf7f7c786eaNqennC',
//         //             'fileToken':body.fileToken,
//         //             'scetioncheck':data,
//         //             'startloc':'0',
//         //             'client':'other'       
//         //        }
//         //        console.log(body_upload)
//            request({
//             url:'https://multimedia.api.weibo.com/2/multimedia/open_upload.json?access_token=2.00kfeEmDLa62EDf7f7c786eaNqennC&fileToken='+body.fileToken+'&scetioncheck='+data+'&startloc=0&client=other',
//             method: "POST",
//             json: true
//         }, (error, response, body) => {
//             console.log(error)
//             console.log(body)
            
//          })

//        }
//     })
// }

 

// async function shareweibo(data){
//     var url='http://siiva.ufile.ucloud.com.cn/soccer_'+data+'.mp4'
//     request({
//                url:'https://api.weibo.com/2/statuses/share.json?access_token=2.00kfeEmDLa62EDf7f7c786eaNqennC&status='+urlencode('我在 https://bt.siiva.com/ '+url+'等你来打球'),
//                method: "POST",
//                json: true,
//                headers:{
//                    'Content-Type':'application/x-www-form-urlencoded'
//                }
//             //    body:body_share
//            }, (error, response, body) => {
//                console.log(body)
//                const data=body
//                if(data.mid!==''){
//                    console.log('分享成功')
//                }
//            });
// }


async function shareweibo(data) {
    return await new Promise((resolve, reject) => {
            var url='http://siiva.ufile.ucloud.com.cn/soccer_'+data+'.mp4'
           request({
               url:'https://api.weibo.com/2/statuses/share.json?access_token=2.00kfeEmDLa62EDf7f7c786eaNqennC&status='+urlencode('https://bt.siiva.com/wechatTXT/test.html 我在'+url+'等你来打球'),
               method: "POST",
               json: true,
               headers:{
                   'Content-Type':'application/x-www-form-urlencoded'
               }
           }, (error, response, body) => {
               console.log(body)
               const data=body
               if(data.mid!==''){
                   console.log('分享成功')
                   resolve('share weibo done');
               }
           });
    })
}