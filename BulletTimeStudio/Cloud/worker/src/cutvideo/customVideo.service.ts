import { Component } from '@nestjs/common';
import { IWorkerCallback, IEngine } from '../common/worker.interface';
import { CUSTOMVIDEO_WORKER_EVENT } from '../common/worker.interface';
import { WorkerUtil } from '../common/worker.util';
import { HttpClientCallback, HttpClientBuckets } from "../oss/siiva-oss/httpclient.interface";
import httpclient from "../oss/siiva-oss/httpclient";
import * as child from "child_process";
import * as io from 'socket.io-client';

const path = require('path');
const fs = require('fs');
const copyFileSync = require('fs-copy-file-sync');
const util = require('util');

const config = require(`../../config/${process.env.NODE_ENV || 'production'}.json`);
const assetsPath = path.resolve("assets");
const socket = io.connect(config.apiServer, { reconnect: true });
const iptables = [
    {
        private_ip: '172.16.158.183',
        public_ip: '47.99.177.192'
    }
];

@Component()
export class CustomVideo implements IEngine {
    async cut_video(data, cb: IWorkerCallback) {
        const task = data.task;
        console.log('--------- CustomVideo cut_video -------------');
        console.log('task=' + JSON.stringify(task));

        // 1. Create TTS
        if (!fs.existsSync(`${assetsPath}/tts/${task.taskId}`)) {
            fs.mkdirSync(`${assetsPath}/tts/${task.taskId}`);
        }
        await createTTS(task.taskId, task.description);
        socket.emit(CUSTOMVIDEO_WORKER_EVENT.EVENT_VIDEO_PROCESS, '25%');

        // 2. Overlay background with TTS file to bgWithTTS.mp4
        if (!fs.existsSync(`${assetsPath}/video/customVideo/${task.taskId}`)) {
            fs.mkdirSync(`${assetsPath}/video/customVideo/${task.taskId}`);
        }
        await overlayBGWithTTS(task.taskId, task.video);
        socket.emit(CUSTOMVIDEO_WORKER_EVENT.EVENT_VIDEO_PROCESS, '50%');

        // 3. Combine bgWithTTS.mp4 with .srt to videoWithSrt.mp4
        await overlaySrt(task.taskId, task.parameter);
        socket.emit(CUSTOMVIDEO_WORKER_EVENT.EVENT_VIDEO_PROCESS, '75%');

        // Rename videoWithSrt.mp4 to overlayParameter.mp4
        renameOutputFile(
            `${assetsPath}/video/customVideo/${task.taskId}/videoWithSrt.mp4`,
            `${assetsPath}/video/customVideo/${task.taskId}/overlayParameter.mp4`);

        // 4. Overlay parameter to ${taskId}/output.mp4
        // Input: overlayParameter.mp4, output: overlayParameter_output.mp4
        // After overlay parameter, rename overlayParameter_output.mp4 to verlayParameter.mp4
        for(let i = 0; i < task.parameter.length; i++) {
            await overlayVideoWithParameter(task.taskId, task.parameter[i]);
            renameOutputFile(
                `${assetsPath}/video/customVideo/${task.taskId}/overlayParameter_output.mp4`,
                `${assetsPath}/video/customVideo/${task.taskId}/overlayParameter.mp4`)
        }

        if (cb) {
            // Rename to ${taskId}.mp4
            renameOutputFile(
                `${assetsPath}/video/customVideo/${task.taskId}/overlayParameter.mp4`,
                `${assetsPath}/video/customVideo/${task.taskId}/${task.taskId}.mp4`) ;

            cb.onStop(data, `finish ${task.type} ${task.taskId}`, null, null);

            await ossUpload(
                `${assetsPath}/video/customVideo/${task.taskId}/${task.taskId}.mp4`, 
                `VIP_${task.taskId}.mp4`);

            // Emit final video link to cloud/server
            // let workerUtil = new WorkerUtil();
            let getIP = convertAliPrivateIPToPublicIP(WorkerUtil.getIp());
            let getPort = WorkerUtil.getPort();
            socket.emit(
                CUSTOMVIDEO_WORKER_EVENT.EVENT_VIDEO_AVAILABLE, 
                `http://${getIP}:${getPort}/assets/video/customVideo/${task.taskId}/${task.taskId}.mp4`);

            socket.emit(CUSTOMVIDEO_WORKER_EVENT.EVENT_VIDEO_PROCESS, '100%');
        }
    }
}

async function createTTS(taskId, description){
    let ttsPath = assetsPath + '/tts/tts_main';
    let outputPath = assetsPath + `/tts/${taskId}/${taskId}.mp3`;

    const cmd = `${ttsPath} -text "${description}" -output ${outputPath}`;
    // console.log('cmd=' + cmd);
    try {
        return await promiseFromChildProcess(child.exec(cmd));
    } catch (err) {
        console.log('err=' + JSON.stringify(err));
        return Promise.reject('');
    }
}

async function overlayBGWithTTS(taskId, bgVideo){
    let ttsFilePath = `${assetsPath}/tts/${taskId}/${taskId}.mp3`;
    let outputPath = `${assetsPath}/video/customVideo/${taskId}/bgWithTTS.mp4`

    // ToDo: avoid to while loop
    while (!fs.existsSync(ttsFilePath)) {
        await(sleep(5000));
    }

    await fs.chmod(ttsFilePath, 777, () => {});
    // console.log('chmod ' + outputPath);

    // ToDo: download bgVideo

    // Combine bg and tts 
    const cmd = `ffmpeg -i ${assetsPath}/video/customVideo/${bgVideo} -i ${ttsFilePath} -shortest -strict -2 ${outputPath}`;
    // console.log('overlayBGWithTTS cmd=' + cmd);
    try {
        return await promiseFromChildProcess(child.exec(cmd));
    } catch (err) {
        console.log('err=' + JSON.stringify(err));
        return Promise.reject('');
    }
}

async function overlaySrt(taskId, parameter){
    let srcSrtPath = `${assetsPath}/video/customVideo/template.srt`;
    let dstSrcPath = `${assetsPath}/video/customVideo/${taskId}/${taskId}.srt`;

    // Replace .srt keyword from parameter[i].keyword
    if (fs.existsSync(srcSrtPath)) {
        copyFileSync(srcSrtPath, dstSrcPath);
        let err, data = fs.readFileSync(dstSrcPath, 'utf8');
        for(let i = 0; i < parameter.length; i++) {
            switch(parameter[i].type){
                case 'name':
                    data = data.replace('[name]', parameter[i].keyword);
                    break;
                case 'year':
                    data = data.replace('[year]', parameter[i].keyword);
                    break;
                case 'property':
                    data = data.replace('[property]', parameter[i].keyword);
                    break;
                case 'deparment':
                    data = data.replace('[deparment]', parameter[i].keyword);
                    break;
                case 'current':
                    data = data.replace('[current]', parameter[i].keyword);
                    break;
                case 'target':
                    data = data.replace('[target]', parameter[i].keyword);
                    break;
                case 'gift':
                    data = data.replace('[gift]', parameter[i].keyword);
                    break;
            }
        }
        fs.writeFileSync(dstSrcPath, data, 'utf8');

        // Overlay video with .srt
        let filePath = `${assetsPath}/video/customVideo/${taskId}/bgWithTTS.mp4`
        let outputPath = `${assetsPath}/video/customVideo/${taskId}/videoWithSrt.mp4`
        const cmd = `ffmpeg -i ${filePath} -vf "subtitles=${dstSrcPath}:force_style='Fontsize=24,PrimaryColour=&H0000ff&'" -strict -2 ${outputPath}`;
        // console.log('overlaySrt cmd=' + cmd);
        try {
            return await promiseFromChildProcess(child.exec(cmd));
        } catch (err) {
            console.log('err=' + JSON.stringify(err));
            return Promise.reject('');
        }
    }
}

async function overlayVideoWithParameter(taskId, parameter){
    let materialPath = `${assetsPath}/video/customVideo/${parameter.material}`
    let filePath = `${assetsPath}/video/customVideo/${taskId}/overlayParameter.mp4`
    let outputPath = `${assetsPath}/video/customVideo/${taskId}/overlayParameter_output.mp4`
    let cmd = '';

    // console.log('parameter=' + JSON.stringify(parameter));
    switch(parameter.type){
        case 'name':
            break;
        case 'year':
            break;
        case 'property':
            cmd = `ffmpeg -i ${filePath} -i ${materialPath} -filter_complex "[1:v]scale=310:200[img1];[0:v][img1] overlay=950:400:enable='between(t,${parameter.start_time},${parameter.end_time})" -pix_fmt yuv420p -c:a copy ${outputPath}`;
            break;
        case 'department':
            break;
        case 'current':
            // cmd = `ffmpeg -i ${filePath} -i ${materialPath} -profile:v high -level:v 4.0 -filter_complex overlay=0:0 -map [out] -c:a copy ${outputPath}`;
            break;
        case 'target':
            break;   
        case 'gift':
            break;    
    }
    
    // console.log('overlayBGWithTTS cmd=' + cmd);
    try {
        if(cmd) {
            return await promiseFromChildProcess(child.exec(cmd));
        }
    } catch (err) {
        console.log('err=' + JSON.stringify(err));
        return Promise.reject('');
    }
}

async function renameOutputFile(src, dst) {
    console.log('renameOutputFile src=' + src + ', dst=' + dst);
    if (fs.existsSync(src)) {
        fs.renameSync(src, dst);
    }
}

function sleep(ms){
    return new Promise(resolve => {
        setTimeout(resolve, ms)
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

async function ossUpload(localFileName, originFileName) {
    return await new Promise((resolve, reject) => {
        let callback = {
            onSuccess: result => {
                resolve(`${originFileName} upload done`);
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
            callback,
            5,
            HttpClientBuckets.PRIVATE_BUCKET
        )
    })
}

function convertAliPrivateIPToPublicIP(ip){
    for(let i = 0; i < iptables.length; i++){
        if(iptables[i].private_ip === ip){
            return iptables[i].public_ip
        }
    }
    return ip;
}