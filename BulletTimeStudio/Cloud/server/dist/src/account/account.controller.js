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
const account_service_1 = require("./account.service");
const auth_service_1 = require("./auth.service");
const ret_component_1 = require("../common/ret.component");
let AccountController = class AccountController {
    constructor(accountService, authService) {
        this.accountService = accountService;
        this.authService = authService;
    }
    login(res, account, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let ret = yield this.accountService.login(account, password);
                let status = common_1.HttpStatus.FORBIDDEN;
                let accessToken = {};
                console.log("account.controller.ts >>> ret [start]");
                console.log(ret);
                console.log("account.controller.ts >>> ret [end]");
                if (ret !== null) {
                    status = common_1.HttpStatus.OK;
                    accessToken = yield this.authService.createToken(account);
                    accessToken["siteId"] = ret["siteId"];
                    accessToken["group"] = ret["group"];
                }
                else {
                    console.log("account.controller.ts >>> ret is null");
                    ret = new ret_component_1.RetObject();
                    ret.code = 1;
                }
                res.status(status).json(!!Object.keys(accessToken).length ? accessToken : ret);
            }
            catch (e) {
                console.log('/account/login e=' + e);
                let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                res.status(status).json(e);
            }
        });
    }
    logout(res, token) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(common_1.HttpStatus.OK).json('Logout successful');
        });
    }
    add_user(res, account, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.accountService.add_user(account, password);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_account_list(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.accountService.get_account_list();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_soccer_account(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.accountService.accountList();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    soccerLogin(res, acc, password, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let account = yield this.accountService.findOne(acc, password, deviceId);
                let status = common_1.HttpStatus.FORBIDDEN;
                let accessToken = {};
                if (account && account['password'] == password) {
                    status = common_1.HttpStatus.OK;
                    accessToken = yield this.authService.createToken(acc);
                    console.log('accessToken=' + JSON.stringify(accessToken));
                }
                res.status(status).json(accessToken);
            }
            catch (e) {
                console.log(e);
                let status = common_1.HttpStatus.INTERNAL_SERVER_ERROR;
                res.status(status).json(e);
            }
        });
    }
    soccerLogout(res, token) {
        return __awaiter(this, void 0, void 0, function* () {
            res.status(common_1.HttpStatus.OK).json('Soccer logout');
        });
    }
    account_register(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.accountService.register(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    account_getlists(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.accountService.get_account_lists(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    account_getInfo(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.accountService.get_account_info(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    account_matchSites(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('v2/account_matchSites data=' + JSON.stringify(data));
            let ret = yield this.accountService.accountMatchSite(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    account_delete(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.accountService.deleteAccount(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    getSites(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.accountService.getSites(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    getGroupArray(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.accountService.getGroupArray(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_groups(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.accountService.getGroups(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_siteIds(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.accountService.getSiteIds(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
};
__decorate([
    common_1.Post('login'),
    __param(0, common_1.Res()), __param(1, common_1.Body('account')), __param(2, common_1.Body('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "login", null);
__decorate([
    common_1.Get('logout'),
    __param(0, common_1.Res()), __param(1, common_1.Query('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "logout", null);
__decorate([
    common_1.Post('add_user'),
    __param(0, common_1.Res()),
    __param(1, common_1.Body('account')),
    __param(2, common_1.Body('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "add_user", null);
__decorate([
    common_1.Get('get_account_list'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "get_account_list", null);
__decorate([
    common_1.Get('get_soccer_account'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "get_soccer_account", null);
__decorate([
    common_1.Post('soccerLogin'),
    __param(0, common_1.Res()), __param(1, common_1.Body('account')), __param(2, common_1.Body('password')), __param(3, common_1.Body('deviceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "soccerLogin", null);
__decorate([
    common_1.Get('soccerLogout'),
    __param(0, common_1.Res()), __param(1, common_1.Query('accessToken')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "soccerLogout", null);
__decorate([
    common_1.Post('v2/account_register'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "account_register", null);
__decorate([
    common_1.Get('v2/account_getlists'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "account_getlists", null);
__decorate([
    common_1.Get('v2/account_getInfo'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "account_getInfo", null);
__decorate([
    common_1.Post('v2/account_matchSites'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "account_matchSites", null);
__decorate([
    common_1.Post('v2/account_delete'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "account_delete", null);
__decorate([
    common_1.Get('v2/getSites'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getSites", null);
__decorate([
    common_1.Get('v2/getGroupArray'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "getGroupArray", null);
__decorate([
    common_1.Get('v2/get_groups'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "get_groups", null);
__decorate([
    common_1.Get('v2/get_siteIds'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], AccountController.prototype, "get_siteIds", null);
AccountController = __decorate([
    common_1.Controller('account'),
    __metadata("design:paramtypes", [account_service_1.AccountService,
        auth_service_1.AuthService])
], AccountController);
exports.AccountController = AccountController;
//# sourceMappingURL=account.controller.js.map