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
const csv = require("fast-csv");
const db_service_1 = require("../common/db.service");
const ret_component_1 = require("../common/ret.component");
let DeviceService = class DeviceService {
    constructor() { }
    getDeviceList(type) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.readCsv();
        });
    }
    addDevice(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.writeCsv(data);
        });
    }
    readCsv() {
        return new Promise((resolve, reject) => {
            const dataArr = [];
            csv.fromPath(`${__dirname}/CameraList.csv`, { headers: true })
                .on('data', (results) => {
                dataArr.push(results);
            })
                .on('end', (num) => {
                console.log(`讀取成功! 共${num}台相機`);
                resolve(dataArr);
            });
        });
    }
    writeCsv(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let list = yield this.readCsv();
            list.push(data);
            return new Promise((resolve, reject) => {
                csv.writeToPath(`${__dirname}/CameraList.csv`, list, {
                    headers: true,
                    transform: (row) => {
                        return {
                            name: row.name,
                            mac: row.mac
                        };
                    }
                }).on("finish", () => __awaiter(this, void 0, void 0, function* () {
                    const res = yield this.readCsv();
                    resolve(res);
                }));
            });
        });
    }
    get_device_status(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('get_device_status siteId=' + siteId);
            let ret = new ret_component_1.RetObject;
            var devices = yield db_service_1.deviceStatus.find({ "siteId": siteId });
            if (devices != null) {
                ret.code = 0;
                ret.result = devices;
            }
            else {
                ret.code = 1;
                ret.description = "no this siteId:" + siteId + " devices";
            }
            return ret;
        });
    }
};
DeviceService = __decorate([
    common_1.Component(),
    __metadata("design:paramtypes", [])
], DeviceService);
exports.DeviceService = DeviceService;
//# sourceMappingURL=device.service.js.map