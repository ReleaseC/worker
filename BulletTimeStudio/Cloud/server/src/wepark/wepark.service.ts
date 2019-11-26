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
    taskdb,
    weparkdb
} from '../common/db.service';
import {activitydb} from '../common/db.service';
import {dbSiteSetting} from '../common/db.service';
import {RetObject} from '../common/ret.component';
import {Model} from 'mongoose';
import {datareportdb} from '../common/db.service';
import * as https from "https";
import {RedisService} from "../common/redis.service";
import * as child from "child_process";
import {ChildProcess, exec} from "child_process";
import {TaskService} from "../task/task.service";
import {SOCKET_EVENT} from "../common/socket.interface";
import {TASK_STATE} from "../task/interface/task.interface";

var http = require('http');
var request = require('request');
const redis = require('redis');
const bluebird = require("bluebird");
const client = bluebird.promisifyAll(redis.createClient());
var moment = require('moment');


@Component()
export class WeparkService {

    async onEvent(data) {

        console.log('receive onEvent:', data)
        let ret = {'result': {}}
        // if (!data.gid || !data.fid || !data.param || !data.param.yinid || !data.param.gameid || !data.param.player || !data.param.event) {
        if (!data.gid || !data.fid || !data.param || !data.param.yinid || !data.param.gameid || !data.param.event) {
            ret['result']['success'] = false;
            ret['result']['reason'] = "请检查参数";
            return ret
        }


        let gid = data.gid // 同一個遊戲的unique id，以辨別同一遊戲的event
        let uid = data.uid || Date.now() // 使用者id，若不知uid，填空字串
        let fid = data.fid // 場地id
        let yinid = data.param.yinid
        let gameid = data.param.gameid
        let player = data.param.player
        // let timestamp = data.param.timestamp.replace(/ /g, '-') // 把空格替换成-
        let timestamp = moment(new Date()).format('YYYYMMDDHHmmss');
        let event = data.param.event // startgame


        // if ( event.indexOf('game:startgame') >=0 && gameid != '!Spot'){
        if ( event.indexOf('game:startround') >=0 && gameid != '!Spot'){
            event = 'startgame'
        }

        if (gameid == '!Spot' && event.indexOf('game:round') >=0 ){
            if (event.length > 11) {
                let round = event.substring(11, event.length)
                console.log('round:', round)
            }
            event = 'game:round'
        }

        if (gameid == '!Spot' && event.indexOf('score') >=0 ){
            if (event.length > 6) {
                let score = event.substring(6, event.length)
                console.log('score:', score)
            }
            // event = 'score'
            event = 'endgame'
        }

        if ( event.indexOf('score:end') >=0 && gameid != '!Spot'){
            event = 'endgame'
        }


        /*
        if ( event.indexOf('game:end') >=0 ){
            event = 'endgame'
        }
        if ( event.indexOf('panel:hit') >=0 ){
            event = 'hit'
            if (event.length > 10) {
                let hitLocation = event.substring(9, event.length)
                console.log('hitLocation:', hitLocation)
            }
        }
        if (event.indexOf('game:startround') >=0){
            // 开始一轮
            console.log('开始一轮')
            if (event.length > 16){
                let roundCount = event.substring(16,event.length)
                console.log('roundCount:', roundCount)
            }
            event = 'game:startround'
        }
        if ( event.indexOf('score') >=0 ){
            if (event.length > 6) {
                let score = event.substring(6, event.length)
                console.log('score:', score)
            }
            event = 'score'
        }
        if ( event.indexOf('game:rount') >=0 ){
            if (event.length > 11) {
                let rount = event.substring(11, event.length)
                console.log('rount:', rount)
            }
        }
        */


        let game_config = "fid:"+data.fid +","+ "gameid:"+data.param.gameid

        let activity = await activitydb.findOne({'settings.camera_setting.start_signal': {$regex: game_config}})
        if (!activity) {
            activity = await activitydb.findOne({'settings.camera_setting.end_signal': {$regex: game_config}})
        }
        if (!activity) {
            ret['result']['success'] = false;
            ret['result']['reason'] = "未找到该活动";
            return ret
        }
        console.log('activity.name:', activity.activity_name)

        const createWepark = new weparkdb({
            gid: gid,
            uid: uid,
            fid: fid,
            create_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            activity_id: activity.activity_id,
            type: 'event',
            param: data.param
        });
        createWepark.save();


        let cameras = activity.settings.camera_setting.cameras || []
        let shootCount = activity.settings.camera_setting.shoot_count || 1

        switch (event) {
            case "game:round":
            case "startgame": {
                // 开始游戏
                console.log('开始游戏')
                // await activitydb.update({'activity_id': activity.activity_id}, {"$set": {'state': {'activity_state':'activity_start', 'file_state':[]}}});
                // let updataActivity = await activitydb.findOne({'activity_id': activity.activity_id});
                // 同步拍摄
                if (activity.settings.camera_setting.trigger == 'sync'){
                    // 通知所有的设备, 拍摄
                    // let state = updataActivity.state.file_state || []
                    // let taskId = activity.activity_id + "_" + Date.now()
                    // let taskId = 'wepark'+uid + "_" + fid + "_" + timestamp
                    let taskId = 'wepark'+uid + "_" + fid + "_" + timestamp

                    // if (state.length == 0){
                        // 创建task
                        // 创建一个 task
                        let taskService = new TaskService();
                        let task_data = {
                            "type": "common",
                            "activityId": activity.activity_id,
                            "taskId": taskId,
                            "triggerBy": "remote_test",
                            "cameraNum": cameras.length * shootCount,
                            "mode": "video",
                            "fileKey": "",
                            "cutconfigs": {},
                            "version": ""
                        }
                        // console.log('task_data:', task_data)
                        await taskService.createTask(task_data);
                        // console.log('res:', JSON.stringify(res))
                    // }


                    /*
                    // let files = []
                    for (let i = 0; i < state.length; i++) {
                        if (state[i].device_state == 'uploaded') {
                            files.push(state[i].fileName)
                            // taskId = state[i].fileName.split('_')[0] + '_' + state[i].fileName.split('_')[1] + '_' + state[i].fileName.split('_')[2]
                        }
                    }
                    */

                    // console.log('state:', state)
                    // console.log('files:', files)
                    // console.log('cameras:', cameras)

                    for (let i = 0; i < cameras.length; i++) {
                        // console.log('deviceId:', cameras[i].deviceId)
                        let socketId = Global.getSocketId(cameras[i].deviceId);
                        let sentData = {
                            "deviceId": cameras[i].deviceId,
                            "from": data.gid,
                            "requestId": data.gid,
                            "param": {
                                "action": "make_shoot",
                                // "order": i + files.length,
                                "order": i,
                                /////////////
                                "record": cameras[i].collect || {},
                                "recognition": cameras[i].trigger_type.model || {},
                                "video_source": cameras[i].video_source || {},
                                "time": Date.now(),
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

            }
                break;
            /*
            // case "hit":
            case "game:startround":
                console.log('拍摄')
                // 5次 data.ready
                // shootCount

                if (activity.settings.camera_setting.trigger == 'sync'){
                    // 通知所有的设备, 拍摄

                    let state = activity.state.file_state || []
                    // let taskId = activity.activity_id + "_" + Date.now()
                    let taskId = 'wepark'+uid + "_" + fid + "_" + timestamp

                    if (state.length == 0){
                        // 创建task
                        // 创建一个 task
                        let taskService = new TaskService();
                        let task_data = {
                            "type": "common",
                            "activityId": activity.activity_id,
                            "taskId": taskId,
                            "triggerBy": "remote_test",
                            "cameraNum": cameras.length * shootCount,
                            "mode": "video",
                            "fileKey": "",
                            "cutconfigs": {},
                            "version": ""
                        }
                        await taskService.createTask(task_data);
                    }


                    let files = []
                    for (let i = 0; i < state.length; i++) {
                        if (state[i].device_state == 'uploaded') {
                            files.push(state[i].fileName)
                            taskId = state[i].fileName.split('_')[0] + '_' + state[i].fileName.split('_')[1] + '_' + state[i].fileName.split('_')[2]
                        }
                    }

                    for (let i = 0; i < cameras.length; i++) {
                        console.log('deviceId:', cameras[i].deviceId)
                        const socketId = Global.getSocketId(cameras[i].deviceId);
                        let sentData = {
                            "deviceId": cameras[i].deviceId,
                            "from": data.gid,
                            "requestId": data.gid,
                            "param": {
                                "action": "make_shoot",
                                "order": i + files.length,
                                "taskId": taskId
                            }
                        }
                        if (socketId) {
                            // 通知mome开始拍摄
                            console.log('已通知拍摄:', cameras[i].deviceId)
                            Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
                        }
                    }
                }
                break;
                */

            case "endgame":
            case "score":{
                // 得到一轮分数或总分数, 通知mome, 停止拍摄
                console.log('结束游戏')
                for (let i = 0; i < cameras.length; i++) {
                    console.log('deviceId:', cameras[i].deviceId)
                    const socketId = Global.getSocketId(cameras[i].deviceId);
                    let sentData = {
                        "deviceId": cameras[i].deviceId,
                        "from": data.gid,
                        "requestId": data.gid,
                        "param": {
                            "action": "end_shoot",
                            "time": Date.now(),
                            "record": cameras[i].collect || {},
                            "recognition": cameras[i].trigger_type.model || {},
                            "video_source": cameras[i].video_source || {},
                        }
                    }

                    if (socketId) {
                        /* 通知mome停止拍摄 */
                        console.log('已通知停止拍摄:', cameras[i].deviceId)
                        console.log('sentData:', sentData)
                        Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
                    }
                }
            }
            /*
            case "endgame": {
                //结束游戏
                // data.ready
                console.log('结束游戏')
                let state = activity.state.file_state || []
                let taskId = ""
                let files = []
                for (let i = 0; i < state.length; i++) {
                    if (state[i].device_state == 'uploaded') {
                        files.push(state[i].fileName)
                        taskId = state[i].fileName.split('_')[0] + '_' + state[i].fileName.split('_')[1]
                    }
                }
                let readyData = {'taskId': taskId, 'files': files}
                let taskService = new TaskService();
                let ret = await taskService.updateTaskToDataReady(readyData);

            }
                break;
                */
            default:
                // ret['result']['success'] = false;
                // ret['result']['reason'] = '未找到'+event+'事件';
                // return ret;
        }


        ret['result']['success'] = true;
        ret['result']['reason'] = '';
        return ret;
    }

    async onUserEvent(data) {

        console.log('receive  onUserEvent:', data)
        let ret = {'result': {}}
        if (!data.uid || !data.fid || !data.action) {
            ret['result']['success'] = false;
            ret['result']['reason'] = "请检查参数";
            return ret
        }

        let uid = data.uid
        let fid = data.fid
        let action = data.action   // enter/exit
        let timestamp = data.timestamp


        const createWepark = new weparkdb({
            uid: uid,
            fid: fid,
            create_time: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            action: action,
            timestamp: timestamp,
            type: 'user_event',
        });
        createWepark.save();

        switch (action) {
            case "enter":
                // 进入
                break;
            case "exit":
                //离开
                break;
            default:
                break;
        }

        ret['result']['success'] = true;
        ret['result']['reason'] = '';
        return ret;
    }


}