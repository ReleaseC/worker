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
const ret_component_1 = require("../common/ret.component");
const wechat_component_1 = require("../common/wechat.component");
const wechat_component_2 = require("../common/wechat.component");
const FS = require("fs");
const axios_1 = require("axios");
const crypto = require("crypto");
const template_component_1 = require("./template.component");
const environment_1 = require("../environment/environment");
const HttpRequest = require("ufile").HttpRequest;
const AuthClient = require("ufile").AuthClient;
var mongoose = require("mongoose");
var JsonDB = require("node-json-db");
const db_service_1 = require("../common/db.service");
const db_tools_1 = require("../common/db.tools");
const httpclient_interface_1 = require("../../lib/oss/httpclient.interface");
const httpclient_1 = require("../../lib/oss/httpclient");
let WechatService = class WechatService {
    test(code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            var WechatUserInfo = yield wechat_component_2.WechatWeb.get_wechat(code, state);
            console.log();
            let ret = new ret_component_1.RetObject;
            var tiaojian = { "wechat.openid": "o_cTFwig1l0hKD16UyQXhCufyZoI", "source": "0005" };
            var Wechatusers = yield db_service_1.wechatdb.findOne(tiaojian);
            var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
            console.log(wechatusers);
            console.log(">>>>>>>>>");
            ret.code = 0;
            ret.result = wechatusers;
            return ret;
        });
    }
    get_code(code, state, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let isTickect = false;
            console.log(`wechat.service.ts >>> get_code >>> state = ${state}`);
            if (state.endsWith("Ticket")) {
                state = state.replace("Ticket", "");
                isTickect = true;
            }
            console.log(`wechat.service.ts >>> get_code after state.endsWith >>> state = ${state} >>> isTicket = ${isTickect}`);
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var wechat = access_DB.getData("/" + state + "/access");
            console.log(code);
            let ret = new ret_component_1.RetObject;
            if (code.length > 0) {
                var WechatUserInfo = yield wechat_component_2.WechatWeb.get_wechat(code, state);
                var response = WechatUserInfo["wechat"];
                var response_info = WechatUserInfo["info"];
                ret.description = response.openid;
                ret.name = response_info.nickname;
                ret.headimgurl = response_info.headimgurl;
                ret.siteId = state;
                console.log(response);
                console.log(response_info);
                if (response_info.subscribe === 0) {
                    ret.code = 0;
                }
                var openid = response.openid;
                var time = template_component_1.Template.get_time();
                console.log(state);
                var tiaojian = { "wechat.openid": openid, "source": state };
                var update = { $set: { "wechat": response, "info": response_info, "isTicket": isTickect } };
                var Wechatusers = yield db_service_1.wechatdb.findOneAndUpdate(tiaojian, update);
                var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
                console.log(wechatusers);
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                if (wechatusers !== null) {
                    if (wechatusers["wechat"] === undefined) {
                        ret.code = 0;
                    }
                    else {
                        ret.code = 1;
                    }
                }
                else {
                    var createdwechatuser = new db_service_1.wechatdb({
                        "wechat": response,
                        "time": time,
                        "source": state,
                        "info": response_info,
                        "isTicket": isTickect
                    });
                    yield createdwechatuser.save();
                }
            }
            else {
                ret.code = 1;
            }
            return ret;
        });
    }
    get_payid(code, state, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let state_siteid = state.split(',')[0];
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var wechat = access_DB.getData("/" + state_siteid + "/access");
            console.log(code);
            let ret = new ret_component_1.RetObject;
            if (code.length > 0) {
                var WechatUserInfo = yield wechat_component_2.WechatWeb.get_wechat(code, state_siteid);
                var response = WechatUserInfo["wechat"];
                var response_info = WechatUserInfo["info"];
                ret.description = response.openid;
                console.log(response);
                console.log(response_info);
                if (response_info.subscribe === 0) {
                    ret.code = 0;
                }
            }
            else {
                ret.code = 1;
            }
            return ret;
        });
    }
    wpp_get_code(code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var wechat = access_DB.getData("/" + state + "/access");
            let ret = new ret_component_1.RetObject;
            if (code.length > 0) {
                var WechatUserInfo = yield wechat_component_2.WechatWeb.get_wechat(code, state);
                var response = WechatUserInfo["wechat"];
                var response_info = WechatUserInfo["info"];
                ret.code = 0;
                ret.description = response.openid;
                if (response_info.subscribe === 0) {
                    ret.code = 1;
                }
                var openid = response.openid;
                var uid = state;
                var tiaojian = { "wechat.openid": openid, "source": "wpp" };
                var time = template_component_1.Template.get_time();
                var update = { $set: { "wechat": response, "info": response_info } };
                var Wechatusers = yield db_service_1.wechatdb.findOneAndUpdate(tiaojian, update);
                var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
                if (wechatusers["wechat"] === undefined) {
                    var createdwechatuser = new wechat({
                        "wechat": response,
                        "time": time,
                        "source": state,
                        "info": response_info
                    });
                    yield createdwechatuser.save();
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
    wpp_get_tickets(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var wechat = access_DB.getData("/access");
            var time = template_component_1.Template.get_time();
            var ticket = data;
            console.log(ticket);
            function reserve(data) {
                return __awaiter(this, void 0, void 0, function* () {
                    var body = template_component_1.Template.get_tickets(data, ticket);
                    var access_token = wechat.access_token;
                    var response = yield axios_1.default.post("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + access_token, body);
                    if (response.data) {
                    }
                    console.log(response.data);
                });
            }
            console.log(data);
            let ret = new ret_component_1.RetObject;
            ret.code = 0;
            var tiaojian = { "wechat.openid": data.openid, "source": "wpp" };
            var update = { $set: { "tags": data.tags, "tikcets": data.tickets } };
            var Wechatusers = yield db_service_1.wechatdb.findOneAndUpdate(tiaojian, update);
            var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
        });
    }
    get_token() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            for (var i = 0; i < wechat_component_1.WeChatInfo['siteId'].length; i++) {
                let access_DB = new JsonDB("./db/access_token.json", true, false);
                var wechat = access_DB.getData("/" + wechat_component_1.WeChatInfo["siteId"][i] + "/access");
                var siteId = wechat_component_1.WeChatInfo["siteId"][i];
                var time = new Date().getTime();
                if ((time - wechat.get_time) > 7200000 || wechat.access_token === undefined) {
                    try {
                        console.log(time);
                        let response = yield axios_1.default.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + wechat_component_1.WeChatInfo[siteId].appid + "&secret=" + wechat_component_1.WeChatInfo[siteId].secret);
                        var access_token = response.data.access_token;
                        access_DB.push("/" + wechat_component_1.WeChatInfo["siteId"][i] + "/access", {
                            "access_token": access_token,
                            "expires_in": "7200",
                            "get_time": time
                        });
                        ret.code = 0;
                        ret.result = response.data.access_token;
                    }
                    catch (error) {
                    }
                }
                else {
                    ret.code = 0;
                    var access_token = wechat.access_token;
                    ret.result = access_token;
                }
            }
            return ret;
        });
    }
    get_jsapi_ticket(url, siteId) {
        var siteId, url, url;
        return __awaiter(this, void 0, void 0, function* () {
            console.log(siteId);
            console.log(url);
            let ret = new ret_component_1.RetObject;
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var jsapi = access_DB.getData("/" + siteId + "/jsapi");
            var access = access_DB.getData("/" + siteId + "/access");
            siteId = siteId;
            var time = new Date().getTime();
            var noncestr = "siiva123456";
            var timestamp = String((time / 1000)).split(".")[0];
            console.log(time);
            console.log(timestamp);
            console.log((time - jsapi.get_time) / 1000);
            if ((time - jsapi.get_time) > 7200000 || jsapi.ticket === undefined) {
                try {
                    url = url.split("#")[0];
                    console.log(access.access_token);
                    let response = yield axios_1.default.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access.access_token + "&type=jsapi");
                    if (response.data.errcode !== 0) {
                        let newresponse = yield axios_1.default.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + wechat_component_1.WeChatInfo[siteId].appid + "&secret=" + wechat_component_1.WeChatInfo[siteId].secret);
                        var access_token = newresponse.data.access_token;
                        let response = yield axios_1.default.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi");
                        var jsapi_ticket = response.data.ticket;
                        access_DB.push("/" + siteId + "/access", {
                            "access_token": access_token,
                            "expires_in": "7200",
                            "get_time": time
                        });
                        access_DB.push("/" + siteId + "/jsapi", { "ticket": jsapi_ticket, "expires_in": "7200", "get_time": time });
                        var string = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
                        console.log(string);
                        let signature = crypto.createHash("sha1").update(string).digest("hex");
                        console.log(signature);
                        console.log(typeof (signature));
                        ret.code = 1;
                        ret.result = { "time": timestamp, "signature": signature };
                    }
                    else {
                        var jsapi_ticket = response.data.ticket;
                        console.log(response.data);
                        access_DB.push("/" + siteId + "/jsapi", { "ticket": jsapi_ticket, "expires_in": "7200", "get_time": time });
                        var string = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
                        console.log(string);
                        let signature = crypto.createHash("sha1").update(string).digest("hex");
                        console.log(signature + "zzzzzzzzzzzzzzz");
                        console.log(typeof (signature));
                        ret.code = 1;
                        ret.result = { "time": timestamp, "signature": signature };
                    }
                }
                catch (error) {
                    ret.code = 0;
                    return ret;
                }
            }
            else {
                url = url.split("#")[0];
                var string = "jsapi_ticket=" + jsapi.ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
                console.log(string);
                let signature = crypto.createHash("sha1").update(string).digest("hex");
                console.log("zzzzzzzzzzzzzzzzzzz");
                console.log(signature);
                console.log(typeof (signature));
                ret.code = 1;
                ret.result = { "time": timestamp, "signature": signature };
            }
            return ret;
        });
    }
    auto_push(id, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var wechat = access_DB.getData("/access");
            this.get_token();
            var time = template_component_1.Template.get_time();
            let ret = new ret_component_1.RetObject;
            var access_token = wechat.access_token;
            function send(data) {
                return __awaiter(this, void 0, void 0, function* () {
                    var body = {
                        "touser": id,
                        "template_id": wechat_component_1.WeChatInfo[siteId].template.get_video,
                        "url": "https://bt.siiva.com/#/result?id=" + id,
                        "miniprogram": {
                            "appid": "",
                            "pagepath": ""
                        },
                        "data": {
                            "first": {
                                "value": "你好，您在hello Kitty主题乐园拍摄的时光子弹纪念视频已制作成功",
                                "color": "#173177"
                            },
                            "keyword1": {
                                "value": "时光子弹定制视频",
                                "color": "#173177"
                            },
                            "keyword2": {
                                "value": time,
                                "color": "#173177"
                            },
                            "remark": {
                                "value": "点击详情，查看您的专属时光子弹短视频",
                                "color": "#173177"
                            }
                        }
                    };
                    var response = yield axios_1.default.post("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + access_token, body);
                    if (response.data.errcode === 40001) {
                        send(data);
                    }
                });
            }
            var tiaojian = { "wechat.openid": id };
            var Wechatusers = yield db_service_1.wechatdb.findOne(tiaojian);
            var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
            if (wechatusers.gameInfo !== undefined) {
                ret.code = 1;
            }
            else {
                ret.code = 0;
            }
            return ret;
        });
    }
    get_wechatuser() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret.code = 2;
            var tiaojian = { "source": "wpp" };
            var Wechatusers = yield db_service_1.wechatdb.find(tiaojian);
            var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
            if (wechatusers["wechat"] !== undefined) {
                ret.code = 1;
                ret.result = wechatusers;
            }
            else {
                ret.code = 0;
            }
            return ret;
        });
    }
    get_videos(code, state, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(code, state);
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var wechat = access_DB.getData("/" + state + "/access");
            let ret = new ret_component_1.RetObject;
            if (code.length > 0) {
                var response = yield axios_1.default.post("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + wechat_component_1.WeChatInfo[state].appid + "&secret=" + wechat_component_1.WeChatInfo[state].secret + "&code=" + code + "&grant_type=authorization_code", {});
                console.log(response.data);
                var openid = response.data.openid;
                var uid = state;
                var tiaojian = { "wechat.openid": openid, "source": state };
                console.log(tiaojian);
                var Wechatusers = yield db_service_1.wechatdb.findOne(tiaojian);
                var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
                console.log(wechatusers);
                if (wechatusers !== null) {
                    if (wechatusers["wechat"] !== undefined) {
                        ret.code = 1;
                        ret.description = openid;
                        ret.result = wechatusers;
                        console.log("有这个人");
                        ret.description = openid;
                        ret.name = wechatusers.info.nickname;
                        console.log(wechatusers.videoNames);
                        var str = undefined;
                        ret.statusMsg = undefined;
                        if (wechatusers.videoNames !== undefined) {
                            var length = wechatusers.videoNames.length;
                            ret.statusMsg = wechatusers.videoNames[length - 1];
                        }
                        console.log(`wechat.service.ts >>> get_videos >>> isTicket = ${wechatusers.isTicket}`);
                        res.redirect(environment_1.environment.apiServer + state + "/#/result?id=" + ret.description + "&name=" + ret.name + "&videonames=" + ret.statusMsg + "&videonumber=" + length + "&isTicket=" + (wechatusers.isTicket || false));
                    }
                    else {
                        ret.code = 0;
                        console.log("没有这个人");
                        res.redirect(environment_1.environment.apiServer + state + "/#/result?is_play=no");
                    }
                }
                else {
                    ret.code = 0;
                    console.log("没有这个人");
                    res.redirect(environment_1.environment.apiServer + state + "/#/result?is_play=no");
                }
            }
            else {
                ret.code = -1;
            }
            return ret;
        });
    }
    get_like(data) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(data);
            let ret = new ret_component_1.RetObject;
            if (data.friend_id) {
                var Wechatusers = yield db_service_1.wechatdb.findOne({ "wechat.openid": data.open_id, "source": data.siteId });
                var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
                if (wechatusers !== null) {
                    console.log("已经进入了点赞");
                    if (wechatusers["likes"] !== undefined) {
                        console.log("已经进入了点赞>>>>>>>>>>>>>>>");
                        console.log(wechatusers.likes);
                        if (wechatusers["likes"]["friends_like"].indexOf(data.friend_id) < 0) {
                            var friends = wechatusers["likes"]["friends_like"] + "," + data.friend_id;
                            yield db_service_1.wechatdb.update({
                                "wechat.openid": data.open_id,
                                "source": data.siteId
                            }, { $set: { "likes.friends_like": friends } });
                            ret.code = 1;
                        }
                        else {
                            ret.code = 1;
                            console.log("已经存在了");
                        }
                    }
                    else {
                        console.log("有新的id点赞");
                        var friends = "there is," + data.friend_id;
                        yield db_service_1.wechatdb.update({
                            "wechat.openid": data.open_id,
                            "source": data.siteId
                        }, { $set: { "likes.friends_like": friends } });
                        ret.code = 1;
                    }
                }
            }
            console.log(ret);
            return ret;
        });
    }
    is_user(code, state, res) {
        return __awaiter(this, void 0, void 0, function* () {
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var user_id = state.split(",")[0];
            var video_name = state.split(",")[1];
            var user_name = state.split(",")[2];
            var urlnumber = state.split(",")[3];
            var siteId = state.split(",")[4];
            var wechat = access_DB.getData("/" + siteId + "/access");
            var WechatUserInfo = yield wechat_component_2.WechatWeb.get_wechat(code, siteId);
            let ret = new ret_component_1.RetObject;
            var Wechatusers = yield db_service_1.wechatdb.findOne({ "wechat.openid": user_id, "source": siteId });
            var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
            if (wechatusers !== null) {
                if (wechatusers["likes"] !== undefined) {
                    if (wechatusers["likes"]["friends_like"].indexOf(WechatUserInfo["wechat"].openid) > 0) {
                        console.log("存在，已点赞");
                        ret.code = 1;
                        ret.statusMsg = user_id;
                        ret.status = wechatusers["likes"]["friends_like"].split(",").length - 1;
                        ret.description = WechatUserInfo["wechat"].openid;
                        ret.is_like = 1;
                        ret.name = user_name;
                        ret.siteId = video_name;
                        res.redirect(environment_1.environment.apiServer + siteId + "/#/result?id=" + ret.statusMsg + "&friend_id=" + ret.description + "&is_like=" + ret.is_like + "&number=" + ret.status + "&videonames=" + ret.siteId + "&name=" + ret.name);
                        console.log(ret);
                    }
                    else {
                        console.log("不存在，未点赞");
                        ret.code = 0;
                        ret.statusMsg = user_id;
                        ret.status = wechatusers["likes"]["friends_like"].split(",").length - 1;
                        ret.description = WechatUserInfo["wechat"].openid;
                        ret.is_like = 0;
                        ret.name = user_name;
                        ret.siteId = video_name;
                        res.redirect(environment_1.environment.apiServer + siteId + "/#/result?id=" + ret.statusMsg + "&friend_id=" + ret.description + "&is_like=" + ret.is_like + "&number=" + ret.status + "&videonames=" + ret.siteId + "&name=" + ret.name);
                        console.log(ret);
                    }
                }
                else {
                    console.log("该用户没人点赞");
                    ret.code = -1;
                    ret.statusMsg = user_id;
                    ret.status = 0;
                    ret.description = WechatUserInfo["wechat"].openid;
                    ret.is_like = 0;
                    ret.name = user_name;
                    ret.siteId = video_name;
                    res.redirect(environment_1.environment.apiServer + siteId + "/#/result?id=" + ret.statusMsg + "&friend_id=" + ret.description + "&is_like=" + ret.is_like + "&number=" + ret.status + "&videonames=" + ret.siteId + "&name=" + ret.name);
                }
            }
            return ret;
        });
    }
    create_number(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var db = mongoose.createConnection("mongodb://localhost/numbers");
            var monSchema = new mongoose.Schema({
                url: String,
                urlnumber: Number,
                sharenumber: Number
            });
            var number = db.model("numbers", monSchema);
            yield number.findOne({ "url": data.url }, function (err, numbers) {
                if (err) {
                    return err;
                }
                if (numbers) {
                    console.log(typeof (data.urlnumber));
                    console.log(typeof (numbers.urlnumber));
                    var urlnumber = data.urlnumber + numbers.urlnumber;
                    var sharenumber = data.sharenumber + numbers.sharenumber;
                    number.update({ "url": data.url }, {
                        $set: {
                            "urlnumber": urlnumber,
                            "sharenumber": sharenumber
                        }
                    }, function (err, docs) {
                        ret.code = 1;
                        if (err) {
                            console.log(err);
                            ret.code = -1;
                        }
                        console.log("更改成功：" + docs);
                    });
                }
                else {
                    var Number = new number({ "url": data.url, "urlnumber": 1, "sharenumber": 0 });
                    Number.save(function (err, docs) {
                        ret.code = 1;
                        if (err) {
                            console.log(err);
                            ret.code = -1;
                        }
                        console.log("保存成功：" + docs);
                    });
                }
            });
        });
    }
    video_name(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var videoname;
            var tiaojian = { "wechat.openid": data.task.userId, "source": data.task.siteId };
            console.log(tiaojian);
            var Wechatusers = yield db_service_1.wechatdb.findOne(tiaojian);
            var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
            var userData;
            if (wechatusers && wechatusers.videoNames !== undefined) {
                wechatusers.videoNames[wechatusers.videoNames.length] = data["task"]["output"]["name"].split(".")[0];
                videoname = wechatusers.videoNames;
                var update = { $set: { "videoNames": videoname } };
                yield db_service_1.wechatdb.update(tiaojian, update);
            }
            else if (data["task"]["output"]) {
                videoname = data["task"]["output"]["name"] ? [data["task"]["output"]["name"].split(".")[0]] : videoname;
                var update = { $set: { "videoNames": videoname } };
                yield db_service_1.wechatdb.update(tiaojian, update);
            }
            return ret;
        });
    }
    get_data() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var Number = mongoose.createConnection("mongodb://localhost/numbers");
            var Like = mongoose.createConnection("mongodb://localhost/likes");
            var monSchema = new mongoose.Schema({});
            var number = Number.model("numbers", monSchema);
            var like = Like.model("likes", monSchema);
            try {
                var numbers = yield number.find({});
                var numbers = JSON.parse(JSON.stringify(numbers));
            }
            catch (err) {
            }
            try {
                var likes = yield like.find({});
                var likes = JSON.parse(JSON.stringify(likes));
            }
            catch (err) {
            }
            var data = {};
            console.log();
            console.log(likes);
            var like_number = 0;
            for (var i = 0; i < likes.length; i++) {
                like_number += likes[i].friends_like.split(",").length - 1;
            }
            data["005"] = { "urlnumber": numbers[1].urlnumber, "sharenumber": numbers[1].sharenumber };
            data["006"] = { "urlnumber": numbers[0].urlnumber, "sharenumber": numbers[0].sharenumber };
            data["like_number"] = like_number;
            ret.result = data;
            return ret;
        });
    }
    wechatApplogin(code, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var response = yield axios_1.default.get("https://api.weixin.qq.com/sns/jscode2session?appid=wxb4156cd7e9c16be9&secret=fa5044fa0c707f508c7f6522b342b4e7&js_code=" + code + "&grant_type=authorization_code", {});
            if (response.data.errcode == undefined) {
                ret.code = 1;
                ret.result = { "info": "", "wechatapp": response.data };
                if (response.data.unionid !== undefined) {
                    console.log(siteId + ">>>>>>>>>>>>>>>>>");
                    var WechatUser = yield db_service_1.wechatdb.findOneAndUpdate({
                        "info.unionid": response.data.unionid,
                        "source": siteId
                    }, { "wechatapp": response.data });
                    if (WechatUser !== null) {
                        ret.result = { "info": WechatUser, "wechatapp": response.data };
                    }
                }
            }
            else {
                ret.code = 0;
                ret.result = response.data;
            }
            function callback(res) {
            }
            return ret;
        });
    }
    deleteVideo(videoname) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(videoname);
            let ret = new ret_component_1.RetObject;
            FS.unlinkSync("./wechatTXT/" + videoname);
            if (FS.existsSync("./wechatTXT/" + videoname)) {
                ret.code = 0;
            }
            else {
                ret.code = 1;
            }
        });
    }
    downloadVideo(videoName) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            let originFileName = videoName;
            let localFileName = `./wechatTXT/${videoName}`;
            let callback = {
                onSuccess: result => {
                    ret.code = 0;
                    console.log(`wechat video download success`);
                },
                onError: err => {
                    ret.code = 1;
                    console.log(`wechat video download error: ${err}`);
                }
            };
            yield httpclient_1.default.get(originFileName, localFileName, callback, 5, httpclient_interface_1.HttpClientBuckets.PUBLIC_BUCKET);
            console.log(`wechat video download return ret: ${ret.code}`);
            return ret;
        });
    }
    web_login(code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var response = yield axios_1.default.post("https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxa1281d9d88f34304&secret=0b091a100bc3040ef7e5d032b751bf98&code=" + code + "&grant_type=authorization_code");
            ret.result = response.data;
            ret.description = response.data.openid;
            ret.name = "siiva";
            ret.siteId = state;
            ret.code = 1;
            console.log(response.data);
            console.log(ret);
            return ret;
        });
    }
    create_qrcode(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var wechat = access_DB.getData("/" + siteId + "/access");
            var data = { "scene": siteId, "page": "pages/index/index", "width": 430, "auto_color": true, "is_hyaline": false };
            var response = yield axios_1.default.post("https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + wechat.access_token, data);
            ret.result = response.data;
        });
    }
    get_siteId() {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret.description = "0013";
            return ret;
        });
    }
    get_video_name(siteId, openid) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var WechatUser = yield db_service_1.wechatdb.findOne({ "wechat.openid": openid, "source": siteId });
            if (WechatUser.videoNames != undefined || WechatUser.videoNames != null) {
                let length = WechatUser.videoNames.length;
                ret.description = WechatUser.videoNames[length - 1].split(".")[0].split(openid)[1].split("_")[1];
                ret.name = openid;
            }
            else {
                ret.description = "no videos";
            }
            return ret;
        });
    }
    get_tickets_statistics(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            try {
                let conditions = {};
                let retOfIsTicket = new ret_component_1.RetObject();
                let retOfNotTicket = new ret_component_1.RetObject();
                let retOfNullTicket = new ret_component_1.RetObject();
                if (query.siteId) {
                    conditions = { source: query.siteId };
                }
                yield db_service_1.wechatdb.aggregate([{ $match: Object.assign({}, conditions, { "isTicket": true }) }, {
                        $group: {
                            "_id": "$time",
                            "count": { $sum: 1 }
                        }
                    }, {
                        $project: {
                            "_id": 0,
                            "time": "$_id",
                            "count": 1,
                            "isTicket": 1
                        }
                    }], (err, raw) => retOfIsTicket = db_tools_1.dbTools.execSQLCallback({
                    method: "find",
                    err,
                    raw,
                    fileName: "wechat.service.ts",
                    funcName: "get_tickets_statistics"
                }));
                yield db_service_1.wechatdb.aggregate([{ $match: Object.assign({}, conditions, { "isTicket": false }) }, {
                        $group: {
                            "_id": "$time",
                            "count": { $sum: 1 }
                        }
                    }, {
                        $project: {
                            "_id": 0,
                            "time": "$_id",
                            "count": 1,
                            "isTicket": 1
                        }
                    }], (err, raw) => retOfNotTicket = db_tools_1.dbTools.execSQLCallback({
                    method: "find",
                    err,
                    raw,
                    fileName: "wechat.service.ts",
                    funcName: "get_tickets_statistics"
                }));
                yield db_service_1.wechatdb.aggregate([{ $match: Object.assign({}, conditions, { "isTicket": null }) }, {
                        $group: {
                            "_id": "$time",
                            "count": { $sum: 1 }
                        }
                    }, {
                        $project: {
                            "_id": 0,
                            "time": "$_id",
                            "count": 1,
                            "isTicket": 1
                        }
                    }], (err, raw) => retOfNullTicket = db_tools_1.dbTools.execSQLCallback({
                    method: "find",
                    err,
                    raw,
                    fileName: "wechat.service.ts",
                    funcName: "get_tickets_statistics"
                }));
                ret.result = {
                    isTicket: retOfIsTicket.result,
                    notTicket: retOfNotTicket.result.concat(retOfNullTicket.result)
                };
                if (ret.result['isTicket'].length ||
                    ret.result['notTicket'].length) {
                    ret.code = 0;
                }
                else {
                    ret.code = 1;
                }
            }
            catch (e) {
                ret.code = 2;
                ret.description = `获取包票、散票用户统计信息失败：${e}`;
            }
            return ret;
        });
    }
};
WechatService = __decorate([
    common_1.Component()
], WechatService);
exports.WechatService = WechatService;
//# sourceMappingURL=wechat.service.js.map