import { Client } from './client';

const constant = require('./constant');
const path = require('path');
const fs = require('fs');
const http = require('http');
const Bluebird = require('bluebird');

export class YiManager {
    cameraCollection: any;
    config: any;
    autoConnect: boolean;
    port: number;

    constructor() {
        this.cameraCollection = [];
        this.config = constant.config;
        this.autoConnect = true;
        this.port = 7878;
    }

    connectAll(cameraData) {
        return Bluebird.map(cameraData, async (camera) => {
            if (this.cameraCollection.find((collection) => collection.ip === camera.ip) === undefined) {
                this.cameraCollection.push({ index: camera.index, ip: camera.ip, name: camera.name, mac: camera.mac, client: new Client() });
                const res = await this.connect(this.cameraCollection[this.cameraCollection.length - 1]);
                return typeof res === 'number' ? true : false;
            }
        });
    }

    takePhotoAll(savePath) {
        return Bluebird.map(this.cameraCollection, (camera) => {
            camera.client.photo = false;
            const isalive = camera.client.isConnected();
            return isalive ? new Bluebird((resolve, reject) => {
                this.takePhoto(camera)
                    .then((filePath) => {
                        return this.downloadFile(camera, filePath, { folder: savePath, type: '.jpg' });
                    })
                    .then((filePath) => {
                        camera.client.photo = true;
                        resolve({ ip: camera.ip, index: camera.index, path: filePath });
                    })
                    .catch(err => {
                        console.log('take photo error');
                        reject(err);
                    });
            }) : false;
        });
    }

    checkConnectionAll() {
        // console.log(`----check----${ new Date().toLocaleTimeString()}`);
        return Bluebird.map(this.cameraCollection, async (camera) => {
            return new Bluebird(async (resolve) => {
                const isalive = camera.client.isConnected();
                if (isalive) {
                    let res = '';
                    setTimeout(async () => {
                        if (typeof res !== 'number') {
                            this.retryConnection(camera, resolve, 5);
                        } else {
                            camera.client.battery = res;
                            resolve(res);
                        }
                    }, 2000);
                    res = await this.getBattery(camera);
                } else {
                    resolve(false);
                }
            });
        });
    }

    getBatteryAll() {
        return Bluebird.map(this.cameraCollection, (camera) => {
            const isalive = camera.client.isConnected();
            return isalive ? this.getBattery(camera) : false;
        });
    }

    getConfigAll() {
        return Bluebird.map(this.cameraCollection, (camera) => {
            camera.client.setting = '';
            const isalive = camera.client.isConnected();
            return isalive ? this.getConfig(camera) : false;
        });
    }

    setConfigAll(type, param) {
        console.log(type,param); 
        return Bluebird.map(this.cameraCollection, (camera) => {
            console.log(type,param);
            const isalive = camera.client.isConnected();
            return isalive ? this.setConfig(camera, type, param) : false;
        });
        // param ref: https://docs.google.com/spreadsheets/d/1BAl5X9TJtsxr4d02u353ePkFiw7TySkIX2VjUo2EMHc/edit#gid=0
    }

    getStatus() {
        // console.log(`----status----${ new Date().toLocaleTimeString()}`);
        return Bluebird.map(this.cameraCollection, async (camera) => {
            const isalive = camera.client.isConnected();
            return Bluebird.resolve({
                ip: camera.ip,
                index: camera.index,
                name: camera.name,
                mac: camera.mac,
                battery: isalive ? camera.client.battery : 0,
                photo: isalive ? camera.client.photo : false,
                isalive: camera.client.isConnected(),
            });
        });
    }

    private async retryConnection(camera, resolve, retryCount: number) {
        console.log(`---${camera.ip}---${retryCount}---${new Date().toLocaleTimeString()}`);
        let res = '';
        setTimeout(async () => {
            if (typeof res !== 'number') {
                if (retryCount === 0) {
                    camera.client.changeConnected();
                    resolve(false);
                } else {
                    this.retryConnection(camera, resolve, retryCount - 1);
                }
            } else {
                camera.client.battery = res;
                resolve(res);
            }
        }, 2000);
        res = await this.getBattery(camera);
    }

    // Send action
    private sendAction(camera, action, testFunc, ...settingObj) {
        let param = '';
        let type = '';

        if (settingObj.length > 0) {
            param = settingObj[0];
            type = settingObj[1];
        }

        // console.log(action)
        // console.log(testFunc)
        // console.log(param)
        // console.log(type)

        return camera.client.sendAction(action, testFunc, param, type);
    }

    // Request token
    private requestToken(camera) {
        return camera.client.sendAction(constant.action.REQUEST_TOKEN, (data) => {
            return (data.msg_id === constant.action.REQUEST_TOKEN && data.hasOwnProperty('rval') && data.hasOwnProperty('param'));
        });
    }

    private async connect(camera) {
        console.log('-----------' + camera.ip + '--------------');
        try {
            const res = await camera.client.connect(camera.ip, this.port);
            const token = await this.requestToken(camera);
            camera.client.token = token;
            return token;

        } catch (err) {
            return err;
        }

    }

    private takePhoto(camera) {
        return this.sendAction(camera, constant.action.TAKE_PHOTO, (data) => {
            return (data.hasOwnProperty('type') && data.type === 'photo_taken');
        });
    }

    private getBattery(camera) {
        return this.sendAction(camera, constant.action.GET_BATTERY, (data) => {
            return (data.hasOwnProperty('rval') && data.hasOwnProperty('msg_id') && data.msg_id === constant.action.GET_BATTERY);
        });
    }

    private getConfig(camera) {
        return this.sendAction(camera, constant.action.GET_CONFIG, (data) => {
            return (data.hasOwnProperty('rval') && data.hasOwnProperty('msg_id') && data.msg_id === constant.action.GET_CONFIG);
        })
            .then((config) => {

                const configObject = {};

                // tslint:disable-next-line:forin
                for (const index in config) {
                    // tslint:disable-next-line:forin
                    for (const propertyName in config[index]) {
                        configObject[propertyName] = config[index][propertyName];
                    }
                }

                return configObject;
            });
    }

    private setConfig(camera, type, value) {
        return this.sendAction(camera, constant.action.SET_CONFIG, (data) => {
            // console.log(camera)
            // tslint:disable-next-line:max-line-length
            return (data.hasOwnProperty('rval') && data.hasOwnProperty('msg_id') && data.msg_id === constant.action.SET_CONFIG && data.hasOwnProperty('type') && data.type === type);
        }, value, type);
    }

    private downloadFile(camera, filePath, fileObj) {

        const outputPath = fileObj.folder;
        const fileHttpPath = filePath.replace(/\/tmp\/fuse_d/, 'http://' + camera.ip);
        const outputFilePath = path.join(outputPath, camera.index + fileObj.type);
        const outputFileStream = fs.createWriteStream(outputFilePath, { flag: 'a+' });

        return new Bluebird((resolve, reject) => {
            http.get(fileHttpPath, (response) => {
                response.pipe(outputFileStream, './')
                    .on('finish', () => {
                        console.log(fileHttpPath)
                        this.deleteFile(camera,fileHttpPath)
                        resolve(outputFilePath);
                    })
                    .on('error', (err) => {
                        reject(err);
                    });
            });
        });
    }

    private deleteFile(camera,filePath) {
        // const fileHttpPath = filePath.replace(/\/tmp\/fuse_d/, 'http://' + camera.ip); 
         return new Bluebird((resolve, reject) => {
            return this.sendAction(camera,constant.action.DELETE_FILE, function (data) {
                return (data.hasOwnProperty('rval') && data.hasOwnProperty('msg_id') && data.msg_id == constant.action.DELETE_FILE);
            }, filePath);
         });
    }

    // TODO: change camera
    reconnect() {
        return Bluebird.map(this.cameraCollection, (camera) => {
            const isalive = camera.client.isConnected();
            return isalive ? false : this.connect(camera);
        });
    }

    
}
