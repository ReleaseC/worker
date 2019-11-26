import {
    Component,
    Inject,
    Controller,
    Get,
    Post,
    Res,
    Body,
    Response,
    Param,
    Query,
    HttpStatus,
    HttpException,
    Req
} from '@nestjs/common';
import {Global} from '../common/global.services';
import {
    accountdb,
    basketAnnoSiteSettingSchema,
    CameraSettingdb,
    soccorDbSiteSetting,
    taskdb
} from '../common/db.service';
import {activitydb} from '../common/db.service';
import {dbSiteSetting} from '../common/db.service';
import {RetObject} from '../common/ret.component';
import {Model} from 'mongoose';
import {datareportdb} from '../common/db.service';
import * as https from "https";
import {TASK_STATE} from "../task/interface/task.interface";
import {RedisService} from "../common/redis.service";
import {AccountService} from "../account/account.service";
import * as child from "child_process";
import {ChildProcess, exec} from "child_process";
import {
    CUSTOMVIDEO_WORKER_EVENT,
    LOCAL_FILE_EVENT,
    MOME_EVENT,
    SOCCER_EVENT,
    SOCKET_EVENT
} from "../common/socket.interface";
import {SiteService} from "../site/site.service";
import {TaskService} from "../task/task.service";

var http = require('http');
var request = require('request');
const redis = require('redis');
const bluebird = require("bluebird");
const redisClient = bluebird.promisifyAll(redis.createClient());


@Component()
export class ActivityService {

    activityServiceSocket: any;
    // activityServiceSocketIo: any;
    fileServerStatuses = [];


    initService(io, socket) {
        this.activityServiceSocket = socket;
        // this.activityServiceSocketIo = io;
        // client.set('file_server_status', '[]');
        socket.on(SOCCER_EVENT.EVENT_HEARTBEAT, async (data) => {
            // console.log("fileServer_activity_heart_beat:", JSON.stringify(data));
            if (data && data.device_id) {
                // 显示fileServer状态
                Global.setFileServerStatus(data.device_id, data);
                if (data.activity_id && data.ip) {

                    await activitydb.findOneAndUpdate({'activity_id': data.activity_id}, {
                        '$set': {
                            'settings.src.url': data.ip,
                            // 'settings.src.device_id': data.device_id
                        }
                    });
                }
                // fileServer注册, 单一通知, fileServer上传
                // Global.setSocketId(data.device_id, socket.id);
                Global.setSocketId(data.activity_id, socket.id);

                let activitys = await activitydb.find({'settings.src.device_id': data.device_id});
                console.log('该file_server的活动个数:', activitys.length)
                if (activitys.length > 0) {
                    for (let i = 0; i < activitys.length; i++) {
                        console.log('activity_name:', activitys[i].activity_name)
                        Global.setSocketId(activitys[i].activity_id, socket.id);
                    }
                }
            }
        });
    }

    async getActivity(query) {

        let result = {};
        let res = await activitydb.findOne({activity_id: query['activity_id']});
        if (!res) {
            return result
        }

        let visitCount = 0;
        let playCount = 0;
        let downloadCount = 0;
        let shareCount = 0;
        let likeCount = 0;

        result['mark'] = res.mark;
        result['create_time'] = res.create_time;
        result['activity_name'] = res.activity_name;
        result['address'] = res.address;
        result['settings'] = res.settings;
        result['banner'] = res.banner || '';

        // let siteSetting = await soccorDbSiteSetting.find({activity_id: query['activity_id']});
        //
        // let tasklists = [];
        // for (let i = 0; i < siteSetting.length; i++) {
        //     let temp = await taskdb.find({'task.siteId': siteSetting[i].siteId}).find({'del': {$ne: '1'}});
        //     tasklists = tasklists.concat(temp);
        // }
        let tasklists = await taskdb.find({activity_id: query['activity_id']}).find({'del': {$ne: '1'}});
        let tasks = [];

        for (let i = 0; i < tasklists.length; i++) {
            if (!tasklists[i] || !tasklists[i].task || !tasklists[i].task.taskId) {
                continue
            }

            let temptask = {};
            let res = await datareportdb.findOne({taskId: tasklists[i].task.taskId});

            temptask['activity_id'] = query['activity_id'];
            temptask['group'] = tasklists[i].group;
            temptask['state'] = tasklists[i].state;
            temptask['createdAt'] = tasklists[i].createdAt;
            temptask['updatedAt'] = tasklists[i].updatedAt;
            temptask['task'] = {};
            temptask['task']['siteId'] = tasklists[i].task.siteId;
            temptask['task']['taskId'] = tasklists[i].task.taskId;
            temptask['task']['mode'] = tasklists[i].task.mode;
            temptask['task']['output'] = tasklists[i].task.output;
            temptask['task']['cameraNum'] = tasklists[i].task.cameraNum;
            temptask['task']['fileName1'] = tasklists[i].task.fileName1;
            temptask['task']['fileName2'] = tasklists[i].task.fileName2;
            temptask['task']['fileName3'] = tasklists[i].task.fileName3;
            temptask['task']['type'] = tasklists[i].task.type;
            temptask['task']['detail'] = tasklists[i].task.detail;

            temptask['task']['visit'] = 0;
            temptask['task']['play'] = 0;
            temptask['task']['download'] = 0;
            temptask['task']['share'] = 0;
            temptask['task']['like'] = 0;
            if (res) {
                temptask['task']['visit'] = res.visit;
                temptask['task']['play'] = res.play;
                temptask['task']['download'] = res.download;
                temptask['task']['share'] = res.share;
                temptask['task']['like'] = res.like;
                visitCount += res.visit;
                playCount += res.play;
                downloadCount += res.download;
                shareCount += res.share;
                likeCount += res.like;
            }

            result['visit'] = visitCount;
            result['play'] = playCount;
            result['download'] = downloadCount;
            result['share'] = shareCount;
            result['like'] = likeCount;
            tasks.push(temptask);
        }

        result['ipVisit'] = res.visits.length;
        result['tasks'] = tasks;
        return result;
    }

    async getActivityList(query) {

        // let ret: RetObject = new RetObject;
        if (query.accessToken) {
            // ret.code = 1;
            // ret.description = 'accessToken不能为空';
            // return ret;
            let cacheData = await RedisService.getCache(query.accessToken);
            let cacheDataObj = JSON.parse(cacheData);
            let account = cacheDataObj['account'];
            let acount = await accountdb.findOne({account}, {role: 1});
            let condition = {'activity_id': acount.role.siteAdmin}
            return await activitydb.find(condition);
        }
        return await activitydb.find(query['wonderful'] ? {'wonderful': query['wonderful']} : {});
    }

    async activityVisit(query) {

        console.log("activity_id:", query['activity_id'])
        console.log("openid:", query['openid'])


        let ret: RetObject = new RetObject;
        if (!query['activity_id'] || !query['openid']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }

        let temp = await activitydb.findOne({activity_id: query['activity_id']});
        if (!temp) {
            ret.code = 1;
            ret.description = '未发现该活动';
            return ret;
        }


        if (temp.visits && temp.visits.indexOf(query.openid) >= 0) {
            ret.code = 1;
            ret.description = '已浏览过';
            return ret;
        }

        await activitydb.update({'activity_id': query['activity_id']},
            {'$push': {'visits': query['openid']}});

        ret.code = 0;
        return ret;

    }

    async activityFlow(query) {

        console.log("activity_id:", query['activity_id'])
        console.log("openid:", query['openid'])


        let ret: RetObject = new RetObject;
        if (!query['activity_id'] || !query['openid']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }

        let temp = await activitydb.findOne({activity_id: query['activity_id']});
        if (!temp) {
            ret.code = 1;
            ret.description = '未发现该活动';
            return ret;
        }


        if (temp.flows && temp.flows.indexOf(query.openid) >= 0) {
            ret.code = 1;
            ret.description = '已跳转过';
            return ret;
        }

        await activitydb.update({'activity_id': query['activity_id']},
            {'$push': {'flows': query['openid']}});

        ret.code = 0;
        return ret;

    }

    async getactivityInfo(query) {
        let ret: RetObject = new RetObject;
        if (!query['activity_id']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }

        if (query['activity_id']) {
            let activity = await activitydb.findOne({'activity_id': query.activity_id})
            ret.code = 0
            ret.result = activity
            return ret;
        }
        ret.code = 1;
        ret.description = '未找到该设备的设定';
        return ret;
    }

    async getCameraSetting(query) {
        let ret: RetObject = new RetObject;
        if (!query['activity_id'] && !query['device_id']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }

        if (query['activity_id']) {
            let activity = await activitydb.findOne({'activity_id': query.activity_id}, {
                'settings.camera_setting': 1,
                '_id': 0
            })
            if (!activity || !activity.settings || !activity.settings.camera_setting) {
                ret.code = 0
                ret.result = {}
                return ret;
            }
            ret.code = 0
            ret.result = activity.settings.camera_setting
            return ret;
        }
        if (query['device_id']) {

            let activity = await activitydb.findOne({'settings.camera_setting.cameras.deviceId': query['device_id']}, {
                'settings.camera_setting': 1,
                'activity_id': 1,
                'account': 1,
                '_id': 0
            })

            if (activity && activity.settings && activity.settings.camera_setting && activity.settings.camera_setting.cameras) {
                let cameras = activity.settings.camera_setting.cameras
                for (let i = 0; i < cameras.length; i++) {
                    if (cameras[i].deviceId == query['device_id']) {
                        let sentData = {
                            "deviceId": query['device_id'],
                            // "from": data.from,
                            // "requestId": data.requestId,
                            "param": {
                                // "action": "setup",
                                "account": activity.account || {},
                                "activity": {
                                    "activity_id": activity.activity_id
                                },
                                "video_source": cameras[i].video_source || {},
                                "recognition": cameras[i].trigger_type.model || {},
                                "record": cameras[i].collect || {},
                            }
                        }
                        ret.code = 0
                        ret.result = sentData
                        return ret;
                    }
                }
            }
        }
        ret.code = 1;
        ret.description = '未找到该设备的设定';
        return ret;
    }

    async addCameraSetting(data) {

        console.log('data:', data)
        let ret: RetObject = new RetObject
        if (!data.activity_id || data.position === undefined || !data.deviceId) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }

        // console.log('123:', 345)
        let activity = await activitydb.findOne({'activity_id': data.activity_id})
        if (!activity || !activity.settings || !activity.settings.camera_setting) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }
        // console.log('activity:', activity)
        for (let i = 0; i < activity.settings.camera_setting.cameras.length; i++) {
            if (activity.settings.camera_setting.cameras[i].position == data.position) {
                let res = await activitydb.update({
                    'activity_id': data.activity_id,
                    'settings.camera_setting.cameras.position': data.position
                }, {$set: {"settings.camera_setting.cameras.$.deviceId": data.deviceId}})
                ret.code = 0;
                ret.description = "ok";
                if (data.activity_id) {
                    data['cameras'] = []
                    let activity = await activitydb.findOne({activity_id: data.activity_id})
                    console.log('activity.settings:', activity.settings)
                    console.log('data1:', data)
                    if (activity && activity.settings && activity.settings.camera_setting && activity.settings.camera_setting.cameras.length > 0) {
                        data['cameras'] = activity.settings.camera_setting.cameras;
                        console.log('this.activityServiceSocket~~~~~~~~~~~~~~~~~~~:', this.activityServiceSocket);
                        if (this.activityServiceSocket) {
                            // this.activityServiceSocket.to(data.activity_id).emit(MOME_EVENT.DEVICE_CONFIG_CHANGE, data);
                            this.activityServiceSocket.emit(MOME_EVENT.DEVICE_CONFIG_CHANGE, data);
                        }
                    }
                    console.log('data2:', data)
                }
                return ret;
            }
        }

        // console.log('333:', 333)
        let update = {
            "$addToSet": {
                'settings.camera_setting.cameras': {'position': data.position, 'deviceId': data.deviceId}
            }
        }

        const res = await activitydb.update({'activity_id': data.activity_id}, update);

        console.log('res:', res)
        ret.code = 0;
        ret.description = "ok";
        if (data.activity_id) {
            data['cameras'] = []
            let activity = await activitydb.findOne({activity_id: data.activity_id})
            console.log('activity.settings:', activity.settings)
            console.log('data01:', data)
            if (activity && activity.settings && activity.settings.camera_setting && activity.settings.camera_setting.cameras.length > 0) {
                // console.log('camera_setting:', camera_setting)
                console.log('this.activityServiceSocket===============>', this.activityServiceSocket);
                data['cameras'] = activity.settings.camera_setting.cameras;
                if (this.activityServiceSocket) {
                    // this.activityServiceSocket.to(data.activity_id).emit(MOME_EVENT.DEVICE_CONFIG_CHANGE, data);
                    this.activityServiceSocket.emit(MOME_EVENT.DEVICE_CONFIG_CHANGE, data);
                }
            }
            console.log('data02:', data)
        }
        // console.log('777:', 777)
        return ret;
    }

    async addCameraCollect(data) {

        console.log('data:', JSON.stringify(data))
        let ret: RetObject = new RetObject
        if (!data.activity_id || data.collects === undefined) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }

        let activity = await activitydb.findOne({'activity_id': data.activity_id})
        if (!activity) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }

        if (data.trigger) {
            let update = {
                "$set": {
                    'settings.camera_setting.trigger': data.trigger
                }
            }
            const res = await activitydb.update({'activity_id': data.activity_id}, update);
            console.log('res0:', res)
        }
        if (data.direction) {
            let update = {
                "$set": {
                    'settings.camera_setting.direction': data.direction
                }
            }
            const res = await activitydb.update({'activity_id': data.activity_id}, update);
            console.log('res1:', res)
        }

        activity = await activitydb.findOne({'activity_id': data.activity_id})
        for (let i = 0; i < data.collects.length; i++) {
            if (this.hasContain(activity.settings.camera_setting.cameras, data.collects[i].position)) {
                //更新
                console.log('更新')
                let res = await activitydb.update({
                    'activity_id': data.activity_id,
                    'settings.camera_setting.cameras.position': data.collects[i].position
                }, {
                    $set: {
                        "settings.camera_setting.cameras.$.collect": data.collects[i].collect,
                        "settings.camera_setting.cameras.$.deviceId": data.collects[i].deviceId,
                        "settings.camera_setting.cameras.$.trigger_type": data.collects[i].trigger_type,
                        "settings.camera_setting.cameras.$.mark": data.collects[i].mark,
                        "settings.camera_setting.cameras.$.video_source": data.collects[i].video_source
                    }
                })
                console.log('res2:', res)
            } else {
                // 添加
                console.log('添加')
                let update = {
                    "$addToSet": {
                        'settings.camera_setting.cameras': {
                            'position': data.collects[i].position,
                            'collect': data.collects[i].collect,
                            'deviceId': data.collects[i].deviceId,
                            "trigger_type": data.collects[i].trigger_type,
                            "mark": data.collects[i].mark,
                            "video_source": data.collects[i].video_source
                        }
                    }
                }
                const res = await activitydb.update({'activity_id': data.activity_id}, update);
                console.log('res3:', res)
            }
        }
        ret.code = 0;
        ret.description = "ok";
        return ret;
    }

    hasContain(cameraArr, onePosition) {
        if (!cameraArr) {
            return false
        }
        for (let i = 0; i < cameraArr.length; i++) {
            if (cameraArr[i].position == onePosition) {
                return true
            }
        }
        return false
    }

    async addVideo(data) {

        console.log('data:', data)
        let ret: RetObject = new RetObject
        if (!data.activity_id) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }
        let update = {
            "$addToSet": {
                'settings.video_list': {'file_name': data.file_name, 'start': data.start, 'end': data.end}
            }
        }
        const res = await activitydb.update({'activity_id': data.activity_id}, update);
        ret.code = 0;
        ret.description = "ok";
        return ret;

    }

    async getSetting(query) {

        let ret: RetObject = new RetObject;
        if (!query.activity_id) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }
        let activity = await activitydb.findOne({'activity_id': query.activity_id}, {'settings': 1, '_id': 0})
        if (!activity || !activity.settings) {
            ret.code = 0
            ret.result = {}
            return ret;
        }

        ret.code = 0
        ret.result = activity;
        return ret
    }

    async getSettings(query) {
        let ret: RetObject = new RetObject;
        let condition = {};
        let accountService = new AccountService();
        let getSiteIdResult = await accountService.getSiteIds(query);
        let siteIds = getSiteIdResult.code == 0 ? getSiteIdResult.result as string[] : [];
        // let siteIds = ["t0000012"];
        const type = query['type'] || 'basketball';
        condition = {
            'type': type
        };
        let result = await basketAnnoSiteSettingSchema.find(condition, {siteId: 1, siteName: 1});

        if (result) {
            ret.code = 0;
            ret.result = [];

            for (let i = 0; i < siteIds.length; i++) {
                for (let j = 0; j < result.length; j++) {
                    if (siteIds[i] == result[j].siteId) {
                        ret.result.push(result[j]);
                    }
                }
            }

            // 没有siteIds列表返回所有
            if (siteIds.length == 0) {
                ret.result = result;
            }
        } else {
            ret.code = 1;
            ret.result = [];
        }
        return ret;
    }

    async getSettingsStream(quert) {

        let ret: RetObject = new RetObject;


        let activitys = await activitydb.find({
            "settings.ffmpegConfig": {$ne: null},
            "settings.ffmpegConfig.streamSourceUri": {$ne: null}
        })
        let res = []
        for (let i = 0; i < activitys.length; i++) {
            let temp = {}
            temp['activity_id'] = activitys[i].activity_id
            temp['activity_name'] = activitys[i].activity_name
            res.push(temp)
        }

        ret.code = 0
        ret.result = res
        return ret

    }

    async getSettingsFfmpegConfig(query) {


        let ret: RetObject = new RetObject;

        if (!query.activity_id) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }
        let activity = await activitydb.findOne({"activity_id": query.activity_id})
        if (!activity) {
            ret.code = 1
            ret.description = `未找到${query.activity_id}`
            return ret
        }

        ret.code = 0
        ret.result = activity.settings.ffmpegConfig
        return ret

    }

    async getFileServerStatus(query) {

        let data = Global.getAllFileServerStatus();
        let res = []
        for (var deviceId in data) {
            if (data.hasOwnProperty(deviceId)) {
                res.push(data[deviceId])
            }
        }
        for (let i = 0; i < res.length; i++) {
            let activity = await activitydb.findOne({'settings.src.device_id': res[i].device_id}, {
                'activity_name': 1,
                '_id': 0
            })
            if (activity) {
                res[i]['activity_name'] = activity.activity_name
            }
        }
        return res

    }

    async delFileServerStatus(query) {

        console.log('query:', query)
        let ret: RetObject = new RetObject;
        if (!query.deviceId) {
            ret.code = 1
            ret.description = "deviceId不能为空"
            return ret
        }
        if (Global.getFileServerStatus(query.deviceId)) {
            delete Global.getAllFileServerStatus()[query.deviceId];
            ret.code = 0
            ret.description = "删除成功"
            // ret.result = this.getFileServerStatus({})
            return ret
        } else {
            ret.code = 1
            ret.description = "未找到该deviceId"
            return ret
        }
    }

    keysort(key, sortType) {
        return function (a, b) {
            return sortType ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
        }
    }

    async getMomeUbuntuStatus(query) {

        let activity_ids = []
        if (query) {
            // console.log('query:', query)
            let activitys = await activitydb.find(query, {"activity_id": 1, "_id": 0})
            for (let i = 0; i < activitys.length; i++) {
                activity_ids.push(activitys[i].activity_id)
            }
        }
        console.log('activity_ids:', activity_ids)

        let data = Global.getAllMomeUbuntuStatus();
        let res = []
        for (var deviceId in data) {
            if (data.hasOwnProperty(deviceId)) {
                let param = data[deviceId]
                param['device_id'] = deviceId
                let time1 = new Date(param['timestamp'])
                if (Date.now() - time1.getTime() < 3600 * 9000 || param.activity_id) {
                    if (activity_ids.length == 0) {
                        res.push(param)
                    }
                    if (activity_ids.length > 0 && param.activity_id && activity_ids.indexOf(param.activity_id) >= 0) {
                        res.push(param)
                    }
                }
            }
        }

        res.sort(this.keysort('activity_id', true));
        return res

    }

    async setCheckTime(data) {

        console.log('data:', data)
        let ret: RetObject = new RetObject
        if (!data.activity_id || !data.check_type) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }

        if (data.check_type == 'interval') {
            // 时间段
            let update = {
                "$set": {
                    'settings.time_check': {'check_type': 'interval', 'times': data.times}
                }
            }
            const res = await activitydb.update({'activity_id': data.activity_id}, update);
            console.log('res:', res)
            ret.code = 0;
            ret.description = "ok";
            return ret;
        } else if (data.check_type == 'point') {
            // 时间点
            let update = {
                "$set": {
                    'settings.time_check': {'check_type': 'point', 'times': data.times}
                }
            }
            const res = await activitydb.update({'activity_id': data.activity_id}, update);
            console.log('res:', res)
            ret.code = 0;
            ret.description = "ok";
            return ret;
        }

        ret.code = 1
        ret.description = "参数错误"
        return ret

    }

    async fireDevice(query) {

        let ret: RetObject = new RetObject;
        if (!query.deviceId) {
            ret.code = 1
            ret.description = "deviceId不能为空"
            return ret
        }

        let bindActivitys = await activitydb.find({'settings.camera_setting.cameras.deviceId': query.deviceId})
        for (let i = 0; i < bindActivitys.length; i++) {
            let res = await activitydb.update({'activity_id': bindActivitys[i].activity_id}, {'$pull': {'settings.camera_setting.cameras': {'deviceId': query.deviceId}}});
        }
        ret.code = 0;
        ret.description = "解绑成功";
        return ret;

    }

    /* cloud admin 通知拍摄 */
    async makeMove(query) {

        console.log('拍摄query:', query)
        console.log('query.time:', query.time)
        let ret: RetObject = new RetObject;
        if (!query.activity_id) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }

        let activity = await activitydb.findOne({'activity_id': query.activity_id}, {"settings": 1, "_id": 0})
        if (activity && activity.settings && activity.settings.camera_setting && activity.settings.camera_setting.cameras) {

            console.log(activity.settings.camera_setting.trigger + '拍摄')

            let cameras = activity.settings.camera_setting.cameras
            let shootCount = activity.settings.camera_setting.shoot_count || 1
            let taskService = new TaskService();
            let taskId = query.taskId || query.activity_id + "_" + Date.now()

            if (!query.multi_shoot) {
                // 未传轮数进来
                query.multi_shoot = 1
                // 第一轮拍摄, 初始化活动state,
                await activitydb.update({'activity_id': query.activity_id}, {
                    "$set": {
                        'state': {
                            'activity_state': 'activity_start',
                            'file_state': []
                        }
                    }
                });
                let mode = "video"
                if (cameras.length > 0 && cameras[0].collect && cameras[0].collect.duration == 0) {
                    mode = "photo"
                }
                if (activity.settings.mode && activity.settings.mode.length > 0) {
                    mode = activity.settings.mode
                }

                // console.log('activity.mode:', activity.mode)
                // console.log('mode:', mode)

                // 创建task
                let task_data = {
                    "type": "common",
                    "activityId": query.activity_id,
                    "taskId": taskId,
                    "triggerBy": "remote_test",
                    "cameraNum": cameras.length * shootCount,
                    "mode": mode,
                    "fileKey": "",
                    "cutconfigs": {},
                    "version": ""
                }
                if (query['from']) {
                    task_data['from'] = query['from']
                }
                await taskService.createTask(task_data);
            }

            switch (activity.settings.camera_setting.trigger) {
                case 'async':
                    /*线性*/

                    let deviceId = query.deviceId || cameras[0].deviceId

                    const socketId = Global.getSocketId(deviceId);
                    // console.log("该deviceid匹配的socketid是:" + socketId)
                    let sentData = {
                        "deviceId": deviceId,
                        "from": query.from,
                        "requestId": query.requestId,
                        "param": {
                            "action": "make_shoot",
                            "order": query.order || 0,
                            /////////////
                            "record": cameras[query.order].collect || {},
                            "recognition": cameras[query.order].trigger_type.model || {},
                            "video_source": cameras[query.order].video_source || {},
                            "time": query.time || Date.now(),
                            ///////////////
                            "taskId": taskId
                        }
                    }
                    if (socketId) {
                        /* 通知mome开始拍摄 */
                        console.log('已通知拍摄:', deviceId)
                        console.log('sentData:', JSON.stringify(sentData))
                        Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
                    }
                    break
                case 'sync':
                    /* 同步 */

                    // 如果是有辨识盒的, 直接发给deviceId_python
                    let recognition_cameras = activity.settings.camera_setting.recognition_cameras
                    if (recognition_cameras) {
                        for (let i = 0; i < recognition_cameras.length; i++) {
                            console.log('deviceId:', recognition_cameras[i].deviceId)
                            const socketId = Global.getSocketId(recognition_cameras[i].deviceId);
                            console.log("该deviceid匹配的socketid是:" + socketId)
                            let sentData = {
                                "deviceId": recognition_cameras[i].deviceId,
                                "from": query.from,
                                "requestId": query.requestId,
                                "param": {
                                    "action": "make_shoot",
                                    "order": i + (query.multi_shoot - 1) * cameras.length,
                                    /////////////
                                    "record": recognition_cameras[i].collect || {},
                                    "recognition": recognition_cameras[i].trigger_type.model || {},
                                    "video_source": recognition_cameras[i].video_source || {},
                                    "time": query.time || Date.now(),
                                    ///////////////
                                    "taskId": taskId
                                }
                            }
                            if (socketId) {
                                /* 通知mome开始拍摄 */
                                console.log('已通知python拍摄:', recognition_cameras[i].deviceId)
                                console.log('sentData:', JSON.stringify(sentData))
                                Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
                            }
                        }
                    }

                    // 如果没有辨识盒的, 直接发给deviceId
                    else {
                        for (let i = 0; i < cameras.length; i++) {
                            console.log('deviceId:', cameras[i].deviceId)
                            const socketId = Global.getSocketId(cameras[i].deviceId);
                            // console.log("该deviceid匹配的socketid是:" + socketId)
                            let sentData = {
                                "deviceId": cameras[i].deviceId,
                                "from": query.from,
                                "requestId": query.requestId,
                                "param": {
                                    "action": "make_shoot",
                                    "order": i + (query.multi_shoot - 1) * cameras.length,
                                    /////////////
                                    "record": cameras[i].collect || {},
                                    "recognition": cameras[i].trigger_type.model || {},
                                    "video_source": cameras[i].video_source || {},
                                    "time": query.time || Date.now(),
                                    ///////////////
                                    "taskId": taskId
                                }
                            }
                            if (socketId) {
                                /* 通知mome开始拍摄 */
                                console.log('已通知拍摄:', cameras[i].deviceId)
                                console.log('sentData:', JSON.stringify(sentData))
                                Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
                            }
                        }
                    }

                    break
                case 'random':
                    // 随机
                    break
                default:
                    break
            }

            ret.code = 0;
            ret.result = {'taskId': taskId};
            return ret

        }
    }

    /* cloud admin 结束拍摄 */
    async endMove(query) {

        console.log('结束拍摄query:', query)
        let ret: RetObject = new RetObject;
        if (!query.activity_id) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }

        let activity = await activitydb.findOne({'activity_id': query.activity_id}, {"settings": 1, "_id": 0})
        if (activity && activity.settings && activity.settings.camera_setting && activity.settings.camera_setting.cameras) {

            console.log(activity.settings.camera_setting.trigger + '结束拍摄')
            let cameras = activity.settings.camera_setting.cameras

            for (let i = 0; i < cameras.length; i++) {
                console.log('deviceId:', cameras[i].deviceId)
                const socketId = Global.getSocketId(cameras[i].deviceId);
                let sentData = {
                    "deviceId": cameras[i].deviceId,
                    "from": query.from,
                    "requestId": query.requestId,
                    "param": {
                        "action": "end_shoot",
                        "time": Date.now(),
                        "record": cameras[i].collect || {},
                        "recognition": cameras[i].trigger_type.model || {},
                        "video_source": cameras[i].video_source || {},
                    }
                }

                if (socketId) {
                    /* 通知mome开始拍摄 */
                    console.log('已通知结束录影:', cameras[i].deviceId)
                    Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
                }
            }
        }

    }

    /* cloud admin 通知提示屏倒计时 */
    async startPrompt(query) {

        console.log('倒计时query:', query)
        let ret: RetObject = new RetObject;
        if (!query.activity_id) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }

        if (query.from) {
            query['time'] = Date.now()
            Global.setPromptData(query.from, query);
        }

        let activity = await activitydb.findOne({'activity_id': query.activity_id}, {"settings": 1, "_id": 0})
        if (activity && activity.settings && activity.settings.prompt_setting) {
            console.log(activity.settings.prompt_setting.prompt_id + '倒计时')
            const socketId = Global.getSocketId(activity.settings.prompt_setting.prompt_id);
            let sentData = {
                "deviceId": activity.settings.prompt_setting.prompt_id,
                "from": query.from,
                "requestId": query.requestId,
                "param": {
                    "action": "start_prompt",
                }
            }
            if (socketId) {
                /* 通知mome开始拍摄 */
                console.log('已通知', activity.settings.prompt_setting.prompt_id, "开始倒计时")
                console.log('sentData:', JSON.stringify(sentData))
                Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
            }
            ret.code = 0;
            ret.result = {'deviceId': activity.settings.prompt_setting.prompt_id};
            return ret
        }
        ret.code = 1
        ret.description = "未找到该活动的提示屏"
        return ret
    }

    /* cloud admin 通知提示屏停止倒计时 */
    async stopPrompt(query) {

        console.log('取消倒计时query:', query)
        let ret: RetObject = new RetObject;
        if (!query.activity_id) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }

        if (query.from) {
            query['time'] = Date.now()
            Global.setPromptData(query.from, query);
        }

        let activity = await activitydb.findOne({'activity_id': query.activity_id}, {"settings": 1, "_id": 0})
        if (activity && activity.settings && activity.settings.prompt_setting) {
            console.log(activity.settings.prompt_setting.prompt_id + '倒计时')
            const socketId = Global.getSocketId(activity.settings.prompt_setting.prompt_id);
            let sentData = {
                "deviceId": activity.settings.prompt_setting.prompt_id,
                "from": query.from,
                "requestId": query.requestId,
                "param": {
                    "action": "stop_prompt",
                }
            }
            if (socketId) {
                /* 通知mome开始停止倒计时 */
                console.log('已通知', activity.settings.prompt_setting.prompt_id, "停止倒计时")
                console.log('sentData:', JSON.stringify(sentData))
                Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
            }
            ret.code = 0;
            ret.result = {'deviceId': activity.settings.prompt_setting.prompt_id};
            return ret
        }
        ret.code = 1
        ret.description = "未找到该活动的提示屏"
        return ret
    }

    /* 采集盒压力测试 */
    async pressureTest(data) {

        console.log('压力测试data:', data)
        let ret: RetObject = new RetObject;
        if (!data.activity_id || !data.count || !data.wait) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }

        let activity = await activitydb.findOne({'activity_id': data.activity_id}, {"settings": 1, "_id": 0})
        if (activity) {

            for (let i = 0; i < data.count; i++) {

                // let makeMovieQuery = {
                //     'activity_id': data.activity_id,
                //     'from': data.from,
                //     'requestId': data.requestId
                // }

                setTimeout(function () {
                    // makeMove(makeMovieQuery)
                    request({
                        url: 'https://iva.siiva.com/activity/make_move?activity_id=' + data.activity_id + '&from=' + data.from + '&requestId=' + data.requestId,
                        method: "GET",
                        json: true
                    }, (error, response, body) => {
                        // console.log('压测:', JSON.stringify(body))
                    })
                }, data.wait * 1000 * (i));
            }

            ret.code = 0
            ret.description = "开始测试"
            return ret
        }

        ret.code = 1
        ret.description = "未找到该活动"
        return ret


    }

    /* 给main.ts接收make_shoot_response用的 */
    async receiveMakeShoot(data) {

        // console.log('收到post_make_shoot_data:', JSON.stringify(data))
        let ret: RetObject = new RetObject
        if (!data.deviceId) {
            ret.code = 1
            ret.description = "deviceId 不能为空"
            return ret
        }

        if (data.state == 'uploaded' && data.fileName && data.fileName.length > 0) {
            // 一台设备已完成
            console.log(data.from + "上传完成啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊")
            let taskId = data.fileName.split('_')[0] + '_' + data.fileName.split('_')[1]
            let task = await taskdb.findOne({'task.taskId': taskId});
            if (!task) {
                taskId = data.fileName.split('_')[0] + '_' + data.fileName.split('_')[1] + '_' + data.fileName.split('_')[2]
                task = await taskdb.findOne({'task.taskId': taskId});
            }

            let bindActivity = await activitydb.findOne({'activity_id': task.activity_id})
            if (!bindActivity) {
                ret.code = 1;
                ret.description = "未找到该设备绑定的活动";
                return ret;
            }

            let res = await activitydb.update({'activity_id': bindActivity.activity_id}, {
                '$addToSet': {
                    'state.file_state': {
                        'deviceId': data.from,
                        'device_state': data.state,
                        'fileName': data.fileName
                    }
                }
            });

            let afterUpdateActivity = await activitydb.findOne({'activity_id': task.activity_id})

            await taskdb.findOneAndUpdate({'task.taskId': taskId}, {
                '$addToSet': {
                    'task.files': data.fileName
                }
            });

            task = await taskdb.findOne({'task.taskId': taskId});
            let taskFiles = task.task.files || []
            let cameraNum = task.task.cameraNum || 1
            if (taskFiles.length == cameraNum) {
                // 通知该task data.ready
                let readyData = {'taskId': taskId, 'files': taskFiles}
                let taskService = new TaskService();
                let ret = await taskService.updateTaskToDataReady(readyData);

            }

            switch (bindActivity.settings.camera_setting.trigger) {
                case 'async': {
                    /* 线性 */
                    // 通知下一只拍摄
                    // let afterUpdateActivity = await activitydb.findOne({
                    //     'settings.camera_setting.cameras.deviceId': data.from,
                    //     'state.activity_state': 'activity_start'
                    // })
                    let shootCount = afterUpdateActivity.settings.camera_setting.shoot_count || 1
                    let cameraCount = afterUpdateActivity.settings.camera_setting.cameras.length || 0
                    let state = afterUpdateActivity.state.file_state || []

                    // let taskId = data.fileName.split('_')[0] + '_' + data.fileName.split('_')[1]
                    // if (afterUpdateActivity && afterUpdateActivity.settings && afterUpdateActivity.settings.provider && afterUpdateActivity.settings.provider.mate && afterUpdateActivity.settings.provider.mate == 'wepark-oss') {
                    // 根据wepark的要求文件名需要是, wepark[uid]_[fid]_[timestamp].mp4, 所以wepark的taskId⬇(不过wepark用到的是同步拍摄, 不会到这里)
                    //     taskId = data.fileName.split('_')[0] + '_' + data.fileName.split('_')[1] + '_' + data.fileName.split('_')[2]
                    // }

                    let files = []
                    if (afterUpdateActivity && state) {
                        for (let i = 0; i < state.length; i++) {
                            if (state[i].device_state == 'uploaded') {
                                files.push(state[i].fileName)
                            }
                        }
                    }

                    if (files.length < cameraCount * shootCount) {
                        this.makeMove({
                            'activity_id': afterUpdateActivity.activity_id,
                            'multi_shoot': Math.floor(files.length / cameraCount) + 1,
                            'deviceId': afterUpdateActivity.settings.camera_setting.cameras[files.length % cameraCount].deviceId || '',
                            'order': files.length,
                            'from': data.deviceId,
                            'requestId': data.requestId,
                            'taskId': taskId
                        })

                        await taskdb.update({
                            'task.taskId': taskId,
                        }, {$set: {"task.files": files}})

                    } else if (files.length == cameraCount * shootCount) {
                        console.log('线性文件都上传完成了, 请data.ready')
                        // 多个机位都完成
                        let readyData = {'taskId': taskId, 'files': files}
                        // -> data.ready
                        let taskService = new TaskService();
                        // let ret = await taskService.updateTaskToDataReady(readyData);
                        await activitydb.update({'activity_id': afterUpdateActivity.activity_id}, {"$set": {'state.activity_state': 'activity_complete'}});

                    }

                }

                    break
                case 'sync': {
                    /* 同步 */
                    // let afterUpdateActivity = await activitydb.findOne({
                    //     'settings.camera_setting.cameras.deviceId': data.from,
                    //     'state.activity_state': 'activity_start'
                    // })
                    // let taskId = data.fileName.split('_')[0] + '_' + data.fileName.split('_')[1]
                    // if (afterUpdateActivity && afterUpdateActivity.settings && afterUpdateActivity.settings.provider && afterUpdateActivity.settings.provider.mate && afterUpdateActivity.settings.provider.mate == 'wepark-oss') {
                    // 根据wepark的要求文件名需要是, wepark[uid]_[fid]_[timestamp].mp4, 所以wepark的taskId⬇
                    //     taskId = data.fileName.split('_')[0] + '_' + data.fileName.split('_')[1] + '_' + data.fileName.split('_')[2]
                    // }
                    let files = []
                    let state = afterUpdateActivity.state.file_state || []
                    if (afterUpdateActivity && state) {
                        for (let i = 0; i < state.length; i++) {
                            if (state[i].device_state == 'uploaded') {
                                files.push(state[i].fileName)
                            }
                        }
                    }

                    let shootCount = afterUpdateActivity.settings.camera_setting.shoot_count
                    let cameraCount = afterUpdateActivity.settings.camera_setting.cameras.length
                    /* 此时表示所有的机位上传了cameras.length的整数倍次文件 */
                    if (files.length > 0 && files.length % cameraCount == 0 && files.length < cameraCount * shootCount && !afterUpdateActivity.settings.camera_setting.start_signal) {
                        // 通知继续拍摄
                        console.log('请拍第' + (files.length / cameraCount + 1) + '轮视频')
                        this.makeMove({
                            'activity_id': bindActivity.activity_id,
                            // 'multi_shoot': files.length / cameraCount,
                            'multi_shoot': Math.floor(files.length / cameraCount) + 1,
                            'from': data.deviceId,
                            'requestId': data.requestId,
                            'taskId': taskId
                        })
                        await taskdb.update({
                            'task.taskId': taskId,
                        }, {$set: {"task.files": files}})
                    }

                    /* 此时表示所有的机位上传了shoot_count次文件 */
                    if (files.length == cameraCount * shootCount) {
                        console.log('文件都上传完成了, 请data.ready')
                        // 多个机位都完成
                        let readyData = {'taskId': taskId, 'files': files}
                        // -> data.ready
                        let taskService = new TaskService();
                        // let ret = await taskService.updateTaskToDataReady(readyData);
                        await activitydb.update({'activity_id': afterUpdateActivity.activity_id}, {"$set": {'state.activity_state': 'activity_complete'}});

                    }
                }
                    break
                case 'random':
                    /* 随机 */
                    break
                default:
                    break
            }

        }

        ret.code = 0;
        ret.description = "收到post_make_shoot";
        return ret;
    }

    /* 给main.ts套用socket用的 */
    async addCamera(data) {

        console.log('data:', JSON.stringify(data))
        let ret: RetObject = new RetObject
        if (!data.activity_id) {
            ret.code = 1
            ret.description = "activity_id 不能为空"
            return ret
        }

        let activity = await activitydb.findOne({'activity_id': data.activity_id})
        if (!activity) {
            ret.code = 1
            ret.description = "未找到该活动" + data.activity_id
            return ret
        }

        /* 如果绑定了其他活动, 先解绑 */
        let bindActivitys = await activitydb.find({'settings.camera_setting.cameras.deviceId': data.param.deviceId})
        // for (let i = 0; i < bindActivitys.length; i++) {
        //     let res = await activitydb.update({'activity_id': bindActivitys[i].activity_id}, {'$pull': {'settings.camera_setting.cameras': {'deviceId': data.param.deviceId}}});
        // }

        /* 如果绑定了该活动, 先解绑 */
        for (let i = 0; i < bindActivitys.length; i++) {
            if (bindActivitys[i].activity_id == data.activity_id) {
                let res = await activitydb.update({'activity_id': bindActivitys[i].activity_id}, {'$pull': {'settings.camera_setting.cameras': {'deviceId': data.param.deviceId}}});
            }
        }
        // if (onlyActivity && onlyActivity.activity_id == data.activity_id) {
        //     let res = await activitydb.update({
        //         'activity_id': data.activity_id,
        //         'settings.camera_setting.cameras.deviceId': data.param.deviceId
        //     }, {$set: {"settings.camera_setting.cameras.$": data.param}})
        // }

        let update = {
            "$addToSet": {
                'settings.camera_setting.cameras': data.param
            },
            "$set": {
                'account': data.account
            }
        }
        const res = await activitydb.update({'activity_id': data.activity_id}, update);
        ret.code = 0;
        ret.description = "设定在资料库绑定成功, 正在通知mome";
        return ret;
    }

    async setCameras(data) {

        console.log('setCameras data:', JSON.stringify(data))
        let ret: RetObject = new RetObject

        if (!data.collects) {
            ret.code = 1
            ret.description = "collects 不能为空"
            return ret
        }

        let update = {
            "$set": {
                'settings.camera_setting.cameras': data.collects,
                'settings.camera_setting.trigger': data.trigger,
                'settings.camera_setting.direction': data.direction,
                'settings.camera_setting.start_signal': data.start_signal,
                'settings.camera_setting.end_signal': data.end_signal,
                'settings.camera_setting.shoot_count': data.shoot_count,
                'settings.later_setting.record': [],
            }
        }

        // console.log('update:', JSON.stringify(update))
        const res = await activitydb.update({'activity_id': data.activity_id}, update);
        // console.log('update cameras res:', res)

        /* 发送给采集盒 */
        for (let i = 0; i < data.collects.length; i++) {

            let deviceId = data.collects[i].deviceId
            const socketId = Global.getSocketId(deviceId);
            // console.log("该deviceid匹配的socketid是:" + socketId)

            let sentData = {
                "deviceId": deviceId,
                "from": data.from,
                "requestId": data.requestId,
                "param": {
                    "action": "setup",
                    "account": data.account,
                    "activity": {
                        "activity_id": data.activity_id
                    },
                    "video_source": data.collects[i].video_source,
                    "recognition": data.collects[i].trigger_type.model,
                    "record": data.collects[i].collect,
                    // "steps": data.collects[i].steps
                }
            }

            // io.to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
            if (socketId) {
                console.log('发送给:', deviceId)
                console.log('sentData:', JSON.stringify(sentData))
                Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
            }

        }
        ret.code = res.ok == 1 ? 0 : 1
        ret.description = res.ok == 1 ? "资料库写入成功" : "资料库写入失败"
        return ret

    }

    async laterSetting(data) {

        console.log('laterSetting data:', JSON.stringify(data))
        let ret: RetObject = new RetObject

        // if (!data.activity_id || !data.record || !data.source) {
        if (!data.activity_id) {
            ret.code = 1
            ret.description = "缺少参数"
            return ret
        }

        let update = {
            "$set": {
                'settings.later_setting.cut_param': data.cut_param,
                'settings.later_setting.record': data.record,
                'settings.later_setting.source': data.source,
                'settings.later_setting.cut_templates': data.cut_templates,
            }
        }

        // console.log('update:', JSON.stringify(update))
        const res = await activitydb.update({'activity_id': data.activity_id}, update);

        ret.code = 0
        ret.description = "写入资料库成功"
        return ret

    }

    async restartCollect(query) {

        console.log('restartCollect query:', JSON.stringify(query))
        let ret: RetObject = new RetObject

        if (!query.activity_id && !query.device_id) {
            ret.code = 1
            ret.description = "activity_id和device_id不能同时为空"
            return ret
        }

        if (query.device_id) {
            const socketId = Global.getSocketId(query.device_id);
            let sentData = {
                "deviceId": query.device_id,
                "from": query.from,
                "requestId": query.requestId,
                "param": {
                    "action": "restart"
                }
            }
            if (socketId) {
                /* 通知mome开始拍摄 */
                console.log('已通知:', query.device_id, "重启")
                console.log('sentData:', JSON.stringify(sentData))
                Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
            }
            ret.code = 0
            ret.description = "已通知" + query.device_id + "重启"
            return ret
        }

        if (query.activity_id) {
            let activity = await activitydb.findOne({'activity_id': query.activity_id}, {
                "settings.camera_setting.cameras.deviceId": 1,
                "_id": 0
            });

            if (activity && activity.settings && activity.settings.camera_setting && activity.settings.camera_setting.cameras) {

                let cameras = activity.settings.camera_setting.cameras

                let deviceIdStr = ''

                for (let i = 0; i < cameras.length; i++) {

                    deviceIdStr += cameras[i].deviceId
                    if (i < cameras.length - 1) {
                        deviceIdStr += ','
                    }

                    const socketId = Global.getSocketId(cameras[i].deviceId);
                    let sentData = {
                        "deviceId": cameras[i].deviceId,
                        "from": query.from,
                        "requestId": query.requestId,
                        "param": {
                            "action": "restart"
                        }
                    }
                    if (socketId) {
                        console.log('已通知:', cameras[i].deviceId, "重启")
                        console.log('sentData:', JSON.stringify(sentData))
                        Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
                    }
                }

                ret.code = 0
                ret.description = "已通知" + deviceIdStr + "重启"
                return ret

            }
        }

        ret.code = 0
        ret.description = "未找到"
        return ret
    }

    async uploadTest(query) {
        let activity = await activitydb.findOne({'activity_id': query.activity_id}, {"settings": 1, "_id": 0})
        let cameras = activity.settings.camera_setting.cameras
        for (let i = 0; i < cameras.length; i++) {
            const socketId = Global.getSocketId(cameras[i].deviceId);
            let sentData = {
                "deviceId": cameras[i].deviceId,
                "from": query.from,
                "requestId": query.requestId,
                "param": {
                    "action": "upload_circle_file",
                    "order": i,
                    "time": query.time || Date.now(),
                    "duration": query.duration
                }
            }
            if (socketId) {
                console.log('已通知上传circle_file:', cameras[i].deviceId)
                console.log('sentData:', JSON.stringify(sentData))
                Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
            }
        }


    }


}