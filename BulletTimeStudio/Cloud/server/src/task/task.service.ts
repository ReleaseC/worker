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
import {MOME_EVENT, SOCKET_EVENT, LOCAL_FILE_EVENT} from '../common/socket.interface';
import {Model} from 'mongoose';
import * as mongoose from 'mongoose';
import {SiteService} from './site.service';
import {TASK_STATE} from './interface/task.interface';
import axios from 'axios';
import {WechatModule} from '../wechat/wechat.module';

const request = require('request');

import {
    activitydb,
    datareportdb,
    order,
    taskdb,
    weparkdb,
    dbSiteSetting,
    soccorDbSiteSetting,
    wechatdb
} from '../common/db.service';
import {RetObject} from '../common/ret.component';
import {fileMgrCmd} from '../../lib/ufile/filemgr/filemgr';
import {dbTools} from '../common/db.tools';

var moment = require('moment');
import httpclient from '../../lib/oss/httpclient';
import {HttpClientBuckets, HttpClientCallback, HttpClientListOptions} from '../../lib/oss/httpclient.interface';

const uuidv1 = require('uuid/v1');
var moment = require('moment');


@Component()
export class TaskService {

    async createTask(data) {

        console.log('createTask data = ' + JSON.stringify(data));
        let ret: RetObject = new RetObject;
        const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        let setting = await soccorDbSiteSetting.findOne({'siteId': data.siteId}) || {};

        switch (data.type) {
            case 'common': {
                const task = {
                    'taskId': data.taskId,
                    'triggerBy': data.triggerBy || 'manual',
                    'cameraNum': data.cameraNum || 1,
                    'mode': data.mode || 'video',
                    'from': data.from,
                    // 'fileName1': data.fileKey,
                    'type': data.type,
                    'local': data.local || false,
                    'version': data.version,
                    'cutconfigs': data.cutconfigs,
                    'detail': []
                };
                const createTask = new taskdb({
                    task: task,
                    activity_id: data.activityId || '',
                    state: TASK_STATE.CREATE,
                    createdAt: date.toLocaleString(),
                    updatedAt: date.toLocaleString(),
                    del: '0',
                    msg: ''
                });
                const result = await createTask.save();
                ret.code = 0;
                ret.description = 'Create new ' + data.type + ' task.';
            }
                break;
            case 'soccer':
            case 'luoke': {
                var outHash = 1315423911, i, ch;
                for (i = data.taskId.length - 1; i >= 0; i--) {
                    ch = data.taskId.charCodeAt(i);
                    outHash ^= ((outHash << 5) + ch + (outHash >> 2));
                }
                let output = outHash & 0x7FFFFFF;
                let temp = output.toString();
                if (temp.length > 8) {
                    temp = temp.substring(0, 8);
                }

                const task = {
                    'siteId': data.siteId,
                    'taskId': data.taskId,
                    'output': temp,
                    'cameraNum': data.cameraNum || 3,
                    'fileName1': '',
                    'fileName2': '',
                    'fileName3': '',
                    'type': data.type,
                    'detail': []
                };
                const createTask = new taskdb({
                    task: task,
                    activity_id: setting.activity_id || '',
                    state: TASK_STATE.CREATE,
                    createdAt: date.toLocaleString(),
                    updatedAt: date.toLocaleString(),
                    del: '0',
                    msg: ''
                });
                const result = await createTask.save();
                ret.code = 0;
                ret.description = 'Create new ' + data.type + ' task.';
            }
                break;
            case 'annoTool': {
                // basketnnoTool
                // console.log('createTask data=' + JSON.stringify(data));
                const uuidv1 = require('uuid/v1');
                const task = {
                    'siteId': data.siteId,
                    'taskId': uuidv1().replace(/-/g, '').substring(0, 8),
                    'team': data.detail.team,
                    'player': data.detail.player,
                    'frame': data.detail.frame,
                    'img': data.detail.img,
                    'mainIndex': data.detail.mainIndex,
                    'childIndex': data.detail.childIndex,
                    'goalType': data.detail.goalType,
                    'type': data.detail.activityType,
                    'isTaskCreated': data.detail.isTaskCreated
                };
                const createTask = new taskdb({
                    task: task,
                    state: TASK_STATE.CREATE,
                    createdAt: date.toLocaleString(),
                    updatedAt: date.toLocaleString(),
                    del: '0',
                    msg: ''
                });
                const result = await createTask.save();
                ret.code = 0;
                ret.result = {
                    'taskId': task.taskId
                };
            }
                break;
            case 'moment':
            case 'multicam': {
                var outHash = 1315423911, i, ch;
                for (i = data.taskId.length - 1; i >= 0; i--) {
                    ch = data.taskId.charCodeAt(i);
                    outHash ^= ((outHash << 5) + ch + (outHash >> 2));
                }
                let output = outHash & 0x7FFFFFF;
                let temp = output.toString();
                if (temp.length > 8) {
                    temp = temp.substring(0, 8);
                }

                // 当拍照片时, type由moment改为common
                if (data.mode == 'photo') {
                    data.type = 'common'
                }

                const task = {
                    'siteId': data.siteId,
                    'taskId': data.taskId,
                    'output': temp,
                    'triggerBy': data.triggerBy || 'manual',
                    'cameraNum': data.cameraNum || 1,
                    'mode': data.mode || 'video',
                    'fileName1': data.fileKey,
                    'type': data.type,
                    'local': data.local || false,
                    'version': data.version,
                    'cutconfigs': data.cutconfigs,
                    'light': data.light || 0,
                    'rmturn': data.rmturn || false,
                    'rmborder': data.rmborder || false,
                    'rmbgm': data.rmbgm || false,
                    'detail': []
                };
                const createTask = new taskdb({
                    task: task,
                    activity_id: data.activityId || '',
                    state: TASK_STATE.CREATE,
                    createdAt: date.toLocaleString(),
                    updatedAt: date.toLocaleString(),
                    del: '0',
                    msg: ''
                });
                const result = await createTask.save();
                ret.code = 0;
                ret.description = 'Create new ' + data.type + ' task.';
            }
                break;
            case 'basketball': {
                var outHash = 1315423911, i, ch;
                for (i = data.taskId.length - 1; i >= 0; i--) {
                    ch = data.taskId.charCodeAt(i);
                    outHash ^= ((outHash << 5) + ch + (outHash >> 2));
                }
                let output = outHash & 0x7FFFFFF;
                let temp = output.toString();
                if (temp.length > 8) {
                    temp = temp.substring(0, 8);
                }

                data.src.bucket = 'siiva-video';
                const task = {
                    'activity_id': data.activity_id,
                    'taskId': data.taskId,
                    'type': data.type,
                    'start_time': date,
                    'option': data.option,
                    'src': data.src,
                    'dst': {
                        'bucket': 'siiva-video-public',
                        'output': data.activity_id + '/' + data.taskId,
                    }
                };
                const createTask = new taskdb({
                    task: task,
                    activity_id: data.activity_id || '', // 先保留直接去掉, cloud_admin或h5页面会不兼容
                    state: TASK_STATE.CREATE,
                    createdAt: date.toLocaleString(),
                    updatedAt: date.toLocaleString(),
                    del: '0',
                    msg: ''
                });
                const result = await createTask.save();
                ret.code = 0;
                ret.description = 'Create new ' + data.type + ' task.';
            }
                break;
            case 'customVideo':
                // console.log('customVideo data=' + JSON.stringify(data));
                const task = {
                    'siteId': '',
                    'taskId': uuidv1().replace(/-/g, '').substring(0, 8),
                    'description': data.description,
                    'video': data.video,
                    'parameter': data.parameter,
                    'type': data.type,
                };
                const createTask = new taskdb({
                    task: task,
                    state: TASK_STATE.CREATE,
                    createdAt: date.toLocaleString(),
                    updatedAt: date.toLocaleString(),
                    del: '0',
                    msg: ''
                });
                const result = await createTask.save();
                ret.code = 0;
                ret.result = {
                    'taskId': task.taskId
                };
                break;
            default: {
                let siteSettings = await dbSiteSetting.findOne({'siteId': data.siteId});
                let task = this.convertTask(data, siteSettings);
                // console.log('task=' + JSON.stringify(task));
                if (task.length > 1) {
                    // Support 多樣版
                    for (let i = 0; i < task.length; i++) {
                        task[i]['param']['template'] = siteSettings['template']['templates'][i] + '.' + siteSettings['template']['type'];
                        //多模板场景视频命名方式
                        let name = siteSettings['template']['templates'][i] + '_' + data.siteId + '_' + data.userId + '_' + data.taskId + '.mp4';
                        task[i]['output']['name'] = name;
                        const createTask = new taskdb({
                            task: task[i],
                            state: TASK_STATE.CREATE,
                            createdAt: date.toLocaleString(),
                            updatedAt: date.toLocaleString(),
                            del: '0',
                            msg: ''
                        });
                        await createTask.save();
                    }
                    ret.code = 0;
                    ret.description = 'Create new ' + data.type + ' tasks, number of tasks:' + task.length;
                } else {
                    // 只有單一樣版
                    const createTask = new taskdb({
                        activity_id: siteSettings.activity_id || '',
                        task: task[0],
                        state: TASK_STATE.CREATE,
                        createdAt: date.toLocaleString(),
                        updatedAt: date.toLocaleString(),
                        del: '0',
                        msg: ''
                    });
                    await createTask.save();
                    ret.code = 0;
                    ret.description = 'Create a new ' + siteSettings['type'] + ' task.';
                }
            }
        }

        // 生成该task的二维码
        request({
            url: 'https://iva.siiva.com/me_photo/qrcode?taskId=' + data.taskId,
            method: "GET",
            json: true
        }, (error, response, body) => {
            // console.log('二维码:', JSON.stringify(body))
        })

        return ret;
    }

    async getTask(data) {
        // console.log('get task==============data:', JSON.stringify(data))
        const update = {
            $set: {
                state: TASK_STATE.START,
                updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                workerId: data['worker_id']
            }
        };
        // 时光子弹localworker
        // if ((data['worker_id']).indexOf('local') >= 0 ) {
        if (data['worker_id'] === "localBT_1") {
            let activity = activitydb.findOne({'settings.worker_config.worker_id': data['worker_id'].split('_')[1]})
            if (activity) {
                // local worker
                const update = {
                    $set: {
                        state: TASK_STATE.START,
                        updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                        workerId: data['worker_id']
                    }
                };
                const res = await taskdb.findOneAndUpdate({
                    state: TASK_STATE.DATA_READY,
                    del: {$ne: '1'}
                }, update, {sort: {'createdAt': -1}});
                return res;
            }
        }
        let activitys = await activitydb.find({'settings.worker_config.worker_id': {$ne: null}})
        let local_activity_ids = []
        for (let i = 0; i < activitys.length; i++) {
            local_activity_ids.push(activitys[i].activity_id)
        }

        // console.log('local_activity_ids:', local_activity_ids)

        const res = await taskdb.findOneAndUpdate({
            state: TASK_STATE.DATA_READY,
            activity_id: {$nin: local_activity_ids},
            del: {$ne: '1'}
        }, update, {sort: {'createdAt': -1}});

        // console.log('res:', res)

        let result = {'task': {'later_setting': {}}}
        if (!res) {
            result = null
        }
        if (res) {
            result['activity_id'] = res.activity_id
            result['state'] = res.state
            result['createdAt'] = res.createdAt
            result['updatedAt'] = res.updatedAt
            result['workerId'] = res.workerId
            result['task']['taskId'] = res.task.taskId
            result['task']['mode'] = res.task.mode
            result['task']['type'] = res.task.type
            result['task']['local'] = res.task.local
            /* 兼容原来的小汽车, 凯蒂猫 */
            result['task']['fileName1'] = res.task.fileName1


            let activity = await activitydb.findOne({'activity_id': res.activity_id})
            // console.log('这个task的activity_name:', activity.activity_name)
            if (activity) {
                /* 剪辑参数 */
                if (activity.settings && activity.settings.later_setting) {
                    result['task']['later_setting']['source'] = activity.settings.later_setting.source
                }
            }

            if (activity && activity.settings && activity.settings.later_setting) {
                result['task']['later_setting']['cut_param'] = activity.settings.later_setting.cut_param
            }

            if (activity && activity.settings && activity.settings.provider) {
                result['task']['provider'] = activity.settings.provider
            }

            if (res.task && res.task.later_setting) {
                // console.log('res.task.later_setting:', res.task.later_setting)
                // 如果task里面已经有later_setting, 说明是小程序那边选中多模板生成的 task
                result['task']['later_setting'] = res.task.later_setting
            }

            if (activity && activity.settings && activity.settings.later_setting && activity.settings.later_setting.record) {
                let record = []
                for (let i = 0; i < activity.settings.later_setting.record.length; i++) {

                    let temp = {}
                    temp['deviceId'] = activity.settings.later_setting.record[i].deviceId
                    temp['order'] = activity.settings.later_setting.record[i].order
                    temp['duration'] = activity.settings.later_setting.record[i].duration
                    temp['begin'] = activity.settings.later_setting.record[i].begin
                    temp['effect'] = activity.settings.later_setting.record[i].effect
                    temp['paste_mov'] = activity.settings.later_setting.record[i].paste_mov || ''

                    let files = res['task']['files'] || []

                    console.log('files:', files)

                    if (files.length == 0 && !res.task.fileName1) {
                        console.log(res.task.taskId, '的files和fileName1都是空, 请注意')
                    }

                    for (let j = 0; j < files.length; j++) {

                        // console.log('jpg:', '_' + activity.settings.later_setting.record[i].order + '.jpg')
                        // if (files[j].indexOf('_' + activity.settings.later_setting.record[i].order + '.mp4') > 0 || files[j].indexOf('_' + activity.settings.later_setting.record[i].order + '.jpg') > 0 || files[j].indexOf(res.task.taskId + '.jpg') > 0) {
                        if (files[j].indexOf('_' + activity.settings.later_setting.record[i].order + '.mp4') > 0 || files[j].indexOf('_' + activity.settings.later_setting.record[i].order + '.jpg') > 0) {
                            // 包含_order.mp4的flies[j]
                            temp['fileName'] = files[j]
                        }
                    }
                    /* 照片 */
                    if (files.length == 0 && res.task.fileName1 && res.task.fileName1.length > 0) {
                        temp['fileName'] = res.task.fileName1
                    }

                    console.log('temp[fileName]:', temp['fileName'])
                    console.log('res.task.fileName1:', res.task.fileName1)

                    /* 片花 */
                    if (activity.settings.later_setting.record[i].everytype == 'flower' && activity.settings.later_setting.record[i].paste) {
                        // 代表这个record是片花, 'device'代表素材, 就是机位拍摄的文件
                        temp['fileName'] = activity.settings.later_setting.record[i].paste.replace('https://siiva-video.oss-cn-hangzhou.aliyuncs.com/', '')
                    }

                    /* HIT */
                    if (activity.settings.later_setting.record[i].API == 'HIT') {

                        let beginCount = activity.settings.later_setting.record[i].begin / 1000 || 1
                        let score = await weparkdb.findOne({
                            "activity_id": res.activity_id,
                            "create_time": {$gt: res.createdAt},
                            'param.event': {$regex: 'score:'}
                        }) || {}
                        if (!score.create_time) {
                            score.create_time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                        }
                        let hits = await weparkdb.find({
                            "activity_id": res.activity_id,
                            "create_time": {$gt: res.createdAt, $lt: score.create_time},
                            'param.event': {$regex: 'panel:hit'}
                        }) || []

                        if (hits.length < beginCount) {
                            // 如果hit的次数过少, 去剪辑wrong的瞬间
                            let wrongs = await weparkdb.find({
                                "activity_id": res.activity_id,
                                "create_time": {$gt: res.createdAt, $lt: score.create_time},
                                'param.event': {$regex: 'panel:wrong'}
                            }) || []
                            var c = hits.concat(wrongs)
                            hits = c
                        }

                        let weparkEvent = {}
                        if (hits.length >= beginCount) {
                            weparkEvent = hits[beginCount - 1]
                        }
                        if (hits.length < beginCount) {
                            // 如果hit和wrong的总次数过少, 去剪辑长视频的第i/length处
                            weparkEvent = {
                                'create_time': res.createdAt,
                            }
                        }


                        if (!weparkEvent) {
                            console.log('注意!!!!未找到该weparkEvent:', activity.settings.later_setting.record[i])
                            console.log('hits:', hits)
                        }

                        if (weparkEvent) {
                            let taskCreateTime = new Date(res.createdAt)
                            let hitTime = new Date(weparkEvent['create_time'])
                            temp['begin'] = (hitTime.getTime() - taskCreateTime.getTime())
                        }
                    }

                    record.push(temp)
                }
                result['task']['later_setting']['record'] = record
            }

        }

        // console.log('result:', JSON.stringify(result))

        return result;
    }

    async getEffectTask(data) {
        const update = {
            state: TASK_STATE.EFFECT,
            updatedAt: new Date().toLocaleString(),
            workerId: data['worker_id']
        };
        const ret = await taskdb.findOneAndUpdate({state: TASK_STATE.COMPLETE}, update, {sort: {'created_at': -1}});
        let task = {};
        if (ret != null) {
            task = {
                'taskId': ret.task['taskId'],
                'src': {
                    'provider': ret.task['output']['path'],
                    'key': ret.task['output']['name']
                },
                'dst': {
                    'provider': ret.task['output']['path'],
                    'key': 'effect_' + ret.task['output']['name']
                },
                'param': {}
            };
        }
        return task;
    }

    arrangeVideoLists(lists) {
        // Remove last empty
        lists.pop();
        let retLists = [];
        for (let i = 0; i < lists.length; i++) {
            var temp = '_' + i + '_';
            for (let j = 0; j < lists.length; j++) {
                if (lists[i].indexOf(temp) > 0) {
                    retLists.push(lists[i]);
                }
            }
        }
        return retLists;
    }

    async updateTask(data) {
        let ret: RetObject = new RetObject;
        var update = {
            'state': data.state
        };
        const fileNameRes = await this.get_task_file_lists(data);
        const fileNameList = this.arrangeVideoLists(fileNameRes['result'].toString().split('\n'));
        for (let j = 0; j < fileNameList.length; j++) {
            var tempStr = 'task.fileName' + (j + 1).toString();
            update[tempStr] = fileNameList[j];
        }
        const task = await taskdb.updateOne({'task.taskId': data.taskId, 'state': 'create'}, update, this.mongoCb);
        ret.code = dbTools.getUpdateCode(task);

        /* 兼容多模板时光子弹*/
        let siteSettings = await dbSiteSetting.findOne({'siteId': data.siteId});
        // console.log('siteSettings=' + JSON.stringify(siteSettings));
        // console.log('data.type=' + data.type);
        if (data.type !== 'soccer' && siteSettings && siteSettings['param']['type'] && siteSettings['param']['type'] == 'more') {
            var more_update = {
                state: data.state,
                msg: data.msg,
                updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss').toLocaleString()
            };
            for (let i = 0; i < siteSettings['template']['templates'].length; i++) {
                //分一下taskId
                let taskId = '';
                if (i > 0) {
                    taskId = data.taskId + '_' + i;
                } else {
                    taskId = data.taskId;
                }
                if (data.state == 'uploading') {
                    let task = await taskdb.findOneAndUpdate({
                        'task.taskId': taskId,
                        'state': 'create'
                    }, more_update, this.mongoCb);
                    if (i == siteSettings['template']['templates'].length - 1) {
                        ret.code = 0;
                        ret.result = task;
                    }
                } else {
                    let task = await taskdb.findOneAndUpdate({
                        'task.taskId': taskId,
                        'state': 'uploading'
                    }, update, this.mongoCb);
                    if (i == siteSettings['template']['templates'].length - 1) {
                        ret.code = 0;
                        ret.result = task;
                    }
                }
            }
        } else {
            // 無模板
            const task = await taskdb.findOneAndUpdate({'task.taskId': data.taskId}, update, this.mongoCb);
            ret.code = 0;
            ret.result = task;
        }
        /* 兼容多模板时光子弹*/
        return ret;
    }

    async deleteTask(data) {
        let ret: RetObject = new RetObject();
        let tasklist = null;
        switch (data['data_type']) {
            case 'annoTool':
                tasklist = await taskdb.remove({'task.taskId': data['detail'].taskId});
                break;
        }
        ret.code = 0;
        ret.result = tasklist;
        return ret;
    }

    async updateTaskToDataReady(data) {
        console.log('updateTaskToDataReady_data:', JSON.stringify(data))

        const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        let ret: RetObject = new RetObject();

        // 用于更新原来的task, 但是只增加files, 不改变state为data.ready的
        let originalUpdate = {}
        let update = {}
        originalUpdate = {
            $set: {
                msg: data.msg,
                updatedAt: date.toLocaleString(),
                'task.fileName1': data.fileName1
            }
        }
        update = {
            $set: {
                state: TASK_STATE.DATA_READY,
                msg: data.msg,
                updatedAt: date.toLocaleString(),
                'task.fileName1': data.fileName1
            }
        };

        if (data.files) {
            originalUpdate = {
                $set: {
                    updatedAt: new Date().toLocaleString(),
                    'task.files': data.files,
                }
            }
            update = {
                $set: {
                    state: TASK_STATE.DATA_READY,
                    updatedAt: new Date().toLocaleString(),
                    'task.files': data.files,
                }
            }
        }

        // let task = await taskdb.findOneAndUpdate({'task.taskId': data.taskId}, update, this.mongoCb);

        let task: any;

        let tasks = await taskdb.find({'task.taskId': {$regex: data.taskId}})
        console.log('tasks.len:', tasks.length)

        if (tasks && tasks.length == 1) {
            // 证明没有多模板照片的, 值处理当前task
            console.log('没有多模板')
            task = await taskdb.findOneAndUpdate({'task.taskId': data.taskId}, update, this.mongoCb);
        } else {
            // 有多模板照片, 不处理原task, 只处理生成的多task
            console.log('有多模板的')
            await taskdb.findOneAndUpdate({'task.taskId': data.taskId}, originalUpdate, this.mongoCb);
            task = await taskdb.updateMany({
                'task.taskId': {$regex: data.taskId, '$ne': data.taskId},
                'state': {'$nin': ['complete', 'start']}
            }, update, null, null);
        }
        // let task = await taskdb.update({'task.taskId': {$regex: data.taskId}}, update, false,true);
        console.log('更新结果:', task)
        if (!task) {
            ret.code = 1;
        } else {
            ret.code = 0;
            ret.result = task;
        }
        return ret;
    }

    async finishTask(data) {

        console.log('finish_data:', JSON.stringify(data))

        async function video_name(data) {
            // console.log("更新用户的视频列表");
            let response = await axios.post('http://localhost:3000/wechat/video_name', data);
        }

        try {
            await video_name(data);
        } catch (err) {

        }

        const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
        const update = {
            state: TASK_STATE.COMPLETE,
            msg: data.msg,
            updatedAt: date.toLocaleString()
        };

        var taskCondition = {};
        taskCondition = {_id: data._id};
        if (data && data.task && data.task.taskId) {
            taskCondition = {'task.taskId': data.task.taskId}

            let temp = await taskdb.findOne({'task.taskId': data.task.taskId});

            // console.log('temp:', temp)

            // 通知浏览器剪辑完成, 显示二维码
            if (temp.task.from) {
                const socketId = Global.getSocketId(temp.task.from);
                let sentData = {
                    // "deviceId": deviceId,
                    // "from": query.from,
                    // "requestId": query.requestId,
                    "deviceId": temp.task.from,
                    "from": "",
                    "requestId": "",
                    "param": {
                        "action": "task_complete",
                        "taskId": data.task.taskId
                    }
                }
                console.log('已通知', temp.task.from, '显示二维码')
                // console.log('socketId:', socketId)
                console.log('sentData:', sentData)
                Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);

                // 通知发送倒计时的浏览器显示二维码

                let promptData = Global.getAllPromptData()
                for (var browserId in promptData) {
                    if (promptData.hasOwnProperty(browserId)) {
                        let promptTemp = promptData[browserId]
                        if (promptTemp.activity_id == temp.activity_id && Date.now() - promptTemp.time < 7200000) {
                            // 2h以内点击开始倒计时的浏览器, 会收到二维码已生成
                            const promptSocketId = Global.getSocketId(browserId);
                            if (promptSocketId) {
                                Global.getSocket('start_socket').to(promptSocketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
                            }
                        }
                    }
                }
            }
            // 通知打印机, 打印照片
            if (temp.task.print) {
                request({
                    url: 'https://iva.siiva.com/me_photo/print?taskId=' + data.task.taskId + '&activity_id=' + temp.activity_id + '&print_id=' + temp.task.print,
                    method: "GET",
                    json: true
                }, (error, response, body) => {
                    console.log('发送打印请求:', JSON.stringify(body))
                })
            }

        }
        const task = await taskdb.findOneAndUpdate(taskCondition, update, this.mongoCb);
        return task;

    }

    async finishEffectTask(data) {
        const update = {
            state: TASK_STATE.EFFECT_FINISH,
            msg: data.msg,
            updatedAt: new Date().toLocaleString()
        };
        const task = await taskdb.findOneAndUpdate({'task.taskId': data.taskId}, update, this.mongoCb);
        return task;
    }

    async onAbortTask(data) {
        console.log('onAbortTask data=' + JSON.stringify(data));
        const update = {
            state: TASK_STATE.ABORT,
            msg: data.msg || '',
            updatedAt: new Date().toLocaleString()
        };
        // const task = await taskdb.findOneAndUpdate({_id: data._id}, update, this.mongoCb);
        let taskId = ''
        if (data.task.taskId) {
            taskId = data.task.taskId
        }
        console.log('')
        const task = await taskdb.findOneAndUpdate({'task.taskId': taskId}, update, this.mongoCb);
        return task;
    }

    async getTaskList(query) {
        const tasklists = await taskdb
            .find({'createdAt': {$regex: query['time']}})
            .find(query['siteId'] ? {'task.siteId': query['siteId']} : {})
            .find({'del': {$ne: '1'}})
            .find(query['state'] ? {'state': query['state']} : {})
            .sort(query['sort'] ? {createdAt: -1} : {createdAt: 1})
            .limit(Number(query['limit']));

        for (let i = 0; i < tasklists.length; i++) {

            if (!tasklists[i] || !tasklists[i].task || !tasklists[i].task.taskId) {
                continue
            }

            let siteSetting = await soccorDbSiteSetting.findOne({siteId: tasklists[i].task.siteId});
            if (siteSetting) {
                tasklists[i].group = siteSetting.group;
                tasklists[i]['task']['siteName'] = siteSetting.siteName;

                let activity = await activitydb.findOne({activity_id: siteSetting.activity_id});
                if (activity) {
                    tasklists[i].activity_name = activity.activity_name;
                    tasklists[i].user_id = activity.user_id;
                }
            }
        }

        let res = [];
        if (query['group']) {
            for (let i = 0; i < tasklists.length; i++) {
                if (tasklists[i].group.indexOf(query['group']) >= 0) {
                    res.push(tasklists[i]);
                }
            }
        } else {
            res = tasklists;
        }
        return res;
    }

    mongoCb(err, doc, res) {
        // console.log("err = " + err);
        // console.log("doc = " + doc);
        // console.log("res = " + res);

    }

    convertTask(_task, siteSettings) {
        // console.log('convertTask=' + JSON.stringify(_task));
        siteSettings['output']['name'] = `${_task.siteId}_${_task.userId}_${_task.taskId}.mp4`;
        siteSettings['param']['text'] = _task.nickname;
        var new_task = [];
        if (siteSettings['param']['type'] == 'more') {
            for (var i = 0; i < siteSettings['template']['templates'].length; i++) {
                // console.log('i=' + siteSettings['template']['templates'][i]);
                siteSettings['param']['template'] = siteSettings['template']['templates'][i] + '.' + siteSettings['template']['type'];
                //分一下taskId
                let taskId = '';
                if (i > 0) {
                    taskId = _task.taskId + '_' + i;
                    delete siteSettings.param['template_foreground'];
                } else {
                    taskId = _task.taskId;
                    siteSettings['param']['template_foreground'] = _task.siteId + '_foreground.mov';
                }

                new_task[i] = {
                    'siteId': _task.siteId,
                    'taskId': taskId,
                    'userId': _task.userId,
                    'source': _task.source,
                    'cameraNum': _task.cameraNum,
                    'type': siteSettings['type'],
                    'param': Object.assign({}, siteSettings['param']),
                    'output': siteSettings['output']
                };

                // ToDo: current only support two templates
                if (i == 1) {
                    return new_task;
                }
            }
        } else {
            if (_task.template) {
                siteSettings['param']['template'] = _task.template;
            }

            new_task[0] = {
                'siteId': _task.siteId,
                'taskId': _task.taskId,
                'userId': _task.userId,
                'source': _task.source,
                'cameraNum': _task.cameraNum,
                'type': siteSettings['type'],
                'param': siteSettings['param'],
                'output': siteSettings['output']
            };
            return new_task;
        }

    }

    async create_new_task(data) {
        var orders = await order.findOne({'openid': data.openid, 'order_id': data.out_trade_no});
        var newtask = {};
        var wechats = await wechatdb.findOne({'wechat.openid': data.openid, 'source': orders.siteId});
        var tasks = await taskdb.findOne({'task.output.name': wechats.videoNames[wechats.videoNames.length - 1]});
        if (orders !== null && orders.is_pay == 1) {
            let siteSettings = await dbSiteSetting.findOne({'siteId': orders.siteId});
            for (var i = 0; i < orders.templates.length; i++) {
                // let siteSettings = this.siteService.find(orders.siteId);
                const uuidv1 = require('uuid/v1');
                var taskId = uuidv1().replace(/-/g, '');
                const date = new Date();
                siteSettings['output']['name'] = `${orders.siteId}_${data.openid}_${taskId}.mp4`;
                siteSettings['param']['text'] = tasks['task']['param']['text'];
                if (orders.templates[i]) {
                    siteSettings['param']['template'] = orders.templates[i];
                }
                const task = {
                    'siteId': order.siteId,
                    'taskId': taskId,
                    'userId': data.openid,
                    'source': tasks.task['source'],
                    'cameraNum': tasks.task['cameraNum'],
                    'type': siteSettings['type'],
                    'param': siteSettings['param'],
                    'output': siteSettings['output']
                };
                const createTask = new taskdb({
                    task: task,
                    state: TASK_STATE.DATA_READY,
                    createdAt: date.toLocaleString(),
                    updatedAt: date.toLocaleString(),
                    msg: ''
                });
                return await createTask.save();
            }
            // await this.taskModel.find({})
        }

    }

    async get_test_task(task_id) {
        let tasks = await taskdb.find({'task.taskId': task_id});
        // console.log(tasks.length);
    }

    async get_task_file_lists(data) {
        // console.log("get_task_file_lists data.deviceId=" + data.taskId);
        let ret: RetObject = new RetObject;
        // const cmd = `--action getfilelist --bucket eee --prefix soccer_${data.taskId} | grep soccer | cut -c 16-`;
        // ret.code = 0;
        // ret.result = fileMgrCmd(cmd);
        let callback = {
            onSuccess: result => {
                // console.log(result.objects);    //  result.objects 是一个数组
                ret.code = 0;
                ret.result = '';

                for (let index in result.objects) {
                    ret.result += result.objects[index].name + '\n';
                }
            },
            onError: err => {
                console.error(`list error = ${err}`);
                ret.code = 1;
                ret.description = err;
            }
        } as HttpClientCallback;

        // 列出文件
        await httpclient.list({
            // prefix: `soccer_${data.taskId}`
            prefix: `${data.taskId}`
        } as HttpClientListOptions, callback);

        // console.log(ret);
        return ret;
    }

    async onCancelTask(data) {
        let ret: RetObject = new RetObject;
        const update = {
            state: TASK_STATE.CANCELLED,
            msg: data.msg,
            updatedAt: new Date().toLocaleString()
        };
        const task = await taskdb.findOneAndUpdate({'task.taskId': data.task_id}, update, this.mongoCb);
        ret.code = 0;
        ret.description = 'Cancel task:' + data.task_id + ' succesful.';
        return ret;
    }

    async getBtSingleTaskStatus(data) {
        let ret: RetObject = new RetObject;
        const tasklist = await taskdb.find({
            'task.taskId': data.taskId,
            'task.userId': data.userId,
            'state': data.state
        });
        ret.code = 0;
        ret.result = tasklist;
        return ret;
    }

    async updateStatus(data) {
        let ret: RetObject = new RetObject;

        try {
            if (!data.taskId || !data.role || !data.position) {
                throw new Error(`无效的参数: taskId = ${data.taskId}, role = ${data.role}, position = ${data.position}`);
            }

            let task = await taskdb.findOne({'task.taskId': data.taskId});
            if (!task) {
                throw new Error(`没有找到对应的task： taskId = ${data.taskId}`);
            }

            let detail = task.task.detail || [];
            let update = {
                $set: {}
            };
            let getIndex = (role, position, arr) => {
                for (let i in arr) {
                    if (arr[i]['role'] == role && arr[i]['position'] == position) {
                        return i;
                    }
                }

                return -1;
            };
            let index = getIndex(data.role, data.position, detail);

            if (index != -1) {
                // 找到了对应的位置
                data.msg && (detail[index]['msg'] = data.msg);
                data.shift && (detail[index]['shift'] = data.shift);
            } else {
                // 没有找到对应的位置
                detail.push({
                    'role': data.role,
                    'position': data.position,
                    'msg': data.msg || '',
                    'shift': data.shift || ''
                });
            }

            update.$set['task.detail'] = detail;

            ret.result = await taskdb.updateOne({'task.taskId': data.taskId}, update);
            ret.code = dbTools.getUpdateCode(ret.result);
        } catch (error) {
            ret.code = 2;
            ret.description = `更新状态出错：${error}`;
        }

        return ret;
    }

    async getStatus(data) {
        // console.log("getStatus data = " + JSON.stringify(data));
        const ret = await taskdb.findOne({'task.taskId': data.taskId});
        // let videoCam1_status = "";
        // let videoCam2_status = "";
        // let videoCam3_status = "";
        // let worker_status = "";

        const retStatus = {
            'state': ret ? ret.state : '',
            // "videoCam1_status": "",
            // "videoCam2_status": "",
            // "videoCam3_status": "",
            'worker': '',
            'url': ''
        };

        if (ret && ret.task && ret.task.detail) {
            for (let i = 0; i < ret.task.detail.length; i++) {
                // switch (ret.task.detail[i].role) {
                //     case "VideoCam 0":
                //         videoCam1_status = ret.task.detail[i].msg;
                //         break;
                //     case "VideoCam 1":
                //         videoCam2_status = ret.task.detail[i].msg;
                //         break;
                //     case "VideoCam 2":
                //         videoCam3_status = ret.task.detail[i].msg;
                //         break;
                //     case "worker":
                //         worker_status = ret.task.detail[i].msg;
                //         break;
                // }

                if (ret.task.detail[i].role === 'worker') {
                    retStatus['worker'] = ret.task.detail[i].msg;
                } else if (ret.task.detail[i].role.startsWith('VideoCam')) {
                    // let suffix = ret.task.detail[i].role.slice(-1); //  截取最后一位数字
                    retStatus[`videoCam_${ret.task.detail[i].position}_status`] = ret.task.detail[i].msg;
                } else {
                    // goal cam status
                }
            }

            if (ret.task.state == 'complete') {
                retStatus['url'] = `https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/${ret.task.taskId}.mp4`;
            }
        }

        // const retStatus = {
        //   "state": ret.state,
        //   "videoCam1_status": videoCam1_status,
        //   "videoCam2_status": videoCam2_status,
        //   "videoCam3_status": videoCam3_status,
        //   "worker": worker_status
        // };
        // console.log("retStatus=" + JSON.stringify(retStatus));

        return retStatus;
    }

    async isAllFilesUpdated(taskId) {
        let flag = false;

        try {
            await taskdb.findOne({'task.taskId': taskId}, (err, raw) => {

                // console.log("taskId:", taskId)
                // console.log("raw:", raw)
                if ((!err) && (raw)) {
                    let num = raw.task.cameraNum;
                    let hasUpdated = 0;

                    for (let i = 0; i < num; i++) {
                        if (raw.task['fileName' + (i + 1)] !== null && raw.task['fileName' + (i + 1)] !== 'null' && raw.task['fileName' + (i + 1)] !== undefined) {
                            // console.log('fileName'+(i+1), ':', raw.task['fileName'+(i+1)])
                            hasUpdated++;
                        }
                    }

                    // console.log('>>>> isAllFilesUpdated num / hasUpdated');
                    // console.log(`num/hasUpdated = ${num}/${hasUpdated}`);
                    console.log(`hasUpdated/num = ${hasUpdated}/${num}`);
                    if (hasUpdated === num) {
                        flag = true;
                    }
                } else {
                    console.log(' >>>>  isAllFilesUpdated err', err);
                }
            });
        } catch (e) {
            console.log(`task.service.ts >>> isAllFilesUpdated exception`);
            console.log(e);
        }

        return flag;
    }

    async getTaskStatusByDataType(query) {
        let ret: RetObject = new RetObject;
        let tasklist = null;
        switch (query['data_type']) {
            case 'annoTool':
                tasklist = await taskdb.find({'task.siteId': query['siteId']});
                break;
        }
        ret.code = 0;
        ret.result = tasklist;
        return ret;
    }

    async delTask(data) {
        let ret: RetObject = new RetObject;
        try {
            if (!data.taskId) {
                throw new Error(`无效的参数: taskId = ${data.taskId}`);
            }

            let task = await taskdb.findOne({'task.taskId': data.taskId});
            if (!task) {
                throw new Error(`没有找到对应的task： taskId = ${data.taskId}`);
            }

            if (task.task.files) {
                for (let i = 0; i < task.task.files.length; i++) {
                    httpclient.delete(task.task.files[i], {
                        onSuccess: result => {
                            console.log(task.task.files[i], '原文件删除成功')
                        },
                        onError: err => {
                            console.log(task.task.files[i], '原文件删除失败:', err)
                        },
                        onProgress: percentage => {
                        }
                    }, HttpClientBuckets.PRIVATE_BUCKET);
                }
            }

            if (task.activity_id && task.task.taskId && task.state == 'complete') {
                if (task.task.mode == 'photo') {
                    httpclient.delete(task.activity_id + '/' + task.task.taskId + '.jpg', {
                        onSuccess: result => {
                            console.log(task.task.taskId, '合成文件删除成功')
                        },
                        onError: err => {
                            console.log(task.task.taskId, '合成原文件删除失败:', err)
                        },
                        onProgress: percentage => {
                        }
                    }, HttpClientBuckets.PUBLIC_BUCKET);
                } else {
                    httpclient.delete(task.activity_id + '/' + task.task.taskId + '.mp4', {
                        onSuccess: result => {
                            console.log(task.task.taskId, '合成文件删除成功')
                        },
                        onError: err => {
                            console.log(task.task.taskId, '合成原文件删除失败:', err)
                        },
                        onProgress: percentage => {
                        }
                    }, HttpClientBuckets.PUBLIC_BUCKET);
                }
            }

            let update = {
                $set: {}
            };
            update.$set['del'] = '1';
            ret.result = await taskdb.updateOne({'task.taskId': data.taskId}, update);
            ret.code = dbTools.getUpdateCode(ret.result);
        } catch (error) {
            ret.code = 2;
            ret.description = `更新状态出错：${error}`;
        }
        return ret;
    }

    async taskLike(query) {

        let ret: RetObject = new RetObject;
        if (!query['taskId'] || !query['openid']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }

        let temp = await taskdb.findOne({'task.taskId': query['taskId']});
        if (!temp) {
            ret.code = 1;
            ret.description = '未发现该task';
            return ret;
        }


        // if (temp.likes && temp.likes.indexOf(query.openid) >= 0) {
        //   ret.code = 1;
        //   ret.description = '已赞过';
        //   return ret;
        // }
        for (var i = 0; i < temp.likes.length; i++) {
            if (temp.likes[i].openid == query.openid) {
                // 赞过
                await taskdb.update({'task.taskId': query['taskId']}, {'$pull': {'likes': {openid: query.openid}}});
                ret.code = 0;
                ret.description = '取消赞成功';
                return ret;
            }
        }
        let wxUser = {
            'openid': query['openid'],
            'timestamp': Math.round(new Date().getTime() / 1000)
        };
        await taskdb.update({'task.taskId': query['taskId']},
            {'$push': {'likes': wxUser}});
        ret.code = 0;
        ret.description = '赞成功';
        return ret;
        // await taskdb.update({ 'task.taskId': query['taskId'] },
        //   { '$push': { 'likes': query['openid'] } });
        //
        // ret.code = 0;
        // return ret;
    }

    async taskIfLike(query) {

        let ret: RetObject = new RetObject;
        if (!query['taskId'] || !query['openid']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }

        let temp = await taskdb.findOne({'task.taskId': query['taskId']});
        if (!temp) {
            ret.code = 1;
            ret.description = '未发现该task';
            return ret;
        }

        // if (temp.likes && temp.likes.indexOf(query.openid) >= 0) {
        //   ret.code = 0;
        //   ret.description = '已赞过';
        //   return ret;
        // }
        for (var i = 0; i < temp.likes.length; i++) {
            if (temp.likes[i].openid == query.openid) {
                ret.code = 0;
                ret.description = '已赞过';
                return ret;
            }
        }
        ret.code = 1;
        ret.description = '未赞过';
        return ret;
        // ret.code = 1;
        // ret.description = '未赞过';
        // return ret;
    }

    async taskLikeList(query) {

        let ret: RetObject = new RetObject;
        if (!query['openid']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }
        // const tasklists = await taskdb.find({'likes.0': {$exists: 1}})
        // const tasklists = await taskdb.find({ 'likes': { $in: [query['openid']] } });
        const tasklists = await taskdb.find({'likes.openid': {$in: [query['openid']]}}).sort({'likes.timestamp': -1});

        for (let i = 0; i < tasklists.length; i++) {
            let res = await datareportdb.findOne({taskId: tasklists[i].task.taskId}) || {};
            tasklists[i]['task']['visit'] = res.visit || 0;
            tasklists[i]['task']['play'] = res.play || 0;
            tasklists[i]['task']['download'] = res.download || 0;
            tasklists[i]['task']['share'] = res.share || 0;
            tasklists[i]['task']['like'] = res.like || 0;
            let siteSetting = await soccorDbSiteSetting.findOne({siteId: tasklists[i].task.siteId});
            if (siteSetting) {
                tasklists[i].group = siteSetting.group;
                tasklists[i]['task']['siteName'] = siteSetting.siteName;
            }
        }
        return tasklists;
    }


    async taskCollect(query) {

        let ret: RetObject = new RetObject;
        if (!query['taskId'] || !query['openid']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }

        let temp = await taskdb.findOne({'task.taskId': query['taskId']});
        if (!temp) {
            ret.code = 1;
            ret.description = '未发现该task';
            return ret;
        }

        // if (temp.collects && temp.collects.indexOf(query.openid) >= 0) {
        //   ret.code = 1;
        //   ret.description = '已收藏过';
        //   return ret;
        // }

        for (var i = 0; i < temp.collects.length; i++) {
            if (temp.collects[i].openid == query.openid) {
                // 收藏过
                await taskdb.update({'task.taskId': query['taskId']}, {'$pull': {'collects': {openid: query.openid}}});
                ret.code = 0;
                ret.description = '取消收藏成功';
                return ret;
            }
        }

        let wxUser = {
            'openid': query['openid'],
            'timestamp': Math.round(new Date().getTime() / 1000)
        };
        await taskdb.update({'task.taskId': query['taskId']},
            {'$push': {'collects': wxUser}});
        ret.code = 0;
        ret.description = '收藏成功';
        return ret;

    }

    async taskIfCollect(query) {

        let ret: RetObject = new RetObject;
        if (!query['taskId'] || !query['openid']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }

        let temp = await taskdb.findOne({'task.taskId': query['taskId']});
        if (!temp) {
            ret.code = 1;
            ret.description = '未发现该task';
            return ret;
        }


        // if (temp.collects && temp.collects.indexOf(query.openid) >= 0) {
        //   ret.code = 0;
        //   ret.description = '已收藏';
        //   return ret;
        // }
        for (var i = 0; i < temp.collects.length; i++) {
            if (temp.collects[i].openid == query.openid) {
                ret.code = 0;
                ret.description = '已收藏';
                return ret;
            }
        }

        ret.code = 1;
        ret.description = '未收藏';
        return ret;

    }

    async taskCollectList(query) {

        let ret: RetObject = new RetObject;
        if (!query['openid']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }

        // const tasklists = await taskdb.find({ 'collects': { $in: [query['openid']] } });
        const tasklists = await taskdb.find({'collects.openid': {$in: [query['openid']]}}).sort({'collects.timestamp': -1});

        for (let i = 0; i < tasklists.length; i++) {
            let res = await datareportdb.findOne({taskId: tasklists[i].task.taskId}) || {};
            tasklists[i]['task']['visit'] = res.visit || 0;
            tasklists[i]['task']['play'] = res.play || 0;
            tasklists[i]['task']['download'] = res.download || 0;
            tasklists[i]['task']['share'] = res.share || 0;
            tasklists[i]['task']['like'] = res.like || 0;
            let siteSetting = await soccorDbSiteSetting.findOne({siteId: tasklists[i].task.siteId});
            if (siteSetting) {
                tasklists[i].group = siteSetting.group;
                tasklists[i]['task']['siteName'] = siteSetting.siteName;
            }
        }
        return tasklists;
    }


    async taskVisit(query) {

        let ret: RetObject = new RetObject;
        if (!query['taskId'] || !query['openid']) {
            ret.code = 1;
            ret.description = '请检查参数';
            return ret;
        }

        let temp = await taskdb.findOne({'task.taskId': query['taskId']});
        if (!temp) {
            ret.code = 1;
            ret.description = '未发现该task';
            return ret;
        }


        if (temp.visits && temp.visits.indexOf(query.openid) >= 0) {
            ret.code = 1;
            ret.description = '已浏览过';
            return ret;
        }

        await taskdb.update({'task.taskId': query['taskId']},
            {'$push': {'visits': query['openid']}});

        ret.code = 0;
        return ret;

    }

    async taskInfo(query) {

        let ret: RetObject = new RetObject;
        if (!query['taskId']) {
            ret.code = 1;
            ret.description = 'taskId不能为空';
            return ret;
        }

        let task = await taskdb.findOne({'task.taskId': query['taskId']});
        if (!task) {
            ret.code = 1;
            ret.description = '未发现该task';
            return ret;
        }

        let activity = await activitydb.findOne({activity_id: task.activity_id}) || {};

        let result = {}
        result['createdAt'] = task.createdAt || '';
        result['activity_id'] = activity.activity_id || '';
        result['activity_name'] = activity.activity_name || '';
        return result;
    }

    async sendLocalCloud(query) {

        let res = {}

        console.log('收到需通知local file server 上传到OSS的请求: ', query)
        if (query.taskId && Global.getSocket('start_socket')) {
            let task = await taskdb.findOne({'task.taskId': query.taskId});
            if (task) {
                query["activityId"] = task.activity_id;
                query["action"] = "send_local_cloud"
                let activity = await activitydb.findOne({"activity_id": task.activity_id})
                if (activity) {
                    query["type"] = activity.type;
                }
            }
            console.log('完整query: ', query)
            // Global.getSocket('start_socket').sockets.emit(LOCAL_FILE_EVENT.SEND_LOCAL_CLOUD, query);
            const socketId = Global.getSocketId(query["activityId"]);
            if (socketId) {
                console.log('已通知: ', query["activityId"], '上传文件')
                Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, query);
            }
            res = task
        }
        return res

    }

    async sendPromptScan(query) {

        let res = {}
        console.log('收到需通知python 扫码: ', query)

        let data = {}
        if (query.taskId && Global.getSocket('start_socket')) {
            let task = await taskdb.findOne({'task.taskId': query.taskId});
            if (task) {
                data['param'] = {}
                data["param"]["action"] = "send_prompt_scan"
                data["param"]["activityId"] = task.activity_id;
                let activity = await activitydb.findOne({"activity_id": task.activity_id})
                if (activity && activity.settings && activity.settings.prompt_setting && activity.settings.prompt_setting.prompt_id) {
                    data['deviceId'] = activity.settings.prompt_setting.prompt_id
                    const socketId = Global.getSocketId(activity.settings.prompt_setting.prompt_id)
                    if (socketId) {
                        console.log('已通知: ', activity.settings.prompt_setting.prompt_id, '扫码')
                        Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, data);
                    }
                }
            }
            res = task
        }
        return res

    }

    async hasPreviewImg(query) {

        let ret: RetObject = new RetObject;
        if (!query['taskId']) {
            ret.code = 1;
            ret.description = 'taskId不能为空';
            return ret;
        }

        let task = await taskdb.findOne({'task.taskId': query.taskId});
        if (!task) {
            ret.code = 1;
            ret.description = '未找到该task';
            return ret;
        }
        let res = await taskdb.updateOne({'task.taskId': query.taskId}, {$set: {'task.has_preview_img': '1',}});
        console.log('update has_preview res:', res)
        ret.code = 0;
        ret.description = '更新成功';
        return ret;

    }

    async hasPreviewVideo(query) {

        let ret: RetObject = new RetObject;
        if (!query['taskId']) {
            ret.code = 1;
            ret.description = 'taskId不能为空';
            return ret;
        }

        let task = await taskdb.findOne({'task.taskId': query.taskId});
        if (!task) {
            ret.code = 1;
            ret.description = '未找到该task';
            return ret;
        }
        let res = await taskdb.updateOne({'task.taskId': query.taskId}, {$set: {'task.has_preview_video': '1',}});
        console.log('update has_preview res:', res)
        ret.code = 0;
        ret.description = '更新成功';
        return ret;

    }



}