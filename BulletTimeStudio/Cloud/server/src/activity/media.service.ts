
import {MEDIA_WORKER_EVENT} from "../common/socket.interface";
import {RedisService} from "../common/redis.service";
import {async} from "rxjs/scheduler/async";
import {basketAnnoSiteSettingSchema} from "../common/db.service";
import {dbTools} from "../common/db.tools";

export class MediaService {
    mediaServiceSocket: any;

    constructor() {
        console.log(`constructor of MediaService`);
    }

    initService(io, socket) {

        this.mediaServiceSocket = socket;
        // console.log(`media worker init service`);

        socket.on(MEDIA_WORKER_EVENT.REGISTER_MEDIA_WORKER, async data => {
           // 注册哪个worker处理了哪个site
           console.log(`MEDIA_WORKER_EVENT.REGISTER_MEDIA_WORKER => data: ${JSON.stringify(data)}`);
           let result = await basketAnnoSiteSettingSchema.updateOne({"siteId": data.siteId, $or:
               [
                   {"mediaWorker": {$eq: null}},
                   {"mediaWorker": {$ne: data.ip}}
               ]
           }, {$set: {
               "mediaWorker": data.ip
           }});

           console.log("update media worker info" + JSON.stringify(result));
           let code = dbTools.getUpdateCode(result);
           if (code == 0) {
               console.log(`media worker ip: ${data.ip} 认领了 siteId: ${data.siteId} 的流录制任务`);
           } else {
               console.log(`更新media worker info失败`);
           }
        });

        socket.on(MEDIA_WORKER_EVENT.START_RECORDING, data => {
            console.log(`转发事件: ${MEDIA_WORKER_EVENT.START_RECORDING} => data: ${JSON.stringify(data)}`);

            socket.broadcast.emit(MEDIA_WORKER_EVENT.START_RECORDING, data);
        });

        /**
         * media worker 响应帧可用, 转发给annotation tool
         */
        socket.on(MEDIA_WORKER_EVENT.FRAME_AVAILABLE, async data => {
            console.log(`转发事件: ${MEDIA_WORKER_EVENT.FRAME_AVAILABLE} => data: ${JSON.stringify(data)}`);

            socket.broadcast.emit(MEDIA_WORKER_EVENT.FRAME_AVAILABLE, data);
        });

        /**
         * 从 annotation tool 请求帧，转发给media worker
         */
        socket.on(MEDIA_WORKER_EVENT.REQUEST_FRAME, async data => {
            console.log(`转发事件： ${MEDIA_WORKER_EVENT.REQUEST_FRAME} => data: ${JSON.stringify(data)}`);

            socket.broadcast.emit(MEDIA_WORKER_EVENT.REQUEST_FRAME, data);
        });

        /**
         * 从 annotation tool 发出 goal事件，转发给media worker
         */
        socket.on(MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL, data => {
            console.log(`转发事件: ${MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL} => data: ${JSON.stringify(data)}`);
            socket.broadcast.emit(MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL, data);
        });

        /**
         * 从 media worker 发出，转发给annotation tool
         */
        socket.on(MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL_COMPLETE, data => {
            console.log(`转发事件: ${MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL_COMPLETE} => data: ${JSON.stringify(data)}`);
            socket.broadcast.emit(MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL_COMPLETE, data);
        });

        socket.on(MEDIA_WORKER_EVENT.TEST, data => {
            console.log(`test event => MEDIA_WORKER_EVENT.TEST => data: ${JSON.stringify(data)}`);
            socket.broadcast.emit(MEDIA_WORKER_EVENT.TEST, data);
            // io.sockets.emit(MEDIA_WORKER_EVENT.TEST, data);
        })
    }

    public requestFrame(data) {
        this.mediaServiceSocket.emit(MEDIA_WORKER_EVENT.REQUEST_FRAME, data);
    }

    public startRecording(data) {
        this.mediaServiceSocket.emit(MEDIA_WORKER_EVENT.START_RECORDING, data);
    }
}