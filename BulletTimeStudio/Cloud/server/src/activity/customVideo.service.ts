
import {CUSTOMVIDEO_WORKER_EVENT} from "../common/socket.interface";

export class CustomVideoService {
    ccustomVideoServiceSocket: any;

    constructor() {
        console.log(`constructor of CustomVideoService`);
    }

    initService(io, socket) {
        this.ccustomVideoServiceSocket = socket;
        // console.log('CustomVideo init service');

        socket.on(CUSTOMVIDEO_WORKER_EVENT.EVENT_VIDEO_PROCESS, data => {
            console.log('EVENT_VIDEO_PROCESS data=' + data);
            socket.broadcast.emit(CUSTOMVIDEO_WORKER_EVENT.EVENT_VIDEO_PROCESS, data);
        });

        socket.on(CUSTOMVIDEO_WORKER_EVENT.EVENT_VIDEO_AVAILABLE, data => {
            console.log('EVENT_VIDEO_AVAILABLE data=' + data);
            socket.broadcast.emit(CUSTOMVIDEO_WORKER_EVENT.EVENT_VIDEO_AVAILABLE, data);
        });
    }    
}