var os = require('os');
import * as fs from 'fs';
import httpclient from '../oss/siiva-oss/httpclient';
import { HttpClientBuckets,HttpClientCallback } from '../oss/siiva-oss/httpclient.interface';
import weparkhttpclient from '../oss/wepark-oss/httpclient';
import { weparkHttpClientBuckets,weparkHttpClientCallback } from '../oss/wepark-oss/httpclient.interface';
import * as child from 'child_process';
const config_workerid = require(`../../config/workerid.json`);
const request = require('request');
export class WorkerUtil {
  worker_id: string;

  static getIp(): string {
    var ip = 'ip_unknown';
    var ifaces = os.networkInterfaces();
    Object.keys(ifaces).forEach(function(ifname) {
      var alias = 0;
      ifaces[ifname].forEach(function(iface) {
        if ('IPv4' !== iface.family || iface.internal !== false) {
          return;
        }
        if (alias >= 1) {
        } else {
          ip = iface.address;
        }
        ++alias;
      });
    });
    return ip;
  }

  static getPort(): number {
    return +process.env.PORT || 8000;
  }

  static getWorkerInfo(): string {
    return `VideoWorker@${this.getWorkerId()}}`;
  }

  static getWorkerId(): string {
    return config_workerid.workerid || `${this.getIp()}_${this.getPort()}`;
  }

  static createDirectoryIfNotExist(dir: string) {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }

  static prepareWorkingDirectory(taskId: string): string {
    let wd = `./working/tasks/${taskId}`;
    this.createDirectoryIfNotExist('./working');
    this.createDirectoryIfNotExist('./working/tasks');
    this.createDirectoryIfNotExist(wd);
    return wd;
  }
  static prepareActivityDirectory(activity_id: string): string {
    let wd = `./working/activity/${activity_id}`;
    this.createDirectoryIfNotExist('./working');
    this.createDirectoryIfNotExist('./working/activity');
    this.createDirectoryIfNotExist(wd);
    return wd;
  }
   static dirNameIsExist(dirName){
    if(fs.existsSync(dirName)){
      return true;
    }else{
      return false;
    }
   }

  static async ossDownload(src: string, dst: string) {
    return await new Promise((resolve, reject) => {
      let callback = {
        onSuccess: result => {
          console.log('onSuccess');
          let localFileSize = `${fs.statSync(dst).size}`;
          let originFileSize = result.res.headers['content-length'];

          if (localFileSize == originFileSize) {
            console.log(`成功下载：${result.res.requestUrls}`);
            resolve(src);
          } else {
            console.log(`Download fail：${result.res.requestUrls}`);
            resolve(false);
          }
        },
        onError: err => {
          console.error(`下载失败： ${err}`);
          reject(false);
        }
      } as HttpClientCallback;
      httpclient.get(src, dst, callback);
    });
  }

  static async ossUpload(data,src, dst) {
    return await new Promise((resolve, reject) => {
      let callback = {
        onSuccess: result => {
          let time=Date.now()
          WorkerUtil.report_task_process_time(data.task.taskId,time,'worker_edit_finish')
          resolve(`${src} upload done`);
        },
        onError: err => {
          console.error(`上传失败[${src}]: ${err}`);
          reject(err);
        },
        onProgress: percentage => {
          console.log(`${src} is uploading: ${percentage * 100}%`);
        }
      } as HttpClientCallback;
      httpclient.breakPointUpload(dst, src, callback);
    });
  }

  static async ossUploadToWepark(src, dst) {
    return await new Promise((resolve, reject) => {
      let callback = {
        onSuccess: result => {
          let fileName = dst
          let arr = dst.split('/')
            if (arr.length > 0){
                fileName = arr[1]
            }
          let body_status={
            // "fileName":dst
            "fileName":fileName
          }
          console.log('body_status:', body_status)
          request({
            // url: `https://wepark.heart2world.com/mobile/public/file_back`,
            // url: `https://www.hzly86586.com/mobile/public/file_back`,
            url: `https://www.daowepark.com/mobile/public/file_back`,
            method: "POST",
            json: true,
            body: body_status
        }, (error, response, body) => { 
          // console.log(body)
        })
          resolve(`${src} upload done`);
        },
        onError: err => {
          console.error(`上传失败[${src}]: ${err}`);
          reject(err);
        },
        onProgress: percentage => {
          console.log(`${src} is uploading: ${percentage * 100}%`);
        }
      } as weparkHttpClientCallback;
      let remoteDst = dst
      let remoteArr = dst.split('/')
      if (remoteArr.length > 0){
          remoteDst = remoteArr[1]
      }
      // console.log('dst:', dst)
      // console.log('remoteDst:', remoteDst)
      weparkhttpclient.breakPointUpload(remoteDst, src, callback);
    });
  }

  static async executeCmd(cmd) {
    let c = child.exec(cmd);
    return new Promise((resolve, reject) => {
      c.stderr.on('data', res => {
        console.log(res);
      });
      c.stdout.on('data', res => {
        console.log(res);
        resolve(res);
      });
      c.on('close', res => {
        res === 0 ? resolve(res) : reject(res);
      });
    });
  }

  static async report_task_process_time(taskId,time,time_mode){   
    request(
    {
      url: `https://iva.siiva.com/task/period_time?taskId=`+taskId+`&time=`+time+`&period=`+time_mode,
      method: "GET",
      json: true
    }, (error, response, body) => { 
          console.log(body)
     })
    }

  static async getqrcode(taskId){
     request(
      {
        url: `https://iva.siiva.com/me_photo/qrcode?taskId=`+taskId,
        method: "GET",
        json: true
      }, (error, response, body) => { 
            console.log(body)
         })
  }
  
  static async get_VersaAi_access_token(config){
    return await new Promise((resolve, reject) => {
      let headers={
        "Authorization":'Basic '+Buffer.from(`${config.CLIENT_ID}:${config.CLIENT_SECRET}`).toString('base64'),
        "Content-Type":"application/x-www-form-urlencoded"
      }
      request({
        url: `https://open.api.versa-ai.com/oauth/token?grant_type=client_credentials`,
        method: "POST",
        headers:headers
      }, (error, response, body) => { 
           if(error){console.log(error);reject(error)}
           if(body){console.log(body);resolve(JSON.parse(body))}
           return body
        })
      })
    }

    static async get_VersaAi_asegment_instance_human(access_token,img_url){
      return await new Promise((resolve, reject) => {
        let headers={
          "Authorization":'Bearer '+access_token,
          "Content-Type":"application/x-www-form-urlencoded"
        }
        request({
          url: `https://open.api.versa-ai.com/segment/instance/human?image_url=`+img_url,
          method: "POST",
          headers:headers
        }, (error, response, body) => { 
             if(error){console.log(error);reject(error)}
             if(body){resolve(JSON.parse(body))}
             return body
          })
        })
    }

    static async get_VersaAi_asegment_instance_separate(access_token,img_url){
      return await new Promise((resolve, reject) => {
        let headers={
          "Authorization":'Bearer '+access_token,
          "Content-Type":"application/x-www-form-urlencoded"
        }
        request({
          url: `https://open.api.versa-ai.com/segment/instance/separate?image_url=`+img_url+`&instance_keys=16`,
          method: "POST",
          headers:headers
        }, (error, response, body) => { 
             if(error){console.log(error);reject(error)}
             if(body){resolve(JSON.parse(body))}
             return body
          })
        })
    }


}
