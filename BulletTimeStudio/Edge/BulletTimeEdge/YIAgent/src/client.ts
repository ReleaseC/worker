const net = require('net');
const constant = require('./constant');

export class Client {
    socketClient: any;
    listeners: any;
    connecting: boolean;
    connected: boolean;
    token: any;
    battery: number;
    photo: boolean;
    setting: string;

    constructor() {
        this.socketClient = new net.Socket();
        this.listeners = [];
        this.connecting = false;
        this.connected = false;
        this.token = null;
        this.battery = 0;
        this.photo = false;
        this.setting = '';

        // On client receive data
        this.socketClient.on('data', (data) => {
            try {
                data = String(data);
                if (data.length < 500) {
                    const mutiDataObj = data.match(/\}\{/g) || false;
                    if (!mutiDataObj) {
                        const obj = JSON.parse(data);
                        // console.log(obj);
                        // console.log('-------' + obj + '--------');
                        this.listeners = this.listeners.filter((listener) => {
                            return !listener(obj);
                        });
                    } else {
                        // ERROR: {}{}
                        const objCollection = data.split(/\}\{/g);
                        objCollection.forEach((obj, index) => {
                            const objNum = mutiDataObj.length;
                            // tslint:disable-next-line:max-line-length
                            obj = index !== 0 && index !== objNum ? JSON.parse(`{${obj}}`) : index === 0 ? JSON.parse(`${obj}}`) : JSON.parse(`{${obj}`);
                            this.listeners.filter((listener) => {
                                return !listener(obj);
                            });
                        });
                    }
                } else {
                    // ERROR: config broken
                    this.setting += data;
                    if (this.setting.length > 2000) {
                        this.listeners.filter((listener) => {
                            return !listener(JSON.parse(this.setting));
                        });
                    }
                }
            } catch (error) {
                console.log(error);
            }
        });

        this.socketClient.on('close', (had_error) => {
            console.log('socket close');

            if (this.connected) {
                this.connected = false;
                this.token = null;
                // this.socketClient.destroy();

                if (had_error) {
                    console.error('Transmission error');
                }
            }
        });

    }

    isConnected() {
        return this.connected;
    }

    changeConnected() {
        this.connected = false;
        return this.connected;
    }

    connect(ip, port) {
        return new Promise((resolve, reject) => {
            // if (this.connected) {
            //     reject('Already connected');
            //     return;
            // }
            if (this.connecting) {
                reject('Already trying connecting');
            }
            this.connecting = true;

            const onError = (err) => {
                this.connecting = false;
                reject(err);
            };
            this.socketClient.once('error', onError);

            this.socketClient.connect(port, ip, () => {
                this.connected = true;
                this.connecting = false;
                this.socketClient.removeListener('error', onError);
                resolve('connecting');
            });

        });
    }

    disconnect() {
        return new Promise((resolve) => {
            this.socketClient.on('end', () => {
                console.log('disconnecting');
                resolve();
            });

            this.connected = false;
            this.token = null;
            this.socketClient.end();
        });
    }

    sendAction(action, testFunc, param, type) {
        return new Promise((resolve) => {
            const message = {
                msg_id: action,
                token: action === constant.action.REQUEST_TOKEN ? 0 : this.token,
            };
            if (param) {
                // tslint:disable-next-line:no-string-literal
                message['param'] = param;
            }
            if (type) {
                // tslint:disable-next-line:no-string-literal
                message['type'] = type;
            }
            this.sendMessage(message, testFunc, resolve);
        });
    }

    // Send message on the socket and register a test function to get result
    // Test function should return true on a valid response
    sendMessage(message, testFunc, resolve) {
        if (testFunc) {
            this.listeners.push((data) => {
                const result = !!testFunc(data);
                if (result) {
                    resolve(data.hasOwnProperty('param') ? data.param : null);
                }
                return result;
            });
        }
        this.socketClient.write(JSON.stringify(message));
    }
}