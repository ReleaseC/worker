import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import {
    dbSiteSetting,
    shareDbSiteSetting,
    soccorDbSiteSetting,
    template,
    accountMatchSites,
    CameraSettingdb,
    bindingDeviceTableDb,
    siteSettingModel,
    soccorSiteSettingSchema,
    basketAnnoSiteSettingSchema, accountdb,
} from '../common/db.service';
import { RetObject } from '../common/ret.component';
import { AuthService } from '../account/auth.service';
import { SiteGeneralSettings, SiteVideoSettings, SiteGeneralSettingsRequest, SiteVideoSettingsRequest, SiteQueryRequest, SiteGroupRequest, FFmpegConfig } from './interface/site.interface';
import { dbTools } from '../common/db.tools';
import { Global } from '../common/global.services';
import { BASKETBALL_EVENT, MEDIA_WORKER_EVENT } from '../common/socket.interface';
import { Exception } from "winston";
import { AccountService } from "../account/account.service";
const authService = new AuthService();

const uuidv1 = require('uuid/v1');
var JsonDB = require('node-json-db');
const redis = require('redis');
const bluebird = require("bluebird");
const client = bluebird.promisifyAll(redis.createClient());

@Component()
export class SiteService {

    addZero(number) {
        let s = number + "";
        while (s.length < 4) s = "0" + s;
        return s;
    }

    async addSite(data) {
        console.log('addSite data.type=' + data.type);
        let ret: RetObject = new RetObject;
        if (data.type === 'soccer') {
            await soccorDbSiteSetting.findOne({ siteName: data.siteName }, async (err, site) => {
                if (err) {
                    ret.code = -1;
                    ret.result = err;
                }
                if (site) {
                    ret.code = 1;
                    ret.description = 'Site has been added';
                } else {
                    let newSite = new soccorDbSiteSetting();
                    newSite.siteId = uuidv1().replace(/-/g, '');
                    newSite.siteName = data.siteName;
                    newSite.siteType = 'SOCCOR';
                    newSite.save();
                    ret.code = 0;
                    ret.description = 'Add new soccer site successful.';
                }
            });
        } else {
            await dbSiteSetting.findOne({ siteId: data.siteId }, (err, site) => {
                if (err) ret = err;
                if (site) {
                    ret.description = 'Site ID has been added';
                } else {
                    let newSite = new dbSiteSetting();
                    newSite.siteId = data.siteId;
                    newSite.name = data.name;
                    newSite.type = data.type;
                    newSite.param = data.param;
                    newSite.source = data.source;
                    newSite.output = data.output;
                    newSite.accessToken = uuidv1().replace(/-/g, '');
                    newSite.expireTime = new Date().getTime() + (1000 * 24 * 60 * 60 * 30); // 30 Days
                    newSite.template = data.template;
                    newSite.deviceConfig = data.deviceConfig;
                    newSite.sparedeviceConfig = data.sparedeviceConfig;
                    newSite.save();
                    ret.code = 0;
                    ret.description = 'Add new BT site successful.';
                }
            });
        }
        return ret;
    }

    async getSiteNames(data) {
        console.log('getSiteNames data.type=' + data.type);
        let ret: RetObject = new RetObject;
        if (data.type === 'soccor') {
            return await soccorDbSiteSetting.distinct("siteName");
        } else {
            return await dbSiteSetting.distinct("name");
        }
    }

    async getGroupLists(data) {
        const accessToken = data.accessToken;
        const ret = [
            { groupId: 'S001' },
        ];
        return ret;
    }

    async getSiteLists(data) {
        const acc = data.account;
        const matchSiteIDs = await accountMatchSites.find({ account: acc });
        let ret = [];
        for (let i = 0; i < matchSiteIDs.length; i++) {
            const soccer = await soccorDbSiteSetting.find({ siteId: matchSiteIDs[i].siteId });
            ret.push(soccer[0]);
        }

        // const ret = [
        //     {
        //         siteName: '左球門',
        //         siteId: '0001',
        //     },{
        //         siteName: '右球門',
        //         siteId: '0002',
        //     },
        // ];
        return ret;
    }

    async getSiteDetail(data) {
        console.log("getSiteDetail, data.type=" + data.type);
        let ret: RetObject = new RetObject;
        if (data.type === 'soccer') {
            ret.code = 0;
            ret.result = await soccorDbSiteSetting.find().sort({ region: 1, siteName: 1 });
        } else {
            ret.code = 0;
            ret.result = await dbSiteSetting.findOne({ siteId: data.siteId });
        }
        return ret;
    }

    async updateSite(data) {
        console.log('updateSite data.type = ' + data.type);
        let ret: RetObject = new RetObject;
        if (data.type === 'soccer') {
            ret.code = 1;
            ret.description = 'obsolete';
        } else {
            await dbSiteSetting.findOne({ siteId: data.siteId }, (err, site) => {
                if (err) ret = err;
                if (site) {
                    site.siteId = data.siteId;
                    site.name = data.name;
                    site.type = data.type;
                    site.param = data.param;
                    site.source = data.source;
                    site.output = data.output;
                    site.template = data.template;
                    site.deviceConfig = data.deviceConfig;
                    site.sparedeviceConfig = data.sparedeviceConfig;
                    site.save();
                    ret.code = 0;
                    ret.description = 'success';
                } else {
                    ret.code = 1;
                    ret.description = 'No site Id founded';
                }
            });
        }
        return ret;
    }

    async siteLoginCheck(data) {
        console.log('siteLoginCheck=' + JSON.stringify(data));
        let ret: RetObject = new RetObject;

        if (data.type === 'soccor') {
            await soccorDbSiteSetting.findOne({ accessToken: data.accessToken }, async (err, site) => {
                if (err) {
                    ret.code = 0;
                    ret.description = "there is error";
                }
                if (site) {
                    // access token verify OK
                    const currentDate = new Date().getTime();
                    const expireDate = site.expireTime;
                    console.log('minus=' + (expireDate - currentDate));
                    if ((expireDate - currentDate) < 0) {
                        // ToDo: 20180605
                        // accessToken expire
                        // site.accessToken = uuidv1().replace(/-/g, '');
                        // site.expireTime = new Date().getTime() + ( 1000 * 24 * 60 * 60 * 30 ); // 30 Days
                        // site.save();
                    }
                    ret.code = 1;
                    ret.description = "success";
                    ret.result = site;
                }
            });
        } else {
            await dbSiteSetting.findOne({ $and: [{ siteId: data.siteId }, { accessToken: data.accessToken }] }, (err, site) => {
                if (err) {

                    ret.code = 0;
                    ret.description = "there is error";
                }
                if (site) {
                    const currentDate = new Date().getTime();
                    const expireDate = site.expireTime;
                    console.log('minus=' + (expireDate - currentDate));
                    if ((expireDate - currentDate) < 0) {
                        // accessToken expire
                        site.accessToken = uuidv1().replace(/-/g, '');
                        site.expireTime = new Date().getTime() + (1000 * 24 * 60 * 60 * 30); // 30 Days
                        site.save();
                    }
                    ret.code = 1;
                    ret.description = "success"
                    ret.result = {
                        'siteId': data.siteId,
                        'accessToken': site.accessToken,
                        'expireTime': site.expireTime,
                    };
                } else {

                    ret.code = 0;
                    ret.description = "No site Id founded"
                    ret.result = {
                        'siteId': data.siteId,
                    };
                }
            });
        }
        return ret;
    }

    async getTemplate() {
        let ret: RetObject = new RetObject;
        var templates = await template.find();
        ret.code = 0;
        ret.result = templates
        return ret;
    }

    async addTemplate(data) {
        let ret: RetObject = new RetObject;
        var templates = await template.find();
        var newtemplates = templates.concat(data.template);
        await template.update({}, { $set: { "template": newtemplates } });
        ret.code = 0;
        ret.description = "Add new template successful.";
        return ret;
    }

    async changeDeviceConfig(data) {
        let ret: RetObject = new RetObject
        let site = await dbSiteSetting.findOneAndUpdate({ siteId: data.siteId }, { "deviceConfig": data.deviceConfig, "sparedeviceConfig": data.deviceConfig });
        if (site !== null) {
            ret.code = 0;
            ret.description = "Update device config. successful.";
        } else {
            ret.code = 1;
            ret.description = "Fail to update device config.";
        }
        return ret;
    }

    async getCameraSetting() {
        let ret: RetObject = new RetObject
        let CameraSetting = await CameraSettingdb.find();
        if (CameraSetting !== null) {
            ret.code = 1;
            ret.result = CameraSetting;
        } else {
            ret.code = 0;
            ret.description = "no CameraSetting"
        }
        return ret;
    }

    async addCameraSetting(data) {
        console.log('data:', data)
        let ret: RetObject = new RetObject
        if (!data.siteId || !data.cameraSetting || !data.cameraSetting.role || !data.cameraSetting.position || !data.cameraSetting.rotation || !data.cameraSetting.scale) {
            ret.code = 1
            ret.description = "请检查参数"
            return ret
        }

        let site = await soccorDbSiteSetting.findOne({ siteId: data.siteId })
        var exist = 0
        if (site !== null) {
            ret.code = 0;
            ret.description = "ok";
            if (site.cameraSetting) {
                for (let i = 0; i < site.cameraSetting.length; i++) {
                    if (site.cameraSetting[i].role == data.cameraSetting.role && site.cameraSetting[i].position == data.cameraSetting.position) {
                        // 已有该设备
                        await soccorDbSiteSetting.update(
                            { "cameraSetting.position": site.cameraSetting[i].position },
                            { "$set": { "cameraSetting.$": data.cameraSetting } }
                        )
                        exist = 1
                    }
                }
            }
        } else {
            ret.code = 1;
            ret.description = "no site: " + data.siteId;
        }

        if (exist == 1) {
            return ret;
        }

        await soccorDbSiteSetting.update({ siteId: data.siteId },
            { '$push': { cameraSetting: data.cameraSetting } });
        return ret;
    }

    async getAccountMatchSites() {
        let ret: RetObject = new RetObject;
        ret.code = 0;
        ret.result = await accountMatchSites.find().sort({ region: 1 });
        return ret;
    }

    async addAccountMatchSites(data) {
        console.log('accountMatchSites siteId = ' + data.siteId);
        let ret: RetObject = new RetObject
        await accountMatchSites.findOne({ siteId: data.siteId }, async (err, site) => {
            if (err) {
                ret.code = -1;
                ret.result = err;
            } else {
                if (site) {
                    ret.code = 1;
                    ret.description = 'Site id:' + data.siteId + 'has already added.';
                } else {
                    let newSite = new accountMatchSites();
                    newSite.account = data.account;
                    newSite.siteId = data.siteId;
                    newSite.save();
                    ret.code = 0;
                    ret.description = 'Add new accountMatchSites setting.';
                }
            }
        });
        return ret;
    }

    async getBindingTable() {
        let ret: RetObject = new RetObject;
        ret.code = 0;
        ret.result = await bindingDeviceTableDb.find().sort({ deviceId: 1 });
        return ret;
    }

    async setBindingTable(data) {
        console.log('setBindingTable data.deviceId=' + data.deviceId);
        let ret: RetObject = new RetObject;
        if (data.isbind) {
            ret.code = 1;
            ret.result = await bindingDeviceTableDb.remove({ deviceId: data.deviceId });
        } else {
            await bindingDeviceTableDb.findOne({ device: data.deviceId }, async (err, device) => {
                if (err) {
                    ret.code = -1;
                    ret.result = err;
                } else {
                    if (device) {
                        ret.code = 1;
                        ret.description = "This device is already binding to siteName:" + device.siteName + " and role:" + device.role;
                    } else {
                        if (data.role == 'admin') {
                            let accountMatch = await accountMatchSites.findOne({ siteId: data.siteId });
                            let accountMatchs = await accountMatchSites.find({ account: accountMatch.account });
                            const accountMatchLen = accountMatchs.length;
                            for (let i = 0; i < accountMatchLen; i++) {
                                let newBindDevice = new bindingDeviceTableDb();
                                newBindDevice.siteId = accountMatchs[i].siteId;
                                newBindDevice.role = data.role;
                                newBindDevice.deviceId = data.deviceId;
                                newBindDevice.save();
                            }
                        } else {
                            let newBindDevice = new bindingDeviceTableDb();
                            newBindDevice.siteId = data.siteId;
                            newBindDevice.role = data.role;
                            newBindDevice.deviceId = data.deviceId;
                            newBindDevice.save();
                        }
                        ret.code = 0;
                        ret.description = 'success';
                    }
                }
            });
        }
        return ret;
    }

    async getHeartbeatRedis(data) {
        let ret: RetObject = new RetObject;
        if (await client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role)) {
            ret.result = {
                'temperature': await client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_temp'),
                'power': await client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_power'),
                'charging': await client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_charging'),
                'version': await client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_version'),
                'goal': await client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_goal'),
                'msg': await client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_msg'),
                'timestamp': await client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_timestamp'),
                'lastUpdate': await client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_lastUpdate'),
                'isRecording': await client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_isRecording'),
            };
        }
        return ret;
    }

    async setHeartbeatRedis(data) {
        let ret: RetObject = new RetObject;

        if (data.status) {
            client.set(data.siteId + '_' + data.deviceId + '_' + data.role, 'OK');
            client.set(data.siteId + '_' + data.deviceId + '_' + data.role + '_temp', data.status.temperature);
            client.set(data.siteId + '_' + data.deviceId + '_' + data.role + '_power', data.status.power);
            client.set(data.siteId + '_' + data.deviceId + '_' + data.role + '_charging', data.status.charging);
            client.set(data.siteId + '_' + data.deviceId + '_' + data.role + '_version', data.status.version);

            client.set(data.siteId + '_' + data.deviceId + '_' + data.role + '_goal', data.status.goal || "");
            client.set(data.siteId + '_' + data.deviceId + '_' + data.role + '_msg', data.status.msg || "");
            client.set(data.siteId + '_' + data.deviceId + '_' + data.role + '_timestamp', data.status.timestamp || "");
            client.set(data.siteId + '_' + data.deviceId + '_' + data.role + '_lastUpdate', (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString());

            client.set(data.siteId + '_' + data.deviceId + '_' + data.role + '_isRecording', data.status.isRecording || false);
        }
        return ret;
    }

    // ------------------------ V2 Site ------------------------------
    async postSiteSetting(body) {
        let ret: RetObject = new RetObject;
        const data = body.data;
        const typeToUpperCase = body.type.toUpperCase();

        ret = await authService.authAccessToken(body.access_token);
        if (ret.code != 0) {
            return ret;
        }

        switch (typeToUpperCase) {
            case 'SOCCOR':
            case 'BASKETBALL':
                await soccorDbSiteSetting.findOne({ siteName: data.siteName }, async (err, site) => {
                    if (err) {
                        ret.code = 1;
                        ret.description = err.toString();
                    }
                    if (site) {
                        ret.code = 1;
                        ret.description = 'There is a same site name on :' + data.siteName;
                    } else {
                        let newSite = new soccorDbSiteSetting();
                        newSite.siteId = uuidv1().replace(/-/g, '');
                        newSite.siteName = data.siteName;
                        newSite.siteType = data.siteType;
                        newSite.save();
                        ret.code = 0;
                        ret.description = 'Add new site successful.';
                    }
                });
                break;
            case 'BT':
            case 'BT-1':
                await dbSiteSetting.findOne({ siteId: data.siteId }, (err, site) => {
                    if (err) {
                        ret.code = -1;
                        ret.result = err;
                    }
                    if (site) {
                        ret.description = 'Site ID has been added';
                    } else {
                        let newSite = new dbSiteSetting();
                        newSite.siteId = data.siteId;
                        newSite.name = data.name;
                        newSite.type = data.type;
                        newSite.param = data.param;
                        newSite.source = data.source;
                        newSite.output = data.output;
                        newSite.accessToken = uuidv1().replace(/-/g, '');
                        newSite.expireTime = new Date().getTime() + (1000 * 24 * 60 * 60 * 30); // 30 Days
                        newSite.template = data.template;
                        newSite.deviceConfig = data.deviceConfig;
                        newSite.sparedeviceConfig = data.sparedeviceConfig;
                        newSite.save();
                        ret.code = 0;
                        ret.description = 'Add new BT site successful.';
                    }
                });
                break;
            default:
                ret.code = 1;
                ret.description = "No setting on site type: " + typeToUpperCase;
                break;
        }
        return ret;
    }

    async getSiteSetting(query) {
        let ret: RetObject = new RetObject;
        let result;
        const typeToUpperCase = query['type'].toUpperCase();

        ret = await authService.authAccessToken(query['access_token']);
        if (ret.code != 0) {
            return ret;
        }

        console.log('query[\'type\']=' + typeToUpperCase);
        switch (typeToUpperCase) {
            case 'SOCCOR':
            case 'BASKETBALL':
            case 'LEKE':
                result = await soccorDbSiteSetting
                    .find({ "siteType": typeToUpperCase })
                    .find(query['group'] ? { "group": query['group'] } : {})
                    .sort({ region: 1, siteName: 1 });
                //console.log('result=' + JSON.stringify(result));
                if (result.length) {
                    ret.code = 0;
                    ret.result = result;
                } else {
                    ret.code = 1;
                    ret.description = "No data on site type: " + typeToUpperCase;
                }
                break;
            case 'BT':
            case 'BT-1':
                result = await dbSiteSetting.find({});
                if (result.length) {
                    ret.code = 0;
                    ret.result = result;
                } else {
                    ret.code = 1;
                    ret.description = "Nodata on site type: " + typeToUpperCase;
                }
                break;
            default:
                ret.code = 1;
                ret.description = "Site: " + typeToUpperCase + " undefined.";
                break;
        }
        return ret;
    }

    async getSiteSettingInfo(body) {
        let ret: RetObject = new RetObject;
        let result;
        const typeToUpperCase = body.type.toUpperCase();

        ret = await authService.authAccessToken(body.access_token);
        if (ret.code != 0) {
            return ret;
        }

        switch (typeToUpperCase) {
            case 'SOCCOR':
            case 'BASKETBALL':
            case 'LEKE':
            case 'LUOKE':
                result = await soccorDbSiteSetting.findOne({ "siteType": typeToUpperCase, "siteId": body.siteId }).sort({ region: 1, siteName: 1 });
                if (result) {
                    ret.code = 0;
                    ret.result = result;
                } else {
                    ret.code = 1;
                    ret.description = "No data on site type: " + typeToUpperCase;
                }
                break;
            case 'BT':
            case 'BT-1':
                result = await dbSiteSetting.findOne({ "type": typeToUpperCase, "siteId": body.siteId });
                if (result) {
                    ret.code = 0;
                    ret.result = result;
                } else {
                    ret.code = 1;
                    ret.description = "Nodata on site type: " + typeToUpperCase;
                }
                break;
            default:
                ret.code = 1;
                ret.description = "Site: " + typeToUpperCase + " undefined.";
                break;
        }
        return ret;
    }

    async updateSiteSetting(body) {
        let ret: RetObject = new RetObject;
        let result;
        const typeToUpperCase = body.type.toUpperCase();

        ret = await authService.authAccessToken(body.access_token);
        if (ret.code != 0) {
            return ret;
        }

        switch (typeToUpperCase) {
            case 'SOCCOR':
            case 'BASKETBALL':
                result = await soccorDbSiteSetting.update({ siteId: body.data.siteId }, body.data);
                console.log('result=' + JSON.stringify(result));
                if (result.ok) {
                    ret.code = 0;
                    ret.description = "Site setting:" + body.data.siteId + " update successful.";
                } else {
                    ret.code = 1;
                    ret.description = "No data on siteId: " + body.data.siteId;
                }
                break;
            case 'BT':
            case 'BT-1':
                result = await dbSiteSetting.update({ siteId: body.data.siteId }, body.data);
                console.log('result=' + JSON.stringify(result));
                if (result.ok) {
                    ret.code = 0;
                    ret.description = "Site setting:" + body.data.siteId + " update successful.";
                } else {
                    ret.code = 1;
                    ret.description = "Nodata on siteId: " + body.data.siteId;
                }
                break;
            default:
                ret.code = 1;
                ret.description = "Site setting : " + body.data.siteId + " undefined.";
                break;
        }
        return ret;
    }

    async bind(query) {
        let ret: RetObject = new RetObject;
        const typeToUpperCase = query['type'].toUpperCase();
        let result;
        console.log('bind=' + JSON.stringify(query));

        // No use
        // if((query['role'] != "GoalCam") && (query['role'] != "V-Cam 1") && (query['role'] != "V-Cam 2") && (query['role'] != "V-Cam 3")){
        //     ret.code = 1;
        //     ret.description = "Role: " + query['role'] + " is unrecognized.";
        //     return ret;
        // }

        // if((query['position'] != 0) && (query['position'] != 1) && (query['position'] != 2) && (query['position'] != 3)){
        //     ret.code = 1;
        //     ret.description = "Position: " + query['position'] + " is unrecognized.";
        //     return ret;
        // }

        ret = await authService.authAccessToken(query['access_token']);
        if (ret.code != 0) {
            return ret;
        }

        switch (typeToUpperCase) {
            case 'SOCCOR':
            case 'BASKETBALL':
                // result = await soccorDbSiteSetting.findOne({ siteId: query['siteId'] });
                // if (result) {
                //     ret.code = 0;
                //     // find role
                //     let deviceConfigLen = result.deviceConfig.length;
                //     for (let i = 0; i < deviceConfigLen; i++) {
                //         if (result.deviceConfig[i].role === query['role']) {
                //             result.deviceConfig[i].deviceId = query['deviceId'];
                //             result.deviceConfig[i].position = query['position'];
                //             await result.update({ "deviceConfig": result.deviceConfig });
                //             ret.code = 0;
                //             ret.description = "Role:" + query['role'] + ", deviceId:" + query['deviceId'] + ", position:" + query['position'] + " update successful.";
                //             return ret;
                //         }
                //     }
                //     result.deviceConfig.push({
                //         "role": query['role'],
                //         "deviceId": query['deviceId'],
                //         "position": query['position']
                //     });
                //     result.save();
                //     ret.code = 0;
                //     ret.description = "Role:" + query['role'] + ", deviceId:" + query['deviceId'] + ", position:" + query['position'] + " insert successful.";
                // } else {
                //     ret.code = 1;
                //     ret.description = "No data on siteId: " + query['siteId'];
                // }
                ret = await this.bindBasketBallDevice(query);
                break;
            default:
                ret.code = 1;
                ret.description = "Type : " + typeToUpperCase + " not support this api";
                break;
        }
        return ret;
    }

    async bindBasketBallDevice(query) {
        let ret: RetObject = new RetObject;

        try {
            console.log(`bindBasketBallDevice query >>> `);
            console.log(query);
            this.validateSiteId(query.siteId);

            // await soccorDbSiteSetting.update({ siteId: query.siteId }, { $pull: { deviceConfig: { role: query.role } } });
            // await soccorDbSiteSetting.update({}, { $pull: { deviceConfig: { deviceId: query.deviceId } } }, { multi: true });
            // ret = await soccorDbSiteSetting.update({ siteId: query.siteId }, { $addToSet: { deviceConfig: { role: query.role, deviceId: query.deviceId, position: query.position } } }, {});

            // if (ret['ok'] === 1 && ret['nModified'] !== 0) {
            //     ret = new RetObject();
            //     ret.code = 0;
            // } else {
            //     ret.code = 1;
            //     ret.description = `${ret['ok'] !== 1 ? "执行更新失败" : ""} ${ret['nModified'] === 0 ? "受影响行数为0" : "受影响行数为：" + ret['nModified']}`;
            // }

            // Query all siteId and clear which include deviceId=query.deviceId
            // 找尋所有siteId, 把有deviceId=query.deviceId的config都清掉
            let result = await soccorDbSiteSetting.update({}, { $pull: { deviceConfig: { deviceId: query.deviceId } } }, { multi: true });

            // Clear config in specific siteId and role=query.role and position=query.position
            // 根據指定siteId, 把目前role=query.role和position=query.position的資料清掉
            result = await soccorDbSiteSetting.update({siteId: query.siteId}, { $pull: { deviceConfig: { role: query.role, position: query.position+"" } } });
            console.log('result 1 ='+JSON.stringify(result));

            // Add config in specific siteId
            // 新增config
            result = await soccorDbSiteSetting.update({ siteId: query.siteId }, { $addToSet: { deviceConfig: { role: query.role, deviceId: query.deviceId, position: query.position+"" } }});
            console.log('result 2 ='+JSON.stringify(result));

        } catch (error) {
            ret.code = 2;
            ret.description = `绑定篮球设备发生错误：${error}`;
        }
        ret.code = 0;
        return ret;
    }

    async prebind(query) {
        let ret: RetObject = new RetObject;

        try {
            let siteId = query['siteId'];
            let role = query['role'];
            let position = query['position'];

            this.validateToken(query['accessToken']);
            if (!role || !position) { throw new Error(`参数无效, role: ${role}, position: ${position}`); }

            // ret = await soccorDbSiteSetting.findOne(
            //     { siteId, "deviceConfig.role": role, "deviceConfig.position": position },
            //     { "deviceConfig.$": 1 });



            // let deviceConfig = (ret.result && ret.result['deviceConfig']) || [];
            // let code = ret.code;

            // ret = new RetObject;
            // // ret.code = code;
            // ret.result = {
            //     deviceId: (deviceConfig && deviceConfig[0] && deviceConfig[0]['deviceId']) || ""
            // };

            let deviceConfig = await soccorDbSiteSetting.findOne(
                { siteId, "deviceConfig.role": role, "deviceConfig.position": position },
                { "deviceConfig.$": 1 });
          console.log('prebind deviceConfig='+ `deviceConfig: ${deviceConfig}`)

          if(deviceConfig){
                ret.result = {
                    deviceId: deviceConfig.deviceConfig[0]['deviceId']
                };
            }else{
                ret.result = {
                    deviceId: ""
                };
            }

        } catch (error) {
            ret.code = 2;
            ret.description = `预绑定发生错误: ${error}`;
        }

        ret.code = 0;
        return ret;
    }

    async create(data: SiteGeneralSettingsRequest) {
        let ret: RetObject = new RetObject;

        try {
            this.validateToken(data.accessToken);
            let model = new siteSettingModel();

            model.siteId = uuidv1().replace(/-/g, '') || '';
            model.siteName = data.siteName || '';
            model.siteType = data.siteType || '';
            model.siteDescription = data.siteDescription || '';
            model.groups = data.groups || [];

            model.save();
            ret.code = 0;
            ret.siteId = model.siteId;
        } catch (e) {
            ret.code = 1;
            ret.description = `创建失败: ${e}`;
        }

        return ret;
    }

    async updateGeneral(data: SiteGeneralSettingsRequest) {
        let ret: RetObject = new RetObject();

        try {
            this.validateSiteId(data.siteId);
            this.validateToken(data.accessToken);
            let updateObject = this.buildUpdateObjectForGS(data);

            await siteSettingModel.update(
                { siteId: data.siteId },
                updateObject,
                {},
                (err, raw) => (ret = dbTools.execSQLCallback({
                    method: 'update',
                    err,
                    raw,
                    fileName: 'site.service.ts',
                    funcName: 'updateGeneral'
                }))
            );

        } catch (e) {
            ret.code = 2;
            ret.description = `更新失败: ${e}`;
        }

        return ret;
    }

    /**
     * 构建更新对象 For GeneralSettings（GS）
     * @param data 
     */
    buildUpdateObjectForGS(data: SiteGeneralSettingsRequest) {
        let updateObject = new Object;

        data.groups !== undefined && (updateObject['groups'] = data.groups);
        data.siteDescription !== undefined && (updateObject['siteDescription'] = data.siteDescription);
        data.siteName !== undefined && (updateObject['siteName'] = data.siteName);
        data.siteType !== undefined && (updateObject['siteType'] = data.siteType);

        return updateObject;
    }

    async getGeneral(siteId, accessToken) {
        let ret: RetObject = new RetObject;

        try {
            this.validateSiteId(siteId);
            this.validateToken(accessToken);

            ret.result = await siteSettingModel.find({ siteId }, {
                siteId: 1,
                siteName: 1,
                siteType: 1,
                siteDescription: 1,
                groups: 1
            }, {});

            ret.code = ret.result ? 0 : 1;

        } catch (e) {
            ret.code = 2;
            ret.description = `获取失败: ${e}`;
        }

        return ret;
    }

    async updateVideo(data: SiteVideoSettingsRequest) {
        let ret: RetObject = new RetObject;

        try {
            this.validateSiteId(data.siteId);
            this.validateToken(data.accessToken);

            await siteSettingModel.update({ siteId: data.siteId }, {
                source: data.source || {},
                prefix: data.prefix || "",
                output: data.output || {},
                param: data.param || {}
            }, {}, (err, raw) => (ret = dbTools.execSQLCallback({
                method: 'update',
                err,
                raw,
                fileName: 'site.service.ts',
                funcName: 'updateVideo'
            })));

        } catch (error) {
            ret.code = 2;
            ret.description = `更新异常： ${error}`;
        }

        return ret;
    }

    async getGroup(data: SiteQueryRequest) {
        let ret: RetObject = new RetObject;

        try {
            this.validateSiteId(data.siteId);
            this.validateToken(data.accessToken);

            ret.result = await siteSettingModel.find({ siteId: data.siteId }, { groups: 1 }, {});
            ret.code = ret.result ? 0 : 1;

        } catch (error) {
            ret.code = 2;
            ret.description = `查询异常： ${error}`;
        }

        return ret;
    }

    async addGroup(data: SiteGroupRequest) {
        let ret: RetObject = new RetObject;

        try {
            this.validateSiteId(data.siteId);
            this.validateToken(data.accessToken);

            // await siteSettingModel.find({siteId: data.siteId}, {groups: 1}, {}, (err, raw) => ret = dbTools.execSQLCallback({
            //     method: 'find',
            //     err,
            //     raw,
            //     fileName: 'site.service.ts',
            //     funcName: 'getGroup'
            // }));

            await siteSettingModel.update({ siteId: data.siteId }, { $addToSet: { groups: data.group } }, {},
                (err, raw) => ret = dbTools.execSQLCallback({
                    method: 'update',
                    err,
                    raw,
                    fileName: 'site.service.ts',
                    funcName: 'addGroup - addToSet'
                }));

        } catch (error) {
            ret.code = 2;
            ret.description = `查询异常： ${error}`;
        }

        return ret;
    }

    async reconnectDevice(data) {
        let ret: RetObject = new RetObject();

        try {
            if (!data.deviceId) { throw new Error(`无效的设备ID: ${data.deviceId}`); }
            let shareSiteSetting = await shareDbSiteSetting.find({ deviceId: data.deviceId });
            let temp = []
            shareSiteSetting.forEach(shareSetting => {
                temp.push(shareSetting.siteId)
            });

            let deviceConfig = await soccorDbSiteSetting.findOne({ deviceConfig: { $elemMatch: { deviceId: data.deviceId } } }, { "deviceConfig.$": 1, siteId: 1, _id: 0 });

            if (deviceConfig) {
                ret.code = 0;
                ret.result = deviceConfig;
                let rest = ret.result;
                ret.result = {
                    deviceConfig: rest['deviceConfig'],
                    siteId: rest['siteId'],
                    shareSiteId: temp
                };
            }else{
                ret.code = 2;
                ret.result = {
                    deviceConfig: [],
                    siteId: "",
                    shareSiteId:[]
                };
            }

        } catch (error) {
            ret = new RetObject();

            ret.code = 2;
            ret.result = {
                deviceConfig: [],
                siteId: "", 
                shareSiteId:[]
            };
        }

        return ret;
    }

    async addShareSiteSetting(data) {
        console.log(`addShareSiteSetting - data = ${data}`);
        let ret = new RetObject()
        try {
            if ( !data ) { throw new Error(`无效的data: ${data}`); }
            if ( !data.deviceId || !data.siteId ) { throw new Error(`无效参数：deviceId = ${data.deviceId} siteId = ${data.siteId}`)}

            let result = await shareDbSiteSetting.create({
              deviceId: data.deviceId,
              siteId: data.siteId
            })
            console.log(`result of create shareDbSiteSettings: `);
            console.log(result);
            ret.code = 0;
            // ret.result = result;
        } catch (e) {
            ret.code = 2;
            ret.description = e;
        }

        return ret;
    }

    async getDevicesByGroup(query) {
        let ret: RetObject = new RetObject;

        try {
            console.log(`group = ${query.group}`);
            ret.result = await soccorDbSiteSetting.find({ group: { $elemMatch: { $eq: query.group } }, deviceConfig: { $elemMatch: { $ne: null } } },
                { deviceConfig: 1, siteId: 1, siteName: 1, _id: 0, cameraSetting: 1 });
            // 补充信息
            ret.code = ret.result ? 0 : 1;

            ret = this.fillGetDevicesByGroupInfo(ret);
        } catch (error) {
            ret.code = 2;
            ret.description = `通过group获取设备列表失败: ${error}`;
        }

        return ret;
    }

    // 补充获取设备信息
    fillGetDevicesByGroupInfo(ret) {
        ret.code === 0 && ret.result.forEach(element => {
            element.deviceConfig.forEach(item => {
                item.label = item.label || "";
            });
        });

        return ret;
    }

    async updateDeviceLabel(data) {
        let ret: RetObject = new RetObject;

        try {
            let deviceId = data.deviceId;
            let label = data.label;

            if (!deviceId) { throw new Error(`设备ID：${deviceId}无效`); }

            await soccorDbSiteSetting.update(
                { "deviceConfig": { $elemMatch: { deviceId } } },
                { $set: { "deviceConfig.$.label": label || "" } },
                (err, raw) => ret = dbTools.execSQLCallback({
                    method: "update",
                    err,
                    raw,
                    fileName: "site.service.ts",
                    funcName: "updateDeviceLabel"
                }));

        } catch (error) {
            ret.code = 2;
            ret.description = `更新设备备注失败: ${error}"`;
        }

        return ret;
    }

    async getDeviceConfig(query) {
        let ret: RetObject = new RetObject;
        const siteId = query['siteId'];
        let result = await soccorDbSiteSetting.findOne({ "siteId": siteId }, { deviceConfig: 1});
        if (result) {
            ret.code = 0
            ret.result = result;
        }else{
            ret.code = 1;
            ret.result = [];
        }
        return ret;
    }

    async updateScaleByGroupPosition(group, position, scale) {
      let ret = await soccorDbSiteSetting.find({ group, "cameraSetting.position": {"$exists": true, "$eq": position}});

      // update ret
      let length = ret.length;

      for (let i = 0; i < length; i++) {
          if (ret[i]["cameraSetting"]) {
              let cameraSettingLength = ret[i]['cameraSetting'].length;

              // 遍历cameraSetting
              for (let j = 0; j < cameraSettingLength; j++) {
                  if (ret[i]["cameraSetting"][j]["position"] == position) {
                      ret[i]["cameraSetting"][j]['scale'] = scale;
                      break;    //  一个站点的指定position只会有一个scale，因此不用在继续循环cameraSetting了
                  }
              }
          }
      }


      // update db
      // 因为mongodb不支持批量更新数组定位项数据且不支持事务，因此只好用循环来更新数据
      for (let i = 0; i < length; i++) {
          await soccorDbSiteSetting.update({_id: ret[i]['_id']}, {"cameraSetting": ret[i]['cameraSetting']});
      }

    }


    /**
     * 验证token是否有效
     * @param token 
     * @throws Error when token is invalid throw an error
     */
    async validateToken(token) {
        if ((await authService.authAccessToken(token)).code) { throw new Error(`授权失败, access token: ${token} 无效`); }
    }

    /**
     * 验证siteId是否有效
     * @param siteId 
     * @throws Error when this siteId is invalid, it will throw an error
     */
    validateSiteId(siteId) {
        if (!siteId) { throw new Error(`siteId：${siteId} 无效`); }
    }

    async getBasketAnnoSite(query){
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
        let result = await basketAnnoSiteSettingSchema.find(condition, {siteId:1, siteName: 1});

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
        }else{
            ret.code = 1;
            ret.result = [];
        }
        return ret;
    }

    async getBasketAnnoTeamBySiteId(query){
        let ret: RetObject = new RetObject;
        const siteId = query['siteId'];
        let result = await basketAnnoSiteSettingSchema.findOne({ "siteId": siteId }, {player: 1});
        if (result) {
            ret.code = 0
            ret.result = result;
        }else{
            ret.code = 1;
            ret.result = [];
        }
        return ret;
    }

    async getBasketAnnoSiteBySiteId(query) {
        let ret: RetObject = new RetObject();

        try {
            if (!query.siteId) { throw new Error(`无效的siteId: ${query.siteId}`); }

            let result = await basketAnnoSiteSettingSchema.findOne({"siteId": query.siteId});

            if (result) {
                ret.code = 0;
                ret.result = result;
            } else {
                ret.code = 1;
                ret.description = "无效的查询结果";
            }
        } catch (err) {
            ret.code = 2;
            ret.description = `通过siteId获取篮球站点信息错误: ${err}`;
        }

        return ret;
    }

    async upsertBasketBallSession(data) {
        console.log(`更插篮球赛事: upsertBasketBallSession >> data: ${JSON.stringify(data)}`);
        let ret: RetObject = new RetObject();

        try {
            if (!data.siteId) { throw new Error(`无效的siteId: ${data.siteId}`); }

            let site = await basketAnnoSiteSettingSchema.findOne({"siteId": data.siteId});

            if (site) {
                let update = {
                    $set: {}
                };

                data.siteName && (update.$set["siteName"] = data.siteName);
                data.player != undefined && data.player instanceof Array &&
                    data.player.length > 0 && (update.$set["player"] = data.player);

                // site存在则更新
                let result = await basketAnnoSiteSettingSchema.update({"siteId": data.siteId}, update);
                // console.log("更新篮球赛事" + JSON.stringify(result));
                ret.code = dbTools.getUpdateCode(result);
            } else {
                // 插入
                let result = await new basketAnnoSiteSettingSchema(data).save();
                // console.log("插入篮球赛事" + JSON.stringify(result));
                ret.code = result ? 0 : 1;
            }

        } catch (err) {
            ret.code = 2;
            ret.description = err;
        }

        return ret;
    }

    async getFFmpegConfig(query) {
        let ret: RetObject = new RetObject();

        try {
            if (!query.siteId) { throw new Error(`无效的siteId：${query.siteId}`); }
            
            let result = await basketAnnoSiteSettingSchema.findOne({"siteId": query.siteId}, {ffmpegConfig: 1, _id: 0});

            ret.code = 0;
            ret.result = result;
        } catch(e) {
            console.log(`getFFmpegConfig Error: ${e}`);
            ret.code = 2;
            ret.description = e.toString();
        }

        return ret;
    }

    async updateFFmpegConfig(data) {
        let ret: RetObject = new RetObject();

        try {
            if (!data.siteId) { throw new Error(`无效的siteId：${data.siteId}`); }
            if (!data.ffmpegConfig) { throw new Error(`无效的ffmpegConfig: ${data.ffmpegConfig}`); }
            
            let result = await basketAnnoSiteSettingSchema.findOneAndUpdate(
                {"siteId": data.siteId}, 
                {$set: {
                    ffmpegConfig: data.ffmpegConfig as FFmpegConfig
                }}, 
                {ffmpegConfig: 1, _id: 0}
            );

            ret.code = 0;
            // ret.result = result;
            Global.sendEvent('start_socket', MEDIA_WORKER_EVENT.START_RECORDING,
                (await this.getBasketAnnoSiteBySiteId(data)).result || {});
        } catch(e) {
            console.log(`getFFmpegConfig Error: ${e}`);
            ret.code = 2;
            ret.description = e.toString();
        }

        return ret;
    }

    async updateFFmpegConfigTime(data) {
        let ret: RetObject = new RetObject();

        try {
            if (!data.siteId) { throw new Error(`无效的siteId: ${data.siteId}`); }
            if (!data.start || !data.end) { throw new Error(`无效的起点与结束时间[start: ${data.start}, end: ${data.end}]`); }

            let result = await basketAnnoSiteSettingSchema.updateOne(
                {"siteId": data.siteId},
                {
                    $set: {
                        "ffmpegConfig.start": data.start,
                        "ffmpegConfig.end": data.end
                    }
                },
                {
                    ffmpegConfig: 1,
                    _id: 0
                }
            );

            console.log(`update ffmpeg config time >>>`);
            console.log(result);
            ret.code = dbTools.getUpdateCode(result);

            // 下达开始录制的指令
            // let sockets = Global.getSocket();
            // console.log(sockets['start_socket']);
            Global.sendEvent('start_socket', MEDIA_WORKER_EVENT.START_RECORDING,
                (await this.getBasketAnnoSiteBySiteId(data)).result || {});
        } catch (err) {
            ret.code = 2;
            ret.description = err;
        }

        return ret;
    }
}
