import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import { RetObject } from '../common/ret.component';
import { Global } from '../common/global.component';
import * as FS from 'fs';
import axios from 'axios';
import { Users } from './interface/users.interface';
import { Model } from 'mongoose';
import { WeChatInfo } from '../common/wechat.component';
import { WechatWeb } from '../common/wechat.component';
import { Template } from '../wechat/template.component';
//微信的access_token
var JsonDB = require('node-json-db');
var mongoose = require("mongoose");

@Component()
export class UsersService {
  constructor(@Inject('UsersModelToken') private readonly usersModel: Model<Users>) { }

  //查询是否参赛
  async find(name: String, game_id: String): Promise<RetObject> {
    let ret: RetObject = new RetObject;
    //设定条件
    var tiaojian = { "name": name, "game_id": { $regex: game_id, $options: "i" } };
    //查看方法
    var Users = await this.usersModel.findOne(tiaojian)
    var users = JSON.parse(JSON.stringify(Users))
    console.log(users)
    if (users !== null) {
      if (users['game_id'] !== undefined) {
        ret.code = 0;
        ret.result = users;
      } else {
        ret.code = 1;
        ret.description = game_id + " undefined";
      }
    } else {
      ret.code = 1;
      ret.description = "users undefined";
    }
    return ret;
  }

  async auto_push(game_id) {
    let ret: RetObject = new RetObject;
    //设定条件
    var tiaojian = { "game_id": { $regex: game_id, $options: "i" } };
    var update = { $set: { 'is_video': 1 } };

    console.log(update)
    //查看方法
    await this.usersModel.findOneAndUpdate(tiaojian, update)
    ret.code = 0;
    ret.description = "Auto push successful.";
    return ret;
  }

  async auto_update(game_id,game_time) {
    let ret: RetObject = new RetObject;
    //设定条件
    var tiaojian = { "game_id": game_id.split("\n")[1] };
    var update = { $set: { "game_time": game_time } };

    //console.log(update)
    //查看方法
    var a = await this.usersModel.findOneAndUpdate(tiaojian, update);
    if(a !== null){
      ret.code = 0;
      ret.result = a;
    }else{
      ret.code = 0;
      ret.description = game_id;
      ret.name = game_time;
      ret.result = a;
    }
    return ret;
  }

  async get_video(game_id): Promise<RetObject> {
    let ret: RetObject = new RetObject;
    //设定条件
    var tiaojian = { "game_id": { $regex: game_id, $options: "i" } };
    //查看方法
    var Users = await this.usersModel.findOne(tiaojian)
    var users = JSON.parse(JSON.stringify(Users))
    console.log(users)
    if (users.game_id !== undefined) {
      ret.code = 0;
      ret.result = users;
    } else {
      ret.code = 1;
      ret.description = "users.game_id:" + game_id + " undefined";
    }
    return ret;
  }

  async is_reservate(code, state) {
    let access_DB = new JsonDB('./db/access_token.json', true, false);
    var wechat = access_DB.getData("/" + state + "/access");
    let ret: RetObject = new RetObject;
    if (code.length > 0) {
      var WechatUserInfo = await WechatWeb.get_wechat(code, state)
      var response = WechatUserInfo['wechat']
      //获取用户基本信息
      //var response_info = WechatUserInfo['info']
      var time = Template.get_time();
      //ret.code = 1;
      var openid = response.openid;
      var tiaojian = { "wechat.openid": openid };
      //连接组件，选择数据库
      var Runusers = await this.usersModel.findOne(tiaojian);
      var runusers = JSON.parse(JSON.stringify(Runusers))
      if (runusers == null) {
        // var createdwechatuser = new this.wechatModel({ 'wechat': response, 'time': time, 'source': state, "info": response_info })
        // await createdwechatuser.save();
        ret.code = 1;
        ret.result = response;
      } else if (runusers['wechat'] == undefined) {
        ret.code = 1;
        ret.result = response;
      } else {
        ret.code = 0;
        ret.result = runusers;
      }
    } else {
      ret.code = 1;
    }
    return ret;
  }

  async add_user(data) {
    let ret: RetObject = new RetObject;
    var tiaojian = { "game_id": data.game_id, "name": data.name };
    var update = { $set: { "wechat": data.wechat } }
    var Runusers = await this.usersModel.findOne(tiaojian)
    var runusers = JSON.parse(JSON.stringify(Runusers))
    if (runusers !== null) {
      if (runusers['wechat'] == undefined) {
        console.log("这个号码没人绑定")
        await this.usersModel.update(tiaojian, update)
        ret.code = 0;
      } else {
        ret.code = 1;
      }
    } else {
      ret.code = 1;
    }
    return ret;
  }

  async get_users(data) {
    let ret: RetObject = new RetObject;
    var Users = await this.usersModel.find(data);
    var users = JSON.parse(JSON.stringify(Users));
    ret.code = 0;
    ret.result = users;
    return ret;
  }

  async give_like(game_id) {
    let ret: RetObject = new RetObject;
    var tiaojian = { "game_id": game_id };
    var update = { $inc: { 'likes': 1 } };
    var Users = await this.usersModel.findOneAndUpdate(tiaojian, update)
    var users = JSON.parse(JSON.stringify(Users))
    if (users !== null) {
      ret.code = 0;
    } else {
      ret.code = 1;
    }
    return ret;
  }

  async userTest() {
    let ret: RetObject = new RetObject;
    var tiaojian = {};
    var Users = await this.usersModel.findOne(tiaojian)
    var users = JSON.parse(JSON.stringify(Users))
    if (users !== null) {
      ret.code = 0;
      ret.result = users;
    } else {
      ret.code = 1;
    }
    return ret;
  }

}
