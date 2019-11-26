"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os = require('os');
const child = require("child_process");
function fileMgrCmd(cmd) {
    const platform = os.platform();
    let filemgrCmd = '';
    switch (platform) {
        case 'win32':
            filemgrCmd = 'filemgr-win64.exe ' + cmd;
            break;
        case 'darwin':
            filemgrCmd = './filemgr-mac ' + cmd;
            break;
        case 'linux':
            filemgrCmd = './filemgr-linux64 ' + cmd;
            break;
    }
    return child.execSync(filemgrCmd).toString();
}
exports.fileMgrCmd = fileMgrCmd;
//# sourceMappingURL=filemgr.js.map