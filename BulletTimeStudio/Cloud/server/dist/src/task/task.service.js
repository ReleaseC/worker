"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const task_interface_1 = require("./interface/task.interface");
const axios_1 = require("axios");
const db_service_1 = require("../common/db.service");
const db_service_2 = require("../common/db.service");
const db_service_3 = require("../common/db.service");
const db_service_4 = require("../common/db.service");
const db_service_5 = require("../common/db.service");
const ret_component_1 = require("../common/ret.component");
const db_tools_1 = require("../common/db.tools");
var moment = require('moment');
const httpclient_1 = require("../../lib/oss/httpclient");
const uuidv1 = require('uuid/v1');
var moment = require('moment');
let TaskService = class TaskService {
    createTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('createTask data = ' + JSON.stringify(data));
            if (data.siteId && data.type !== 'annoTool') {
                let setting = yield db_service_3.soccorDbSiteSetting.findOne({ siteId: data.siteId });
                if (setting && setting.siteType) {
                    data.type = setting.siteType;
                }
            }
            let ret = new ret_component_1.RetObject;
            const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
            let setting = (yield db_service_3.soccorDbSiteSetting.findOne({ 'siteId': data.siteId })) || {};
            switch (data.type) {
                case 'soccer':
                case 'luoke':
                    {
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
                        const createTask = new db_service_4.taskdb({
                            task: task,
                            activity_id: setting.activity_id || '',
                            state: task_interface_1.TASK_STATE.CREATE,
                            createdAt: date.toLocaleString(),
                            updatedAt: date.toLocaleString(),
                            del: '0',
                            msg: ''
                        });
                        const result = yield createTask.save();
                        ret.code = 0;
                        ret.description = 'Create new ' + data.type + ' task.';
                    }
                    break;
                case 'annoTool':
                    {
                        console.log('createTask data=' + JSON.stringify(data));
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
                            'isTaskCreated': data.detail.isTaskCreated
                        };
                        const createTask = new db_service_4.taskdb({
                            task: task,
                            state: task_interface_1.TASK_STATE.CREATE,
                            createdAt: date.toLocaleString(),
                            updatedAt: date.toLocaleString(),
                            del: '0',
                            msg: ''
                        });
                        const result = yield createTask.save();
                        ret.code = 0;
                        ret.description = 'Create new ' + data.type + ' task.';
                    }
                    break;
                case 'moment':
                    {
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
                            'triggerBy': data.triggerBy || 'manual',
                            'cameraNum': data.cameraNum || 1,
                            'fileName1': '',
                            'type': data.type,
                            'version': data.version,
                            'detail': []
                        };
                        const createTask = new db_service_4.taskdb({
                            task: task,
                            activity_id: setting.activity_id || '',
                            state: task_interface_1.TASK_STATE.CREATE,
                            createdAt: date.toLocaleString(),
                            updatedAt: date.toLocaleString(),
                            del: '0',
                            msg: ''
                        });
                        const result = yield createTask.save();
                        ret.code = 0;
                        ret.description = 'Create new ' + data.type + ' task.';
                    }
                    break;
                default: {
                    let siteSettings = yield db_service_5.dbSiteSetting.findOne({ 'siteId': data.siteId });
                    let task = this.convertTask(data, siteSettings);
                    if (task.length > 1) {
                        for (let i = 0; i < task.length; i++) {
                            task[i]['param']['template'] = siteSettings['template']['templates'][i] + '.' + siteSettings['template']['type'];
                            let name = siteSettings['template']['templates'][i] + '_' + data.siteId + '_' + data.userId + '_' + data.taskId + '.mp4';
                            task[i]['output']['name'] = name;
                            const createTask = new db_service_4.taskdb({
                                task: task[i],
                                state: task_interface_1.TASK_STATE.CREATE,
                                createdAt: date.toLocaleString(),
                                updatedAt: date.toLocaleString(),
                                del: '0',
                                msg: ''
                            });
                            yield createTask.save();
                        }
                        ret.code = 0;
                        ret.description = 'Create new ' + data.type + ' tasks, number of tasks:' + task.length;
                    }
                    else {
                        const createTask = new db_service_4.taskdb({
                            task: task[i],
                            activity_id: setting.activity_id || '',
                            state: task_interface_1.TASK_STATE.CREATE,
                            createdAt: date.toLocaleString(),
                            updatedAt: date.toLocaleString(),
                            del: '0',
                            msg: ''
                        });
                        yield createTask.save();
                        ret.code = 0;
                        ret.description = 'Create a new ' + data.type + ' task.';
                    }
                }
            }
            return ret;
        });
    }
    getTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = {
                $set: {
                    state: task_interface_1.TASK_STATE.START,
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
                    workerId: data['worker_id']
                }
            };
            const res = yield db_service_4.taskdb.findOneAndUpdate({ state: task_interface_1.TASK_STATE.DATA_READY }, update, { sort: { 'created_at': -1 } });
            if (!res) {
                return res;
            }
            let site = yield db_service_3.soccorDbSiteSetting.findOne({ siteId: res.task.siteId });
            console.log('site:', site);
            if (!site) {
                return res;
            }
            if (site.cameraSetting.length > 0) {
                res.task.cameraSetting = site.cameraSetting;
            }
            else {
                res.task.cameraSetting = [
                    {
                        'role': 'VideoCam',
                        'position': '0',
                        'rotation': '0',
                        'scale': '100%'
                    },
                    {
                        'role': 'VideoCam',
                        'position': '1',
                        'rotation': '0',
                        'scale': '100%'
                    },
                    {
                        'role': 'VideoCam',
                        'position': '2',
                        'rotation': '0',
                        'scale': '100%'
                    }
                ];
            }
            return res;
        });
    }
    getEffectTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = {
                state: task_interface_1.TASK_STATE.EFFECT,
                updatedAt: new Date().toLocaleString(),
                workerId: data['worker_id']
            };
            const ret = yield db_service_4.taskdb.findOneAndUpdate({ state: task_interface_1.TASK_STATE.COMPLETE }, update, { sort: { 'created_at': -1 } });
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
        });
    }
    arrangeVideoLists(lists) {
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
    updateTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var update = {
                'state': data.state
            };
            const fileNameRes = yield this.get_task_file_lists(data);
            const fileNameList = this.arrangeVideoLists(fileNameRes['result'].toString().split('\n'));
            for (let j = 0; j < fileNameList.length; j++) {
                var tempStr = 'task.fileName' + (j + 1).toString();
                update[tempStr] = fileNameList[j];
            }
            const task = yield db_service_4.taskdb.updateOne({ 'task.taskId': data.taskId, 'state': 'create' }, update, this.mongoCb);
            ret.code = db_tools_1.dbTools.getUpdateCode(task);
            let siteSettings = yield db_service_5.dbSiteSetting.findOne({ 'siteId': data.siteId });
            if (data.type !== 'soccer' && siteSettings && siteSettings['param']['type'] && siteSettings['param']['type'] == 'more') {
                var more_update = {
                    state: data.state,
                    msg: data.msg,
                    updatedAt: moment(new Date()).format('YYYY-MM-DD HH:mm:ss').toLocaleString()
                };
                for (let i = 0; i < siteSettings['template']['templates'].length; i++) {
                    let taskId = '';
                    if (i > 0) {
                        taskId = data.taskId + '_' + i;
                    }
                    else {
                        taskId = data.taskId;
                    }
                    if (data.state == 'uploading') {
                        let task = yield db_service_4.taskdb.findOneAndUpdate({ 'task.taskId': taskId, 'state': 'create' }, more_update, this.mongoCb);
                        if (i == siteSettings['template']['templates'].length - 1) {
                            ret.code = 0;
                            ret.result = task;
                        }
                    }
                    else {
                        let task = yield db_service_4.taskdb.findOneAndUpdate({
                            'task.taskId': taskId,
                            'state': 'uploading'
                        }, update, this.mongoCb);
                        if (i == siteSettings['template']['templates'].length - 1) {
                            ret.code = 0;
                            ret.result = task;
                        }
                    }
                }
            }
            return ret;
        });
    }
    updateTaskToDataReady(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            let update = {
                $set: {
                    state: task_interface_1.TASK_STATE.DATA_READY,
                    msg: data.msg,
                    updatedAt: new Date().toLocaleString()
                }
            };
            let task = yield db_service_4.taskdb.findOneAndUpdate({ 'task.taskId': data.taskId }, update, this.mongoCb);
            if (!task) {
                ret.code = 1;
            }
            else {
                ret.code = 0;
                ret.result = task;
            }
            return ret;
        });
    }
    finishTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            function video_name(data) {
                return __awaiter(this, void 0, void 0, function* () {
                    let response = yield axios_1.default.post('http://localhost:3000/wechat/video_name', data);
                });
            }
            try {
                yield video_name(data);
            }
            catch (err) {
            }
            const update = {
                state: task_interface_1.TASK_STATE.COMPLETE,
                msg: data.msg,
                updatedAt: new Date().toLocaleString()
            };
            const task = yield db_service_4.taskdb.findOneAndUpdate({ _id: data._id }, update, this.mongoCb);
            return task;
        });
    }
    finishEffectTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = {
                state: task_interface_1.TASK_STATE.EFFECT_FINISH,
                msg: data.msg,
                updatedAt: new Date().toLocaleString()
            };
            const task = yield db_service_4.taskdb.findOneAndUpdate({ 'task.taskId': data.taskId }, update, this.mongoCb);
            return task;
        });
    }
    onAbortTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('onAbortTask data=' + JSON.stringify(data));
            const update = {
                state: task_interface_1.TASK_STATE.ABORT,
                msg: data.msg,
                updatedAt: new Date().toLocaleString()
            };
            const task = yield db_service_4.taskdb.findOneAndUpdate({ _id: data._id }, update, this.mongoCb);
            return task;
        });
    }
    getTaskList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const tasklists = yield db_service_4.taskdb
                .find({ 'createdAt': { $regex: query['time'] } })
                .find(query['siteId'] ? { 'task.siteId': query['siteId'] } : {})
                .find({ 'del': { $ne: '1' } })
                .find(query['state'] ? { 'state': query['state'] } : {})
                .sort(query['sort'] ? { createdAt: -1 } : { createdAt: 1 })
                .limit(Number(query['limit']));
            for (let i = 0; i < tasklists.length; i++) {
                let siteSetting = yield db_service_3.soccorDbSiteSetting.findOne({ siteId: tasklists[i].task.siteId });
                if (siteSetting) {
                    tasklists[i].group = siteSetting.group;
                    tasklists[i]['task']['siteName'] = siteSetting.siteName;
                    let activity = yield db_service_1.activitydb.findOne({ activity_id: siteSetting.activity_id });
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
            }
            else {
                res = tasklists;
            }
            return res;
        });
    }
    mongoCb(err, doc, res) {
    }
    convertTask(_task, siteSettings) {
        console.log('convertTask=' + JSON.stringify(_task));
        siteSettings['output']['name'] = `${_task.siteId}_${_task.userId}_${_task.taskId}.mp4`;
        siteSettings['param']['text'] = _task.nickname;
        var new_task = [];
        if (siteSettings['param']['type'] == 'more') {
            for (var i = 0; i < siteSettings['template']['templates'].length; i++) {
                console.log('i=' + siteSettings['template']['templates'][i]);
                siteSettings['param']['template'] = siteSettings['template']['templates'][i] + '.' + siteSettings['template']['type'];
                let taskId = '';
                if (i > 0) {
                    taskId = _task.taskId + '_' + i;
                    delete siteSettings.param['template_foreground'];
                }
                else {
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
                if (i == 1) {
                    return new_task;
                }
            }
        }
        else {
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
    create_new_task(data) {
        return __awaiter(this, void 0, void 0, function* () {
            var orders = yield db_service_1.order.findOne({ 'openid': data.openid, 'order_id': data.out_trade_no });
            var newtask = {};
            var wechats = yield db_service_2.wechatdb.findOne({ 'wechat.openid': data.openid, 'source': orders.siteId });
            var tasks = yield db_service_4.taskdb.findOne({ 'task.output.name': wechats.videoNames[wechats.videoNames.length - 1] });
            if (orders !== null && orders.is_pay == 1) {
                let siteSettings = yield db_service_5.dbSiteSetting.findOne({ 'siteId': orders.siteId });
                for (var i = 0; i < orders.templates.length; i++) {
                    const uuidv1 = require('uuid/v1');
                    var taskId = uuidv1().replace(/-/g, '');
                    const date = new Date();
                    siteSettings['output']['name'] = `${orders.siteId}_${data.openid}_${taskId}.mp4`;
                    siteSettings['param']['text'] = tasks['task']['param']['text'];
                    if (orders.templates[i]) {
                        siteSettings['param']['template'] = orders.templates[i];
                    }
                    const task = {
                        'siteId': db_service_1.order.siteId,
                        'taskId': taskId,
                        'userId': data.openid,
                        'source': tasks.task['source'],
                        'cameraNum': tasks.task['cameraNum'],
                        'type': siteSettings['type'],
                        'param': siteSettings['param'],
                        'output': siteSettings['output']
                    };
                    const createTask = new db_service_4.taskdb({
                        task: task,
                        state: task_interface_1.TASK_STATE.DATA_READY,
                        createdAt: date.toLocaleString(),
                        updatedAt: date.toLocaleString(),
                        msg: ''
                    });
                    return yield createTask.save();
                }
            }
        });
    }
    get_test_task(task_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let tasks = yield db_service_4.taskdb.find({ 'task.taskId': task_id });
            console.log(tasks.length);
        });
    }
    get_task_file_lists(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let callback = {
                onSuccess: result => {
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
            };
            yield httpclient_1.default.list({
                prefix: `${data.taskId}`
            }, callback);
            return ret;
        });
    }
    onCancelTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            const update = {
                state: task_interface_1.TASK_STATE.CANCELLED,
                msg: data.msg,
                updatedAt: new Date().toLocaleString()
            };
            const task = yield db_service_4.taskdb.findOneAndUpdate({ 'task.taskId': data.task_id }, update, this.mongoCb);
            ret.code = 0;
            ret.description = 'Cancel task:' + data.task_id + ' succesful.';
            return ret;
        });
    }
    getBtSingleTaskStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            const tasklist = yield db_service_4.taskdb.find({ 'task.taskId': data.taskId, 'task.userId': data.userId, 'state': data.state });
            ret.code = 0;
            ret.result = tasklist;
            return ret;
        });
    }
    updateStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                if (!data.taskId || !data.role || !data.position) {
                    throw new Error(`无效的参数: taskId = ${data.taskId}, role = ${data.role}, position = ${data.position}`);
                }
                let task = yield db_service_4.taskdb.findOne({ 'task.taskId': data.taskId });
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
                    data.msg && (detail[index]['msg'] = data.msg);
                    data.shift && (detail[index]['shift'] = data.shift);
                }
                else {
                    detail.push({
                        'role': data.role,
                        'position': data.position,
                        'msg': data.msg || '',
                        'shift': data.shift || ''
                    });
                }
                update.$set['task.detail'] = detail;
                ret.result = yield db_service_4.taskdb.updateOne({ 'task.taskId': data.taskId }, update);
                ret.code = db_tools_1.dbTools.getUpdateCode(ret.result);
            }
            catch (error) {
                ret.code = 2;
                ret.description = `更新状态出错：${error}`;
            }
            return ret;
        });
    }
    getStatus(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield db_service_4.taskdb.findOne({ 'task.taskId': data.taskId });
            const retStatus = {
                'state': ret ? ret.state : '',
                'worker': '',
                'url': ''
            };
            if (ret && ret.task && ret.task.detail) {
                for (let i = 0; i < ret.task.detail.length; i++) {
                    if (ret.task.detail[i].role === 'worker') {
                        retStatus['worker'] = ret.task.detail[i].msg;
                    }
                    else if (ret.task.detail[i].role.startsWith('VideoCam')) {
                        retStatus[`videoCam_${ret.task.detail[i].position}_status`] = ret.task.detail[i].msg;
                    }
                    else {
                    }
                }
                if (ret.task.state == 'complete') {
                    retStatus['url'] = `https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/${ret.task.taskId}.mp4`;
                }
            }
            return retStatus;
        });
    }
    isAllFilesUpdated(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            let flag = false;
            try {
                yield db_service_4.taskdb.findOne({ 'task.taskId': taskId }, (err, raw) => {
                    if ((!err) && (raw)) {
                        let num = raw.task.cameraNum;
                        let hasUpdated = 0;
                        for (let i = 0; i < num; i++) {
                            if (raw.task['fileName' + (i + 1)] !== null && raw.task['fileName' + (i + 1)] !== 'null') {
                                hasUpdated++;
                            }
                        }
                        console.log('>>>> isAllFilesUpdated num / hasUpdated');
                        console.log(`num/hasUpdated = ${num}/${hasUpdated}`);
                        if (hasUpdated === num) {
                            flag = true;
                        }
                    }
                    else {
                        console.log(' >>>>  isAllFilesUpdated err', err);
                    }
                });
            }
            catch (e) {
                console.log(`task.service.ts >>> isAllFilesUpdated exception`);
                console.log(e);
            }
            return flag;
        });
    }
    getTaskStatusByDataType(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let tasklist = null;
            switch (query['data_type']) {
                case 'annoTool':
                    tasklist = yield db_service_4.taskdb.find({ 'task.siteId': query['siteId'] });
                    break;
            }
            ret.code = 0;
            ret.result = tasklist;
            return ret;
        });
    }
    delTask(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                if (!data.taskId) {
                    throw new Error(`无效的参数: taskId = ${data.taskId}`);
                }
                let task = yield db_service_4.taskdb.findOne({ 'task.taskId': data.taskId });
                if (!task) {
                    throw new Error(`没有找到对应的task： taskId = ${data.taskId}`);
                }
                let detail = task.task.detail || [];
                let update = {
                    $set: {}
                };
                update.$set['del'] = '1';
                ret.result = yield db_service_4.taskdb.updateOne({ 'task.taskId': data.taskId }, update);
                ret.code = db_tools_1.dbTools.getUpdateCode(ret.result);
            }
            catch (error) {
                ret.code = 2;
                ret.description = `更新状态出错：${error}`;
            }
            return ret;
        });
    }
    taskLike(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            if (!query['taskId'] || !query['openid']) {
                ret.code = 1;
                ret.description = '请检查参数';
                return ret;
            }
            let temp = yield db_service_4.taskdb.findOne({ 'task.taskId': query['taskId'] });
            if (!temp) {
                ret.code = 1;
                ret.description = '未发现该task';
                return ret;
            }
            for (var i = 0; i < temp.likes.length; i++) {
                if (temp.likes[i].openid == query.openid) {
                    yield db_service_4.taskdb.update({ 'task.taskId': query['taskId'] }, { '$pull': { 'likes': { openid: query.openid } } });
                    ret.code = 0;
                    ret.description = '取消赞成功';
                    return ret;
                }
            }
            let wxUser = {
                'openid': query['openid'],
                'timestamp': Math.round(new Date().getTime() / 1000)
            };
            yield db_service_4.taskdb.update({ 'task.taskId': query['taskId'] }, { '$push': { 'likes': wxUser } });
            ret.code = 0;
            ret.description = '赞成功';
            return ret;
        });
    }
    taskIfLike(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            if (!query['taskId'] || !query['openid']) {
                ret.code = 1;
                ret.description = '请检查参数';
                return ret;
            }
            let temp = yield db_service_4.taskdb.findOne({ 'task.taskId': query['taskId'] });
            if (!temp) {
                ret.code = 1;
                ret.description = '未发现该task';
                return ret;
            }
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
        });
    }
    taskLikeList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            if (!query['openid']) {
                ret.code = 1;
                ret.description = '请检查参数';
                return ret;
            }
            const tasklists = yield db_service_4.taskdb.find({ 'likes.openid': { $in: [query['openid']] } }).sort({ 'likes.timestamp': -1 });
            for (let i = 0; i < tasklists.length; i++) {
                let res = (yield db_service_1.datareportdb.findOne({ taskId: tasklists[i].task.taskId })) || {};
                tasklists[i]['task']['visit'] = res.visit || 0;
                tasklists[i]['task']['play'] = res.play || 0;
                tasklists[i]['task']['download'] = res.download || 0;
                tasklists[i]['task']['share'] = res.share || 0;
                tasklists[i]['task']['like'] = res.like || 0;
                let siteSetting = yield db_service_3.soccorDbSiteSetting.findOne({ siteId: tasklists[i].task.siteId });
                if (siteSetting) {
                    tasklists[i].group = siteSetting.group;
                    tasklists[i]['task']['siteName'] = siteSetting.siteName;
                }
            }
            return tasklists;
        });
    }
    taskCollect(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            if (!query['taskId'] || !query['openid']) {
                ret.code = 1;
                ret.description = '请检查参数';
                return ret;
            }
            let temp = yield db_service_4.taskdb.findOne({ 'task.taskId': query['taskId'] });
            if (!temp) {
                ret.code = 1;
                ret.description = '未发现该task';
                return ret;
            }
            for (var i = 0; i < temp.collects.length; i++) {
                if (temp.collects[i].openid == query.openid) {
                    yield db_service_4.taskdb.update({ 'task.taskId': query['taskId'] }, { '$pull': { 'collects': { openid: query.openid } } });
                    ret.code = 0;
                    ret.description = '取消收藏成功';
                    return ret;
                }
            }
            let wxUser = {
                'openid': query['openid'],
                'timestamp': Math.round(new Date().getTime() / 1000)
            };
            yield db_service_4.taskdb.update({ 'task.taskId': query['taskId'] }, { '$push': { 'collects': wxUser } });
            ret.code = 0;
            ret.description = '收藏成功';
            return ret;
        });
    }
    taskIfCollect(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            if (!query['taskId'] || !query['openid']) {
                ret.code = 1;
                ret.description = '请检查参数';
                return ret;
            }
            let temp = yield db_service_4.taskdb.findOne({ 'task.taskId': query['taskId'] });
            if (!temp) {
                ret.code = 1;
                ret.description = '未发现该task';
                return ret;
            }
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
        });
    }
    taskCollectList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            if (!query['openid']) {
                ret.code = 1;
                ret.description = '请检查参数';
                return ret;
            }
            const tasklists = yield db_service_4.taskdb.find({ 'collects.openid': { $in: [query['openid']] } }).sort({ 'collects.timestamp': -1 });
            for (let i = 0; i < tasklists.length; i++) {
                let res = (yield db_service_1.datareportdb.findOne({ taskId: tasklists[i].task.taskId })) || {};
                tasklists[i]['task']['visit'] = res.visit || 0;
                tasklists[i]['task']['play'] = res.play || 0;
                tasklists[i]['task']['download'] = res.download || 0;
                tasklists[i]['task']['share'] = res.share || 0;
                tasklists[i]['task']['like'] = res.like || 0;
                let siteSetting = yield db_service_3.soccorDbSiteSetting.findOne({ siteId: tasklists[i].task.siteId });
                if (siteSetting) {
                    tasklists[i].group = siteSetting.group;
                    tasklists[i]['task']['siteName'] = siteSetting.siteName;
                }
            }
            return tasklists;
        });
    }
    taskVisit(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            if (!query['taskId'] || !query['openid']) {
                ret.code = 1;
                ret.description = '请检查参数';
                return ret;
            }
            let temp = yield db_service_4.taskdb.findOne({ 'task.taskId': query['taskId'] });
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
            yield db_service_4.taskdb.update({ 'task.taskId': query['taskId'] }, { '$push': { 'visits': query['openid'] } });
            ret.code = 0;
            return ret;
        });
    }
    taskInfo(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            if (!query['taskId']) {
                ret.code = 1;
                ret.description = 'taskId不能为空';
                return ret;
            }
            let task = yield db_service_4.taskdb.findOne({ 'task.taskId': query['taskId'] });
            if (!task) {
                ret.code = 1;
                ret.description = '未发现该task';
                return ret;
            }
            let activity = (yield db_service_1.activitydb.findOne({ activity_id: task.activity_id })) || {};
            let result = {};
            result['createdAt'] = task.createdAt || '';
            result['activity_id'] = activity.activity_id || '';
            result['activity_name'] = activity.activity_name || '';
            return result;
        });
    }
};
TaskService = __decorate([
    common_1.Component()
], TaskService);
exports.TaskService = TaskService;
//# sourceMappingURL=task.service.js.map