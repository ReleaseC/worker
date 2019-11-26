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
const util = require('util');
const exec = util.promisify(require('child_process').exec);
let SystemService = class SystemService {
    saveApkVersion(siteId, deviceId, role, apkVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            yield db_service_1.apkVersionDb.findOne({ siteId: siteId, deviceId: deviceId, role: role }, (err, device) => {
                if (err) {
                    ret.code = -1;
                    ret.result = err;
                }
                if (device) {
                    device.apkVersion = apkVersion;
                    device.save();
                    ret.code = 1;
                    ret.description = 'Update apk verion successful.';
                }
                else {
                    let newDevice = new db_service_1.apkVersionDb();
                    newDevice.siteId = siteId;
                    newDevice.deviceId = deviceId;
                    newDevice.role = role;
                    newDevice.apkVersion = apkVersion;
                    newDevice.save();
                    ret.code = 0;
                    ret.description = 'Add new apk version with siteId:' + siteId + ", deviceId:" + deviceId + ", role:" + role;
                }
            });
            return ret;
        });
    }
    getApkVersionFromDb(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_service_1.apkVersionDb.aggregate([{ $match: { $or: data.siteIds } }, { $group: { _id: "$siteId", devicesInfo: { $push: {
                                deviceId: "$deviceId",
                                role: "$role",
                                apkVersion: "$apkVersion"
                            } } } }]);
        });
    }
    getGitCommitId() {
        return __awaiter(this, void 0, void 0, function* () {
            let commandLine = 'git rev-parse HEAD';
            let ret = new ret_component_1.RetObject;
            let { stdout, stderr } = yield exec(commandLine);
            ret.code = stderr ? 1 : 0;
            ret.description = stdout || stderr;
            ret.description = ret.description.replace(/\n/g, '');
            return ret;
        });
    }
    reploy() {
        return __awaiter(this, void 0, void 0, function* () {
            let commandLine = 'cd /data/BulletTimeStudio/Cloud/server/scripts && ./auto_reploy.sh';
            let ret = new ret_component_1.RetObject;
            let { stdout, stderr } = yield exec(commandLine);
            if (stderr) {
                ret.code = 1;
                ret.description = stderr.toString();
            }
            else {
                ret.code = 0;
                ret.description = stdout.toString();
            }
            return ret;
        });
    }
};
SystemService = __decorate([
    common_1.Component()
], SystemService);
exports.SystemService = SystemService;
//# sourceMappingURL=system.service.js.map