import * as Socket from 'socket.io';

let g_socket:Socket = {}; // Save socket to global variable
// let key = '';

let g_socketId:Socket = {};
// let deviceId='';

let g_file_server_status = {}; // g_file_server_status

let g_mome_ubuntu_status = {}; // g_mome_ubuntu_status

let g_register_data = {}; // g_register_data

let g_prompt = {}; // g_prompt

export class Global {

    static setSocket(key, socket: object) {
        g_socket[key] = socket;
    }

    static getSocket(key) {
        return g_socket[key];
    }

    static setSocketId(deviceId, socketId: string) {
        g_socketId[deviceId] = socketId;
    }

    static getSocketId(deviceId) {
        return g_socketId[deviceId];
    }

    static sendEvent(key, event: string, cmd: any) {
        console.log('sendEvent: ' + event + ' ' + g_socket[key]);
        g_socket[key].emit(event, cmd);
    }

    /* fileServer map */
    static setFileServerStatus(key, data) {
        g_file_server_status[key] = data;
    }

    static getFileServerStatus(key) {
        return g_file_server_status[key];
    }

    static getAllFileServerStatus() {
        return g_file_server_status;
    }

    /* mome_ubuntu map */
    static setMomeUbuntuStatus(key, data) {
        g_mome_ubuntu_status[key] = data;
    }

    static getMomeUbuntuStatus(key) {
        return g_mome_ubuntu_status[key];
    }

    static getAllMomeUbuntuStatus() {
        return g_mome_ubuntu_status;
    }

    /* socket register map, 用于记录浏览器来注册的map */
    static setRegisterData(key, data) {
        g_register_data[key] = data;
    }

    static getRegisterData(key) {
        return g_register_data[key];
    }

    static getAllRegisterData() {
        return g_register_data;
    }

    /* socket register map, 用于记录通知倒计时的浏览器map */
    static setPromptData(key, data) {
        g_prompt[key] = data;
    }

    static getPromptData(key) {
        return g_prompt[key];
    }

    static getAllPromptData() {
        return g_prompt;
    }


}
