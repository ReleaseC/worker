'use strict';

const
    constant = require('./constant'),
    path = require('path'),
    fs = require('fs'),
    http = require('http'),
    net = require('net'),
    Promise = require('bluebird'),


class Client {
    constructor() {
        this.socketClient = new net.Socket();
        this.listeners = [];
        this.connecting = false;
        this.connected = false;
        this.token = null;
        this.battery = '';
        this.photo = false;

        let that = this;
        // On client receive data
        this.socketClient.on('data', function (data) {
            try {
                data = String(data);
                const objCollection = data.match(/\{(.*?)\}/g);

                objCollection.forEach((obj) => {
                    if (!obj.includes('battery') && !obj.includes('adapter')) {
                        console.log('-------' + obj + '--------');
                        obj = JSON.parse(obj);
                        that.listeners.filter(function (listener) {
                            return !listener(obj);
                        });
                    } else {
                        if (!obj.includes('status')) {
                            obj = JSON.parse(obj);
                            that.battery = obj.param;
                            // console.log('battery = ' + that.battery);
                            // console.log('ip = ' + that.ip);
                        }
                    }
                })
            } catch (error) {
                console.log(error);
            }
        });


        // On client close
        this.socketClient.on('close', function (had_error) {
            console.log('socket close');

            if (that.connected) {
                that.connected = false;
                that.token = null;
                that.socketClient.destroy();

                if (had_error) {
                    console.error('Transmission error');
                }
            }
        });
    }

    isConnected() {
        return this.connected;
    };

    connect(ip, port) {
        let that = this;
        return new Promise(function (resolve, reject) {
            if (that.connected) {
                reject('Already connected');
                return;
            }

            if (that.connecting) {
                reject('Already trying connecting');
                return;
            }

            that.connecting = true;

            var onError = function (err) {
                that.connecting = false;
                reject(err);
            };
            that.socketClient.once('error', onError);

            that.socketClient.connect(port, ip, function () {
                that.connected = true;
                that.connecting = false;
                that.socketClient.removeListener('error', onError);
                resolve('connecting');
            });

        });
    };

    disconnect() {
        let that = this;
        return new Promise(function (resolve) {
            that.socketClient.on('end', function () {
                console.log('disconnecting');

                resolve();
            });

            that.connected = false;
            Client.token = null;

            that.socketClient.end();
        });
    };

    sendAction(action, testFunc, param, type) {
        let that = this;
        return new Promise(function (resolve) {
            var message = {
                msg_id: action,
                token: action == constant.action.REQUEST_TOKEN ? 0 : that.token
            };

            if (param) {
                message.param = param;
            }

            if (type) {
                message.type = type;
            }

            that.sendMessage(message, testFunc, resolve);
        });
    };


    // Send message on the socket and register a test function to get result
    // Test function should return true on a valid response
    sendMessage(message, testFunc, resolve) {
        // console.log(message);

        if (testFunc) {

            this.listeners.push(function (data) {
                // console.log(data);

                var result = !!testFunc(data);

                if (result) {
                    resolve(data.hasOwnProperty('param') ? data.param : null);
                }

                return result;
            });
        }

        this.socketClient.write(JSON.stringify(message));
    }
}


// save camera  obj
// {    
//      ip: camera ip, 
//      client: client class, 
//      index: camera index    
// }
var cameraCollection = [];

// YiActionCamera
var YiActionCamera = exports;

// Expose config constants
YiActionCamera.config = constant.config;

// Settings
YiActionCamera.autoConnect = true;
YiActionCamera.port = 7878;


YiActionCamera.connectCamera = function (cameraData) {
    Promise.map(cameraData, (camera) => {
        if (cameraCollection.find((collection) => collection.ip === camera.id) === undefined) {
            cameraCollection.push({ ip: camera.id, client: new Client(), index: camera.index })
            connect(cameraCollection[camera.index - 1]);
        }
    })
}

YiActionCamera.takePhoto = function (savePath) {
    return Promise.map(cameraCollection, (camera) => {
        camera.client.photo = false;
        return new Promise((resolve, reject) => {
            takePhoto(camera)
                .then((filePath) => {
                    return downloadFile(camera, filePath, { folder: savePath, type: '.jpg' })
                })
                .then((filePath) => {
                    camera.client.photo = true;
                    resolve({ ip: camera.ip, index: camera.index, path: filePath });
                })
                .catch(err => {
                    reject(err)
                })
        })
    })
}

YiActionCamera.record = function (time, savePath) {
    return Promise.map(cameraCollection, (camera) => {
        startRecord(camera);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                stopRecord(camera)
                    .then((cameraFilePath) => {
                        return downloadFile(camera, cameraFilePath, { folder: savePath, type: '.mp4' })
                    })
                    .then((outFilePath) => {
                        resolve({ ip: camera.ip, index: camera.index, path: outFilePath });
                    })
                    .catch(err => {
                        console.log(err)
                    })
            }, time);
        })
    })
}

YiActionCamera.getStatus = function () {

    return Promise.map(cameraCollection, (camera) => {
        return Promise.resolve({ 
            ip: camera.ip,
            index: camera.index,
            battery: camera.client.battery,
            photo: camera.client.photo,
            isalive: camera.client.connected,
        });
    })
}


YiActionCamera.setConfig = function () {
    return Promise.map(cameraCollection, (camera) => {
        const type = 'switch_to_cap_mode';
        const param = 'capture_mode';
        return setConfig(camera, type, param);
    })
}


// Connect
function connect(camera) {
    console.log('-----------' + camera.ip + '--------------');
    if (!camera.client.isConnected()) {
        return camera.client.connect(camera.ip, YiActionCamera.port)
            .then((data) => {
                return requestToken(camera);
            }, (err) => { })
            .then((token) => {
                camera.client.token = token;
            }, (err) => { });
    } else {
        console.log('Already connected');

    }
};

// Disconnect
function disconnect(camera) {
    camera.client.disconnect();
};

// Take photo
function takePhoto(camera) {
    return sendAction(camera, constant.action.TAKE_PHOTO, function (data) {
        return (data.hasOwnProperty('type') && data.type == 'photo_taken');
    });
};

// Start record
function startRecord(camera) {
    return sendAction(camera, constant.action.START_RECORD, function (data) {
        return (data.hasOwnProperty('type') && data.type == 'start_video_record');
    });
};

// Stop record
function stopRecord(camera) {
    return sendAction(camera, constant.action.STOP_RECORD, function (data) {
        return (data.hasOwnProperty('type') && data.type == 'video_record_complete');
    });
};

// Delete file
YiActionCamera.deleteFile = function (filePath) {
    return sendAction(constant.action.DELETE_FILE, function (data) {
        return (data.hasOwnProperty('rval') && data.hasOwnProperty('msg_id') && data.msg_id == constant.action.DELETE_FILE);
    }, filePath);
};

// Get camera config
function getConfig(camera) {
    return sendAction(camera, constant.action.GET_CONFIG, function (data) {
        return (data.hasOwnProperty('rval') && data.hasOwnProperty('msg_id') && data.msg_id == constant.action.GET_CONFIG);
    })
        .then(function (config) {
            console.log('------config-------');
            console.log(config);

            var configObject = {};

            for (var index in config) {
                for (var propertyName in config[index]) {
                    configObject[propertyName] = config[index][propertyName];
                }
            }

            return configObject;
        });
};

// Set camera config
function setConfig(camera, type, value) {
    return sendAction(camera, constant.action.SET_CONFIG, function (data) {
        return (data.hasOwnProperty('rval') && data.hasOwnProperty('msg_id') && data.msg_id == constant.action.SET_CONFIG && data.hasOwnProperty('type') && data.type == type);
    }, value, type);
};

// Download file
function downloadFile(camera, filePath, fileObj) {

    const outputPath = fileObj.folder;

    var fileHttpPath = filePath.replace(/\/tmp\/fuse_d/, 'http://' + camera.ip),
        outputFilePath = path.join(outputPath, camera.index + fileObj.type),
        outputFileStream = fs.createWriteStream(outputFilePath, { flag: 'a+' });

    return new Promise(function (resolve, reject) {
        http.get(fileHttpPath, function (response) {

            response.pipe(outputFileStream, './').on('finish', () => {
                resolve(outputFilePath);
            });

        })
            .on('error', function (err) {
                reject(err);
            });
    });
};

// Send action
function sendAction(camera, action, testFunc, param, type) {
    if (YiActionCamera.autoConnect && !camera.client.isConnected()) {
        return camera.client.connect()
            .then(function () {
                return camera.client.sendAction(action, testFunc, param, type);
            });
    } else {
        return camera.client.sendAction(action, testFunc, param, type);
    }
}

// Request token
function requestToken(camera) {
    return camera.client.sendAction(constant.action.REQUEST_TOKEN, function (data) {
        return (data.msg_id == constant.action.REQUEST_TOKEN && data.hasOwnProperty('rval') && data.hasOwnProperty('param'));
    });
}