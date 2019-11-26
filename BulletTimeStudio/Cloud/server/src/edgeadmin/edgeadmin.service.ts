import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import { RetObject } from '../common/ret.component';
import { Global } from '../common/global.component';
import axios from 'axios';
const HttpRequest = require('ufile').HttpRequest;
const AuthClient = require('ufile').AuthClient;
//微信的access_token
var JsonDB = require('node-json-db');
var mongoose = require("mongoose");

@Component()
export class EdgeadminService {

  //查询是否参赛
  async adjust_data(data) {
    let ret: RetObject = new RetObject;
    console.log(data)
    var fs = require('fs');
    var xlsx = require('node-xlsx');
    // var list = xlsx.parse("./excel/" + "1.xlsx"); //读取excel  
    var datas = []
    var data0 = ["", "center", "top"];
    var data1 = [16, "", ""];
    for (var i = 0; i < 17; i++) {
      if (i == 0) {
        datas.push(data0);
      } else if (i == 16) {
        console.log(16)
        datas.push(data1);
      } else {
        let a = data[i-1]
        // console.log(typeof a)
        // console.log(a[0])

        datas.push([i,a[0][0]+', '+a[0][1], a[1][0]+', '+a[1][1]]);
      }
    }

    // var data1 = [4, "1277, 333", "1277, 333"];
    // datas.push(data0);    //一行一行添加的 不是一列一列  
    // datas.push(data1);
    writeXls(datas);
    function writeXls(datas) {
      var buffer = xlsx.build([
        {
          name: 'sheet1',
          data: datas
        }
      ]);
      fs.writeFileSync("./excel/1.xlsx", buffer, { 'flag': 'w' });   //生成excel  
    }

    const bucket = 'eee',
      key = "0013/adjust.xlsx",
      file_path = "./excel/1.xlsx",
      method = 'PUT',
      url_path_params = '/' + key;

    const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
    const client = new AuthClient(req);
    client.SendRequest(callback);

    function callback(res) {
      if (res instanceof Error) {
        console.log(res)
      } else {
        console.log("上传成功")
        
      }
    }
    ret.code = 1;
    return ret;
  }

}
