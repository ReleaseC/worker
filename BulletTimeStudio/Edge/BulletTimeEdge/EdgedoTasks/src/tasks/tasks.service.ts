import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import { frameUploadTask, TASK_STATE } from '../common/db.component';

import * as ufile from '../../lib/ufile';
import * as async from 'async';
const path = require("path")

const HttpRequest = ufile.HttpRequest;
const AuthClient = ufile.AuthClient;
const request = require('request');
const config = require(`../config/${process.env.NODE_ENV || 'development'}.json`);

let isReadytoUpdate = true;
let currentCount = 0;
let doTasksState = TASK_STATE.CREATE;
let currentTask;

@Component()
export class TasksService {

  addZero(data) {
    return (data > 9) ? data : '0' + data;
  }

  getCurrentTime() {
    const d = new Date();
    const year = d.getFullYear();
    const month = this.addZero(d.getMonth() + 1);
    const date = this.addZero(d.getDate());
    const hour = this.addZero(d.getHours());
    const min = this.addZero(d.getMinutes());
    const sec = this.addZero(d.getSeconds());

    return year + '/' + month + '/' + date + ' ' + hour + ':' + min + ':' + sec;
  }

  frameCloudUpload(common, data, callback) {
    // console.log('frameCloudUpload common='+JSON.stringify(common));
    // console.log('frameCloudUpload data='+JSON.stringify(data));
    if (!data) {
      return callback(null);
    }
    const bucket = 'eee'; // "eee".cn-sh2.ufileos.com
    const key = `${common.site_id}/${common.task_id}/${data.index}.jpg`;  // destination file name
    const file_path = data.path; // source file path + name
    const method = 'POST';
    const url_path_params = '/' + key;
    const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
    const client = new AuthClient(req);
    return client.SendRequest((res) => {
      console.log('res=' + JSON.stringify(res));
      if (res instanceof Error) {
        // 报错后会重复抓取
        // ToDo:
        // this.frameCloudUpload(data, callback);
        callback(res);
      } else {
        callback(null); // success
      }
    });
  }

  async sendTaskState(task) {
    const body = {
      state: task.status,
      msg: task.msg,
      siteId: task.site_id,
      taskId: task.task_id,
      userId: task.user_id
    }
    await request({
      url: `${config.apiServer}/task/task_update`,
      method: "POST",
      json: true,
      body: body
    }, (error, response, body) => {
      console.log('task_update done, start request');
      if (error) {
        task.status = TASK_STATE.ABORT;
        task.msg = task.msg + this.getCurrentTime() + ', request abort=' + error + ', ';
      }
      if (!error && response.statusCode == 200) {
        if (task.status === TASK_STATE.DATA_READY) {
          task.msg = task.msg + this.getCurrentTime() + ' request done.';
        }
      }
      task.save();
    });
  }

  doFrameUpload() {
    frameUploadTask.findOne({ $or: [{ status: TASK_STATE.CREATE }, { status: TASK_STATE.ABORT }] }, async (err, task) => {
      // console.log('tasks=' + JSON.stringify(task));
      if (task) {
        task.status = TASK_STATE.UPLOADING;
        console.log('frameUploadTask retryCount=' + task.retryCount);
        if (task.retryCount) {
          task.retryCount += 1;
          task.msg = task.msg + this.getCurrentTime() + ' uploading... retryCount=' + task.retryCount + ', ';
        } else {
          task.retryCount = 1;
          task.msg = this.getCurrentTime() + ' uploading... retryCount=' + task.retryCount + ', ';
        }
        await this.sendTaskState(task);

        doTasksState = TASK_STATE.UPLOADING;
        currentTask = task;

        task.save().then(() => {
          const self = this;
          async.mapLimit(task.video_path, 5, function (data, callback) {
            const common = {
              site_id: task.site_id,
              task_id: task.task_id,
              user_id: task.user_id
            };
            self.frameCloudUpload(common, data, callback);
          }, async (err, result) => {
            if (err) {
              console.log('mapLimit err=' + JSON.stringify(err));
              task.status = TASK_STATE.ABORT;
              task.msg = task.msg + this.getCurrentTime() + ', mapLimit error=' + err + ', ';
              await this.sendTaskState(task);
            } else {
              console.log('async done, start request, result=' + result);
              task.status = TASK_STATE.DATA_READY;
              task.msg = task.msg + this.getCurrentTime() + ' frameupload done, ';
              await this.sendTaskState(task);
              doTasksState = TASK_STATE.CREATE;
            }
          });
        });
      }
    });
  }


  //定时删除之前的文件
  removefile() {
    console.log()
    console.log("开始删除已完成的文件")
    frameUploadTask.findOne({ $or: [{ status: TASK_STATE.START }, { status: TASK_STATE.UPLOADING }, { status: TASK_STATE.DATA_READY }, { status: TASK_STATE.COMPLETE }] }, async (err, task) => {
      const rimraf = require('rimraf');
      console.log(task)
      console.log(">>>>>>>>>>>>>>>>>")
      if (task !== null) {
        let file_path = __dirname.split("EdgedoTasks")[0]+'YIAgentServer/assets/videos/' + task["task_id"]+"/";
        console.log(file_path)
        rimraf(file_path, function (err) {

          if (err) {
            console.log(err);
          } else {
            frameUploadTask.update({ "task_id": task["task_id"] }, { $set: { status: TASK_STATE.DELETE } }, function (err, data) {
              if (err) {
                console.log(err)
              }
            })
          }
        });


      }
    })
  }




  doTasks() {
    let waitCount = 10;
    const requestInterval = setInterval(async () => {
      if (doTasksState === TASK_STATE.CREATE) {
        console.log("do Tasks!");
        waitCount = 10;
        this.doFrameUpload();
      } else {
        console.log("Wait state, waitCount=" + waitCount);
        if (waitCount === 0) {
          currentTask.status = TASK_STATE.ABORT;
          currentTask.msg = currentTask.msg + this.getCurrentTime() + ' error, ';
          await this.sendTaskState(currentTask);

          doTasksState = TASK_STATE.CREATE;
          currentTask.save();
          waitCount = 10;
        } else {
          waitCount--;
        }
      }
    }, 10000);
  }
}
