const os = require('os');
import * as child from "child_process";

export function fileMgrCmd(cmd) {
    const platform = os.platform();
    // console.log('platform = ' + platform);
    let filemgrCmd = '';
    switch(platform){
        case 'win32':
            filemgrCmd = 'filemgr-win64.exe '+cmd;
            break;
        case 'darwin':
            filemgrCmd = './filemgr-mac '+cmd;
            break;
        case 'linux':
            filemgrCmd = './filemgr-linux64 '+cmd;
            break;
    }
    return child.execSync(filemgrCmd).toString();
}