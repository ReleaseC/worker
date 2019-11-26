"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const global_services_1 = require("./common/global.services");
const socket_interface_1 = require("./common/socket.interface");
const timers_1 = require("timers");
const wechat_component_1 = require("./common/wechat.component");
const db_service_1 = require("./common/db.service");
const site_service_1 = require("./site/site.service");
const soccer_service_1 = require("./activity/soccer.service");
const basketball_service_1 = require("./activity/basketball.service");
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const axios_1 = require("axios");
const media_service_1 = require("./activity/media.service");
var JsonDB = require("node-json-db");
var schedule = require("node-schedule");
const siteService = new site_service_1.SiteService();
const soccerService = new soccer_service_1.SoccerService();
const basketballService = new basketball_service_1.BasketballService();
const mediaServer = new media_service_1.MediaService();
const tenpay = require("tenpay");
const config = {
    appid: "wxb0c9caded7e8fc8d",
    mchid: "1493786962",
    partnerKey: "D0A3F589989F8C38226A177A2BF6BB82",
    pfx: require("fs").readFileSync("./src/wechat_payment/apiclient_cert.p12"),
    notify_url: "https://bt.siiva.com/wechat_payment/notify_wechatpay",
    spbill_create_ip: "106.75.216.70"
};
let Tenpay = new tenpay(config);
function bootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        const server = express();
        var cors = require("cors");
        server.use(cors());
        server.use(bodyParser.text({ type: "*/xml" }));
        server.use("/", express.static("./"));
        console.log(path.resolve("../../output"));
        server.use("/", express.static(path.resolve("../../output")));
        const app = yield core_1.NestFactory.create(app_module_1.AppModule, server);
        const httpServer = yield app.listen(3000);
        const io = require("socket.io")(httpServer);
        io.on(socket_interface_1.SOCKET_EVENT.CONNECT, (socket) => {
            global_services_1.Global.setSocket("start_socket", socket);
            soccerService.initService(io, socket);
            basketballService.initService(io, socket);
            mediaServer.initService(io, socket);
            socket.on(socket_interface_1.SOCKET_EVENT.IS_ALIVE, (data) => {
            });
            socket.on(socket_interface_1.SOCKET_EVENT.DISCONNECT, function () {
            });
            socket.on(socket_interface_1.SOCKET_EVENT.REGISTER, function (data) {
                global_services_1.Global.setSocket(data.siteId, socket);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.PREPARE_TO_RECORD, function (data) {
                console.log("去通知本地server准备拍摄");
                console.log(data);
                socket.broadcast.emit("prepare_To_record", data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.ALLOCATING_TASK, (data) => {
                console.log(data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_ASK_LOCAL_ADJUST_POTHO, (data) => {
                console.log(data);
                console.log(socket_interface_1.SOCKET_EVENT.EVENT_ADJUST_POTHO);
                socket.broadcast.emit(socket_interface_1.SOCKET_EVENT.EVENT_ADJUST_POTHO, data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_ADJUST_POTHO_SUCCESS, (data) => {
                console.log(data);
                socket.broadcast.emit(socket_interface_1.SOCKET_EVENT.EVENT_ADJUST_POTHO_SUCCESS_EDGE_ADMIN, data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_GET_CAMERA_CONFIG, (data) => {
                console.log(data);
                console.log(">>>>>>>>>>>>>>>>>>");
                socket.broadcast.emit(socket_interface_1.SOCKET_EVENT.EVENT_GET_CAMERA_CONFIG, data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_GET_CAMERA_CONFIG_ADMIN, (data) => {
                socket.broadcast.emit(socket_interface_1.SOCKET_EVENT.EVENT_GET_CAMERA_CONFIG_ADMIN, data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_SET_CAMERA_CONFIG, (data) => {
                console.log(data);
                socket.broadcast.emit(socket_interface_1.SOCKET_EVENT.EVENT_SET_CAMERA_CONFIG, data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_RESCAN, (data) => {
                console.log(data);
                console.log("re_scan>>>>>>>>>>>>>>>>>>>>>>>");
                socket.broadcast.emit(socket_interface_1.SOCKET_EVENT.EVENT_RESCAN, data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_RESCAN_YIAGENT, data => {
                console.log(data);
                console.log("rescan_yiAgent >>>>>>>>>>>>> ");
                socket.broadcast.emit(socket_interface_1.SOCKET_EVENT.EVENT_RESCAN_YIAGENT, data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_EDGESERVER_STATUS, (data) => {
                console.log(data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_CAMERA_STATUS_FROM_EDGE, (data) => {
                console.log("from edge data=" + JSON.stringify(data));
                db_service_1.deviceStatus.findOne({ siteId: data.siteId }, (err, device) => {
                    if (err)
                        console.log("DB service EVENT_CAMERA_STATUS_FROM_EDGE err=" + err);
                    if (device) {
                        device.status = data.device_status;
                        device.updateTime = data.updateTime;
                        device.save();
                    }
                    else {
                        let newDeviceStatus = new db_service_1.deviceStatus();
                        newDeviceStatus.siteId = data.siteId;
                        newDeviceStatus.status = data.device_status;
                        newDeviceStatus.updateTime = data.updateTime;
                        newDeviceStatus.save();
                    }
                });
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_CAMERA_STATUS, (body, cb) => {
                console.log("EVENT_CAMERA_STATUS body=" + JSON.stringify(body));
                db_service_1.deviceStatus.findOne({ siteId: body.siteId }, (err, device) => {
                    if (err)
                        console.log("DB service EVENT_CAMERA_STATUS_FROM_EDGE err=" + err);
                    if (device) {
                        cb(device);
                    }
                });
            });
            socket.on(socket_interface_1.BASKETBALL_EVENT.DEVICE_ISALIVE, (data) => {
                console.log(`收到来自cloud/admin 的isAlive命令：deviceId = ${data.deviceId}`);
                socket.broadcast.emit(socket_interface_1.BASKETBALL_EVENT.DEVICE_ISALIVE, data);
            });
            socket.on(socket_interface_1.BASKETBALL_EVENT.DEVICE_IMALIVE, (data) => {
                console.log(`收到来自cloud/admin 的imalive命令：deviceId = ${data.deviceId}`);
                socket.broadcast.emit(socket_interface_1.BASKETBALL_EVENT.DEVICE_IMALIVE, data);
            });
            socket.on(socket_interface_1.BASKETBALL_EVENT.REBOOT_DEVICE_CLOUD, (data, cb) => {
                console.log(`收到来自cloud/admin的设备重启命令：deviceId = ${data.deviceId}`);
                socket.broadcast.emit(socket_interface_1.BASKETBALL_EVENT.REBOOT_DEVICE_EDGE, data);
                (typeof cb === 'function') && cb(data);
            });
            socket.on(socket_interface_1.BASKETBALL_EVENT.REBOOT_DEVICE_SUCCESS_EDGE, data => {
                console.log(`收到来自edge/admin的设备重启成功结果：data = ${data}`);
                socket.broadcast.emit(socket_interface_1.BASKETBALL_EVENT.REBOOT_DEVICE_SUCCESS_CLOUD);
            });
            socket.on(socket_interface_1.BASKETBALL_EVENT.REBOOT_DEVICE_FAIL_EDGE, data => {
                console.log(`收到来自edge/admin的设备重启失败结果：data = ${data}`);
                socket.broadcast.emit(socket_interface_1.BASKETBALL_EVENT.REBOOT_DEVICE_FAIL_CLOUD);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_PUSH_APK_UPDATE_CLOUD, data => {
                console.log(`收到来自cloud/admin的推送apk更新命令: url = ${data.url}`);
                socket.broadcast.emit(socket_interface_1.SOCKET_EVENT.EVENT_PUSH_APK_UPDATE_EDGE, data);
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_UPDATE_SCALE, (data, cb) => {
                console.log(`收到来自cloud/admin推送的设备缩放比例的更新: 
								group = ${data.group}, 
								position = ${data.position},
								scale = ${data.scale}`);
                if (data.group && data.position && data.scale) {
                    let soccerService = new site_service_1.SiteService();
                    soccerService.updateScaleByGroupPosition(data.group, data.position, data.scale);
                    cb(data);
                }
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_JOIN_SITE, data => {
                let siteId = data.siteId;
                let deviceId = data.device;
                if (siteId) {
                    console.log(`deviceId: ${deviceId} join to room ${siteId}`);
                    socket.join(siteId);
                }
            });
            socket.on(socket_interface_1.SOCKET_EVENT.EVENT_LEAVE_SITE, data => {
                let siteId = data.siteId;
                let deviceId = data.device;
                if (siteId) {
                    console.log(`deviceId: ${deviceId} leave from room ${siteId}`);
                    socket.leave(siteId);
                }
            });
        });
        console.log(">>>>>>>>>>>>>>>>>>");
        timers_1.setInterval(function () {
            console.log("更新token");
            refresh_token();
            refresh_jsapi_ticket();
        }, 900000);
        function refresh_jsapi_ticket() {
            return __awaiter(this, void 0, void 0, function* () {
                for (var i = 0; i < wechat_component_1.WeChatInfo['siteId'].length; i++) {
                    let access_DB = new JsonDB("./db/access_token.json", true, false);
                    var jsapi = access_DB.getData("/" + wechat_component_1.WeChatInfo["siteId"][i] + "/jsapi");
                    var wechat = access_DB.getData("/" + wechat_component_1.WeChatInfo["siteId"][i] + "/access");
                    var siteId = wechat_component_1.WeChatInfo["siteId"][i];
                    console.log(siteId + "????????");
                    var url = "https://bt.siiva.com/#/";
                    var time = new Date().getTime();
                    var noncestr = "siiva123456";
                    var timestamp = String((time / 1000)).split(".")[0];
                    console.log((time - jsapi.get_time) / 1000);
                    if ((time - jsapi.get_time) > 7200000 || jsapi.ticket === undefined) {
                        try {
                            var url = url.split("#")[0];
                            console.log(wechat.access_token);
                            let response = yield axios_1.default.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + wechat.access_token + "&type=jsapi");
                            console.log(response.data.errcode + ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                            if (response.data.errcode !== 0) {
                                let newresponse = yield axios_1.default.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + wechat_component_1.WeChatInfo[siteId].appid + "&secret=" + wechat_component_1.WeChatInfo[siteId].secret);
                                var access_token = newresponse.data.access_token;
                                let response = yield axios_1.default.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi");
                                access_DB.push("/" + wechat_component_1.WeChatInfo["siteId"][i] + "/access", {
                                    "access_token": access_token,
                                    "expires_in": "7200",
                                    "get_time": time
                                });
                            }
                            var jsapi_ticket = response.data.ticket;
                            console.log(response.data);
                            access_DB.push("/" + wechat_component_1.WeChatInfo["siteId"][i] + "/jsapi", {
                                "ticket": jsapi_ticket,
                                "expires_in": "7200",
                                "get_time": time
                            });
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                    else {
                        console.log("不需要更新");
                    }
                }
            });
        }
        function refresh_token() {
            return __awaiter(this, void 0, void 0, function* () {
                for (var i = 0; i < wechat_component_1.WeChatInfo['siteId'].length; i++) {
                    let access_DB = new JsonDB("./db/access_token.json", true, false);
                    var wechat = access_DB.getData("/" + wechat_component_1.WeChatInfo["siteId"][i] + "/access");
                    var siteId = wechat_component_1.WeChatInfo["siteId"][i];
                    console.log(siteId + "?????");
                    var time = new Date().getTime();
                    if ((time - wechat.get_time) > 7200000 || wechat.access_token === undefined) {
                        let response = yield axios_1.default.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + wechat_component_1.WeChatInfo[siteId].appid + "&secret=" + wechat_component_1.WeChatInfo[siteId].secret);
                        console.log(response.data);
                        console.log(response.data.errcode + ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
                        var access_token = response.data.access_token;
                        access_DB.push("/" + wechat_component_1.WeChatInfo["siteId"][i] + "/access", {
                            "access_token": access_token,
                            "expires_in": "7200",
                            "get_time": time
                        });
                    }
                    else {
                        console.log("不需要更新");
                    }
                }
            });
        }
        try {
            yield refresh_token();
        }
        catch (err) {
        }
        try {
            yield refresh_jsapi_ticket();
        }
        catch (err) {
        }
        timers_1.setInterval(() => {
            soccerService.soccerUpdateTask();
        }, 60000);
        timers_1.setInterval(() => {
            soccerService.sentGoalToVC();
        }, 3000);
    });
}
bootstrap();
//# sourceMappingURL=main.js.map