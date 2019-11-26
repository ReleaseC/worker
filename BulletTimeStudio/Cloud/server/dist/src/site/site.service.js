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
const ret_component_1 = require("../common/ret.component");
const auth_service_1 = require("../account/auth.service");
const db_tools_1 = require("../common/db.tools");
const global_services_1 = require("../common/global.services");
const socket_interface_1 = require("../common/socket.interface");
const account_service_1 = require("../account/account.service");
const authService = new auth_service_1.AuthService();
const uuidv1 = require('uuid/v1');
var JsonDB = require('node-json-db');
const redis = require('redis');
const bluebird = require("bluebird");
const client = bluebird.promisifyAll(redis.createClient());
let SiteService = class SiteService {
    addZero(number) {
        let s = number + "";
        while (s.length < 4)
            s = "0" + s;
        return s;
    }
    addSite(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('addSite data.type=' + data.type);
            let ret = new ret_component_1.RetObject;
            if (data.type === 'soccer') {
                yield db_service_1.soccorDbSiteSetting.findOne({ siteName: data.siteName }, (err, site) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        ret.code = -1;
                        ret.result = err;
                    }
                    if (site) {
                        ret.code = 1;
                        ret.description = 'Site has been added';
                    }
                    else {
                        let newSite = new db_service_1.soccorDbSiteSetting();
                        newSite.siteId = uuidv1().replace(/-/g, '');
                        newSite.siteName = data.siteName;
                        newSite.siteType = 'SOCCOR';
                        newSite.save();
                        ret.code = 0;
                        ret.description = 'Add new soccer site successful.';
                    }
                }));
            }
            else {
                yield db_service_1.dbSiteSetting.findOne({ siteId: data.siteId }, (err, site) => {
                    if (err)
                        ret = err;
                    if (site) {
                        ret.description = 'Site ID has been added';
                    }
                    else {
                        let newSite = new db_service_1.dbSiteSetting();
                        newSite.siteId = data.siteId;
                        newSite.name = data.name;
                        newSite.type = data.type;
                        newSite.param = data.param;
                        newSite.source = data.source;
                        newSite.output = data.output;
                        newSite.accessToken = uuidv1().replace(/-/g, '');
                        newSite.expireTime = new Date().getTime() + (1000 * 24 * 60 * 60 * 30);
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
        });
    }
    getSiteNames(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getSiteNames data.type=' + data.type);
            let ret = new ret_component_1.RetObject;
            if (data.type === 'soccor') {
                return yield db_service_1.soccorDbSiteSetting.distinct("siteName");
            }
            else {
                return yield db_service_1.dbSiteSetting.distinct("name");
            }
        });
    }
    getGroupLists(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const accessToken = data.accessToken;
            const ret = [
                { groupId: 'S001' },
            ];
            return ret;
        });
    }
    getSiteLists(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const acc = data.account;
            const matchSiteIDs = yield db_service_1.accountMatchSites.find({ account: acc });
            let ret = [];
            for (let i = 0; i < matchSiteIDs.length; i++) {
                const soccer = yield db_service_1.soccorDbSiteSetting.find({ siteId: matchSiteIDs[i].siteId });
                ret.push(soccer[0]);
            }
            return ret;
        });
    }
    getSiteDetail(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getSiteDetail, data.type=" + data.type);
            let ret = new ret_component_1.RetObject;
            if (data.type === 'soccer') {
                ret.code = 0;
                ret.result = yield db_service_1.soccorDbSiteSetting.find().sort({ region: 1, siteName: 1 });
            }
            else {
                ret.code = 0;
                ret.result = yield db_service_1.dbSiteSetting.findOne({ siteId: data.siteId });
            }
            return ret;
        });
    }
    updateSite(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('updateSite data.type = ' + data.type);
            let ret = new ret_component_1.RetObject;
            if (data.type === 'soccer') {
                ret.code = 1;
                ret.description = 'obsolete';
            }
            else {
                yield db_service_1.dbSiteSetting.findOne({ siteId: data.siteId }, (err, site) => {
                    if (err)
                        ret = err;
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
                    }
                    else {
                        ret.code = 1;
                        ret.description = 'No site Id founded';
                    }
                });
            }
            return ret;
        });
    }
    siteLoginCheck(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('siteLoginCheck=' + JSON.stringify(data));
            let ret = new ret_component_1.RetObject;
            if (data.type === 'soccor') {
                yield db_service_1.soccorDbSiteSetting.findOne({ accessToken: data.accessToken }, (err, site) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        ret.code = 0;
                        ret.description = "there is error";
                    }
                    if (site) {
                        const currentDate = new Date().getTime();
                        const expireDate = site.expireTime;
                        console.log('minus=' + (expireDate - currentDate));
                        if ((expireDate - currentDate) < 0) {
                        }
                        ret.code = 1;
                        ret.description = "success";
                        ret.result = site;
                    }
                }));
            }
            else {
                yield db_service_1.dbSiteSetting.findOne({ $and: [{ siteId: data.siteId }, { accessToken: data.accessToken }] }, (err, site) => {
                    if (err) {
                        ret.code = 0;
                        ret.description = "there is error";
                    }
                    if (site) {
                        const currentDate = new Date().getTime();
                        const expireDate = site.expireTime;
                        console.log('minus=' + (expireDate - currentDate));
                        if ((expireDate - currentDate) < 0) {
                            site.accessToken = uuidv1().replace(/-/g, '');
                            site.expireTime = new Date().getTime() + (1000 * 24 * 60 * 60 * 30);
                            site.save();
                        }
                        ret.code = 1;
                        ret.description = "success";
                        ret.result = {
                            'siteId': data.siteId,
                            'accessToken': site.accessToken,
                            'expireTime': site.expireTime,
                        };
                    }
                    else {
                        ret.code = 0;
                        ret.description = "No site Id founded";
                        ret.result = {
                            'siteId': data.siteId,
                        };
                    }
                });
            }
            return ret;
        });
    }
    getTemplate() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var templates = yield db_service_1.template.find();
            ret.code = 0;
            ret.result = templates;
            return ret;
        });
    }
    addTemplate(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var templates = yield db_service_1.template.find();
            var newtemplates = templates.concat(data.template);
            yield db_service_1.template.update({}, { $set: { "template": newtemplates } });
            ret.code = 0;
            ret.description = "Add new template successful.";
            return ret;
        });
    }
    changeDeviceConfig(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let site = yield db_service_1.dbSiteSetting.findOneAndUpdate({ siteId: data.siteId }, { "deviceConfig": data.deviceConfig, "sparedeviceConfig": data.deviceConfig });
            if (site !== null) {
                ret.code = 0;
                ret.description = "Update device config. successful.";
            }
            else {
                ret.code = 1;
                ret.description = "Fail to update device config.";
            }
            return ret;
        });
    }
    getCameraSetting() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let CameraSetting = yield db_service_1.CameraSettingdb.find();
            if (CameraSetting !== null) {
                ret.code = 1;
                ret.result = CameraSetting;
            }
            else {
                ret.code = 0;
                ret.description = "no CameraSetting";
            }
            return ret;
        });
    }
    addCameraSetting(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('data:', data);
            let ret = new ret_component_1.RetObject;
            if (!data.siteId || !data.cameraSetting || !data.cameraSetting.role || !data.cameraSetting.position || !data.cameraSetting.rotation || !data.cameraSetting.scale) {
                ret.code = 1;
                ret.description = "请检查参数";
                return ret;
            }
            let site = yield db_service_1.soccorDbSiteSetting.findOne({ siteId: data.siteId });
            var exist = 0;
            if (site !== null) {
                ret.code = 0;
                ret.description = "ok";
                if (site.cameraSetting) {
                    for (let i = 0; i < site.cameraSetting.length; i++) {
                        if (site.cameraSetting[i].role == data.cameraSetting.role && site.cameraSetting[i].position == data.cameraSetting.position) {
                            yield db_service_1.soccorDbSiteSetting.update({ "cameraSetting.position": site.cameraSetting[i].position }, { "$set": { "cameraSetting.$": data.cameraSetting } });
                            exist = 1;
                        }
                    }
                }
            }
            else {
                ret.code = 1;
                ret.description = "no site: " + data.siteId;
            }
            if (exist == 1) {
                return ret;
            }
            yield db_service_1.soccorDbSiteSetting.update({ siteId: data.siteId }, { '$push': { cameraSetting: data.cameraSetting } });
            return ret;
        });
    }
    getAccountMatchSites() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret.code = 0;
            ret.result = yield db_service_1.accountMatchSites.find().sort({ region: 1 });
            return ret;
        });
    }
    addAccountMatchSites(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('accountMatchSites siteId = ' + data.siteId);
            let ret = new ret_component_1.RetObject;
            yield db_service_1.accountMatchSites.findOne({ siteId: data.siteId }, (err, site) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    ret.code = -1;
                    ret.result = err;
                }
                else {
                    if (site) {
                        ret.code = 1;
                        ret.description = 'Site id:' + data.siteId + 'has already added.';
                    }
                    else {
                        let newSite = new db_service_1.accountMatchSites();
                        newSite.account = data.account;
                        newSite.siteId = data.siteId;
                        newSite.save();
                        ret.code = 0;
                        ret.description = 'Add new accountMatchSites setting.';
                    }
                }
            }));
            return ret;
        });
    }
    getBindingTable() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret.code = 0;
            ret.result = yield db_service_1.bindingDeviceTableDb.find().sort({ deviceId: 1 });
            return ret;
        });
    }
    setBindingTable(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('setBindingTable data.deviceId=' + data.deviceId);
            let ret = new ret_component_1.RetObject;
            if (data.isbind) {
                ret.code = 1;
                ret.result = yield db_service_1.bindingDeviceTableDb.remove({ deviceId: data.deviceId });
            }
            else {
                yield db_service_1.bindingDeviceTableDb.findOne({ device: data.deviceId }, (err, device) => __awaiter(this, void 0, void 0, function* () {
                    if (err) {
                        ret.code = -1;
                        ret.result = err;
                    }
                    else {
                        if (device) {
                            ret.code = 1;
                            ret.description = "This device is already binding to siteName:" + device.siteName + " and role:" + device.role;
                        }
                        else {
                            if (data.role == 'admin') {
                                let accountMatch = yield db_service_1.accountMatchSites.findOne({ siteId: data.siteId });
                                let accountMatchs = yield db_service_1.accountMatchSites.find({ account: accountMatch.account });
                                const accountMatchLen = accountMatchs.length;
                                for (let i = 0; i < accountMatchLen; i++) {
                                    let newBindDevice = new db_service_1.bindingDeviceTableDb();
                                    newBindDevice.siteId = accountMatchs[i].siteId;
                                    newBindDevice.role = data.role;
                                    newBindDevice.deviceId = data.deviceId;
                                    newBindDevice.save();
                                }
                            }
                            else {
                                let newBindDevice = new db_service_1.bindingDeviceTableDb();
                                newBindDevice.siteId = data.siteId;
                                newBindDevice.role = data.role;
                                newBindDevice.deviceId = data.deviceId;
                                newBindDevice.save();
                            }
                            ret.code = 0;
                            ret.description = 'success';
                        }
                    }
                }));
            }
            return ret;
        });
    }
    getHeartbeatRedis(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            if (yield client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role)) {
                ret.result = {
                    'temperature': yield client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_temp'),
                    'power': yield client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_power'),
                    'charging': yield client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_charging'),
                    'version': yield client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_version'),
                    'goal': yield client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_goal'),
                    'msg': yield client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_msg'),
                    'timestamp': yield client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_timestamp'),
                    'lastUpdate': yield client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_lastUpdate'),
                    'isRecording': yield client.getAsync(data.siteId + '_' + data.deviceId + '_' + data.role + '_isRecording'),
                };
            }
            return ret;
        });
    }
    setHeartbeatRedis(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
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
        });
    }
    postSiteSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            const data = body.data;
            const typeToUpperCase = body.type.toUpperCase();
            ret = yield authService.authAccessToken(body.access_token);
            if (ret.code != 0) {
                return ret;
            }
            switch (typeToUpperCase) {
                case 'SOCCOR':
                case 'BASKETBALL':
                    yield db_service_1.soccorDbSiteSetting.findOne({ siteName: data.siteName }, (err, site) => __awaiter(this, void 0, void 0, function* () {
                        if (err) {
                            ret.code = 1;
                            ret.description = err.toString();
                        }
                        if (site) {
                            ret.code = 1;
                            ret.description = 'There is a same site name on :' + data.siteName;
                        }
                        else {
                            let newSite = new db_service_1.soccorDbSiteSetting();
                            newSite.siteId = uuidv1().replace(/-/g, '');
                            newSite.siteName = data.siteName;
                            newSite.siteType = data.siteType;
                            newSite.save();
                            ret.code = 0;
                            ret.description = 'Add new site successful.';
                        }
                    }));
                    break;
                case 'BT':
                case 'BT-1':
                    yield db_service_1.dbSiteSetting.findOne({ siteId: data.siteId }, (err, site) => {
                        if (err) {
                            ret.code = -1;
                            ret.result = err;
                        }
                        if (site) {
                            ret.description = 'Site ID has been added';
                        }
                        else {
                            let newSite = new db_service_1.dbSiteSetting();
                            newSite.siteId = data.siteId;
                            newSite.name = data.name;
                            newSite.type = data.type;
                            newSite.param = data.param;
                            newSite.source = data.source;
                            newSite.output = data.output;
                            newSite.accessToken = uuidv1().replace(/-/g, '');
                            newSite.expireTime = new Date().getTime() + (1000 * 24 * 60 * 60 * 30);
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
        });
    }
    getSiteSetting(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let result;
            const typeToUpperCase = query['type'].toUpperCase();
            ret = yield authService.authAccessToken(query['access_token']);
            if (ret.code != 0) {
                return ret;
            }
            console.log('query[\'type\']=' + typeToUpperCase);
            switch (typeToUpperCase) {
                case 'SOCCOR':
                case 'BASKETBALL':
                case 'LEKE':
                    result = yield db_service_1.soccorDbSiteSetting
                        .find({ "siteType": typeToUpperCase })
                        .find(query['group'] ? { "group": query['group'] } : {})
                        .sort({ region: 1, siteName: 1 });
                    if (result.length) {
                        ret.code = 0;
                        ret.result = result;
                    }
                    else {
                        ret.code = 1;
                        ret.description = "No data on site type: " + typeToUpperCase;
                    }
                    break;
                case 'BT':
                case 'BT-1':
                    result = yield db_service_1.dbSiteSetting.find({});
                    if (result.length) {
                        ret.code = 0;
                        ret.result = result;
                    }
                    else {
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
        });
    }
    getSiteSettingInfo(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let result;
            const typeToUpperCase = body.type.toUpperCase();
            ret = yield authService.authAccessToken(body.access_token);
            if (ret.code != 0) {
                return ret;
            }
            switch (typeToUpperCase) {
                case 'SOCCOR':
                case 'BASKETBALL':
                case 'LEKE':
                case 'LUOKE':
                    result = yield db_service_1.soccorDbSiteSetting.findOne({ "siteType": typeToUpperCase, "siteId": body.siteId }).sort({ region: 1, siteName: 1 });
                    if (result) {
                        ret.code = 0;
                        ret.result = result;
                    }
                    else {
                        ret.code = 1;
                        ret.description = "No data on site type: " + typeToUpperCase;
                    }
                    break;
                case 'BT':
                case 'BT-1':
                    result = yield db_service_1.dbSiteSetting.findOne({ "type": typeToUpperCase, "siteId": body.siteId });
                    if (result) {
                        ret.code = 0;
                        ret.result = result;
                    }
                    else {
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
        });
    }
    updateSiteSetting(body) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let result;
            const typeToUpperCase = body.type.toUpperCase();
            ret = yield authService.authAccessToken(body.access_token);
            if (ret.code != 0) {
                return ret;
            }
            switch (typeToUpperCase) {
                case 'SOCCOR':
                case 'BASKETBALL':
                    result = yield db_service_1.soccorDbSiteSetting.update({ siteId: body.data.siteId }, body.data);
                    console.log('result=' + JSON.stringify(result));
                    if (result.ok) {
                        ret.code = 0;
                        ret.description = "Site setting:" + body.data.siteId + " update successful.";
                    }
                    else {
                        ret.code = 1;
                        ret.description = "No data on siteId: " + body.data.siteId;
                    }
                    break;
                case 'BT':
                case 'BT-1':
                    result = yield db_service_1.dbSiteSetting.update({ siteId: body.data.siteId }, body.data);
                    console.log('result=' + JSON.stringify(result));
                    if (result.ok) {
                        ret.code = 0;
                        ret.description = "Site setting:" + body.data.siteId + " update successful.";
                    }
                    else {
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
        });
    }
    bind(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            const typeToUpperCase = query['type'].toUpperCase();
            let result;
            console.log('bind=' + JSON.stringify(query));
            ret = yield authService.authAccessToken(query['access_token']);
            if (ret.code != 0) {
                return ret;
            }
            switch (typeToUpperCase) {
                case 'SOCCOR':
                case 'BASKETBALL':
                    ret = yield this.bindBasketBallDevice(query);
                    break;
                default:
                    ret.code = 1;
                    ret.description = "Type : " + typeToUpperCase + " not support this api";
                    break;
            }
            return ret;
        });
    }
    bindBasketBallDevice(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                console.log(`bindBasketBallDevice query >>> `);
                console.log(query);
                this.validateSiteId(query.siteId);
                let result = yield db_service_1.soccorDbSiteSetting.update({}, { $pull: { deviceConfig: { deviceId: query.deviceId } } }, { multi: true });
                result = yield db_service_1.soccorDbSiteSetting.update({ siteId: query.siteId }, { $pull: { deviceConfig: { role: query.role, position: query.position + "" } } });
                console.log('result 1 =' + JSON.stringify(result));
                result = yield db_service_1.soccorDbSiteSetting.update({ siteId: query.siteId }, { $addToSet: { deviceConfig: { role: query.role, deviceId: query.deviceId, position: query.position + "" } } });
                console.log('result 2 =' + JSON.stringify(result));
            }
            catch (error) {
                ret.code = 2;
                ret.description = `绑定篮球设备发生错误：${error}`;
            }
            ret.code = 0;
            return ret;
        });
    }
    prebind(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                let siteId = query['siteId'];
                let role = query['role'];
                let position = query['position'];
                this.validateToken(query['accessToken']);
                if (!role || !position) {
                    throw new Error(`参数无效, role: ${role}, position: ${position}`);
                }
                let deviceConfig = yield db_service_1.soccorDbSiteSetting.findOne({ siteId, "deviceConfig.role": role, "deviceConfig.position": position }, { "deviceConfig.$": 1 });
                console.log('prebind deviceConfig=' + `deviceConfig: ${deviceConfig}`);
                if (deviceConfig) {
                    ret.result = {
                        deviceId: deviceConfig.deviceConfig[0]['deviceId']
                    };
                }
                else {
                    ret.result = {
                        deviceId: ""
                    };
                }
            }
            catch (error) {
                ret.code = 2;
                ret.description = `预绑定发生错误: ${error}`;
            }
            ret.code = 0;
            return ret;
        });
    }
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                this.validateToken(data.accessToken);
                let model = new db_service_1.siteSettingModel();
                model.siteId = uuidv1().replace(/-/g, '') || '';
                model.siteName = data.siteName || '';
                model.siteType = data.siteType || '';
                model.siteDescription = data.siteDescription || '';
                model.groups = data.groups || [];
                model.save();
                ret.code = 0;
                ret.siteId = model.siteId;
            }
            catch (e) {
                ret.code = 1;
                ret.description = `创建失败: ${e}`;
            }
            return ret;
        });
    }
    updateGeneral(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            try {
                this.validateSiteId(data.siteId);
                this.validateToken(data.accessToken);
                let updateObject = this.buildUpdateObjectForGS(data);
                yield db_service_1.siteSettingModel.update({ siteId: data.siteId }, updateObject, {}, (err, raw) => (ret = db_tools_1.dbTools.execSQLCallback({
                    method: 'update',
                    err,
                    raw,
                    fileName: 'site.service.ts',
                    funcName: 'updateGeneral'
                })));
            }
            catch (e) {
                ret.code = 2;
                ret.description = `更新失败: ${e}`;
            }
            return ret;
        });
    }
    buildUpdateObjectForGS(data) {
        let updateObject = new Object;
        data.groups !== undefined && (updateObject['groups'] = data.groups);
        data.siteDescription !== undefined && (updateObject['siteDescription'] = data.siteDescription);
        data.siteName !== undefined && (updateObject['siteName'] = data.siteName);
        data.siteType !== undefined && (updateObject['siteType'] = data.siteType);
        return updateObject;
    }
    getGeneral(siteId, accessToken) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                this.validateSiteId(siteId);
                this.validateToken(accessToken);
                ret.result = yield db_service_1.siteSettingModel.find({ siteId }, {
                    siteId: 1,
                    siteName: 1,
                    siteType: 1,
                    siteDescription: 1,
                    groups: 1
                }, {});
                ret.code = ret.result ? 0 : 1;
            }
            catch (e) {
                ret.code = 2;
                ret.description = `获取失败: ${e}`;
            }
            return ret;
        });
    }
    updateVideo(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                this.validateSiteId(data.siteId);
                this.validateToken(data.accessToken);
                yield db_service_1.siteSettingModel.update({ siteId: data.siteId }, {
                    source: data.source || {},
                    prefix: data.prefix || "",
                    output: data.output || {},
                    param: data.param || {}
                }, {}, (err, raw) => (ret = db_tools_1.dbTools.execSQLCallback({
                    method: 'update',
                    err,
                    raw,
                    fileName: 'site.service.ts',
                    funcName: 'updateVideo'
                })));
            }
            catch (error) {
                ret.code = 2;
                ret.description = `更新异常： ${error}`;
            }
            return ret;
        });
    }
    getGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                this.validateSiteId(data.siteId);
                this.validateToken(data.accessToken);
                ret.result = yield db_service_1.siteSettingModel.find({ siteId: data.siteId }, { groups: 1 }, {});
                ret.code = ret.result ? 0 : 1;
            }
            catch (error) {
                ret.code = 2;
                ret.description = `查询异常： ${error}`;
            }
            return ret;
        });
    }
    addGroup(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                this.validateSiteId(data.siteId);
                this.validateToken(data.accessToken);
                yield db_service_1.siteSettingModel.update({ siteId: data.siteId }, { $addToSet: { groups: data.group } }, {}, (err, raw) => ret = db_tools_1.dbTools.execSQLCallback({
                    method: 'update',
                    err,
                    raw,
                    fileName: 'site.service.ts',
                    funcName: 'addGroup - addToSet'
                }));
            }
            catch (error) {
                ret.code = 2;
                ret.description = `查询异常： ${error}`;
            }
            return ret;
        });
    }
    reconnectDevice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            try {
                if (!data.deviceId) {
                    throw new Error(`无效的设备ID: ${data.deviceId}`);
                }
                let shareSiteSetting = yield db_service_1.shareDbSiteSetting.find({ deviceId: data.deviceId });
                let temp = [];
                shareSiteSetting.forEach(shareSetting => {
                    temp.push(shareSetting.siteId);
                });
                let deviceConfig = yield db_service_1.soccorDbSiteSetting.findOne({ deviceConfig: { $elemMatch: { deviceId: data.deviceId } } }, { "deviceConfig.$": 1, siteId: 1, _id: 0 });
                if (deviceConfig) {
                    ret.code = 0;
                    ret.result = deviceConfig;
                    let rest = ret.result;
                    ret.result = {
                        deviceConfig: rest['deviceConfig'],
                        siteId: rest['siteId'],
                        shareSiteId: temp
                    };
                }
                else {
                    ret.code = 2;
                    ret.result = {
                        deviceConfig: [],
                        siteId: "",
                        shareSiteId: []
                    };
                }
            }
            catch (error) {
                ret = new ret_component_1.RetObject();
                ret.code = 2;
                ret.result = {
                    deviceConfig: [],
                    siteId: "",
                    shareSiteId: []
                };
            }
            return ret;
        });
    }
    addShareSiteSetting(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`addShareSiteSetting - data = ${data}`);
            let ret = new ret_component_1.RetObject();
            try {
                if (!data) {
                    throw new Error(`无效的data: ${data}`);
                }
                if (!data.deviceId || !data.siteId) {
                    throw new Error(`无效参数：deviceId = ${data.deviceId} siteId = ${data.siteId}`);
                }
                let result = yield db_service_1.shareDbSiteSetting.create({
                    deviceId: data.deviceId,
                    siteId: data.siteId
                });
                console.log(`result of create shareDbSiteSettings: `);
                console.log(result);
                ret.code = 0;
            }
            catch (e) {
                ret.code = 2;
                ret.description = e;
            }
            return ret;
        });
    }
    getDevicesByGroup(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                console.log(`group = ${query.group}`);
                ret.result = yield db_service_1.soccorDbSiteSetting.find({ group: { $elemMatch: { $eq: query.group } }, deviceConfig: { $elemMatch: { $ne: null } } }, { deviceConfig: 1, siteId: 1, siteName: 1, _id: 0, cameraSetting: 1 });
                ret.code = ret.result ? 0 : 1;
                ret = this.fillGetDevicesByGroupInfo(ret);
            }
            catch (error) {
                ret.code = 2;
                ret.description = `通过group获取设备列表失败: ${error}`;
            }
            return ret;
        });
    }
    fillGetDevicesByGroupInfo(ret) {
        ret.code === 0 && ret.result.forEach(element => {
            element.deviceConfig.forEach(item => {
                item.label = item.label || "";
            });
        });
        return ret;
    }
    updateDeviceLabel(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                let deviceId = data.deviceId;
                let label = data.label;
                if (!deviceId) {
                    throw new Error(`设备ID：${deviceId}无效`);
                }
                yield db_service_1.soccorDbSiteSetting.update({ "deviceConfig": { $elemMatch: { deviceId } } }, { $set: { "deviceConfig.$.label": label || "" } }, (err, raw) => ret = db_tools_1.dbTools.execSQLCallback({
                    method: "update",
                    err,
                    raw,
                    fileName: "site.service.ts",
                    funcName: "updateDeviceLabel"
                }));
            }
            catch (error) {
                ret.code = 2;
                ret.description = `更新设备备注失败: ${error}"`;
            }
            return ret;
        });
    }
    getDeviceConfig(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            const siteId = query['siteId'];
            let result = yield db_service_1.soccorDbSiteSetting.findOne({ "siteId": siteId }, { deviceConfig: 1 });
            if (result) {
                ret.code = 0;
                ret.result = result;
            }
            else {
                ret.code = 1;
                ret.result = [];
            }
            return ret;
        });
    }
    updateScaleByGroupPosition(group, position, scale) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield db_service_1.soccorDbSiteSetting.find({ group, "cameraSetting.position": { "$exists": true, "$eq": position } });
            let length = ret.length;
            for (let i = 0; i < length; i++) {
                if (ret[i]["cameraSetting"]) {
                    let cameraSettingLength = ret[i]['cameraSetting'].length;
                    for (let j = 0; j < cameraSettingLength; j++) {
                        if (ret[i]["cameraSetting"][j]["position"] == position) {
                            ret[i]["cameraSetting"][j]['scale'] = scale;
                            break;
                        }
                    }
                }
            }
            for (let i = 0; i < length; i++) {
                yield db_service_1.soccorDbSiteSetting.update({ _id: ret[i]['_id'] }, { "cameraSetting": ret[i]['cameraSetting'] });
            }
        });
    }
    validateToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            if ((yield authService.authAccessToken(token)).code) {
                throw new Error(`授权失败, access token: ${token} 无效`);
            }
        });
    }
    validateSiteId(siteId) {
        if (!siteId) {
            throw new Error(`siteId：${siteId} 无效`);
        }
    }
    getBasketAnnoSite(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let condition = {};
            let accountService = new account_service_1.AccountService();
            let getSiteIdResult = yield accountService.getSiteIds(query);
            let siteIds = getSiteIdResult.code == 0 ? getSiteIdResult.result : [];
            let result = yield db_service_1.basketAnnoSiteSettingSchema.find(condition, { siteId: 1, siteName: 1 });
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
                if (siteIds.length == 0) {
                    ret.result = result;
                }
            }
            else {
                ret.code = 1;
                ret.result = [];
            }
            return ret;
        });
    }
    getBasketAnnoTeamBySiteId(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            const siteId = query['siteId'];
            let result = yield db_service_1.basketAnnoSiteSettingSchema.findOne({ "siteId": siteId }, { player: 1 });
            if (result) {
                ret.code = 0;
                ret.result = result;
            }
            else {
                ret.code = 1;
                ret.result = [];
            }
            return ret;
        });
    }
    getBasketAnnoSiteBySiteId(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            try {
                if (!query.siteId) {
                    throw new Error(`无效的siteId: ${query.siteId}`);
                }
                let result = yield db_service_1.basketAnnoSiteSettingSchema.findOne({ "siteId": query.siteId });
                if (result) {
                    ret.code = 0;
                    ret.result = result;
                }
                else {
                    ret.code = 1;
                    ret.description = "无效的查询结果";
                }
            }
            catch (err) {
                ret.code = 2;
                ret.description = `通过siteId获取篮球站点信息错误: ${err}`;
            }
            return ret;
        });
    }
    upsertBasketBallSession(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(`更插篮球赛事: upsertBasketBallSession >> data: ${JSON.stringify(data)}`);
            let ret = new ret_component_1.RetObject();
            try {
                if (!data.siteId) {
                    throw new Error(`无效的siteId: ${data.siteId}`);
                }
                let site = yield db_service_1.basketAnnoSiteSettingSchema.findOne({ "siteId": data.siteId });
                if (site) {
                    let update = {
                        $set: {}
                    };
                    data.siteName && (update.$set["siteName"] = data.siteName);
                    data.player != undefined && data.player instanceof Array &&
                        data.player.length > 0 && (update.$set["player"] = data.player);
                    let result = yield db_service_1.basketAnnoSiteSettingSchema.update({ "siteId": data.siteId }, update);
                    ret.code = db_tools_1.dbTools.getUpdateCode(result);
                }
                else {
                    let result = yield new db_service_1.basketAnnoSiteSettingSchema(data).save();
                    ret.code = result ? 0 : 1;
                }
            }
            catch (err) {
                ret.code = 2;
                ret.description = err;
            }
            return ret;
        });
    }
    getFFmpegConfig(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            try {
                if (!query.siteId) {
                    throw new Error(`无效的siteId：${query.siteId}`);
                }
                let result = yield db_service_1.basketAnnoSiteSettingSchema.findOne({ "siteId": query.siteId }, { ffmpegConfig: 1, _id: 0 });
                ret.code = 0;
                ret.result = result;
            }
            catch (e) {
                console.log(`getFFmpegConfig Error: ${e}`);
                ret.code = 2;
                ret.description = e.toString();
            }
            return ret;
        });
    }
    updateFFmpegConfig(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            try {
                if (!data.siteId) {
                    throw new Error(`无效的siteId：${data.siteId}`);
                }
                if (!data.ffmpegConfig) {
                    throw new Error(`无效的ffmpegConfig: ${data.ffmpegConfig}`);
                }
                let result = yield db_service_1.basketAnnoSiteSettingSchema.findOneAndUpdate({ "siteId": data.siteId }, { $set: {
                        ffmpegConfig: data.ffmpegConfig
                    } }, { ffmpegConfig: 1, _id: 0 });
                ret.code = 0;
                global_services_1.Global.sendEvent('start_socket', socket_interface_1.MEDIA_WORKER_EVENT.START_RECORDING, (yield this.getBasketAnnoSiteBySiteId(data)).result || {});
            }
            catch (e) {
                console.log(`getFFmpegConfig Error: ${e}`);
                ret.code = 2;
                ret.description = e.toString();
            }
            return ret;
        });
    }
    updateFFmpegConfigTime(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            try {
                if (!data.siteId) {
                    throw new Error(`无效的siteId: ${data.siteId}`);
                }
                if (!data.start || !data.end) {
                    throw new Error(`无效的起点与结束时间[start: ${data.start}, end: ${data.end}]`);
                }
                let result = yield db_service_1.basketAnnoSiteSettingSchema.updateOne({ "siteId": data.siteId }, {
                    $set: {
                        "ffmpegConfig.start": data.start,
                        "ffmpegConfig.end": data.end
                    }
                }, {
                    ffmpegConfig: 1,
                    _id: 0
                });
                console.log(`update ffmpeg config time >>>`);
                console.log(result);
                ret.code = db_tools_1.dbTools.getUpdateCode(result);
                global_services_1.Global.sendEvent('start_socket', socket_interface_1.MEDIA_WORKER_EVENT.START_RECORDING, (yield this.getBasketAnnoSiteBySiteId(data)).result || {});
            }
            catch (err) {
                ret.code = 2;
                ret.description = err;
            }
            return ret;
        });
    }
};
SiteService = __decorate([
    common_1.Component()
], SiteService);
exports.SiteService = SiteService;
//# sourceMappingURL=site.service.js.map