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
const ret_component_1 = require("../common/ret.component");
const mongoose_1 = require("mongoose");
const wechat_component_1 = require("../common/wechat.component");
const template_component_1 = require("../wechat/template.component");
var JsonDB = require('node-json-db');
var mongoose = require("mongoose");
let UsersService = class UsersService {
    constructor(usersModel) {
        this.usersModel = usersModel;
    }
    find(name, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var tiaojian = { "name": name, "game_id": { $regex: game_id, $options: "i" } };
            var Users = yield this.usersModel.findOne(tiaojian);
            var users = JSON.parse(JSON.stringify(Users));
            console.log(users);
            if (users !== null) {
                if (users['game_id'] !== undefined) {
                    ret.code = 0;
                    ret.result = users;
                }
                else {
                    ret.code = 1;
                    ret.description = game_id + " undefined";
                }
            }
            else {
                ret.code = 1;
                ret.description = "users undefined";
            }
            return ret;
        });
    }
    auto_push(game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var tiaojian = { "game_id": { $regex: game_id, $options: "i" } };
            var update = { $set: { 'is_video': 1 } };
            console.log(update);
            yield this.usersModel.findOneAndUpdate(tiaojian, update);
            ret.code = 0;
            ret.description = "Auto push successful.";
            return ret;
        });
    }
    auto_update(game_id, game_time) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var tiaojian = { "game_id": game_id.split("\n")[1] };
            var update = { $set: { "game_time": game_time } };
            var a = yield this.usersModel.findOneAndUpdate(tiaojian, update);
            if (a !== null) {
                ret.code = 0;
                ret.result = a;
            }
            else {
                ret.code = 0;
                ret.description = game_id;
                ret.name = game_time;
                ret.result = a;
            }
            return ret;
        });
    }
    get_video(game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var tiaojian = { "game_id": { $regex: game_id, $options: "i" } };
            var Users = yield this.usersModel.findOne(tiaojian);
            var users = JSON.parse(JSON.stringify(Users));
            console.log(users);
            if (users.game_id !== undefined) {
                ret.code = 0;
                ret.result = users;
            }
            else {
                ret.code = 1;
                ret.description = "users.game_id:" + game_id + " undefined";
            }
            return ret;
        });
    }
    is_reservate(code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let access_DB = new JsonDB('./db/access_token.json', true, false);
            var wechat = access_DB.getData("/" + state + "/access");
            let ret = new ret_component_1.RetObject;
            if (code.length > 0) {
                var WechatUserInfo = yield wechat_component_1.WechatWeb.get_wechat(code, state);
                var response = WechatUserInfo['wechat'];
                var time = template_component_1.Template.get_time();
                var openid = response.openid;
                var tiaojian = { "wechat.openid": openid };
                var Runusers = yield this.usersModel.findOne(tiaojian);
                var runusers = JSON.parse(JSON.stringify(Runusers));
                if (runusers == null) {
                    ret.code = 1;
                    ret.result = response;
                }
                else if (runusers['wechat'] == undefined) {
                    ret.code = 1;
                    ret.result = response;
                }
                else {
                    ret.code = 0;
                    ret.result = runusers;
                }
            }
            else {
                ret.code = 1;
            }
            return ret;
        });
    }
    add_user(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var tiaojian = { "game_id": data.game_id, "name": data.name };
            var update = { $set: { "wechat": data.wechat } };
            var Runusers = yield this.usersModel.findOne(tiaojian);
            var runusers = JSON.parse(JSON.stringify(Runusers));
            if (runusers !== null) {
                if (runusers['wechat'] == undefined) {
                    console.log("这个号码没人绑定");
                    yield this.usersModel.update(tiaojian, update);
                    ret.code = 0;
                }
                else {
                    ret.code = 1;
                }
            }
            else {
                ret.code = 1;
            }
            return ret;
        });
    }
    get_users(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var Users = yield this.usersModel.find(data);
            var users = JSON.parse(JSON.stringify(Users));
            ret.code = 0;
            ret.result = users;
            return ret;
        });
    }
    give_like(game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var tiaojian = { "game_id": game_id };
            var update = { $inc: { 'likes': 1 } };
            var Users = yield this.usersModel.findOneAndUpdate(tiaojian, update);
            var users = JSON.parse(JSON.stringify(Users));
            if (users !== null) {
                ret.code = 0;
            }
            else {
                ret.code = 1;
            }
            return ret;
        });
    }
    userTest() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var tiaojian = {};
            var Users = yield this.usersModel.findOne(tiaojian);
            var users = JSON.parse(JSON.stringify(Users));
            if (users !== null) {
                ret.code = 0;
                ret.result = users;
            }
            else {
                ret.code = 1;
            }
            return ret;
        });
    }
};
UsersService = __decorate([
    common_1.Component(),
    __param(0, common_1.Inject('UsersModelToken')),
    __metadata("design:paramtypes", [mongoose_1.Model])
], UsersService);
exports.UsersService = UsersService;
//# sourceMappingURL=users.service.js.map