"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const db_service_1 = require("../common/db.service");
const task_service_1 = require("../task/task.service");
const site_service_1 = require("../site/site.service");
const redis = require('redis');
let SportService = class SportService {
    constructor() {
        this.Promise = require('bluebird');
        this.deviceIdSocketIdMap = new Object();
    }
    initService(io, socket) {
        this.tempSocket = io;
        socket.on(SOCCER_EVENT.SITES_MATCH_EVENT, (data, cb) => __awaiter(this, void 0, void 0, function* () {
            console.log('Login=' + JSON.stringify(data));
            const device = {
                role: data.role,
                deviceId: data.deviceId,
                camera: data.camera
            };
            let soccerSite = yield db_service_1.soccorDbSiteSetting.findOne({ siteId: data.siteId });
            socket.join(data.siteId);
            if (cb)
                cb('login success in room:' + data.siteId);
            if (!soccerSite || !soccerSite.deviceConfig) {
                console.log(`soccer.service.ts >>> on SITES_MATCH_EVENT >>>`);
                console.log(soccerSite);
                console.log('siteId无效或deviceConfig无效 因此退出回调');
                return;
            }
            io.to(data.siteId).emit(SOCCER_EVENT.SITES_CONFIG_EVENT, soccerSite.deviceConfig);
            let temp = [];
            let isExist = false;
            if (this.connecntMap.get(socket)) {
                temp = this.connecntMap.get(socket);
                for (let i = 0; i < temp.length; i++) {
                    if ((temp[i].siteId == data.siteId) && (temp[i].deviceId == data.deviceId)) {
                        isExist = true;
                        break;
                    }
                }
            }
            if (!isExist) {
                temp.push({ 'siteId': data.siteId, 'deviceId': data.deviceId, 'role': data.role });
                this.connecntMap.set(socket, temp);
            }
        }));
        socket.on(SOCCER_EVENT.SITES_UNMATCH_EVENT, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('device=' + JSON.stringify(data));
            const isDeviceBiding = yield db_service_1.soccorDbSiteSetting.findOne({ 'deviceConfig.deviceId': data.deviceId });
            if (isDeviceBiding) {
                isDeviceBiding.deviceConfig = isDeviceBiding.deviceConfig.filter(item => {
                    if (item.deviceId !== data.deviceId)
                        return item;
                });
                yield db_service_1.soccorDbSiteSetting.findOneAndUpdate({ _id: isDeviceBiding._id }, { deviceConfig: isDeviceBiding.deviceConfig });
                socket.leave(data.siteId);
                io.to(data.siteId).emit(SOCCER_EVENT.SITES_CONFIG_EVENT, isDeviceBiding.deviceConfig);
            }
        }));
        socket.on(SOCCER_EVENT.SITES_CONFIG_EVENT, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('site=' + JSON.stringify(data));
            const soccerSite = yield db_service_1.soccorDbSiteSetting.findOne({ siteId: data.siteId });
            io.to(data.siteId).emit(SOCCER_EVENT.SITES_CONFIG_EVENT, soccerSite.deviceConfig);
        }));
        socket.on(SOCCER_EVENT.GOAL_EVENT, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('admin->server, goal data:' + JSON.stringify(data));
            this.tempSocket = io;
            let site = yield db_service_1.soccorDbSiteSetting.findOne({ siteId: data.siteId });
            let res = {
                'siteId': '',
                'taskId': '',
                'timestamp': '',
                'deviceId_0': '',
                'deviceId_1': '',
                'deviceId_2': ''
            };
            res.siteId = data.siteId;
            res.taskId = data.taskId;
            res.timestamp = data.timestamp;
            if (site && site.deviceConfig) {
                for (let i = 0; i < site.deviceConfig.length; i++) {
                    if (site.deviceConfig[i].role == 'VideoCam') {
                        switch (site.deviceConfig[i].position) {
                            case '0':
                                res.deviceId_0 = site.deviceConfig[i].deviceId;
                                break;
                            case '1':
                                res.deviceId_1 = site.deviceConfig[i].deviceId;
                                break;
                            case '2':
                                res.deviceId_2 = site.deviceConfig[i].deviceId;
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            this.goalMap[data.taskId] = res;
            socket.emit(SOCCER_EVENT.EVENT_GOAL_SUCCESS_ACK, res);
            socket.broadcast.to(data.siteId).emit(SOCCER_EVENT.PREPARE_UPLOAD_EVENT, res);
            let goal = new db_service_1.goalEvent;
            goal.siteId = data.siteId;
            goal.taskId = data.taskId;
            goal.timestamp = data.timestamp;
            goal.save();
        }));
        socket.on(SOCCER_EVENT.EVENT_CAM_GOAL_ACK, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('vc收到goal, data:' + JSON.stringify(data));
            this.tempSocket = io;
            let res = this.goalMap[data.taskId];
            if (res.deviceId_0 == data.deviceId) {
                res.deviceId_0 = '';
            }
            if (res.deviceId_1 == data.deviceId) {
                res.deviceId_1 = '';
            }
            if (res.deviceId_2 == data.deviceId) {
                res.deviceId_2 = '';
            }
            this.goalMap[data.taskId] = res;
            if (res.deviceId_0.length == 0 && res.deviceId_1.length == 0 && res.deviceId_2.length == 0) {
                let result = yield db_service_1.goalEvent.update({ 'taskId': data.taskId }, { $set: { 'del': true } });
                delete this.goalMap[data.taskId];
            }
        }));
        socket.on(SOCCER_EVENT.SINGLE_VIDEO_UPLOADED_EVENT, (data) => {
            console.log('Single video uploaded goal data=' + JSON.stringify(data));
            io.to(data.siteId).emit(SOCCER_EVENT.SINGLE_VIDEO_UPLOADED_EVENT, data);
            let taskService = new task_service_1.TaskService();
            if (taskService.isAllFilesUpdated(data.taskId)) {
                this.soccerUpdateTask();
            }
        });
        socket.on(SOCCER_EVENT.EVENT_REMOTE_SHOT_GETDEVICES, (data) => {
            console.log('remote shot get devices data=' + JSON.stringify(data));
            io.to(data.siteId).emit(SOCCER_EVENT.EVENT_REMOTE_SHOT_GETDEVICES, data);
        });
        socket.on(SOCCER_EVENT.EVENT_REMOTE_SHOT, (data) => {
            console.log('remote shot data=' + JSON.stringify(data));
            socket.join(data.siteId);
            io.to(data.siteId).emit(SOCCER_EVENT.EVENT_REMOTE_SHOT, data);
        });
        socket.on(SOCCER_EVENT.EVENT_REMOTE_SHOT_GET_PICS, (data) => {
            console.log('remote shot get pics');
            console.log('remote shot get pics, siteId=' + data.siteId);
            console.log('remote shot get pics, index=' + data.index);
            io.to(data.siteId).emit(SOCCER_EVENT.EVENT_REMOTE_SHOT_GET_PICS, data);
        });
        socket.on(SOCCER_EVENT.EVENT_HEARTBEAT, (data) => __awaiter(this, void 0, void 0, function* () {
            console.log('heart_beat:', JSON.stringify(data));
            if (data && data.deviceId && socket && socket.id) {
                this.deviceIdSocketIdMap[data.deviceId] = socket.id;
            }
            let siteService = new site_service_1.SiteService();
            if (data.role == 'admin') {
                const ret = yield siteService.setHeartbeatRedis(data);
                socket.broadcast.emit(SOCCER_EVENT.EVENT_HEARTBEAT, data);
            }
            else {
                let site = yield db_service_1.soccorDbSiteSetting.findOne({ siteId: data.siteId });
                if (site && site.deviceConfig) {
                    for (let i = 0; i < site.deviceConfig.length; i++) {
                        if (site.deviceConfig[i].deviceId == data.deviceId) {
                            const ret = yield siteService.setHeartbeatRedis(data);
                            socket.broadcast.emit(SOCCER_EVENT.EVENT_HEARTBEAT, data);
                        }
                    }
                }
            }
        }));
        socket.on(SOCKET_EVENT.DISCONNECT, (data, cb) => __awaiter(this, void 0, void 0, function* () {
            if (this.connecntMap.get(socket) != undefined) {
                for (let i = 0; i < this.connecntMap.get(socket).length; i++) {
                    socket.broadcast.emit(SOCCER_EVENT.EVENT_DEVICEOFFLINE, this.connecntMap.get(socket)[i]);
                }
            }
        }));
        socket.on(SOCCER_EVENT.EVENT_SOCCER_CMD, (data) => {
            console.log('cmd=' + JSON.stringify(data));
            io.to(data.siteId).emit(SOCCER_EVENT.EVENT_SOCCER_CMD, data);
        });
    }
    soccerUpdateTask() {
        return __awaiter(this, void 0, void 0, function* () {
            let taskService = new task_service_1.TaskService();
            const time = new Date().toLocaleDateString().replace(/\//g, '-');
            const type = {
                'time': time,
                'sort': true,
                'limit': 0
            };
            let retArr = yield taskService.getTaskList(type);
            retArr = retArr.filter((item, index, array) => {
                return ((item.state === 'create') || (item.state === 'abort'));
            });
            const retArrLen = retArr.length;
            console.log(retArrLen + ' tasks need to recheck in ' + time);
            for (let i = 0; i < retArrLen; i++) {
                const cmd = `--action getfilelist --bucket eee --prefix soccer_${retArr[i].task.taskId} | grep soccer | cut -c 16-`;
                let fileLists = fileMgrCmd(cmd);
                const fileNameList = fileLists.split('\n');
                fileNameList.pop();
                if ((fileNameList[0]) && (fileNameList[1]) && fileNameList[2]) {
                    const body = {
                        taskId: retArr[i].task.taskId,
                        fileName1: fileNameList[0],
                        fileName2: fileNameList[1],
                        fileName3: fileNameList[2] || '',
                        state: 'data.ready',
                        type: 'soccer'
                    };
                    let r = yield taskService.updateTask(body);
                }
                else {
                    const body = {
                        taskId: retArr[i].task.taskId,
                        fileName1: fileNameList[0],
                        fileName2: fileNameList[1],
                        fileName3: fileNameList[2],
                        state: retArr[i].state,
                        type: 'soccer'
                    };
                    let r = yield taskService.updateTask(body);
                }
            }
        });
    }
};
SportService = __decorate([
    common_1.Component(),
    __metadata("design:paramtypes", [])
], SportService);
exports.SportService = SportService;
//# sourceMappingURL=sport.service.js.map