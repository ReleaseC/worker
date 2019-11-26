"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_interface_1 = require("../common/socket.interface");
const db_service_1 = require("../common/db.service");
const db_tools_1 = require("../common/db.tools");
class MediaService {
    constructor() {
        console.log(`constructor of MediaService`);
    }
    initService(io, socket) {
        this.mediaServiceSocket = socket;
        console.log(`media worker init service`);
        socket.on(socket_interface_1.MEDIA_WORKER_EVENT.REGISTER_MEDIA_WORKER, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(`MEDIA_WORKER_EVENT.REGISTER_MEDIA_WORKER => data: ${JSON.stringify(data)}`);
            let result = yield db_service_1.basketAnnoSiteSettingSchema.updateOne({ "siteId": data.siteId, $or: [
                    { "mediaWorker": { $eq: null } },
                    { "mediaWorker": { $ne: data.ip } }
                ]
            }, { $set: {
                    "mediaWorker": data.ip
                } });
            console.log("update media worker info" + JSON.stringify(result));
            let code = db_tools_1.dbTools.getUpdateCode(result);
            if (code == 0) {
                console.log(`media worker ip: ${data.ip} 认领了 siteId: ${data.siteId} 的流录制任务`);
            }
            else {
                console.log(`更新media worker info失败`);
            }
        }));
        socket.on(socket_interface_1.MEDIA_WORKER_EVENT.START_RECORDING, data => {
            console.log(`转发事件: ${socket_interface_1.MEDIA_WORKER_EVENT.START_RECORDING} => data: ${JSON.stringify(data)}`);
            socket.broadcast.emit(socket_interface_1.MEDIA_WORKER_EVENT.START_RECORDING, data);
        });
        socket.on(socket_interface_1.MEDIA_WORKER_EVENT.FRAME_AVAILABLE, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(`转发事件: ${socket_interface_1.MEDIA_WORKER_EVENT.FRAME_AVAILABLE} => data: ${JSON.stringify(data)}`);
            socket.broadcast.emit(socket_interface_1.MEDIA_WORKER_EVENT.FRAME_AVAILABLE, data);
        }));
        socket.on(socket_interface_1.MEDIA_WORKER_EVENT.REQUEST_FRAME, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log(`转发事件： ${socket_interface_1.MEDIA_WORKER_EVENT.REQUEST_FRAME} => data: ${JSON.stringify(data)}`);
            socket.broadcast.emit(socket_interface_1.MEDIA_WORKER_EVENT.REQUEST_FRAME, data);
        }));
        socket.on(socket_interface_1.MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL, data => {
            console.log(`转发事件: ${socket_interface_1.MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL} => data: ${JSON.stringify(data)}`);
            socket.broadcast.emit(socket_interface_1.MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL, data);
        });
        socket.on(socket_interface_1.MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL_COMPLETE, data => {
            console.log(`转发事件: ${socket_interface_1.MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL_COMPLETE} => data: ${JSON.stringify(data)}`);
            socket.broadcast.emit(socket_interface_1.MEDIA_WORKER_EVENT.ANNO_TOOL_GOAL_COMPLETE, data);
        });
        socket.on(socket_interface_1.MEDIA_WORKER_EVENT.TEST, data => {
            console.log(`test event => MEDIA_WORKER_EVENT.TEST => data: ${JSON.stringify(data)}`);
            socket.broadcast.emit(socket_interface_1.MEDIA_WORKER_EVENT.TEST, data);
        });
    }
    requestFrame(data) {
        this.mediaServiceSocket.emit(socket_interface_1.MEDIA_WORKER_EVENT.REQUEST_FRAME, data);
    }
    startRecording(data) {
        this.mediaServiceSocket.emit(socket_interface_1.MEDIA_WORKER_EVENT.START_RECORDING, data);
    }
}
exports.MediaService = MediaService;
//# sourceMappingURL=media.service.js.map