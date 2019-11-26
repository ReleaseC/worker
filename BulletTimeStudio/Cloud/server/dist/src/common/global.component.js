"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var g_socket = [];
var key = '';
var g_time = '';
var g_start = 0;
var g_id = '';
var g_status = 'Free';
class Global {
    static setSocket(socket, id) {
        key = id;
        g_socket[key] = socket;
    }
    static getSocket() {
        return g_socket;
    }
    static setStatus(data) {
        g_status = data;
    }
    static getStatus() {
        return g_status;
    }
    static setTime(time) {
        g_time = time;
    }
    static getTime() {
        return g_time;
    }
    static setstart(is_start) {
        g_start += is_start;
    }
    static getstart() {
        return g_start;
    }
    static setid(id) {
        g_id += id;
    }
    static getid() {
        return g_id;
    }
}
exports.Global = Global;
//# sourceMappingURL=global.component.js.map