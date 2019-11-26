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
const jsSHA = require("jssha");
const wechat_service_1 = require("./wechat.service");
const environment_1 = require("../environment/environment");
let WechatController = class WechatController {
    constructor(wechatService) {
        this.wechatService = wechatService;
    }
    Wx(signature, timestamp, echostr, nonce) {
        var token = "siiva123456";
        console.log(echostr);
        var oriArray = new Array();
        oriArray[0] = nonce;
        oriArray[1] = timestamp;
        oriArray[2] = token;
        oriArray.sort();
        var original = oriArray.join("");
        var shaObj = new jsSHA("SHA-1", "TEXT");
        shaObj.update(original);
        var scyptoString = shaObj.getHash("HEX");
        if (signature == scyptoString) {
            return echostr;
        }
        else {
            return "verify fail.";
        }
    }
    test(res, code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.test(code, state);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_code(res, code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.get_code(code, state, res);
            state = state.endsWith("Ticket") ? state.replace("Ticket", "") : state;
            if (state == 'SiivaPage') {
                res.redirect(environment_1.environment.uiServer + state + "/#/homepage?id=" + ret.description + "&name=" + ret.name + "&headimgurl=" + ret.headimgurl);
            }
            else {
                res.redirect(environment_1.environment.apiServer + state + "/#/login?user_id=" + ret.description + "&nickname=" + ret.name + "&code=" + ret.code + "&siiva=wechat" + "&where=" + ret.siteId);
            }
        });
    }
    get_payid(res, code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.get_payid(code, state, res);
            res.redirect(environment_1.environment.uiServer + "SiivaPage/#/result?payid=" + ret.description + "&id=" + state.split(',')[1] + "&taskId=" + state.split(',')[2]);
        });
    }
    wpp_get_code(res, code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.wpp_get_code(code, state);
            res.redirect(environment_1.environment.apiServer + "0004/#/wpp?user_id=" + ret.description + "&code=" + ret.code + "&siiva=wpp" + "&where" + ret.status);
        });
    }
    wpp_get_tickets(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.wpp_get_tickets(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_token(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.get_token();
            console.log(ret);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_jsapi_ticket(res, url, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.get_jsapi_ticket(url, siteId);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_wechatuser(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.get_wechatuser();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    auto_push(res, id, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.auto_push(id, siteId);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_videos(res, code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            var ret = yield this.wechatService.get_videos(code, state, res);
        });
    }
    get_like(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.get_like(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    is_user(res, code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.is_user(code, state, res);
        });
    }
    create_number(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.create_number(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    video_name(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.video_name(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_data(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.get_data();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    Wechatapp(signature, timestamp, echostr, nonce) {
        var token = "siiva123456";
        var oriArray = new Array();
        oriArray[0] = nonce;
        oriArray[1] = timestamp;
        oriArray[2] = token;
        oriArray.sort();
        var original = oriArray.join("");
        var shaObj = new jsSHA("SHA-1", "TEXT");
        shaObj.update(original);
        var scyptoString = shaObj.getHash("HEX");
        return echostr;
    }
    wechatApplogin(res, code, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.wechatApplogin(code, siteId);
            console.log(ret);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    download(res, videoname) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.downloadVideo(videoname);
            console.log(ret);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    deleteVideo(res, videoname) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.deleteVideo(videoname);
            console.log(ret);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    web_login(res, code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.web_login(code, state);
            console.log(ret);
            res.redirect(environment_1.environment.apiServer + state + "/#/login?user_id=" + ret.description + "&nickname=" + ret.name + "&code=" + ret.code + "&siiva=wechat" + "&where=" + ret.siteId);
        });
    }
    create_qrcode(res, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.create_qrcode(siteId);
            console.log(ret);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_siteId(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.get_siteId();
            console.log(ret);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_video_name(res, siteId, openid) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.get_video_name(siteId, openid);
            console.log(ret);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_tickets_statistics(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.wechatService.get_tickets_statistics(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
};
__decorate([
    common_1.Get("wx"),
    __param(0, common_1.Query("signature")),
    __param(1, common_1.Query("timestamp")),
    __param(2, common_1.Query("echostr")),
    __param(3, common_1.Query("nonce")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], WechatController.prototype, "Wx", null);
__decorate([
    common_1.Get("test"),
    __param(0, common_1.Res()), __param(1, common_1.Query("code")), __param(2, common_1.Query("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "test", null);
__decorate([
    common_1.Get("get_code"),
    __param(0, common_1.Res()), __param(1, common_1.Query("code")), __param(2, common_1.Query("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_code", null);
__decorate([
    common_1.Get("get_payid"),
    __param(0, common_1.Res()), __param(1, common_1.Query("code")), __param(2, common_1.Query("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_payid", null);
__decorate([
    common_1.Get("wpp_get_code"),
    __param(0, common_1.Res()), __param(1, common_1.Query("code")), __param(2, common_1.Query("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "wpp_get_code", null);
__decorate([
    common_1.Post("wpp_get_tickets"),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "wpp_get_tickets", null);
__decorate([
    common_1.Get("get_token"),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_token", null);
__decorate([
    common_1.Get("get_jsapi_ticket"),
    __param(0, common_1.Res()), __param(1, common_1.Query("url")), __param(2, common_1.Query("siteId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_jsapi_ticket", null);
__decorate([
    common_1.Get("get_wechatuser"),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_wechatuser", null);
__decorate([
    common_1.Get("auto_push"),
    __param(0, common_1.Res()), __param(1, common_1.Query("id")), __param(2, common_1.Query("siteId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "auto_push", null);
__decorate([
    common_1.Get("get_videos"),
    __param(0, common_1.Res()), __param(1, common_1.Query("code")), __param(2, common_1.Query("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_videos", null);
__decorate([
    common_1.Post("get_like"),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_like", null);
__decorate([
    common_1.Get("is_user"),
    __param(0, common_1.Res()), __param(1, common_1.Query("code")), __param(2, common_1.Query("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "is_user", null);
__decorate([
    common_1.Post("create_number"),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "create_number", null);
__decorate([
    common_1.Post("video_name"),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "video_name", null);
__decorate([
    common_1.Get("get_data"),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_data", null);
__decorate([
    common_1.Get("wechatapp"),
    __param(0, common_1.Query("signature")),
    __param(1, common_1.Query("timestamp")),
    __param(2, common_1.Query("echostr")),
    __param(3, common_1.Query("nonce")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, String]),
    __metadata("design:returntype", void 0)
], WechatController.prototype, "Wechatapp", null);
__decorate([
    common_1.Get("wechatApplogin"),
    __param(0, common_1.Res()), __param(1, common_1.Query("code")), __param(2, common_1.Query("siteId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "wechatApplogin", null);
__decorate([
    common_1.Get("downloadVideo"),
    __param(0, common_1.Res()), __param(1, common_1.Query("videoname")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "download", null);
__decorate([
    common_1.Get("deleteVideo"),
    __param(0, common_1.Res()), __param(1, common_1.Query("videoname")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "deleteVideo", null);
__decorate([
    common_1.Get("web_login"),
    __param(0, common_1.Res()), __param(1, common_1.Query("code")), __param(2, common_1.Query("state")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "web_login", null);
__decorate([
    common_1.Get("create_qrcode"),
    __param(0, common_1.Res()), __param(1, common_1.Query("siteId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "create_qrcode", null);
__decorate([
    common_1.Get("get_siteId"),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_siteId", null);
__decorate([
    common_1.Get("get_video_name"),
    __param(0, common_1.Res()), __param(1, common_1.Query("siteId")), __param(2, common_1.Query("openid")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_video_name", null);
__decorate([
    common_1.Get("get_tickets_statistics"),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatController.prototype, "get_tickets_statistics", null);
WechatController = __decorate([
    common_1.Controller("wechat"),
    __metadata("design:paramtypes", [wechat_service_1.WechatService])
], WechatController);
exports.WechatController = WechatController;
;
//# sourceMappingURL=wechat.controller.js.map