import * as dns from 'dns';
import * as OS from 'os';
import * as timers from 'timers';
import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import { RetObject } from '../common/ret.component';
import {SETTING} from '../setting/setting.service'
import { Global } from '../common/global.component';
import * as FS from 'fs';
import axios from 'axios';
import { request } from 'http';
var JsonDB = require('node-json-db');
let API_SERVER = SETTING.API_SERVER;

@Component()
export class RecordService {
  // constructor(
  //   @Inject('UserModelToken') private readonly userModel: Model<User>) { }
  async post_test(data) {
    let ret: RetObject = new RetObject;
    ret.code = 1;
    ret.result = data;
    return ret;
  }

  async get_test(id) {
    let ret: RetObject = new RetObject;
    ret.code = 1;
    ret.description = id;
    return ret;
  }

  async start_record(id) {
    var record_time = String(new Date().getTime())
    let deviceDB = new JsonDB('./db/device.json', true, false);
    var device = deviceDB.getData('/');
    var child = require('child_process');
    console.log('开始录制')
    //raspivid -t 5000 -o video.h264
    await child.exec('python ./src/modules/record/bullet.py '+record_time+' '+device.id+' '+device.index+' '+id+' ', function (error, stdout, stderr) {
    //await child.exec('raspivid -t 5000 -o '+record_time+'_'+id+'.h264', function (error, stdout, stderr) {
      var file = record_time+'_'+device.id+'_'+device.index+'_'+id+'.h264';
      if (stdout.length > 1){
        console.log('you offer args:', stdout);
        let data = FS.createReadStream('./video/'+file)
        console.log(data)
        var FormData = require('form-data')
        let form = new FormData()
        form.append('type', 'txt')
        form.append('video_data', data, file)
        console.log(data)
        let getHeaders = (form => {
          return new Promise((resolve, reject) => {
            form.getLength((err, length) => {
              if (err) reject(err)
              let headers = Object.assign({ 'Content-Length': length }, form.getHeaders())
              resolve(headers)
            })
          })
        })

        getHeaders(form)
          .then(headers => {
            //console.log(form)
            return axios.post(API_SERVER+'/upload', form, { headers: headers })
          })
          .then((response) => {
            console.log('上传成功')
            
          })

          .catch(e => {
            console.log(e)
            console.log('上传失败')
          })
      } else {
        console.log('you don\'t offer args');
        console.log('you offer args:', stdout);
        let data = FS.createReadStream('./video/'+file)
        console.log(data)
        var FormData = require('form-data')
        let form = new FormData()
        form.append('type', 'txt')
        form.append('video_data', data, file)
        console.log(data)
        let getHeaders = (form => {
          return new Promise((resolve, reject) => {
            form.getLength((err, length) => {
              if (err) reject(err)
              let headers = Object.assign({ 'Content-Length': length }, form.getHeaders())
              resolve(headers)
            })
          })
        })

        getHeaders(form)
          .then(headers => {
            //console.log(form)
            return axios.post(API_SERVER+'/upload', form, { headers: headers })
          })
          .then((response) => {
            console.log('上传成功')
            //child.exec('rm ./'+file)            
            //	console.log(response.data)
          })

          .catch(e => {
            console.log(e)
            console.log('上传失败')
          })
      }
      if (error) {
        console.info('stderr : ' + stderr);
      }
    });




  };

}
