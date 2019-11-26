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
const db_service_1 = require("../common/db.service");
const db_service_2 = require("../common/db.service");
const ret_component_1 = require("../common/ret.component");
const db_service_3 = require("../common/db.service");
let ActivityService = class ActivityService {
    getActivity(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = {};
            let res = yield db_service_2.activitydb.findOne({ activity_id: query['activity_id'] });
            if (!res) {
                return result;
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
            result['banner'] = res.banner || '';
            let siteSetting = yield db_service_1.soccorDbSiteSetting.find({ activity_id: query['activity_id'] });
            let tasklists = [];
            for (let i = 0; i < siteSetting.length; i++) {
                let temp = yield db_service_1.taskdb.find({ 'task.siteId': siteSetting[i].siteId }).find({ 'del': { $ne: '1' } });
                tasklists = tasklists.concat(temp);
            }
            let tasks = [];
            for (let i = 0; i < tasklists.length; i++) {
                let temptask = {};
                let res = yield db_service_3.datareportdb.findOne({ taskId: tasklists[i].task.taskId });
                temptask['activity_id'] = query['activity_id'];
                temptask['group'] = tasklists[i].group;
                temptask['state'] = tasklists[i].state;
                temptask['createdAt'] = tasklists[i].createdAt;
                temptask['updatedAt'] = tasklists[i].updatedAt;
                temptask['task'] = {};
                temptask['task']['siteId'] = tasklists[i].task.siteId;
                temptask['task']['taskId'] = tasklists[i].task.taskId;
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
        });
    }
    getActivityList(query) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_service_2.activitydb.find(query['wonderful'] ? { 'wonderful': query['wonderful'] } : {});
        });
    }
    activityVisit(query) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("activity_id:", query['activity_id']);
            console.log("openid:", query['openid']);
            let ret = new ret_component_1.RetObject;
            if (!query['activity_id'] || !query['openid']) {
                ret.code = 1;
                ret.description = '请检查参数';
                return ret;
            }
            let temp = yield db_service_2.activitydb.findOne({ activity_id: query['activity_id'] });
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
            yield db_service_2.activitydb.update({ 'activity_id': query['activity_id'] }, { '$push': { 'visits': query['openid'] } });
            ret.code = 0;
            return ret;
        });
    }
};
ActivityService = __decorate([
    common_1.Component()
], ActivityService);
exports.ActivityService = ActivityService;
//# sourceMappingURL=activity.service.js.map