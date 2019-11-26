"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
let g_socket = {};
let key = '';
class Global {
    static setSocket(key, socket) {
        g_socket[key] = socket;
    }
    static getSocket() {
        return g_socket;
    }
    static sendEvent(key, event, cmd) {
        console.log('sendEvent: ' + event + ' ' + g_socket[key]);
        g_socket[key].emit(event, cmd);
    }
}
exports.Global = Global;
//# sourceMappingURL=global.services.js.map