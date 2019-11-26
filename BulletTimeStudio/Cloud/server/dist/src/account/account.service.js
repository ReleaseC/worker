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
const account_1 = require("./interface/account");
const db_service_1 = require("../common/db.service");
const ret_component_1 = require("../common/ret.component");
const db_service_2 = require("../common/db.service");
const auth_service_1 = require("./auth.service");
const site_service_1 = require("../site/site.service");
const redis_service_1 = require("../common/redis.service");
const tools_1 = require("../common/tools");
const authService = new auth_service_1.AuthService();
const siteService = new site_service_1.SiteService();
var crypto = require('crypto');
let Accounts = [
    { name: "siiva", password: "7a05d1a0a575f7df313f4597e4d608f1", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "hellokitty", password: "bb536b2e0f18d7bf37e112d1c2a8b72c", group: account_1.ACCOUNT_ROLE.GROUP_CUSTOMER },
    { name: "soccer_test", password: "7a05d1a0a575f7df313f4597e4d608f1", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "soccer_test_1", password: "7a05d1a0a575f7df313f4597e4d608f1", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "soccer_test_2", password: "7a05d1a0a575f7df313f4597e4d608f1", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "soccer_test_3", password: "7a05d1a0a575f7df313f4597e4d608f1", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "soccer_test_4", password: "7a05d1a0a575f7df313f4597e4d608f1", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "soccer_test_5", password: "7a05d1a0a575f7df313f4597e4d608f1", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "sh_1", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "sh_2", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "sh_3", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "sh_4", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "bj_1", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "bj_2", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "bj_3", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "bj_4", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "bj_5", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "bj_6", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "bj_7", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "bj_8", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "gz_1", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "gz_2", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "gz_3", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "gz_4", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "gz_5", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
    { name: "gz_6", password: "bb6a4e31e039e1a12c3b8958dd117503", group: account_1.ACCOUNT_ROLE.GROUP_ADMIN },
];
let AccountService = class AccountService {
    login(account, password) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('AccountService.login, account=' + account);
            let md5 = crypto.createHash('md5');
            let result = md5.update(password).digest('hex');
            console.log(">>>> login >>> password");
            console.log(result);
            let ret_account = (yield db_service_1.accountdb.findOne({ account, password: result })) || (yield db_service_1.accountdb.findOne({ "name": account, "password": result }));
            return ret_account;
        });
    }
    add_user(account, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let md5 = crypto.createHash('md5');
            let result = md5.update(password).digest('hex');
            let accountDb = new db_service_1.accountdb({ "account": account, "password": result });
            accountDb.save();
            ret.code = 0;
            ret.description = "add_user save success";
            return ret;
        });
    }
    get_account_list() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var account = yield db_service_1.accountdb.find({}, { account: 1 });
            if (account !== null) {
                ret.code = 0;
                ret.result = account;
            }
            else {
                ret.code = 1;
                ret.description = "No accounts";
            }
            return ret;
        });
    }
    accountList() {
        return __awaiter(this, void 0, void 0, function* () {
            return Accounts;
        });
    }
    findOne(name, password, deviceId) {
        return __awaiter(this, void 0, void 0, function* () {
            let account = null;
            let accounts = Accounts.filter(account => account.name == name);
            if (accounts.length > 0) {
                account = accounts[0];
            }
            yield db_service_2.accMatchSigDb.findOne({ 'account': name }, (err, account) => __awaiter(this, void 0, void 0, function* () {
                if (err) {
                    console.log('accMatchSigDb err=' + err);
                }
                else {
                    if (account) {
                        account.signature = deviceId;
                        account.save();
                    }
                    else {
                        let newAcc = new db_service_2.accMatchSigDb();
                        newAcc.account = name;
                        newAcc.signature = deviceId;
                        newAcc.save();
                    }
                }
            }));
            return account;
        });
    }
    register(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            console.log('data=' + JSON.stringify(data));
            let md5 = crypto.createHash('md5');
            let pass_hex = md5.update(data.password).digest('hex');
            ret = yield authService.authAccessToken(data.access_token);
            if (ret.code != 0) {
                return ret;
            }
            let result = yield db_service_1.accountdb.find({ "account": data.account });
            if (result.length) {
                ret.code = 1;
                ret.description = "This account is exists";
                return ret;
            }
            else {
                let accountDb = new db_service_1.accountdb({
                    "account": data.account,
                    "name": data.account,
                    "password": pass_hex,
                    "role": data.role,
                    "active": true,
                    "description": data.description,
                });
                return accountDb.save()
                    .then(() => {
                    ret.code = 0;
                    ret.description = "register save success";
                    return ret;
                })
                    .catch(err => {
                    ret.code = 0;
                    ret.result = err;
                    return ret;
                });
            }
        });
    }
    get_account_lists(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret = yield authService.authAccessToken(query['access_token']);
            if (ret.code != 0) {
                return ret;
            }
            var account = yield db_service_1.accountdb.find({ "active": true }, { account: 1, role: 1, description: 1, matchSites: 1 });
            if (account.length) {
                ret.code = 0;
                ret.result = account;
            }
            else {
                ret.code = 1;
                ret.description = "No accounts";
            }
            return ret;
        });
    }
    get_account_info(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret = yield authService.authAccessToken(query['access_token']);
            if (ret.code != 0) {
                return ret;
            }
            var result = yield db_service_1.accountdb.findOne({ "account": query['account'] }, { account: 1, role: 1, description: 1, matchSites: 1, groups: 1 });
            if (result) {
                ret.code = 0;
                ret.result = result;
            }
            else {
                ret.code = 1;
                ret.description = "No accounts";
            }
            return ret;
        });
    }
    accountMatchSite(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret = yield authService.authAccessToken(data.access_token);
            if (ret.code != 0) {
                return ret;
            }
            let account = yield db_service_1.accountdb.findOne({ "account": data.account });
            if (account) {
                yield db_service_1.accountdb.findOne({ "account": data.account, "matchSites.matchSiteName": data.matchSiteName }, (err, result) => __awaiter(this, void 0, void 0, function* () {
                    if (result) {
                        for (let i = 0; i < result.matchSites.length; i++) {
                            if (result.matchSites[i].matchSiteName === data.matchSiteName) {
                                result.matchSites[i].matchSiteLists = data.matchSiteLists;
                                yield result.update({ "matchSites": result.matchSites });
                                break;
                            }
                        }
                    }
                    else {
                        const matchData = {
                            "matchSiteName": data.matchSiteName,
                            "matchSiteLists": data.matchSiteLists,
                        };
                        if (!account.matchSites)
                            account.matchSites = [];
                        account.matchSites.push(matchData);
                        yield account.save();
                    }
                }));
                ret.code = 0;
                ret.description = "Update matchSites successful";
            }
            else {
                ret.code = 1;
                ret.description = "No accounts";
            }
            return ret;
        });
    }
    deleteAccount(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret = yield authService.authAccessToken(data.access_token);
            if (ret.code != 0) {
                return ret;
            }
            let result = yield db_service_1.accountdb.update({ "account": data.account }, { $set: { "active": false } });
            console.log('result=' + JSON.stringify(result));
            if (result.ok) {
                ret.code = 0;
                ret.description = "Delete successful.";
            }
            else {
                ret.code = 1;
                ret.description = "Delete failed.";
            }
            return ret;
        });
    }
    getAccountMatchSitesData(data, type) {
        const dataLen = data.length;
        console.log('dataLen=' + dataLen);
        for (let i = 0; i < dataLen; i++) {
            if (data[i].matchSiteName.toUpperCase() === type.toUpperCase()) {
                return data[i];
            }
        }
        return null;
    }
    getSites(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let siteNameArr = [];
            ret = yield authService.authAccessToken(query['access_token']);
            if (ret.code != 0) {
                return siteNameArr;
            }
            let accountApiResult = yield this.get_account_info(query);
            if (accountApiResult.code != 0) {
                return siteNameArr;
            }
            accountApiResult = this.getAccountMatchSitesData(accountApiResult.result['matchSites'], query.type);
            if (accountApiResult != null) {
                ret.code = 0;
                ret.result = accountApiResult;
            }
            else {
                ret.code = 1;
                ret.result = 'No such data on type ' + query.type;
                return siteNameArr;
            }
            let matchSiteListsLen = accountApiResult['matchSiteLists'].length;
            for (let i = 0; i < matchSiteListsLen; i++) {
                let data = {
                    "type": query.type,
                    "siteId": accountApiResult['matchSiteLists'][i],
                    "access_token": query['access_token']
                };
                let siteApiResult = yield siteService.getSiteSettingInfo(data);
                if (siteApiResult.code == 0) {
                    siteNameArr.push({
                        "siteId": accountApiResult['matchSiteLists'][i],
                        "siteName": siteApiResult.result['siteName'],
                    });
                }
                else {
                    ret.code = siteApiResult.code;
                    ret.result = siteApiResult.description;
                    return siteNameArr;
                }
            }
            return siteNameArr;
        });
    }
    getGroupArray(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let groupArray = [];
            ret = yield authService.authAccessToken(query['access_token']);
            if (ret.code != 0) {
                return groupArray;
            }
            let accountApiResult = yield this.get_account_info(query);
            if (accountApiResult.code != 0) {
                return groupArray;
            }
            const groupArrayLen = accountApiResult.result['groups'].length;
            for (let i = 0; i < groupArrayLen; i++) {
                query.group = accountApiResult.result['groups'][i];
                let result = yield siteService.getSiteSetting(query);
                if (result['result'] === undefined)
                    continue;
                for (let j = 0; j < Object.keys(result['result']).length; j++) {
                    groupArray.push(result['result'][j]);
                }
            }
            return groupArray;
        });
    }
    getGroups(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                ret.result = yield db_service_1.accountdb.findOne({ account: query.account }, { groups: 1, _id: 0 });
                ret.code = ret.result ? 0 : 1;
            }
            catch (error) {
                ret.code = 2;
                ret.description = `获取分组失败: ${error}`;
            }
            return ret;
        });
    }
    getSiteIds(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                if (!query.accessToken) {
                    throw new Error(`access token 无效： ${query.accessToken}`);
                }
                let cacheData = yield redis_service_1.RedisService.getCache(query.accessToken);
                console.log(`cacheData: `);
                console.log(cacheData);
                let cacheDataObj = JSON.parse(cacheData);
                console.log(`cacheDataObj >>> `);
                console.log(cacheDataObj);
                let account = cacheDataObj['account'];
                if (!account) {
                    throw new Error(`account 无效： ${cacheDataObj['account']}`);
                }
                ret.result = yield db_service_1.accountdb.findOne({ account }, { role: 1 });
                ret.code = ret.result ? 0 : 1;
                ret.code === 0 && (ret.result = this.filterRole(ret.result['role']));
            }
            catch (error) {
                ret.code = 2;
                ret.description = `获取siteIds失败： ${error}`;
            }
            return ret;
        });
    }
    filterRole(role) {
        return tools_1.default.isValidArray(role.admin) ||
            tools_1.default.isValidArray(role.owner) ||
            tools_1.default.isValidArray(role.siteAdmin) ||
            [];
    }
};
AccountService = __decorate([
    common_1.Component()
], AccountService);
exports.AccountService = AccountService;
//# sourceMappingURL=account.service.js.map