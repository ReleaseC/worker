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
const device_service_1 = require("./device.service");
const roles_guard_1 = require("../common/guards/roles.guard");
let DeviceController = class DeviceController {
    constructor(deviceService) {
        this.deviceService = deviceService;
    }
    get_device_list(res, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.deviceService.getDeviceList(type);
            res.status(common_1.HttpStatus.OK).json({ device: ret });
        });
    }
    add_device(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.deviceService.addDevice(data);
            res.status(common_1.HttpStatus.OK).json({ device: ret });
        });
    }
    get_device_status(res, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.deviceService.get_device_status(siteId);
            res.status(common_1.HttpStatus.OK).json({ device: ret });
        });
    }
};
__decorate([
    common_1.Get('get_device_list'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "get_device_list", null);
__decorate([
    common_1.Post('add_device'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "add_device", null);
__decorate([
    common_1.Get('get_device_status'),
    __param(0, common_1.Res()), __param(1, common_1.Query("siteId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DeviceController.prototype, "get_device_status", null);
DeviceController = __decorate([
    common_1.Controller('device'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [device_service_1.DeviceService])
], DeviceController);
exports.DeviceController = DeviceController;
//# sourceMappingURL=device.controller.js.map