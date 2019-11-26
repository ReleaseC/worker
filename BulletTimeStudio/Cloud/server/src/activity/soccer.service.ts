import { Component } from '@nestjs/common';
import { SOCKET_EVENT, SOCCER_EVENT } from '../common/socket.interface';
import { soccorDbSiteSetting, bindingDeviceTableDb, goalEvent, accountdb } from '../common/db.service';
import { TaskService } from '../task/task.service';
import { SiteService } from '../site/site.service';
import { fileMgrCmd } from '../../lib/ufile/filemgr/filemgr';
import * as Socket from 'socket.io';
import { dbTools } from '../common/db.tools';
import { Schema } from 'mongoose';
import { stringify } from 'querystring';
import {HttpClientCallback} from "../../lib/oss/httpclient.interface";
var moment = require('moment');

const redis = require('redis');

@Component()
export class SoccerService {
  connecntMap = new Map<Socket, string[]>();
  Promise = require('bluebird');

  client = this.Promise.promisifyAll(redis.createClient());
  goalMap = new Object(); // 记录未发送到vc的goal_event
  deviceIdSocketIdMap = new Object(); // 记录socketId 和 deviceId 对应关系
  tempSocket : any;

  constructor() {
  }

  initService(io, socket) {
    this.tempSocket = io;
    /**
     * @api {socket} /SOCCER_EVENT/SITES_MATCH_EVENT (Client -> Server) Soccer socket event SITES_MATCH_EVENT
     * @apiVersion 1.1.0
     * @apiName SITES_MATCH_EVENT
     * @apiGroup SOCCER_EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiParam {String} data.role Client account: data.role
     * @apiParam {String} data.deviceId Client password: data.deviceId
     * @apiParam {String} data.camera Client camera: data.camera
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.SITES_MATCH_EVENT, async (data, cb) => {
      console.log('Login=' + JSON.stringify(data));
      const device = {
        role: data.role,
        deviceId: data.deviceId,
        camera: data.camera
      };

      // // check binding
      // const isDeviceBiding = await soccorDbSiteSetting.findOne({ "deviceConfig.deviceId": data.deviceId, "deviceConfig.role": data.role });

      // // if device has been bound, unbinding this device
      // if (data.role !== 'admin' && isDeviceBiding) {
      //     isDeviceBiding.deviceConfig = isDeviceBiding.deviceConfig.filter(item => {
      //         if (item.deviceId !== data.deviceId) return item;
      //     })
      //     await soccorDbSiteSetting.findOneAndUpdate({ _id: isDeviceBiding._id }, { deviceConfig: isDeviceBiding.deviceConfig })
      //     socket.leave(isDeviceBiding.siteId)
      //     io.to(isDeviceBiding.siteId).emit(SOCCER_EVENT.SITES_CONFIG_EVENT, isDeviceBiding.deviceConfig)
      //     // console.log(`${isDeviceBiding}`);
      // }

      // If device has not been added, check it before and add it
      // 1. Check binding
      // ToDo: temp remove
      // let permitLogin = true;
      // let bindingTable = await bindingDeviceTableDb.find({ deviceId: data.deviceId });
      // if (bindingTable.length > 0){
      //     // If enter here means this device had been bind
      //     permitLogin = false;
      //     for(let i = 0; i < bindingTable.length; i++){
      //         // console.log('bindingTable['+i+']=' + bindingTable[i]);
      //         if((bindingTable[i].siteId === data.siteId) && (bindingTable[i].role === data.role)){
      //             // Match the binding table, so permit login
      //             permitLogin = true;
      //             break;
      //         }
      //     }
      // }

      // if(!permitLogin){
      //     console.log(data.deviceId + ' login denied on ' + data.siteId);
      //     // Join the socket room for sending login denied event
      //     socket.join(data.siteId);
      //     io.to(data.siteId).emit(SOCCER_EVENT.EVENT_LOGIN_DENIED, "You can not pass!")
      //     return;
      // }

      // 2. Add device in soccor_site_setting deviceConfig

      //--------------------------------------- unbind device with other sites and bind the new device
      // No need update
      // await soccorDbSiteSetting.update({ siteId: data.siteId }, { $pull: { deviceConfig: { role: data.role } } });
      // await soccorDbSiteSetting.update({}, { $pull: { deviceConfig: { deviceId: data.deviceId } } }, { multi: true });
      // await soccorDbSiteSetting.update({ siteId: data.siteId }, { $addToSet: { deviceConfig: { role: data.role, deviceId: data.deviceId, position: data.position } } }, {},
      //     (err, raw) => dbTools.execSQLCallback({
      //         method: 'update',
      //         err,
      //         raw,
      //         fileName: 'soccer.service.ts',
      //         funcName: 'on(SOCCER_EVENT.SITES_MATCH_EVENT)'
      //     }));
      //---------------------------------------------------

      let soccerSite = await soccorDbSiteSetting.findOne({ siteId: data.siteId });
      // if (soccerSite.deviceConfig.find(item => { return (item.deviceId === data.deviceId && item.role === data.role) }) === undefined) {
      //     // console.log('admin soccerSite.deviceConfig=' + soccerSite.deviceConfig);
      //     soccerSite.deviceConfig.push(device)
      // }
      // soccerSite = await soccorDbSiteSetting.findOneAndUpdate({ _id: soccerSite._id }, { deviceConfig: soccerSite.deviceConfig }, { new: true })
      // console.log('soccerSite=' + JSON.stringify(soccerSite));
      socket.join(data.siteId);
      if (cb) cb('login success in room:' + data.siteId);
      if (!soccerSite || !soccerSite.deviceConfig) {
        // console.log(`soccer.service.ts >>> on SITES_MATCH_EVENT >>>`);
        // console.log(soccerSite);
        console.log('siteId无效或deviceConfig无效 因此退出回调');
        return;
      }
      io.to(data.siteId).emit(SOCCER_EVENT.SITES_CONFIG_EVENT, soccerSite.deviceConfig);
      //console.log(`${soccerSite}`);

      // 3. Save socket info, for admin, one socket two siteId
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
    });

    /**
     * @api {socket} /SOCCER_EVENT/SITES_UNMATCH_EVENT (Client -> Server) Soccer socket event SITES_UNMATCH_EVENT
     * @apiVersion 1.1.0
     * @apiName SITES_UNMATCH_EVENT
     * @apiGroup SOCCER_EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiParam {String} data.deviceId Client deviceId: data.deviceId
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.SITES_UNMATCH_EVENT, async (data) => {
      console.log('device=' + JSON.stringify(data));
      const isDeviceBiding = await soccorDbSiteSetting.findOne({ 'deviceConfig.deviceId': data.deviceId });
      if (isDeviceBiding) {
        isDeviceBiding.deviceConfig = isDeviceBiding.deviceConfig.filter(item => {
          if (item.deviceId !== data.deviceId) return item;
        });
        await soccorDbSiteSetting.findOneAndUpdate({ _id: isDeviceBiding._id }, { deviceConfig: isDeviceBiding.deviceConfig });
        socket.leave(data.siteId);
        io.to(data.siteId).emit(SOCCER_EVENT.SITES_CONFIG_EVENT, isDeviceBiding.deviceConfig);
        // console.log(`${isDeviceBiding}`);
      }
    });

    /**
     * @api {socket} /SOCCER_EVENT/SITES_CONFIG_EVENT (Client -> Server) Soccer socket event SITES_CONFIG_EVENT
     * @apiVersion 1.1.0
     * @apiName SITES_CONFIG_EVENT
     * @apiGroup SOCCER_EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.SITES_CONFIG_EVENT, async (data) => {
      console.log('site=' + JSON.stringify(data));
      const soccerSite = await soccorDbSiteSetting.findOne({ siteId: data.siteId });
      io.to(data.siteId).emit(SOCCER_EVENT.SITES_CONFIG_EVENT, soccerSite.deviceConfig);
    });


    /**
     * @api {socket} /SOCCER_EVENT/GOAL_EVENT (Admin -> Server) Soccer socket event GOAL_EVENT
     * @apiVersion 1.1.0
     * @apiName GOAL_EVENT
     * @apiGroup SOCCER_EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.GOAL_EVENT, async (data) => {
      console.log('admin->server, goal data:' + JSON.stringify(data));
      this.tempSocket = io;
      let site = await soccorDbSiteSetting.findOne({ siteId: data.siteId });
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

      // io.sockets.emit(SOCCER_EVENT.PREPARE_UPLOAD_EVENT, res);
      // io.sockets.emit(SOCCER_EVENT.EVENT_GOAL_SUCCESS_ACK, res); // 直接写socket.emit() 不行

      this.goalMap[data.taskId] = res;

      socket.emit(SOCCER_EVENT.EVENT_GOAL_SUCCESS_ACK, res);// send to current request socker client
      socket.broadcast.to(data.siteId).emit(SOCCER_EVENT.PREPARE_UPLOAD_EVENT, res); // sending to all clients in 'data.siteId' room(channel) except sender

      let goal = new goalEvent;
      goal.siteId = data.siteId;
      goal.taskId = data.taskId;
      goal.timestamp = data.timestamp;
      goal.save();
    });


    /**
     * @api {socket} /SOCCER_EVENT/EVENT_CAM_GOAL_ACK (VC -> Server) Soccer socket event EVENT_CAM_GOAL_ACK
     * @apiVersion 1.1.0
     * @apiName EVENT_CAM_GOAL_ACK
     * @apiGroup SOCCER_EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.EVENT_CAM_GOAL_ACK, async (data) => {
      console.log('vc收到goal, data:' + JSON.stringify(data));
      this.tempSocket = io;
      let res = this.goalMap[data.taskId];
      if (!res){
        return
      }
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
        // 干掉goal_evens
        let result = await goalEvent.update({ 'taskId': data.taskId }, { $set: { 'del': true } });
        // 干掉goalMap中未送达到VC的goal_event
        delete this.goalMap[data.taskId];
      }
    });


    /**
     * @api {socket} /SOCCER_EVENT/SINGLE_VIDEO_UPLOADED_EVENT (Client -> Server) Soccer socket event SINGLE_VIDEO_UPLOADED_EVENT
     * @apiVersion 1.1.0
     * @apiName SINGLE_VIDEO_UPLOADED_EVENT
     * @apiGroup SOCCER_EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiParam {String} data.taskId Client taskId: data.taskId
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.SINGLE_VIDEO_UPLOADED_EVENT, (data) => {
      console.log('Single video uploaded goal data=' + JSON.stringify(data));
      // ToDo: data should have siteId and index, only master device can deal with it.
      //socket.broadcast.emit(SOCCER_EVENT.SINGLE_VIDEO_UPLOADED_EVENT, data);
      io.to(data.siteId).emit(SOCCER_EVENT.SINGLE_VIDEO_UPLOADED_EVENT, data);

      // 去检查同一任务下其他文件是否都上传完成了，如果上传完成了则触发更新任务状态soccerUpdateTask
      // 文件是否全部上传完成的判断条件为videoCamCount 是否与 fileName 数量是否相等
      let taskService = new TaskService();

      if (taskService.isAllFilesUpdated(data.taskId)) {
        //  为真则表示文件都上传了
        this.soccerUpdateTask();
      }
    });

    /**
     * @api {socket} /SOCCER_EVENT/EVENT_REMOTE_SHOT_GETDEVICES (Client -> Server) Soccer socket event EVENT_REMOTE_SHOT_GETDEVICES
     * @apiVersion 1.1.0
     * @apiName EVENT_REMOTE_SHOT_GETDEVICES
     * @apiGroup SOCCER_EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.EVENT_REMOTE_SHOT_GETDEVICES, (data) => {
      console.log('remote shot get devices data=' + JSON.stringify(data));
      // data should have siteId
      io.to(data.siteId).emit(SOCCER_EVENT.EVENT_REMOTE_SHOT_GETDEVICES, data);
    });

    /**
     * @api {socket} /SOCCER_EVENT/EVENT_REMOTE_SHOT (Client -> Server) Soccer socket event EVENT_REMOTE_SHOT
     * @apiVersion 1.1.0
     * @apiName EVENT_REMOTE_SHOT
     * @apiGroup SOCCER_EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.EVENT_REMOTE_SHOT, (data) => {
      console.log('remote shot data=' + JSON.stringify(data));
      socket.join(data.siteId);
      // data should have siteId
      io.to(data.siteId).emit(SOCCER_EVENT.EVENT_REMOTE_SHOT, data);
    });

    /**
     * @api {socket} /SOCCER_EVENT/EVENT_REMOTE_SHOT_GET_PICS (Client -> Server) Soccer socket event EVENT_REMOTE_SHOT_GET_PICS
     * @apiVersion 1.1.0
     * @apiName EVENT_REMOTE_SHOT_GET_PICS
     * @apiGroup SOCCER_EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.EVENT_REMOTE_SHOT_GET_PICS, (data) => {
      console.log('remote shot get pics');
      console.log('remote shot get pics, siteId=' + data.siteId);
      console.log('remote shot get pics, index=' + data.index);
      // data should have siteId
      io.to(data.siteId).emit(SOCCER_EVENT.EVENT_REMOTE_SHOT_GET_PICS, data);
    });

    /**
     * @api {socket} /SOCCER_EVENT/EVENT_HEARTBEAT (Client -> Server) Soccer socket event EVENT_HEARTBEAT
     * @apiVersion 1.1.0
     * @apiName EVENT_HEARTBEAT
     * @apiGroup SOCCER_git EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.EVENT_HEARTBEAT, async (data) => {

      // console.log("heart_beat:", JSON.stringify(data));

      if (data && data.deviceId && socket && socket.id) {
        this.deviceIdSocketIdMap[data.deviceId] = socket.id;
      }

      let siteService = new SiteService();
      if (data.role == 'admin') {
        const ret = await siteService.setHeartbeatRedis(data);
        socket.broadcast.emit(SOCCER_EVENT.EVENT_HEARTBEAT, data);
      } else {
        // 增加deviceConfig过滤
        let site = await soccorDbSiteSetting.findOne({ siteId: data.siteId });
        if (site && site.deviceConfig) {
          for (let i = 0; i < site.deviceConfig.length; i++) {
            if (site.deviceConfig[i].deviceId == data.deviceId) {
              const ret = await siteService.setHeartbeatRedis(data);
              socket.broadcast.emit(SOCCER_EVENT.EVENT_HEARTBEAT, data);
            }
          }
        }
      }
    });

    /**
     * @api {socket} /SOCCER_EVENT/DISCONNECT (Client -> Server) Soccer socket event DISCONNECT
     * @apiVersion 1.1.0
     * @apiName DISCONNECT
     * @apiGroup SOCCER_EVENT
     * @apiParam {Object} data Client object data
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     *
     */
    socket.on(SOCKET_EVENT.DISCONNECT, async (data, cb) => {
      if (this.connecntMap.get(socket) != undefined) {
        for (let i = 0; i < this.connecntMap.get(socket).length; i++) {
          // console.log(i+"="+JSON.stringify(this.connecntMap.get(socket)[i]));
          socket.broadcast.emit(SOCCER_EVENT.EVENT_DEVICEOFFLINE, this.connecntMap.get(socket)[i]);
        }
      }
    });

    /**
     * @api {socket} /SOCCER_EVENT/EVENT_SOCCER_CMD (Client -> Server) Soccer socket event EVENT_SOCCER_CMD
     * @apiVersion 1.1.0
     * @apiName EVENT_SOCCER_CMD
     * @apiGroup SOCCER_EVENT
     *
     * @apiParam {Object} data Client object data
     * @apiParam {String} data.siteId Client siteId: data.siteId
     * @apiSuccess {Array} return ret.result
     * @apiSuccessExample
     *
     */
    socket.on(SOCCER_EVENT.EVENT_SOCCER_CMD, (data) => {
      console.log('cmd=' + JSON.stringify(data));
      io.to(data.siteId).emit(SOCCER_EVENT.EVENT_SOCCER_CMD, data);
    });
  }

  async soccerUpdateTask() {
    // 1. get all tasks that state is create or abort
      console.log('soccerUpdateTask:')
    let taskService = new TaskService();
    // const time = new Date().toLocaleDateString().replace(/\//g, '-');
    // const time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const time = moment(new Date()).format('YYYY-MM-DD');

    const type = {
      'time': time,
      'sort': true,
      'limit': 0
    };

    let retArr = await taskService.getTaskList(type);

    retArr = retArr.filter((item, index, array) => {
      // return ((item.state === 'create') || (item.state === 'abort'));
      return (item.state === 'create');
    });

    // 2. Check all three videos are uploaded or not
    const retArrLen = retArr.length;
    // console.log(retArrLen + ' tasks need to recheck in ' + time);
    for (let i = 0; i < retArrLen; i++) {
      /* 当前task:  retArr[i].task */
      let retOfFiles = await taskService.get_task_file_lists({taskId: retArr[i].task.taskId});
      let fileLists = retOfFiles.code == 0 ? retOfFiles.result.toString() : retOfFiles.description;
      const fileNameList = fileLists.split('\n');
      fileNameList.pop();

      const body = {
        taskId: retArr[i].task.taskId,
        type: retArr[i].task.type || 'soccer',
        state: retArr[i].task.state || 'create'
      };
      /* 上传完成个数 */
      var fileCompleteCount = 0;
      for (let j = 0; j < fileNameList.length; j++) {
        var tempStr = 'fileName'+(j+1).toString();
        body[tempStr] = fileNameList[j];
        if (fileNameList[j]) {
          fileCompleteCount++
        }
      }
      if (fileCompleteCount == retArr[i].task.cameraNum){
        body["state"] = 'data.ready'
      }
      let r = await taskService.updateTask(body);
    }
  }



  // 每三秒查询一次有哪些goal没有送给 vc
  async sentGoalToVC() {
    console.log('sentGoalToVC:')
    for (var taskId in this.goalMap) {
      let res = this.goalMap[taskId];
      if (res.deviceId_0.length > 0 && this.deviceIdSocketIdMap[res.deviceId_0]) {
        // console.log('this.deviceIdSocketIdMap[res.deviceId_0]:', this.deviceIdSocketIdMap[res.deviceId_0]);
        this.tempSocket.to(this.deviceIdSocketIdMap[res.deviceId_0]).emit(SOCCER_EVENT.PREPARE_UPLOAD_EVENT, this.goalMap[taskId]);
      }
      if (res.deviceId_1.length > 0 && this.deviceIdSocketIdMap[res.deviceId_1]) {
        // console.log('this.deviceIdSocketIdMap[res.deviceId_1]:', this.deviceIdSocketIdMap[res.deviceId_1]);
        this.tempSocket.to(this.deviceIdSocketIdMap[res.deviceId_1]).emit(SOCCER_EVENT.PREPARE_UPLOAD_EVENT, this.goalMap[taskId]);
      }
      if (res.deviceId_2.length > 0 && this.deviceIdSocketIdMap[res.deviceId_2]) {
        // console.log('this.deviceIdSocketIdMap[res.deviceId_2]:', this.deviceIdSocketIdMap[res.deviceId_2]);
        this.tempSocket.to(this.deviceIdSocketIdMap[res.deviceId_2]).emit(SOCCER_EVENT.PREPARE_UPLOAD_EVENT, this.goalMap[taskId]);
      }
    }
  }


}