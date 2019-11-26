import {NestFactory} from "@nestjs/core";
import {AppModule} from "./app.module";
import {Global} from "./common/global.services";
import {SOCKET_EVENT, SOCCER_EVENT, BASKETBALL_EVENT, MOME_EVENT} from "./common/socket.interface";
import {TaskService} from "./task/task.service";
import {setInterval} from "timers";
import {WeChatInfo} from "./common/wechat.component";
import {activitydb, deviceStatus, goalEvent, siteSettingModel, soccorDbSiteSetting} from "./common/db.service";

import {order} from "./common/db.service";
import {SiteService} from "./site/site.service";
import {SoccerService} from "./activity/soccer.service";
import {BasketballService} from "./activity/basketball.service";

import * as express from "express";
import * as io from "socket.io";
import * as path from "path";
import * as child from "child_process";
import * as bodyParser from "body-parser";
import * as crypto from "crypto";
import axios from "axios";
import {callbackify} from "util";
import {RetObject} from "./common/ret.component";
import {dbTools} from "./common/db.tools";
import {MediaService} from "./activity/media.service";
import {CustomVideoService} from "./activity/customVideo.service";
import {ActivityService} from "./activity/activity.service";
import {HttpStatus} from "@nestjs/common";
// import logger from 'common/logger';
// import { Server } from './server';

var JsonDB = require("node-json-db");
var schedule = require("node-schedule");

const siteService = new SiteService();
const soccerService = new SoccerService();
const basketballService = new BasketballService();
const mediaServer = new MediaService();
const customVideoService = new CustomVideoService();
const activityService = new ActivityService();
const taskService = new TaskService();


var mySocket: any;

//微信支付
const tenpay = require("tenpay");
const config = {
    appid: "wxb0c9caded7e8fc8d",
    mchid: "1493786962",
    partnerKey: "D0A3F589989F8C38226A177A2BF6BB82",
    pfx: require("fs").readFileSync("./src/wechat_payment/apiclient_cert.p12"),
    notify_url: "https://bt.siiva.com/wechat_payment/notify_wechatpay",
    spbill_create_ip: "106.75.216.70"
};
// 方式一
let Tenpay = new tenpay(config);
//import environment from './modules/environment/environment';

// let exportServer: any = undefined;
async function bootstrap() {
    const server = express();
    var cors = require("cors");
    server.use(cors());
    //server.use(express.static('./dist/face'));
    server.use(bodyParser.text({type: "*/xml"}));
    server.use("/", express.static("./"));
    console.log(path.resolve("../../output"));
    server.use("/", express.static(path.resolve("../../output")));

    // logger && logger.info('running at bootstrap() in main.ts');
    // @ts-ignore
    const app = await NestFactory.create(AppModule, server);

    app.use(bodyParser.json({limit: '50mb'})); // add 最大请求限制为 50m
    app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit: 50000})); // add 最大请求限制为 50m


    // var fs = require('fs');
    // const request = require('request');
    // fs.stat("'/Users/liyunpeng/Desktop/cmd.jpg'", function(err, stats) {
    //     request.post("http://192.168.1.158:22222/upload", {
    //         multipart: true,
    //         data: {
    //             "file_name": "123_234_777.jpg",
    //             // "file": restler.file("image.jpg", null, stats.size, null, "image/jpg")
    //             "file": fs.createReadStream('/Users/liyunpeng/Desktop/cmd.jpg')
    //         }
    //     }).on("complete", function(data) {
    //         console.log('data:', data);
    //     });
    // });


    const httpServer = await app.listen(3000);
    const io = require("socket.io")(httpServer);

    io.on(SOCKET_EVENT.CONNECT, (socket) => {
            Global.setSocket("start_socket", io);

            // soccerService.initService(io, socket); // init soccor socket service
            // basketballService.initService(io, socket); // init soccor socket service
            // mediaServer.initService(io, socket);  //  init media worker socket service
            // customVideoService.initService(io, socket);
            activityService.initService(io, socket);

            socket.on(SOCKET_EVENT.IS_ALIVE, (data) => {
            });

            socket.on(SOCKET_EVENT.DISCONNECT, function () {
            });

            // TODO: Keep deviceId and
            socket.on(SOCKET_EVENT.REGISTER, function (data) {
                //本地server注册
                console.log('本地server注册')
                // Global.setSocket(data.siteId, socket);
            });

            socket.on(SOCKET_EVENT.PREPARE_TO_RECORD, function (data) {
                console.log("去通知本地server准备拍摄");
                console.log(data);
                socket.broadcast.emit("prepare_To_record", data);
            });

            socket.on(SOCKET_EVENT.ALLOCATING_TASK, (data) => {
                console.log(data);
            });

            socket.on(SOCKET_EVENT.DISCONNECT, function () {
            });

            socket.on(SOCKET_EVENT.EVENT_CMD, async (data) => {

                if (data && data.status == 1) {
                    console.log('收到status的cmd:', JSON.stringify(data))
                    // socket.emit('cmd', {'deviceId': '779', "param": {"action": "test_action", "reason": "服务端已经收到你的测试数据"}})
                }

                //群发
                // socket.broadcast.emit(SOCKET_EVENT.EVENT_CMD, data)

                /* cloud admin点击活动拍摄, 等待接收post_make_shoot */
                if (data && data.action == 'post_make_shoot') {
                    // console.log('post_make_shoot:', data)
                    activityService.receiveMakeShoot(data).then(res => {
                        if (data.code == 1) {
                            console.log('make_shoot err:', JSON.stringify(data))
                        }
                    })
                    // 当有 prompt_from 上传时, 将socket也转发给开始倒计时的浏览器
                    let activitys = await activitydb.find({'settings.camera_setting.cameras.deviceId': data.from}) || []
                    for (let i = 0; i < activitys.length; i++) {
                        let promptData = Global.getAllPromptData()
                        for (var browserId in promptData) {
                            if (promptData.hasOwnProperty(browserId)) {
                                let temp = promptData[browserId]
                                if (temp.activity_id == activitys[i].activity_id && Date.now() - temp.time < 7200000) {
                                    // 2h以内点击开始倒计时的浏览器, 会收到活动下的设备上传信息
                                    const socketId = Global.getSocketId(browserId);
                                    if (socketId) {
                                        io.to(socketId).emit(SOCKET_EVENT.EVENT_CMD, data);
                                    }
                                }
                            }
                        }
                    }

                }

                if (data.param && data.param.action == 'heartbeat') {

                    // console.log('heartbeat:', data)

                    if (data.param.err_msg) {
                        console.log('err_msg:', data)
                    }

                    let activity = await
                        activitydb.findOne({'settings.camera_setting.cameras.deviceId': data.deviceId})
                    if (activity && activity.settings && activity.settings.camera_setting && activity.settings.camera_setting.cameras) {
                        data.param['activity_id'] = activity.activity_id
                        data.param['activity_name'] = activity.activity_name
                        for (let i = 0; i < activity.settings.camera_setting.cameras.length; i++) {
                            if (activity.settings.camera_setting.cameras[i].deviceId == data.deviceId) {
                                data.param['mark'] = activity.settings.camera_setting.cameras[i].mark
                            }
                        }
                    }

                    Global.setMomeUbuntuStatus(data.deviceId, data.param);

                    let registerData = Global.getAllRegisterData()
                    for (var deviceId in registerData) {
                        if (registerData.hasOwnProperty(deviceId)) {
                            let temp = registerData[deviceId]
                            if (temp.type == 'browser' && Date.now() - temp.time < 7200000 && !temp.project_id) {
                                // 2h以内来注册的浏览器, 都会收到mome_u的状态更新
                                const socketId = Global.getSocketId(deviceId);
                                if (socketId) {
                                    io.to(socketId).emit(SOCKET_EVENT.EVENT_CMD, data);
                                }
                            }

                            if (temp.type == 'browser' && Date.now() - temp.time < 7200000 && temp.project_id) {
                                let activity_ids = []
                                let activitys = await activitydb.find({'project_id': temp.project_id})
                                for (let i = 0; i < activitys.length; i++) {
                                    activity_ids.push(activitys[i].activity_id)
                                }

                                if (data.param && data.param.activity_id && activity_ids.indexOf(data.param.activity_id) > 0) {
                                    const socketId = Global.getSocketId(deviceId);
                                    if (socketId) {
                                        io.to(socketId).emit(SOCKET_EVENT.EVENT_CMD, data);
                                    }
                                }
                            }
                        }
                    }
                }

                /* admin 点击套用 */
                if (data.param && data.param.action == 'setup' && data.param.activity && data.param.video_source && data.param.activitys) {

                    for (let i = 0; i < data.param.activitys.length; i++) {
                        let jsonData = {
                            'activity_id': data.param.activitys[i].activity_id,
                            'account': data.param.activitys[i].account,
                            'param': {
                                'deviceId': data.deviceId,
                                'collect': data.param.record,
                                'trigger_type': {
                                    'model': {
                                        'model_name': '',
                                        'model_url': '',
                                        'recognition_type': [],
                                        'version': ''
                                    }, 'trigger_type_name': ''
                                },
                                'video_source': data.param.video_source,
                                'mark': data.param.mark
                            }
                        }
                        /* 套用添加到数据库 */
                        activityService.addCamera(jsonData).then(res => {
                            /* 发送给admin绑定数据库成功 */
                            if (res['code'] != 0) {
                                let browser = data.from;
                                console.log("browser的deviceid是：", browser)
                                const browserSocketId = Global.getSocketId(browser);
                                console.log("该browser匹配的socketid是：" + browserSocketId)
                                io.to(browserSocketId).emit(SOCKET_EVENT.EVENT_CMD, res);
                            }
                            if (res['code'] == 0) {
                                let browser = data.from;
                                console.log("browser的deviceid是:", browser)
                                const browserSocketId = Global.getSocketId(browser);
                                console.log("该browser匹配的socketid是:" + browserSocketId)
                                io.to(browserSocketId).emit(SOCKET_EVENT.EVENT_CMD, res);
                                /* 发送给mome */
                                let deviceId = data.deviceId;
                                console.log("收到的deviceid是:" + deviceId)
                                const socketId = Global.getSocketId(deviceId);

                                console.log('setup_data:', JSON.stringify(data))

                                var sentData = data

                                if (data.param.mark) {
                                    delete sentData.param['mark']
                                }
                                if (data.param.activitys) {
                                    delete sentData.param['activitys']
                                }
                                if (socketId) {
                                    // console.log('套用的 data:', JSON.stringify(data))
                                    io.to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
                                }
                            }
                        })
                    }

                } else {
                    // 单独发
                    let deviceId = data.deviceId;
                    const socketId = Global.getSocketId(deviceId);
                    if (socketId) {
                        io.to(socketId).emit(SOCKET_EVENT.EVENT_CMD, data);
                    }
                }

            });

            socket.on(SOCKET_EVENT.EVENT_CMD_REGISTER, async (data) => {
                let deviceId = data.deviceId;

                console.log('cmd_register:', data)
                Global.setSocketId(deviceId, socket.id);

                if (data.type) {
                    data['time'] = Date.now()
                    Global.setRegisterData(deviceId, data);
                    if (data.type == 'prompt') {
                        // 提示屏来注册
                        await activitydb.update({'activity_id': data.activity_id}, {$set: {'settings.prompt_setting.prompt_id': data.deviceId}});

                    }
                }

            });

            // TODO: Add event handle, Curry
            socket.on(SOCKET_EVENT.EVENT_CMD_UNREGISTER, (data) => {

                let deviceId = data.deviceId;
                let allStatus = Global.getAllFileServerStatus()
                delete allStatus[deviceId]
            });

            //通知本地进行校正操作——拍摄
            socket.on(SOCKET_EVENT.EVENT_ASK_LOCAL_ADJUST_POTHO, (data) => {
                console.log(data);
                console.log(SOCKET_EVENT.EVENT_ADJUST_POTHO);
                socket.broadcast.emit(SOCKET_EVENT.EVENT_ADJUST_POTHO, data);
            });

            //拍摄成功的通知
            socket.on(SOCKET_EVENT.EVENT_ADJUST_POTHO_SUCCESS, (data) => {
                console.log(data);
                socket.broadcast.emit(SOCKET_EVENT.EVENT_ADJUST_POTHO_SUCCESS_EDGE_ADMIN, data);
            });

            //去获取相机参数
            socket.on(SOCKET_EVENT.EVENT_GET_CAMERA_CONFIG, (data) => {
                console.log(data);
                socket.broadcast.emit(SOCKET_EVENT.EVENT_GET_CAMERA_CONFIG, data);
            });

            //把相机参数给adgeadmin
            socket.on(SOCKET_EVENT.EVENT_GET_CAMERA_CONFIG_ADMIN, (data) => {
                // console.log(data);
                socket.broadcast.emit(SOCKET_EVENT.EVENT_GET_CAMERA_CONFIG_ADMIN, data);
            });

            //去统一修改相机参数
            socket.on(SOCKET_EVENT.EVENT_SET_CAMERA_CONFIG, (data) => {
                console.log(data);
                socket.broadcast.emit(SOCKET_EVENT.EVENT_SET_CAMERA_CONFIG, data);
            });

            //去重新扫描和连接
            socket.on(SOCKET_EVENT.EVENT_RESCAN, (data) => {
                console.log(data);
                // console.log("re_scan>>>>>>>>>>>>>>>>>>>>>>>");
                socket.broadcast.emit(SOCKET_EVENT.EVENT_RESCAN, data);
            });

            //去重新扫描小蚁agent
            socket.on(SOCKET_EVENT.EVENT_RESCAN_YIAGENT, data => {
                console.log(data);
                console.log("rescan_yiAgent >>>>>>>>>>>>> ");
                socket.broadcast.emit(SOCKET_EVENT.EVENT_RESCAN_YIAGENT, data);
            });


            //edgeserver的心跳
            socket.on(SOCKET_EVENT.EVENT_EDGESERVER_STATUS, (data) => {
                console.log(data);
            });

            socket.on(SOCKET_EVENT.EVENT_CAMERA_STATUS_FROM_EDGE, (data) => {
                console.log("from edge data=" + JSON.stringify(data));
                deviceStatus.findOne({siteId: data.siteId}, (err, device) => {
                    if (err) console.log("DB service EVENT_CAMERA_STATUS_FROM_EDGE err=" + err);
                    if (device) {
                        device.status = data.device_status;
                        device.updateTime = data.updateTime;
                        device.save();
                    } else {
                        let newDeviceStatus = new deviceStatus();
                        newDeviceStatus.siteId = data.siteId;
                        newDeviceStatus.status = data.device_status;
                        newDeviceStatus.updateTime = data.updateTime;
                        newDeviceStatus.save();
                    }
                });
            });

            // Cloud/Admin呼叫, 從資料庫取出並回傳
            socket.on(SOCKET_EVENT.EVENT_CAMERA_STATUS, (body, cb) => {
                console.log("EVENT_CAMERA_STATUS body=" + JSON.stringify(body));
                deviceStatus.findOne({siteId: body.siteId}, (err, device) => {
                    if (err) console.log("DB service EVENT_CAMERA_STATUS_FROM_EDGE err=" + err);
                    if (device) {
                        cb(device);
                    }
                });
            });

            // admin询问设备是否alive
            socket.on(BASKETBALL_EVENT.DEVICE_ISALIVE, (data) => {
                console.log(`收到来自cloud/admin 的isAlive命令：deviceId = ${data.deviceId}`);
                // 广播询问vc是否alive
                socket.broadcast.emit(BASKETBALL_EVENT.DEVICE_ISALIVE, data);
            });

            // vc通知server imalive
            socket.on(BASKETBALL_EVENT.DEVICE_IMALIVE, (data) => {
                console.log(`收到来自cloud/admin 的imalive命令：deviceId = ${data.deviceId}`);
                // 告诉admin imalive
                socket.broadcast.emit(BASKETBALL_EVENT.DEVICE_IMALIVE, data);
            });

            // 监听篮球 重启设备事件
            socket.on(BASKETBALL_EVENT.REBOOT_DEVICE_CLOUD, (data, cb) => {
                console.log(`收到来自cloud/admin的设备重启命令：deviceId = ${data.deviceId}`);
                socket.broadcast.emit(BASKETBALL_EVENT.REBOOT_DEVICE_EDGE, data);
                (typeof cb === 'function') && cb(data);
            });

            socket.on(BASKETBALL_EVENT.REBOOT_DEVICE_SUCCESS_EDGE, data => {
                console.log(`收到来自edge/admin的设备重启成功结果：data = ${data}`);
                socket.broadcast.emit(BASKETBALL_EVENT.REBOOT_DEVICE_SUCCESS_CLOUD);
            });

            socket.on(BASKETBALL_EVENT.REBOOT_DEVICE_FAIL_EDGE, data => {
                console.log(`收到来自edge/admin的设备重启失败结果：data = ${data}`);
                socket.broadcast.emit(BASKETBALL_EVENT.REBOOT_DEVICE_FAIL_CLOUD);
            });

            socket.on(SOCKET_EVENT.EVENT_PUSH_APK_UPDATE_CLOUD, data => {
                console.log(`收到来自cloud/admin的推送apk更新命令: url = ${data.url}`);
                socket.broadcast.emit(SOCKET_EVENT.EVENT_PUSH_APK_UPDATE_EDGE, data);
            });

            socket.on(SOCKET_EVENT.EVENT_UPDATE_SCALE, (data, cb) => {
                console.log(`收到来自cloud/admin推送的设备缩放比例的更新: 
								group = ${data.group}, 
								position = ${data.position},
								scale = ${data.scale}`);

                if (data.group && data.position && data.scale) {

                    let soccerService = new SiteService();

                    soccerService.updateScaleByGroupPosition(data.group, data.position, data.scale);

                    // 事情处理完成通知前端更新
                    cb(data);
                }
            });

            /**
             * @param {String} data.siteId 站点ID
             * @param {String} data.deviceId 设备ID
             */
            socket.on(SOCKET_EVENT.EVENT_JOIN_SITE, data => {
                let siteId = data.siteId;
                let deviceId = data.device;

                if (siteId) {
                    console.log(`deviceId: ${deviceId} join to room ${siteId}`);
                    socket.join(siteId);
                }
            });

            /**
             * @param {String} data.siteId 站点ID
             * @param {String} data.deviceId 设备ID
             */
            socket.on(SOCKET_EVENT.EVENT_LEAVE_SITE, data => {
                let siteId = data.siteId;
                let deviceId = data.device;

                if (siteId) {
                    console.log(`deviceId: ${deviceId} leave from room ${siteId}`);
                    socket.leave(siteId);
                }
            });
        }
    )
    ;
//定时更新token
    setInterval(function () {
        refresh_token();
        refresh_jsapi_ticket();

    }, 900000);

    async function refresh_jsapi_ticket() {
        for (var i = 0; i < WeChatInfo['siteId'].length; i++) {
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var jsapi = access_DB.getData("/" + WeChatInfo["siteId"][i] + "/jsapi");
            var wechat = access_DB.getData("/" + WeChatInfo["siteId"][i] + "/access");
            var siteId = WeChatInfo["siteId"][i];
            var url = "https://bt.siiva.com/#/";
            var time = new Date().getTime();
            var noncestr = "siiva123456";
            var timestamp = String((time / 1000)).split(".")[0];
            if ((time - jsapi.get_time) > 7200000 || jsapi.ticket === undefined) {
                try {
                    var url = url.split("#")[0];
                    console.log(wechat.access_token);
                    let response = await axios.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + wechat.access_token + "&type=jsapi");
                    if (response.data.errcode !== 0) {
                        let newresponse = await axios.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + WeChatInfo[siteId].appid + "&secret=" + WeChatInfo[siteId].secret);
                        var access_token = newresponse.data.access_token;
                        let response = await axios.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi");
                        access_DB.push("/" + WeChatInfo["siteId"][i] + "/access", {
                            "access_token": access_token,
                            "expires_in": "7200",
                            "get_time": time
                        });
                    }
                    var jsapi_ticket = response.data.ticket;
                    console.log(response.data);
                    access_DB.push("/" + WeChatInfo["siteId"][i] + "/jsapi", {
                        "ticket": jsapi_ticket,
                        "expires_in": "7200",
                        "get_time": time
                    });
                }
                catch (error) {
                    console.log(error);
                }
            } else {
            }
        }

    }

//更新access_token
    async function refresh_token() {
        for (var i = 0; i < WeChatInfo['siteId'].length; i++) {
            let access_DB = new JsonDB("./db/access_token.json", true, false);
            var wechat = access_DB.getData("/" + WeChatInfo["siteId"][i] + "/access");
            var siteId = WeChatInfo["siteId"][i];
            var time = new Date().getTime();
            if ((time - wechat.get_time) > 7200000 || wechat.access_token === undefined) {
                let response = await axios.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + WeChatInfo[siteId].appid + "&secret=" + WeChatInfo[siteId].secret);
                var access_token = response.data.access_token;
                access_DB.push("/" + WeChatInfo["siteId"][i] + "/access", {
                    "access_token": access_token,
                    "expires_in": "7200",
                    "get_time": time
                });
            } else {
            }
        }
    }

//重启更新token
    try {
        await
            refresh_token();
    } catch (err) {

    }
//重启更新jsapi
    try {
        await
            refresh_jsapi_ticket();
    } catch (err) {

    }

// Do soccer task state check
    setInterval(() => {
        soccerService.soccerUpdateTask();
    }, 3600000);

// // Do server -> vc goal_event sent check
    /*
    setInterval(() => {
        soccerService.sentGoalToVC();
    }, 3000);
    */


}

bootstrap();
