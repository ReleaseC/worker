import {Component} from "@nestjs/common";

const csv = require("fast-csv");
import {activitydb, deviceStatus, soccorDbSiteSetting, taskdb} from '../common/db.service';
import {RetObject} from '../common/ret.component';
import {dbTools} from "../common/db.tools";
import {Global} from "../common/global.services";
import {LOCAL_FILE_EVENT, MOME_EVENT, SOCKET_EVENT} from "../common/socket.interface";
import {BASKETBALL_EVENT} from "../../../admin/src/app/pages/common/socket.interface";
var moment = require('moment');
const redis = require('redis');
const bluebird = require("bluebird");
const redisClient = bluebird.promisifyAll(redis.createClient());

@Component()
export class DeviceService {
    constructor() {
    }


    async getDeviceList(type) {
        return await this.readCsv();
    }

    async addDevice(data) {
        return await this.writeCsv(data);
    }

    readCsv(): Promise<any[]> {
        return new Promise((resolve, reject) => {
            const dataArr = [];
            csv.fromPath(`${__dirname}/CameraList.csv`, {headers: true})
                .on('data', (results) => {
                    dataArr.push(results);
                })
                .on('end', (num) => {
                    console.log(`讀取成功! 共${num}台相機`);
                    resolve(dataArr);
                });
        });
    }

    async writeCsv(data) {
        let list = await this.readCsv();
        list.push(data);
        return new Promise((resolve, reject) => {
            csv.writeToPath(`${__dirname}/CameraList.csv`, list, {
                headers: true,
                transform: (row) => {
                    return {
                        name: row.name,
                        mac: row.mac
                    };
                }
            }).on("finish", async () => {
                const res = await this.readCsv();
                resolve(res);
            });
        });
    }

    //得到某个点位的device的列表及状态
    async get_device_status(siteId) {
        console.log('get_device_status siteId=' + siteId);
        let ret: RetObject = new RetObject;
        var devices = await deviceStatus.find({"siteId": siteId});
        if (devices != null) {
            ret.code = 0
            ret.result = devices;
        } else {
            ret.code = 1;
            ret.description = "no this siteId:" + siteId + " devices";
        }
        return ret;
    }

    async sendCmd(query) {

        let res = {}
        res['code'] = 1
        res['description'] = "失败"
        console.log('收到cmd转发请求: ', query)
        if (query.cmd && Global.getSocket('start_socket')) {
            let cmd = query.cmd
            delete query["cmd"];
            Global.getSocket('start_socket').sockets.emit(cmd, query);
            res['code'] = 0
            res['description'] = "成功"
        }
        return res

    }

    async updateAttent(query) {

        let ret: RetObject = new RetObject;
        if (!query['device_id'] || !query['activity_id']) {
            ret.code = 1;
            ret.description = 'device_id或activity_id不能为空';
            return ret;
        }

        if (query['remove'] == 1) {
            // 移除
            let res = await activitydb.update({'activity_id': query.activity_id}, {$pull: {'settings.attent_device': query['device_id']}})
            console.log('res:', res)
            ret.code = 0;
            ret.description = '解绑成功';
            return ret;
        }

        // 绑定
        let res = await activitydb.update({'activity_id': query.activity_id}, {'$addToSet': {'settings.attent_device': query.device_id}});
        ret.code = 0;
        ret.description = '绑定成功';
        return ret;


    }

    async makeMove(query) {

        let res = {}
        res['code'] = 1
        res['description'] = "失败"
        console.log('收到主动拍摄的请求: ', query)
        if (query.device_id && Global.getSocket('start_socket')) {
            let body = {"deviceId": query.device_id, "doTrigger": true}
            Global.getSocket('start_socket').sockets.emit(BASKETBALL_EVENT.REBOOT_DEVICE_CLOUD, body);
            res['code'] = 0
            res['description'] = "成功"
        }
        return res

    }


    async updateStatus(query) {

        let ret: RetObject = new RetObject;
        if (!query.deviceIds) {
            ret.code = 1;
            ret.description = 'deviceIds不能为空';
            return ret;
        }
        for (let i = 0; i < query.deviceIds.length; i++) {
            const socketId = Global.getSocketId(query.deviceIds[i]);
            let sentData = {
                "deviceId": query.deviceIds[i],
                "param": {
                    "action": "update_device_status"
                }
            }

            let oldTimeStr = await redisClient.getAsync('device_status_'+query.deviceIds[i]) || '2006-01-02 15:05:06'
            let oldTime = new Date(oldTimeStr)
            if (socketId && Date.now() - oldTime.getTime() > 5000) {
                /* 通知mome更新自己的状态 */
                let time = moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
                redisClient.set('device_status_'+query.deviceIds[i], time);
                // console.log('sentData:', JSON.stringify(sentData))
                Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
            }
        }
        ret.code = 0;
        ret.description = '通知完成';
        return ret;

    }


}