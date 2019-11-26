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
} from "@nestjs/common";
import {RetObject} from "../common/ret.component";
import * as FS from "fs";
import axios from "axios";
import * as crypto from "crypto";
import {environment} from "../environment/environment";
import {Template} from "../wechat/template.component";
import {Datareport} from "./interface/datareport.interface";
import {Model} from "mongoose";

var mongoose = require("mongoose");
//微信的access_token
var JsonDB = require("node-json-db");

import * as ufile from "../../lib/ufile";
import {soccorDbSiteSetting, taskdb} from "../common/db.service";

const HttpRequest = ufile.HttpRequest;
const AuthClient = ufile.AuthClient;
const request = require("request");


@Component()
export class DatareportService {

    constructor(@Inject("DatereportModelToken") private readonly datareportModel: Model<Datareport>) {
    }

    //统计
    async point_page(data) {
        console.log("point_page data=" + JSON.stringify(data));
        let ret: RetObject = new RetObject;
        var time = Template.get_time();
        var tiaojian = {
            "siteId": data.siteId,
            "time": time
        };
        var mode = data.mode;
        var Datareports = await this.datareportModel.findOne(tiaojian);
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
            await createddatareports.save();
            ret.code = 0;
            ret.description = "Create data report on " + time + " successful.";
        } else {
            console.log("Update point_page data on" + time + ", mode:" + mode);
            var number = datareports[mode] + 1;
            if (mode == "play") {
                await this.datareportModel.update(tiaojian, {$set: {"play": number}});
            } else if (mode == "point") {
                await this.datareportModel.update(tiaojian, {$set: {"point": number}});
            } else if (mode == "share") {
                await this.datareportModel.update(tiaojian, {$set: {"share": number}});
            } else if (mode == "like") {
                await this.datareportModel.update(tiaojian, {$set: {"like": number}});
            }
            ret.code = 0;
            ret.description = "Increase " + mode + " successful.";
        }
        return ret;
    }

    async statistics(data) {
        let result: RetObject = new RetObject();

        try {
            let time = Template.get_time();
            let condition: any;
            condition = {
                siteId: data.siteId,
                templateId: data.templateId,
                time: time
            };

            if (data.activity_id) {
                // activity_id有效, 说明是统计首页的, 此时无具体某个task
                condition = {
                    'activity_id': data.activity_id
                };

            }

            if (data.taskId) {
                // taskId有效按照taskId 统计
                condition = {
                    'taskId': data.taskId
                };

                // 当统计某个taskId的同时, activity_id也要统计
                let task = await taskdb.findOne({'task.taskId': data.taskId});

                if (task && task.activity_id){
                    this.datareportModel.update({activity_id: task.activity_id}, {
                        $inc: {
                            visit: data.mode === "visit" ? 1 : 0,
                            play: data.mode === "play" ? 1 : 0,
                            download: data.mode === "download" ? 1 : 0,
                            share: data.mode === "share" ? 1 : 0,
                            like: data.mode === "like" ? 1 : 0
                        }
                    }, {upsert: true}, function (err, raw) {
                        err && console.log(err);
                        console.log("---------- callback of statistics update");
                        raw && console.log(raw);
                    });
                }
            }

            if (!data.siteId && !data.templateId && !data.taskId && !data.activity_id) {
                throw new Error(`无效参数`);
            }

            console.log(">>>>>>>>>>>>>>> [API] statistics");
            console.log(`taskId: ${data.taskId}`);
            console.log(`siteId: ${data.siteId}`);
            console.log(`activity_id: ${data.activity_id}`);
            console.log(`templateId: ${data.templateId}`);
            console.log(`time: ${time}`);
            console.log(`mode: ${data.mode}, mode === 'play': ${data.mode === "play"}`);
            console.log('condition:' + JSON.stringify(condition));
            this.datareportModel.update(condition, {
                $inc: {
                    visit: data.mode === "visit" ? 1 : 0,
                    play: data.mode === "play" ? 1 : 0,
                    download: data.mode === "download" ? 1 : 0,
                    share: data.mode === "share" ? 1 : 0,
                    like: data.mode === "like" ? 1 : 0
                }
            }, {upsert: true}, function (err, raw) {
                // err && console.log(err);
                console.log("err:", err)
                console.log("---------- callback of statistics update");
                raw && console.log(raw);
            });
            result.code = 0;
        } catch (e) {
            console.log(e);
            result.code = 1;
            result.description = `执行更插操作失败：${e}`;
        }

        return result;
    }

    async cancel_statistics(data) {
        let result: RetObject = new RetObject();

        try {
            let time = Template.get_time();
            let condition = {
                siteId: data.siteId,
                templateId: data.templateId,
                time: time
            };

            if (data.taskId) {
                // taskId有效按照taskId 统计
                condition = {
                    taskId: data.taskId
                };
            } else if (!data.siteId || !data.templateId) {
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
            }, {upsert: true}, function (err, raw) {
                err && console.log(err);
                console.log("---------- callback of statistics update");
                raw && console.log(raw);
            });
            result.code = 0;
        } catch (e) {
            console.log(e);
            result.code = 1;
            result.description = `执行更插操作失败：${e}`;
        }

        return result;
    }

    async get_data(siteId) {
        console.log("point_page siteId=" + siteId);
        let ret: RetObject = new RetObject;
        var Datareports = await this.datareportModel.find({"siteId": siteId});
        var datareports = JSON.parse(JSON.stringify(Datareports));
        ret.code = 0;
        ret.result = datareports;
        return ret;
    }

    async get_statistics(siteId) {
        let ret: RetObject = new RetObject();

        try {
            if (!siteId) {
                throw new Error(`siteId: ${siteId} 无效`);
            }

            let datareports = await this.datareportModel.aggregate([
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
        } catch (e) {
            console.log(e);
            ret.code = 1;
            ret.description = `执行aggregate操作失败：${e}`;
        }

        return ret;
    }

    async getTaskStatistics(taskId) {
        let ret: RetObject = new RetObject();

        try {
            if (!taskId) {
                throw new Error(`无效的taskId = ${taskId}`);
            }

            let result = await this.datareportModel.find({
                taskId
            });
            if (result) {
                ret.code = 0;
                ret.result = result;
            } else {
                ret.code = 1;
            }
        } catch (e) {
            ret.code = 2;
            ret.description = `按任务获取统计数据失败: ${e}`
        }

        return ret;
    }

    async download_file(method, bucket, key, content_md5, content_type, date) {
        console.log("download_file key=" + key);
        let ret: RetObject = new RetObject;
        const file_path = "./report/1.mp4"; // source file path + name
        const url_path_params = "/" + key;
        const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
        const client = new AuthClient(req);
        ret.code = 0;
        return client.MakeAuth();
    }

    async import_data() {
        let ret: RetObject = new RetObject;
        ret.code = 0;
        return ret;
    }

}

