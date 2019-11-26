// lib
import { Component } from '@nestjs/common';
import * as child from "child_process";
const util = require('util');
const fs = require('fs');
const os = require('os');
const platform = os.platform();
const path = require('path');
const bluebird = require('bluebird');
const HttpRequest = require('./ufile/http_request');
const AuthClient = require('./ufile/auth_client');
const helper = require('./ufile/helper');
const request = require('request');
const config = require(`../../config/develop.json`);

// parameter
const taskId = ``;
const scale = '1.2';
const diffTime = [[10], [6.5, 6.5], [5.5, 4.5, 4.5]];
const duration = [[10], [5, 5], [4, 3, 3]];

@Component()
export class SoccerService {
    filemgrPath = `../../../server/${platform === 'linux' ? 'filemgr-linux64' : platform === 'darwin' ? 'filemgr-mac' : 'filemgr-win64.exe'}`;
    fileList = [];
    async cut_video() {
        try {
            if (!fs.existsSync('./assets')) await promiseFromChildProcess(child.exec('mkdir ./assets'));
            const fileCmd = `${this.filemgrPath} --action getfilelist --bucket eee --prefix soccer_${taskId} | grep soccer | cut -c 16-`;
            const fileNameRes = await promiseFromChildProcess(child.exec(fileCmd));
            this.fileList = String(fileNameRes).split('\n');
            this.fileList.pop()
            console.log(this.fileList);
            this.fileList = this.fileList.map((fileName) => { return { index: fileName.split('_')[3], name: fileName } });
            const downloadRes = await this.ufileDownload();
            console.log('----------------------');
            await bluebird.map(downloadRes, async (filePath, i) => {
                if (this.fileList[i].index !== '0') {
                    this.fileList[i]['src'] = await this.scaleVideo(filePath);
                } else {
                    this.fileList[i]['src'] = downloadRes[i];
                }
            });
            await this.concatVideo();
            await this.addMusic();
            await this.overlayVideo();
            await this.videoCloudUpload(`./assets/soccer_${taskId}.mp4`, `soccer_${taskId}.mp4`);
            await this.updateTask();
            // await removeFile();
        } catch (err) {
            console.log(err);
        }
    }

    async ufileDownload() {
        return new bluebird.map(this.fileList, (fileObj) => {
            return new bluebird(async (resolve) => {
                const bucket = 'eee',
                    key = `${fileObj.name}`,
                    file_path = `./assets/${taskId}_${fileObj.index}.mp4`,
                    method = 'GET',
                    url_path_params = '/' + key;
                const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
                const client = new AuthClient(req);
                const result = await client.SendRequest(callback);
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
                    } else {
                        console.log(res);

                    }
                }
            })
        })
    }

    async scaleVideo(filePath) {
        const pathObj = path.parse(filePath);
        const input = `${filePath}`;
        const output = `${pathObj.dir}/${pathObj.name}_scale.mp4`;
        const addOptions = `-vf scale=iw*${scale}:ih*${scale},crop=iw/${scale}:ih/${scale} -y -hide_banner -loglevel panic`;
        const scaleCmd = `ffmpeg -i ${input} ${addOptions} ${output}`;
        console.log('scale command = ' + scaleCmd);
        console.log('----------------------');
        try {
            await promiseFromChildProcess(child.exec(scaleCmd));
            return bluebird.resolve(output);
        } catch (err) {
            return Promise.reject('scale video error');
        }
    }

    async concatVideo() {
        let file1 = '', file2 = '', file3 = '', filter = '';
        switch (this.fileList.length) {
            case 1:
                file1 = `-ss ${await getVideoTime(this.fileList[0].src, diffTime[0])} -t ${duration[0]} -i ${this.fileList[0].src}`;
                break;
            case 2:
                file1 = `-ss ${await getVideoTime(this.fileList[0].src, diffTime[1][0])} -t ${duration[1][0]} -i ${this.fileList[0].src}`;
                file2 = `-ss ${await getVideoTime(this.fileList[1].src, diffTime[1][0])} -t ${duration[1][1]} -i ${this.fileList[1].src}`;
                filter = `-filter_complex "[0:v:0][1:v:0]concat=n=2:v=1[outv]" -map "[outv]"`;
                break;
            case 3:
                file1 = `-ss ${await getVideoTime(this.fileList[0].src, diffTime[2][0])} -t ${duration[2][0]} -i ${this.fileList[0].src}`;
                file2 = `-ss ${await getVideoTime(this.fileList[1].src, diffTime[2][1])} -t ${duration[2][1]} -i ${this.fileList[1].src}`;
                file3 = `-ss ${await getVideoTime(this.fileList[2].src, diffTime[2][2])} -t ${duration[2][2]} -i ${this.fileList[2].src}`;
                filter = `-filter_complex "[0:v:0][1:v:0][2:v:0]concat=n=3:v=1[outv]" -map "[outv]"`;
                break;
            default:
                break;
        }
        const addOptions = `${filter} -y -r 30 -hide_banner -loglevel panic`;
        const output = `./assets/concat.mp4`;
        const concatCmd = `ffmpeg ${file1} ${file2} ${file3} ${addOptions} ${output}`;
        console.log('concat command = ' + concatCmd);
        console.log('----------------------');
        try {
            return await promiseFromChildProcess(child.exec(concatCmd));
        } catch (err) {
            return Promise.reject('concat video error');
        }
    }

    async addMusic() {
        const music = `../../assets/overlay/soccer/nike${Math.floor(Math.random() * 4 + 1)}.mp3`
        const input = `assets/concat.mp4`;
        const output = `assets/music.mp4`;
        const addOptions = `-c copy -y -hide_banner -loglevel panic`;
        const musicCmd = `ffmpeg -i ${music} -i ${input} ${addOptions} ${output}`;
        console.log('add music command = ' + musicCmd);
        console.log('----------------------');
        try {
            return await promiseFromChildProcess(child.exec(musicCmd));
        } catch (err) {
            return Promise.reject('add music video error');
        }
    }

    async overlayVideo() {
        const input = `assets/music.mp4`;
        const output = `assets/soccer_${taskId}.mp4`;
        // 5 templates, from template1.png to template5.png 
        const overlay = `../../assets/overlay/soccer/template${Math.floor(Math.random() * 5 + 1)}.png`;
        const addOptions = `-filter_complex "[0:v][1:v] overlay=0:0" -hide_banner -loglevel panic -y`;
        const overlayCmd = `ffmpeg -i ${input} -i ${overlay} ${addOptions} ${output}`;
        console.log('overlay command = ' + overlayCmd);
        console.log('----------------------');
        try {
            return await promiseFromChildProcess(child.exec(overlayCmd));
        } catch (err) {
            return Promise.reject('overlay video error');
        }

    }

    async videoCloudUpload(videoPath, uploadName) {
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
                    console.log(`${key} upload done`);
                    console.log('----------------------');
                    resolve();
                }
            }
        })
    }

    async updateTask() {
        const url = `${config.apiServer}/task/task_update`;
        console.log(url);
        request({
            url: url,
            method: "POST",
            json: true,
            body: {
                taskId: taskId,
                state: 'complete',
                type: 'soccer',
            },
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                console.log(`update ${taskId} success`);
                return bluebird.resolve();
            } else {
                return bluebird.reject(error);
            }
        })
    }
}

const soccer = new SoccerService()
soccer.cut_video();

async function removeFile() {
    return await promiseFromChildProcess(child.exec('rm ./assets/*.mp4'));
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
    const fileDuration = await promiseFromChildProcess(child.exec(`ffmpeg -i ${filePath} 2>&1 | grep "Duration"| cut -d ' ' -f 4 | sed s/,//`));
    return Promise.resolve(parseFloat(String(fileDuration).substring(6)) - time);
}
