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
const system_service_1 = require("./system.service");
let SystemController = class SystemController {
    constructor(systemService) {
        this.systemService = systemService;
    }
    version(res) {
        res.status(common_1.HttpStatus.OK).json({ version: '1.1.0', name: 'Short Video Api Server' });
    }
    get_git_commit_id(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.systemService.getGitCommitId();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    edgeversion(res) {
        res.status(common_1.HttpStatus.OK).json({ "edgeadmin": '1.1.0', "edgeserver": '1.1.0', "time": "2018-6-19 11:35:20" });
    }
    get_apk_version(res, type, subType) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('get_apk_version');
            const fs = require('fs');
            const path = require('path');
            const filePath = path.resolve('../../output/apk/', 'version.json');
            console.log('filePath=' + filePath);
            const ret = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    save_apk_version(res, siteId, deviceId, role, apkVersion) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.systemService.saveApkVersion(siteId, deviceId, role, apkVersion);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_apk_version_from_db(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.systemService.getApkVersionFromDb(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    reploy(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.systemService.reploy();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
};
__decorate([
    common_1.Get('version'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SystemController.prototype, "version", null);
__decorate([
    common_1.Get('get_git_commit_id'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "get_git_commit_id", null);
__decorate([
    common_1.Get('edgeversion'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], SystemController.prototype, "edgeversion", null);
__decorate([
    common_1.Post('get_apk_version'),
    __param(0, common_1.Res()), __param(1, common_1.Body('type')), __param(2, common_1.Body('subType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "get_apk_version", null);
__decorate([
    common_1.Post('save_apk_version'),
    __param(0, common_1.Res()), __param(1, common_1.Body('siteId')), __param(2, common_1.Body('deviceId')), __param(3, common_1.Body('role')), __param(4, common_1.Body('apkVersion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String, String]),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "save_apk_version", null);
__decorate([
    common_1.Post('get_apk_version_from_db'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "get_apk_version_from_db", null);
__decorate([
    common_1.Post('reploy'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SystemController.prototype, "reploy", null);
SystemController = __decorate([
    common_1.Controller('system'),
    __metadata("design:paramtypes", [system_service_1.SystemService])
], SystemController);
exports.SystemController = SystemController;
//# sourceMappingURL=system.controller.js.map