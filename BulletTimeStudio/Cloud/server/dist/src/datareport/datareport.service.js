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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
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
const ret_component_1 = require("../common/ret.component");
const template_component_1 = require("../wechat/template.component");
const mongoose_1 = require("mongoose");
var mongoose = require("mongoose");
var JsonDB = require("node-json-db");
const ufile = require("../../lib/ufile");
const HttpRequest = ufile.HttpRequest;
const AuthClient = ufile.AuthClient;
const request = require("request");
let DatareportService = class DatareportService {
    constructor(datareportModel) {
        this.datareportModel = datareportModel;
    }
    point_page(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("point_page data=" + JSON.stringify(data));
            let ret = new ret_component_1.RetObject;
            var time = template_component_1.Template.get_time();
            var tiaojian = {
                "siteId": data.siteId,
                "time": time
            };
            var mode = data.mode;
            var Datareports = yield this.datareportModel.findOne(tiaojian);
            var datareports = JSON.parse(JSON.stringify(Datareports));
            if (datareports == null || datareports[mode] == undefined) {
                console.log("Create point_page data on" + time);
                var createddatareports = new this.datareportModel({
                    "siteId": data.siteId,
                    "time": time,
                    "point": 1,
                    "play": 1,
                    "like": 1,
                    "share": 1
                });
                yield createddatareports.save();
                ret.code = 0;
                ret.description = "Create data report on " + time + " successful.";
            }
            else {
                console.log("Update point_page data on" + time + ", mode:" + mode);
                var number = datareports[mode] + 1;
                if (mode == "play") {
                    yield this.datareportModel.update(tiaojian, { $set: { "play": number } });
                }
                else if (mode == "point") {
                    yield this.datareportModel.update(tiaojian, { $set: { "point": number } });
                }
                else if (mode == "share") {
                    yield this.datareportModel.update(tiaojian, { $set: { "share": number } });
                }
                else if (mode == "like") {
                    yield this.datareportModel.update(tiaojian, { $set: { "like": number } });
                }
                ret.code = 0;
                ret.description = "Increase " + mode + " successful.";
            }
            return ret;
        });
    }
    statistics(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = new ret_component_1.RetObject();
            try {
                let time = template_component_1.Template.get_time();
                let condition = {
                    siteId: data.siteId,
                    templateId: data.templateId,
                    time: time
                };
                if (data.taskId) {
                    condition = {
                        taskId: data.taskId
                    };
                }
                else if (!data.siteId || !data.templateId) {
                    throw new Error(`siteId: ${data.siteId} 或 templateId: ${data.templateId} 无效`);
                }
                console.log(">>>>>>>>>>>>>>> [API] statistics");
                console.log(`taskId: ${data.taskId}`);
                console.log(`siteId: ${data.siteId}`);
                console.log(`templateId: ${data.templateId}`);
                console.log(`time: ${time}`);
                console.log(`mode: ${data.mode}, mode === 'play': ${data.mode === "play"}`);
                this.datareportModel.update(condition, {
                    $inc: {
                        visit: data.mode === "visit" ? 1 : 0,
                        play: data.mode === "play" ? 1 : 0,
                        download: data.mode === "download" ? 1 : 0,
                        share: data.mode === "share" ? 1 : 0,
                        like: data.mode === "like" ? 1 : 0
                    }
                }, { upsert: true }, function (err, raw) {
                    err && console.log(err);
                    console.log("---------- callback of statistics update");
                    raw && console.log(raw);
                });
                result.code = 0;
            }
            catch (e) {
                console.log(e);
                result.code = 1;
                result.description = `执行更插操作失败：${e}`;
            }
            return result;
        });
    }
    cancel_statistics(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let result = new ret_component_1.RetObject();
            try {
                let time = template_component_1.Template.get_time();
                let condition = {
                    siteId: data.siteId,
                    templateId: data.templateId,
                    time: time
                };
                if (data.taskId) {
                    condition = {
                        taskId: data.taskId
                    };
                }
                else if (!data.siteId || !data.templateId) {
                    throw new Error(`siteId: ${data.siteId} 或 templateId: ${data.templateId} 无效`);
                }
                console.log(">>>>>>>>>>>>>>> [API] statistics");
                console.log(`taskId: ${data.taskId}`);
                console.log(`siteId: ${data.siteId}`);
                console.log(`templateId: ${data.templateId}`);
                console.log(`time: ${time}`);
                console.log(`mode: ${data.mode}, mode === 'play': ${data.mode === "play"}`);
                this.datareportModel.update(condition, {
                    $inc: {
                        share: data.mode === "share" ? -1 : 0,
                        like: data.mode === "like" ? -1 : 0
                    }
                }, { upsert: true }, function (err, raw) {
                    err && console.log(err);
                    console.log("---------- callback of statistics update");
                    raw && console.log(raw);
                });
                result.code = 0;
            }
            catch (e) {
                console.log(e);
                result.code = 1;
                result.description = `执行更插操作失败：${e}`;
            }
            return result;
        });
    }
    get_data(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("point_page siteId=" + siteId);
            let ret = new ret_component_1.RetObject;
            var Datareports = yield this.datareportModel.find({ "siteId": siteId });
            var datareports = JSON.parse(JSON.stringify(Datareports));
            ret.code = 0;
            ret.result = datareports;
            return ret;
        });
    }
    get_statistics(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            try {
                if (!siteId) {
                    throw new Error(`siteId: ${siteId} 无效`);
                }
                let datareports = yield this.datareportModel.aggregate([
                    {
                        $match: {
                            siteId
                        }
                    },
                    {
                        $group: {
                            _id: "$time",
                            templates: {
                                $push: {
                                    templateId: "$templateId",
                                    like: "$like",
                                    visit: "$visit",
                                    download: "$download",
                                    share: "$share",
                                    play: "$play"
                                }
                            }
                        }
                    },
                    {
                        $project: {
                            time: "$_id",
                            templates: "$templates"
                        }
                    }
                ]);
                ret.code = 0;
                ret.result = JSON.parse(JSON.stringify(datareports));
            }
            catch (e) {
                console.log(e);
                ret.code = 1;
                ret.description = `执行aggregate操作失败：${e}`;
            }
            return ret;
        });
    }
    getTaskStatistics(taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            try {
                if (!taskId) {
                    throw new Error(`无效的taskId = ${taskId}`);
                }
                let result = yield this.datareportModel.find({
                    taskId
                });
                if (result) {
                    ret.code = 0;
                    ret.result = result;
                }
                else {
                    ret.code = 1;
                }
            }
            catch (e) {
                ret.code = 2;
                ret.description = `按任务获取统计数据失败: ${e}`;
            }
            return ret;
        });
    }
    download_file(method, bucket, key, content_md5, content_type, date) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("download_file key=" + key);
            let ret = new ret_component_1.RetObject;
            const file_path = "./report/1.mp4";
            const url_path_params = "/" + key;
            const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
            const client = new AuthClient(req);
            ret.code = 0;
            return client.MakeAuth();
        });
    }
    import_data() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret.code = 0;
            return ret;
        });
    }
};
DatareportService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject("DatereportModelToken")),
    __metadata("design:paramtypes", [mongoose_1.Model])
], DatareportService);
exports.DatareportService = DatareportService;
//# sourceMappingURL=datareport.service.js.map