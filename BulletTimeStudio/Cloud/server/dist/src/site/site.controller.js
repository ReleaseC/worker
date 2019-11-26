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
const site_service_1 = require("./site.service");
let SiteController = class SiteController {
    constructor(siteService) {
        this.siteService = siteService;
    }
    add_site(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.addSite(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_site_names(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.getSiteNames(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_site_lists(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.getSiteLists(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_site_detail(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.getSiteDetail(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    update_site(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.updateSite(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_template(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.getTemplate();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    add_template(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.addTemplate(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    changeDeviceConfig(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.changeDeviceConfig(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_CameraSetting(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.getCameraSetting();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    add_CameraSetting(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.addCameraSetting(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_account_match_sites(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.getAccountMatchSites();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    add_account_match_sites(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('controller account_match_sites');
            const ret = yield this.siteService.addAccountMatchSites(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_binding_table(res) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.getBindingTable();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    set_binding_table(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.setBindingTable(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_heartbeat_redis(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.getHeartbeatRedis(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    set_heartbeat_redis(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.setHeartbeatRedis(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    post_site_setting(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.postSiteSetting(body);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_site_setting(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.getSiteSetting(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_site_setting_info(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.getSiteSettingInfo(body);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    update_site_setting(res, body) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.updateSiteSetting(body);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    bind(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.siteService.bind(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    prebind(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.prebind(query);
            res.status(common_1.HttpStatus.OK).json(ret.result);
        });
    }
    create(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.create(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    update_general(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.updateGeneral(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_general(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.getGeneral(query.siteId, query.accessToken);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    update_video(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.updateVideo(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_groups(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.getGroup(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    add_group(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.addGroup(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    device_reconnect(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.reconnectDevice(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_devices_by_group(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.getDevicesByGroup(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    update_device_label(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.updateDeviceLabel(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_deviceConfig(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.getDeviceConfig(query);
            console.log("ret=" + JSON.stringify(ret));
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    addShareSiteSetting(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.addShareSiteSetting(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_basketAnnoSite(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.getBasketAnnoSite(query);
            console.log("ret=" + JSON.stringify(ret));
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_basket_anno_site_by_siteId(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.getBasketAnnoSiteBySiteId(query);
            console.log("ret = " + JSON.stringify(ret));
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_basketAnnoTeamBySiteId(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.getBasketAnnoTeamBySiteId(query);
            console.log("ret=" + JSON.stringify(ret));
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    upsert_basketball_session(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.upsertBasketBallSession(data);
            console.log(`ret = ${JSON.stringify(ret)}`);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    ffmpeg_config(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.getFFmpegConfig(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    update_ffmpeg_config(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.updateFFmpegConfig(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    update_ffmpeg_config_time(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.siteService.updateFFmpegConfigTime(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
};
__decorate([
    common_1.Post('add_site'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "add_site", null);
__decorate([
    common_1.Post('get_site_names'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_site_names", null);
__decorate([
    common_1.Post('get_site_lists'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_site_lists", null);
__decorate([
    common_1.Post('get_site_detail'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_site_detail", null);
__decorate([
    common_1.Post('update_site'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "update_site", null);
__decorate([
    common_1.Get('get_template'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_template", null);
__decorate([
    common_1.Post('add_template'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "add_template", null);
__decorate([
    common_1.Post('change_DeviceConfig'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "changeDeviceConfig", null);
__decorate([
    common_1.Get('get_CameraSetting'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_CameraSetting", null);
__decorate([
    common_1.Post('add_camera_setting'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "add_CameraSetting", null);
__decorate([
    common_1.Get('get_account_match_sites'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_account_match_sites", null);
__decorate([
    common_1.Post('add_account_match_sites'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "add_account_match_sites", null);
__decorate([
    common_1.Get('get_binding_table'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_binding_table", null);
__decorate([
    common_1.Post('set_binding_table'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "set_binding_table", null);
__decorate([
    common_1.Post('get_heartbeat_redis'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_heartbeat_redis", null);
__decorate([
    common_1.Post('set_heartbeat_redis'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "set_heartbeat_redis", null);
__decorate([
    common_1.Post('v2/post_site_setting'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "post_site_setting", null);
__decorate([
    common_1.Get('v2/get_site_setting'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_site_setting", null);
__decorate([
    common_1.Post('v2/get_site_setting_info'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_site_setting_info", null);
__decorate([
    common_1.Post('v2/update_site_setting'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "update_site_setting", null);
__decorate([
    common_1.Get('v2/bind'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "bind", null);
__decorate([
    common_1.Get('v2/prebind'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "prebind", null);
__decorate([
    common_1.Post('v2/create'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "create", null);
__decorate([
    common_1.Post('v2/update_general'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "update_general", null);
__decorate([
    common_1.Get('v2/get_general'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_general", null);
__decorate([
    common_1.Post('v2/update_video'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "update_video", null);
__decorate([
    common_1.Get('v2/get_groups'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_groups", null);
__decorate([
    common_1.Post('v2/add_group'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "add_group", null);
__decorate([
    common_1.Get('v2/device_reconnect'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "device_reconnect", null);
__decorate([
    common_1.Get('v2/get_devices_by_group'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_devices_by_group", null);
__decorate([
    common_1.Post('v2/update_device_label'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "update_device_label", null);
__decorate([
    common_1.Get('v2/get_deviceConfig'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_deviceConfig", null);
__decorate([
    common_1.Post('v2/add_share_site_setting'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "addShareSiteSetting", null);
__decorate([
    common_1.Get('v2/get_basketAnnoSite'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_basketAnnoSite", null);
__decorate([
    common_1.Get('v2/get_basket_anno_site_by_siteId'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_basket_anno_site_by_siteId", null);
__decorate([
    common_1.Get('v2/get_basketAnnoTeamBySiteId'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "get_basketAnnoTeamBySiteId", null);
__decorate([
    common_1.Post('v2/upsert_basketball_session'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "upsert_basketball_session", null);
__decorate([
    common_1.Get('v2/ffmpeg_config'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "ffmpeg_config", null);
__decorate([
    common_1.Post('v2/update_ffmpeg_config'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "update_ffmpeg_config", null);
__decorate([
    common_1.Post('v2/update_ffmpeg_config_time'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], SiteController.prototype, "update_ffmpeg_config_time", null);
SiteController = __decorate([
    common_1.Controller('site'),
    __metadata("design:paramtypes", [site_service_1.SiteService])
], SiteController);
exports.SiteController = SiteController;
//# sourceMappingURL=site.controller.js.map