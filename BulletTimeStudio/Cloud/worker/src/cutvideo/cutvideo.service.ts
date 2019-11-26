import { Component } from '@nestjs/common';
import * as child from "child_process";
import { IWorkerCallback, IEngine } from '../common/worker.interface';
import httpclient from "../oss/siiva-oss/httpclient";
import {HttpClientCallback} from "../oss/siiva-oss/httpclient.interface";
const HttpRequest = require('ufile').HttpRequest;
const AuthClient = require('ufile').AuthClient;
const helper = require('ufile').helper;
const util = require('util');
const bluebird = require('bluebird');
const ffmpeg = require('fluent-ffmpeg');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

@Component()
export class CutvideoService implements IEngine {
    async cut_video(data: any, cb: IWorkerCallback, logger) {
        console.log(data)
        logger.info('get task')
        try {
            const basicInfo = {
                taskId: data.task.taskId,
                type: data.task.type
            }
            logger.warn('get task')
            logger.debug('get task')
            logger.info(`get task`, basicInfo)
            console.log('----------------------');
            console.log('进时光子弹worker了')
            mkdirp(data.task);

            // await downloadXlsx(data, cb, logger, basicInfo);
            
            // let time = new Date().getTime();
            const downloadResult = await downloadFrame(data, cb, logger, basicInfo);
            // logger.info(`[Time] downloadFrame: ${(new Date().getTime() - time) / 1000}`, basicInfo);
            // console.log("[Time] downloadFrame: " + (new Date().getTime() - time) / 1000);
            
            // time = new Date().getTime();
            // const adjustResult = await adjustFrame(data, cb, downloadResult.checkMsg, logger, basicInfo);
            // logger.info(`[Time] adjustFrame: ${(new Date().getTime() - time) / 1000} ; [Step] 1/5`, basicInfo);
            // console.log("[Time] adjustFrame: " + (new Date().getTime() - time) / 1000);
            
            // time = new Date().getTime();
            // await resizeFrame(data, cb, adjustResult, logger, basicInfo);
            // logger.info(`[Time] resizeFrame: ${(new Date().getTime() - time) / 1000} ; [Step] 2/5`, basicInfo);
            // // console.log("[Time] resizeFrame: " + (new Date().getTime() - time) / 1000);

            // time = new Date().getTime();
            await frameToVideo(data, cb, logger, basicInfo);
            // logger.info(`[Time] frameToVideo: ${(new Date().getTime() - time) / 1000} ; [Step] 3/5`, basicInfo);
            // // console.log("[Time] frameToVideo: " + (new Date().getTime() - time) / 1000);

            // console.log('----------------------');

            // time = new Date().getTime();
            // background parameter : mask, template
            const hasBackground = data.task.param.hasOwnProperty('template');
            // foreground parameter : template_foreground
            const hasForeground = data.task.param.hasOwnProperty('template_foreground');

            if (hasBackground) {
                await greenScreenVideo(data, cb, logger, basicInfo);
                // logger.info(`[Time] greenScreenVideo: ${(new Date().getTime() - time) / 1000} ; [Step] 4/5`, basicInfo);
                console.log('----------------------');
                // time = new Date().getTime();
            }
            if (hasForeground) {
                hasBackground ? '' : console.log('----------------------');
                await overlayVideo(data, cb, hasBackground, logger, basicInfo);
                // logger.info(`[Time] overlayVideo: ${(new Date().getTime() - time) / 1000} ; [Step] 5/5`, basicInfo);
                console.log('----------------------');
                // time = new Date().getTime();
            }
            
            // time = new Date().getTime();
            await uploadVideo(data, cb, hasForeground, logger, basicInfo)
            // logger.info(`[Time] uploadVideo: ${(new Date().getTime() - time) / 1000}`, basicInfo);
            console.log('----------------------');

            if (cb) {
                removeFile(data, cb, logger, basicInfo);
                const finishMsg = `finish task ${data.task.taskId} ${downloadResult.msg.length > 0 ? `; lack frame ${downloadResult.msg}` : ''}`;
                cb.onStop(data, finishMsg, logger, basicInfo);
                // cb.onStop(data, '', null, null);
            }

        } catch (error) {}
    }
}


async function downloadXlsx(data, cb, logger, basicInfo) {

    return await new Promise((resolve, reject) => {
        let localFileName = `assets/video/bt/${data.task.taskId}/adjust.xlsx`; ;
        let originFileName = `${data.task.source.csv}/adjust.xlsx`;
        let callback = {
            onSuccess: result => {
                console.log(`csv下载成功`);
                resolve(`${originFileName} upload done`);
            },
            onError: err => {
                console.log(`csv下载失败`);
                if (cb) cb.onAbort(data, `download csv error`, null, null);
                return Promise.reject('');
            }
        } as HttpClientCallback;
    
        console.log(`开始下载： ${originFileName}`);
      httpclient.get(originFileName, localFileName, callback);
    })
}

async function downloadFrame(data, cb, logger, basicInfo) {
    let isFrameOk = true;
    let msg = '';
    let checkRes, checkMsg;
    let ufileDownloadRes = await bluebird.map(Array.from(Array(parseInt(data.task.cameraNum)).keys()), async (index) => {
        return await downloadFromUfile(data.task, data.task.source.frame, index);
    })

    if (ufileDownloadRes.every(res => !res)) {
        logger.error(`lack frame all`, basicInfo);
        if (cb) {
            removeFile(data, cb, logger, basicInfo);
            cb.onAbort(data, `lack frame all`);
        }
        return Promise.reject('');
    }

    const checkFrameLackRes = await checkFrameLack(data.task.taskId, ufileDownloadRes);
    checkRes = checkFrameLackRes[0];
    checkMsg = checkFrameLackRes[1];

    ufileDownloadRes.forEach((isFrameExist, index) => {
        isFrameOk = isFrameOk && checkRes[index];
        if (!isFrameExist) {
            msg += checkRes[index] ? `${index + 1}(fix),` : `${index + 1}, `
        }
    })
    msg = msg.length > 0 ? msg.substring(0, msg.length - 1) : '';

    if (msg.length > 0) logger.warn(`lack frame ${msg}`, basicInfo);

    if (isFrameOk) {
        return Promise.resolve({ msg: msg, checkMsg: checkMsg })
    } else {
        logger.error(`lack frame ${msg}`, basicInfo);
        if (cb) {
            removeFile(data, cb, logger, basicInfo);
            cb.onAbort(data, `lack frame ${msg}`);
        }
        return Promise.reject('');
    }
}

function downloadFromUfile(task, framePath, index) {
    return new Promise(async (resolve, reject) => {
        let localFileName=`assets/video/bt/${task.taskId}/frame/${util.format('%d', index + 1)}.jpg`;
        let originFileName=`${framePath}/${util.format('%d', index + 1)}.jpg`;
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
                // return downloadFromUfile(task, framePath, index);
                resolve(false);
            }
        } as HttpClientCallback;

        console.log(`开始下载： ${originFileName}`);
        httpclient.get(originFileName, localFileName, callback);
    })
}




async function checkFrameLack(taskId, ufileDownloadRes) {
    let msg = '';
    const frameNum = ufileDownloadRes.length - 1;
    const newRes = [];
    let adjustTable = new Array<number>(frameNum + 1);
    let refFrame = -1;
    const framePath = `./assets/video/bt/${taskId}/frame`;

    console.log(ufileDownloadRes.length)
    for (let i = 0; i <= frameNum; i++) {
        if (ufileDownloadRes[i]) {
            adjustTable[i] = i + 1 // 1-based
            refFrame = i + 1
            newRes[i] = true
        }
        else if (i != 0 && refFrame != -1) {
            // copy from left
            let cmd = `cp ${framePath}/${refFrame}.jpg ${framePath}/${i + 1}.jpg`
            console.log(cmd)
            await promiseFromChildProcess(child.exec(cmd))
            adjustTable[i] = refFrame; // 1-based
            // msg += `${refFrame}->${i} `
            newRes[i] = true
        }
    }
    for (let i = frameNum; i >= 0; i--) {
        if (newRes[i]) {
            refFrame = adjustTable[i]
        }
        else if (!ufileDownloadRes[i] && refFrame != -1) {
            // copy from right
            let cmd = `cp ${framePath}/${refFrame}.jpg ${framePath}/${i + 1}.jpg`
            console.log(cmd)
            await promiseFromChildProcess(child.exec(cmd))
            // ufileDownloadRes[i] = true
            adjustTable[i] = refFrame;
            // msg += `${i + 1}->${i} `
        }
        newRes[i] = true
    }
    msg = ""
    for (let i = 0; i < adjustTable.length; i++) {
        msg = msg + ((i == 0) ? '' : ',') + adjustTable[i]
    }
    console.log(">>> " + msg + " " + adjustTable.length)
    return Promise.resolve([newRes, msg]);
}

async function adjustFrame(data, cb, msg, logger, basicInfo) {
    console.log('进adjustFrame')
    const pyPath = `src/Algo/5point_correction.py`;
    const xlsxPath = `assets/video/bt/${data.task.taskId}/adjust.xlsx`;
    const sourcePath = `assets/video/bt/${data.task.taskId}/frame`;
    const outputPath = `assets/video/bt/${data.task.taskId}/align`;
    const pointCmd = `python ${pyPath} -i ${xlsxPath} -s ${sourcePath} -d ${outputPath} -r ${msg}`
    console.log('----------------------');
    logger.info(`adjustFrame command = ${pointCmd}`);
    try {
        return await promiseFromChildProcess(child.exec(pointCmd));
    } catch (err) {
        logger.error(`adjust frame error ; [Step] 1/5`, basicInfo);
        if (cb) {
            // removeFile(data, cb, logger, basicInfo);
            cb.onAbort(data, `adjust frame error`);
        }
        return Promise.reject('');
    }
}

function resizeFrame(data, cb, alignFrame, logger, basicInfo) {
    const framePath = alignFrame.split('\n');
    framePath.pop();
    console.log('----------------------');
    console.log(framePath);
    try {
        return bluebird.map(framePath, async (path) => {
            const result = await sharpResize(path, data.task.output.format.width, data.task.output.format.height);
            return result;
        })
    } catch (err) {
        logger.error(`resize frame error ; [Step] 2/5`, basicInfo);
        if (cb) {
            removeFile(data, cb, logger, basicInfo);
            cb.onAbort(data, `resize frame error`);
        }
        return Promise.reject('');
    }
}

function sharpResize(src, dest_w, dest_h) {
    return new Promise((resolve, reject) => {
        const srcObj = path.parse(src);
        const image = sharp(src);
        image
            .metadata()
            .then((metadata) => {
                let width = 0, height = 0;
                let crop_x = 0, crop_y = 0;
                if (metadata.height >= dest_h) {
                    width = metadata.width * dest_h / metadata.height;
                }
                else {
                    width = metadata.width * dest_h / metadata.height;
                }
                height = dest_h;
                crop_x = (width - dest_w) / 2;
                crop_y = 0;
                let ratio = 1.3;  // previous ratio = 1.1
                let offset_x = (width * ratio - width) / 2;
                let offset_y = (height * ratio - height) / 2;

                return image
                    .resize(width * ratio, height * ratio)
                    .extract({ left: crop_x + offset_x, top: crop_y + offset_y, width: dest_w, height: dest_h })
                    .toFile(`${srcObj.dir}/${srcObj.name}_sharp.jpg`)
                    .then((data) => resolve(data))
                    .catch((err) => reject(err));
            })

    })
}

function frameToVideo(data, cb, logger, basicInfo) {

    const fps = data.task.param.framerate !== undefined ? data.task.param.framerate : '6';
    const loop = data.task.param.loop !== undefined ? data.task.param.loop : '1';
    const loopNum = parseInt(loop) > 0 ? parseInt(data.task.cameraNum) * 2 : 0;

    return new Promise((resolve, reject) => {
        new ffmpeg()
            .input(`assets/video/bt/${data.task.taskId}/frame/%d.jpg`)
            .inputOptions(`-framerate ${fps}`)
            .addOptions(`-filter_complex loop=${loop}:${loopNum}`)
            .outputOptions('-r 30')
            .on('start', (cmd) => {
                console.log('----------------------');
                logger.info(`frameToVideo command = ${cmd}`);
            })
            .on('error', (err) => {
                logger.error(err, basicInfo);
                if (cb) {
                    removeFile(data, cb, logger, basicInfo);
                    cb.onAbort(data, 'frame to video error');
                }
                reject();
            })
            .on('end', (end) => {
                resolve();
            })
            .save(`assets/video/bt/${data.task.taskId}/video/frameToVideo.mp4`)
    })
}

async function greenScreenVideo(data, cb, logger, basicInfo) {
    const base = `assets/overlay/${data.task.param.template}`;
    const overlay = `assets/video/bt/${data.task.taskId}/video/frameToVideo.mp4`;
    const output = `assets/video/bt/${data.task.taskId}/video/greenScreen.mp4`;
    // ref: https://ffmpeg.org/ffmpeg-filters.html#chromakey
    const color = data.task.param.color !== undefined ? data.task.param.color : 'green'
    const similarity = data.task.param.similarity !== undefined ? data.task.param.similarity : '0.17';
    const blend = data.task.param.blend !== undefined ? data.task.param.blend : '0.1'; //0.1 
    const chromakey = `-filter_complex "[1:v]chromakey=${color}:${similarity}:${blend}[ckout];[0:v][ckout]overlay[out]" -map "[out]" -map 0:a`;

    const addOptions = `-hide_banner -loglevel panic -y -profile:v high -level:v 4.0 -c:a copy -r 30`
    const greenCmd = `ffmpeg -i ${base} -i ${overlay} ${chromakey} ${addOptions} ${output}`;
    
    logger.info(`greenScreen command = ${greenCmd}`);
    
    try {
        return await promiseFromChildProcess(child.exec(greenCmd));
    } catch (err) {
        logger.error(`greenScreen video error`, basicInfo);
        if (cb) {
            removeFile(data, cb, logger, basicInfo);
            cb.onAbort(data, `greenScreen video error`);
        }
        return Promise.reject('');
    }
}

function overlayVideo(data, cb, hasBackground: boolean, logger, basicInfo) {
    const inputFile = hasBackground ? 'greenScreen.mp4' : 'frameToVideo.mp4';
    return new Promise((resolve, reject) => {
        new ffmpeg()
            .input(`assets/video/bt/${data.task.taskId}/video/${inputFile}`)
            .addOptions([
                // input framerate
                `-i assets/overlay/${data.task.param.template_foreground}`,
                '-profile:v high',
                '-level:v 4.0',
                '-filter_complex overlay=0:0',
                '-c:a copy',
                '-r 30',
            ])
            .on('start', (cmd) => {
                logger.info(`overlayVideo command = ${cmd}`);
            })
            .on('error', (err) => {
                logger.error(err, basicInfo);
                if (cb) {
                    removeFile(data, cb, logger, basicInfo);
                    cb.onAbort(data, 'overlay video error');
                }
                reject();
            })
            .on('end', (end) => {
                resolve();
            })
            .save(`assets/video/bt/${data.task.taskId}/video/overlayVideo.mp4`)
    })
}

function scaleVideo(data, cb, logger, basicInfo) {
    return new Promise((resolve, reject) => {
        const task = data.task;
        new ffmpeg()
            .input('assets/video/align/base.mp4')
            .addOptions([
                '-vf scale=360:640'
            ])
            .on('start', (cmd) => {
                console.log('----------------------');
                console.log('scaleVideo ffmpeg command = ' + cmd);

            })
            .on('error', (err) => {
                if (cb) {
                    removeFile(data, cb, logger, basicInfo);
                    cb.onAbort(data, 'scale video error');
                }
                reject();
            })
            .on('end', (end) => {
                resolve();
            })
            .save('assets/video/align/final.mp4')

    })
}

async function uploadVideo(data, cb, hasForeground: boolean, logger, basicInfo) {
    // let localFileName = `assets/video/bt/${data.task.taskId}/video/${hasForeground ? 'overlayVideo.mp4' : 'greenScreen.mp4'}`;
    let localFileName = `assets/video/bt/${data.task.taskId}/video/frameToVideo.mp4`;
    let originFileName = `${data.task.output.name}`;
    return await new Promise((resolve, reject) => {
        let callback = {
            onSuccess: result => {
                resolve(`${originFileName} upload done`);
                console.log(`${originFileName} is upload done`);    
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



async function removeFile(data, cb, logger, basicInfo) {
    try {
        await promiseFromChildProcess(child.exec(`rm -r assets/video/bt/${data.task.taskId}`));
        return Promise.resolve()
    } catch (err) {
        logger.error('remove file error', basicInfo)
        if (cb) cb.onAbort(data, 'remove file error');
        return Promise.reject(err);
    }
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
    const folderName = String(`bt/${task.taskId}`).split('/');
    folderName.forEach(folder => {
        rootPath = path.join(rootPath, '/', folder);
        if (!fs.existsSync(rootPath)) {
            fs.mkdirSync(rootPath);
        }
    });
    if (!fs.existsSync(`${rootPath}/video`)) {
        fs.mkdirSync(`${rootPath}/video`);
    }
    if (!fs.existsSync(`${rootPath}/frame`)) {
        fs.mkdirSync(`${rootPath}/frame`);
    }
    if (!fs.existsSync(`${rootPath}/align`)) {
        fs.mkdirSync(`${rootPath}/align`);
    }
    return rootPath;
} 