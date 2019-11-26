import {
    Component,
} from '@nestjs/common';
import {Global} from '../common/global.services';
import {activitydb} from '../common/db.service';
import {TaskService} from "../task/task.service";
import {SOCKET_EVENT} from "../common/socket.interface";
import {RetObject} from "../common/ret.component";

var fs = require('fs')

@Component()
export class PartnerService {

    async makeShoot(data) {

        console.log('receive make_shoot:', data)
        let ret = {'result': {}}
        if (!data.activity_id || !data.timestamp || !data.access_token) {
            ret['result']['success'] = false;
            ret['result']['reason'] = "请检查参数";
            return ret
        }

        let activity = await activitydb.findOne({'activity_id': data.activity_id})
        if (activity && activity.settings && activity.settings.camera_setting && activity.settings.camera_setting.cameras) {

            console.log(activity.settings.camera_setting.trigger + '拍摄')

            let cameras = activity.settings.camera_setting.cameras
            let shootCount = activity.settings.camera_setting.shoot_count || 1
            let taskService = new TaskService();
            let taskId = data.taskId || data.activity_id + "_" + Date.now()

            /*
            if (!data.multi_shoot) {
                // 未传轮数进来
                data.multi_shoot = 1
                let mode = "video"
                if (cameras.length > 0 && cameras[0].collect && cameras[0].collect.duration == 0) {
                    mode = "photo"
                }
                // 创建task
                let task_data = {
                    "type": "common",
                    "activityId": data.activity_id,
                    "taskId": taskId,
                    "triggerBy": "remote_test",
                    "cameraNum": cameras.length * shootCount,
                    "mode": mode,
                    "fileKey": "",
                    "cutconfigs": {},
                    "version": ""
                }
                if (data['from']) {
                    task_data['from'] = data['from']
                }
                await taskService.createTask(task_data);
            }
            */

            switch (activity.settings.camera_setting.trigger) {
                case 'sync':
                    /* 同步 */
                    for (let i = 0; i < cameras.length; i++) {
                        console.log('deviceId:', cameras[i].deviceId)
                        const socketId = Global.getSocketId(cameras[i].deviceId);
                        let sentData = {
                            "deviceId": cameras[i].deviceId,
                            "from": data.from,
                            "requestId": data.requestId,
                            "param": {
                                "action": "make_shoot",
                                "order": i + (data.multi_shoot - 1) * cameras.length,
                                "record": cameras[i].collect || {},
                                "recognition": cameras[i].trigger_type.model || {},
                                "video_source": cameras[i].video_source || {},
                                "taskId": taskId
                            }
                        }
                        if (socketId) {
                            /* 通知mome开始拍摄 */
                            console.log('已通知拍摄:', cameras[i].deviceId)
                            console.log('sentData:', JSON.stringify(sentData))
                            Global.getSocket('start_socket').to(socketId).emit(SOCKET_EVENT.EVENT_CMD, sentData);
                        }
                    }

                    break
                default:
                    break
            }

            ret['result']['success'] = true;
            ret['result']['reason'] = '';
            return ret;
        }
        ret['result']['success'] = false;
        ret['result']['reason'] = '未找到该活动';
        return ret;
    }


    async upload(data, req) {

        let ret: RetObject = new RetObject;

        var multiparty = require('multiparty');
        var form = new multiparty.Form();
        form.parse(req, function (err, fields, files) {
            if (!fields || !fields.file_name || !fields.file_name[0] || !files || !files.file || !files.file[0] || !files.file[0].path) {
                ret.code = 1
                ret.description = "请检查参数"
                return ret
            }
            console.log('file_name:', fields.file_name[0]);
            fs.rename(files.file[0].path, '/Users/liyunpeng/Desktop/temp/' + fields.file_name[0], function (err) {
                if (err != null) {
                    console.log('err:', err)
                }
            });
        });

        ret.code = 0
        ret.description = "上传成功"
        return ret
    }


}
