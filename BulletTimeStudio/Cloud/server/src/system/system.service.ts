// @ts-ignore
import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import { apkVersionDb } from '../common/db.service';
import { RetObject } from '../common/ret.component';

const util = require('util');
const exec = util.promisify(require('child_process').exec);

@Component()
export class SystemService {
  async saveApkVersion(siteId, deviceId, role, apkVersion) {
    let ret: RetObject = new RetObject;
    await apkVersionDb.findOne({ siteId: siteId, deviceId: deviceId, role: role }, (err, device) => {
      if (err){
        ret.code = -1;
        ret.result = err;
      } 

      if (device){
        device.apkVersion = apkVersion;
        device.save();
        ret.code = 1;
        ret.description = 'Update apk verion successful.';
      }
      else{
        let newDevice = new apkVersionDb();
        newDevice.siteId = siteId;
        newDevice.deviceId = deviceId;
        newDevice.role = role;
        newDevice.apkVersion = apkVersion;
        newDevice.save();
        ret.code = 0;
        ret.description = 'Add new apk version with siteId:' + siteId + ", deviceId:" + deviceId + ", role:" + role;
      }
    });
    return ret;
  }

  async getApkVersionFromDb(data){

    return await apkVersionDb.aggregate([{$match: {$or: data.siteIds}}, {$group: {_id: "$siteId", devicesInfo: {$push: {
      deviceId: "$deviceId",
      role: "$role",
      apkVersion: "$apkVersion"
    }}}}]);
  }

  async getGitCommitId() {
    let commandLine = 'git rev-parse HEAD';
    let ret: RetObject = new RetObject;
    let {stdout, stderr} = await exec(commandLine);

    ret.code = stderr ? 1 : 0;
    ret.description = stdout || stderr;
    ret.description = ret.description.replace(/\n/g, '');

    return ret;
  }

  async reploy() {
    let commandLine = 'cd /data/BulletTimeStudio/Cloud/server/scripts && ./auto_reploy.sh';
    let ret: RetObject = new RetObject;
    let {stdout, stderr} = await exec(commandLine);

    if (stderr) {
      ret.code = 1;
      ret.description = stderr.toString();
    } else {
      ret.code = 0;
      ret.description = stdout.toString();
    }

    return ret;
  }
}
