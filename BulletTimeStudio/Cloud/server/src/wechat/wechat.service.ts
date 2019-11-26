import {
  Component,
  Inject,
  Controller,
  Get,
  Post,
  Res,
  Body,
  Response,
  Param,
  Query,
  HttpStatus,
  HttpException,
  Req
} from "@nestjs/common";
import { RetObject } from "../common/ret.component";
import { WeChatInfo } from "../common/wechat.component";
import { WechatWeb } from "../common/wechat.component";
import * as FS from "fs";
import axios from "axios";
import * as crypto from "crypto";
import { Template } from "./template.component";
import { environment } from "../environment/environment";
// import { Wechat } from './interface/wechat.interface';
// import { Model } from 'mongoose';
import { Users } from "../users/interface/users.interface";
import { DatareportService } from "../datareport/datareport.service";
import { UsersModule } from "../users/users.module";

const HttpRequest = require("ufile").HttpRequest;
const AuthClient = require("ufile").AuthClient;
var mongoose = require("mongoose");
//微信的access_token
var JsonDB = require("node-json-db");
import { wechatdb } from "../common/db.service";
import { dbTools } from "../common/db.tools";
import {HttpClientBuckets, HttpClientCallback} from "../../lib/oss/httpclient.interface";
import httpclient from "../../lib/oss/httpclient";

@Component()
export class WechatService {
  // constructor(@Inject('WechatModelToken') public readonly wechatModel: Model<Wechat>) { }
  static video_name: any;

  //测试nest的方法
  async test(code, state) {
    //通过这个来获取用户的信息
    var WechatUserInfo = await WechatWeb.get_wechat(code, state);
    console.log();
    let ret: RetObject = new RetObject;
    //查找条件
    var tiaojian = { "wechat.openid": "o_cTFwig1l0hKD16UyQXhCufyZoI", "source": "0005" };
    //连接组件，选择数据库
    var Wechatusers = await wechatdb.findOne(tiaojian);
    var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
    console.log(wechatusers);
    console.log(">>>>>>>>>");
    ret.code = 0;
    ret.result = wechatusers;
    return ret;
  }

  //检查访问者是否已经预约
  // async is_reservate(code, state) {
  //   let access_DB = new JsonDB('./db/access_token.json', true, false);
  //   var wechat = access_DB.getData("/" + state + "/access");
  //   console.log(code)
  //   let ret: RetObject = new RetObject;
  //   //console.log(WeChatInfo)
  //   //获取关注公众号的微信用户openid
  //   if (code.length > 0) {
  //     var WechatUserInfo = await WechatWeb.get_wechat(code, state)
  //     console.log(WechatUserInfo)
  //     var response = WechatUserInfo['wechat']
  //     //获取用户基本信息
  //     var response_info = WechatUserInfo['info']
  //     var time = Template.get_time();
  //     //ret.code = 1;
  //     ret.description = response.openid;
  //     if (response_info.subscribe === 0) {
  //       ret.code = 0;
  //     }
  //     var openid = response.openid;

  //     console.log(state)
  //     var tiaojian = { "wechat.openid": openid, "source": state };
  //     //连接组件，选择数据库
  //     var Wechatusers = await this.wechatModel.findOne(tiaojian);
  //     var wechatusers = JSON.parse(JSON.stringify(Wechatusers))
  //     console.log(wechatusers)
  //     console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  //     if (wechatusers == null) {
  //       var createdwechatuser = new this.wechatModel({ 'wechat': response, 'time': time, 'source': state, "info": response_info })
  //       await createdwechatuser.save();
  //       ret.code = 0;
  //     } else if (wechatusers['gameInfo'] == undefined) {
  //       ret.code = 0;
  //     } else {
  //       ret.code = 1;
  //     }
  //     //return ret;
  //   } else {
  //     ret.code = -1;
  //   }
  //   return ret;
  // }

  //访问者进行预约,并存入路跑选手信息
  // async add_user(data) {
  //   let ret: RetObject = new RetObject;
  //   var tiaojian = { "wechat.openid": data.openid, "source": data.siteId };
  //   var update = { $set: { gameInfo: { "name": data.name, "game_id": data.game_id } } }
  //   console.log(new UsersModule())
  //   // var RunUsers = this.usersService.find(data.name, data.game_id)
  //   // var runusers = JSON.parse(JSON.stringify(RunUsers))
  //   // console.log(runusers)
  //   // console.log(this.usersService)
  //   console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
  //   var flag = 1;
  //   if (flag) {
  //     var Wechatusers = await this.wechatModel.findOneAndUpdate(tiaojian, update);
  //     var wechatusers = JSON.parse(JSON.stringify(Wechatusers))
  //     if (wechatusers !== null) {
  //       console.log(wechatusers)

  //       if (wechatusers['wechat'] !== undefined) {
  //         ret.code = 1;

  //       } else {
  //         ret.code = 0

  //       }
  //     } else {
  //       ret.code = 0
  //     }
  //   }
  //   //连接组件，选择数据库

  //   return ret;
  // }


  //获取用户的微信信息
  async get_code(code, state: string,res) {
    let state_siteid=state.split(',')[0];
    let isTickect: boolean = false;
    console.log(`wechat.service.ts >>> get_code >>> state = ${state_siteid}`);
    //  如果state是以Ticket结尾的，则表示该用户为包票用户
    if (state_siteid.endsWith("Ticket")) {
      state_siteid = state_siteid.replace("Ticket", "");
      isTickect = true;
    }
    console.log(`wechat.service.ts >>> get_code after state.endsWith >>> state = ${state_siteid} >>> isTicket = ${isTickect}`);

    let access_DB = new JsonDB("./db/access_token.json", true, false);
    var wechat = access_DB.getData("/" + state_siteid + "/access");
    console.log(code);
    let ret: RetObject = new RetObject;

    //获取关注公众号的微信用户openid
    if (code.length > 0) {
      var WechatUserInfo = await WechatWeb.get_wechat(code, state_siteid);
      // console.log(WechatUserInfo)
      var response = WechatUserInfo["wechat"];
      //获取用户基本信息
      var response_info = WechatUserInfo["info"];
      //ret.code = 1;
      ret.description = response.openid;
      ret.name = response_info.nickname;

      ret.headimgurl=response_info.headimgurl;

      ret.siteId = state_siteid;
      console.log(response);

      console.log(response_info);
      if (response_info.subscribe === 0) {
        ret.code = 0;
      }
      var openid = response.openid;
      var time = Template.get_time();
      console.log(state);
      var tiaojian = { "wechat.openid": openid, "source": state_siteid };
      var update = { $set: { "wechat": response, "info": response_info, "isTicket": isTickect } };
      //连接组件，选择数据库
      var Wechatusers = await wechatdb.findOneAndUpdate(tiaojian, update);
      var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
      console.log(wechatusers);
      // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
      if (wechatusers !== null) {
        if (wechatusers["wechat"] === undefined) {
          //var createdwechatuser = new this.wechatModel({ 'wechat': response, 'time': time, 'source': state, "info": response_info })
          //await createdwechatuser.save();
          ret.code = 0;
        } else {
          ret.code = 1;
        }
      } else {
        var createdwechatuser = new wechatdb({
          "wechat": response,
          "time": time,
          "source": state_siteid,
          "info": response_info,
          "isTicket": isTickect
        });
        await createdwechatuser.save();
      }

    } else {
      //console.log('111')
      ret.code = 1;
    }
    //console.log('333')
    return ret;
  }

  //获取用户的微信信息
  async get_payid(code, state: string,res) {
    let state_siteid=state.split(',')[0];
    let access_DB = new JsonDB("./db/access_token.json", true, false);
    var wechat = access_DB.getData("/" + state_siteid + "/access");
    console.log(code);
    let ret: RetObject = new RetObject;

    //获取关注公众号的微信用户openid
    if (code.length > 0) {
      var WechatUserInfo = await WechatWeb.get_wechat(code, state_siteid);
      // console.log(WechatUserInfo)
      var response = WechatUserInfo["wechat"];
      //获取用户基本信息
      var response_info = WechatUserInfo["info"];
      //ret.code = 1;
      ret.description = response.openid;
      // ret.name = response_info.nickname;

      // ret.headimgurl=response_info.headimgurl;

      // ret.siteId = state;
      console.log(response);

      console.log(response_info);
      if (response_info.subscribe === 0) {
        ret.code = 0;
      }
    } else {
      ret.code = 1;
    }
    return ret;
  }



  //参与wpp演示的方法
  async wpp_get_code(code, state) {
    let access_DB = new JsonDB("./db/access_token.json", true, false);
    var wechat = access_DB.getData("/" + state + "/access");
    let ret: RetObject = new RetObject;
    //获取关注公众号的微信用户openid
    if (code.length > 0) {
      var WechatUserInfo = await WechatWeb.get_wechat(code, state);
      var response = WechatUserInfo["wechat"];
      //获取用户基本信息
      var response_info = WechatUserInfo["info"];
      ret.code = 0;
      ret.description = response.openid;
      if (response_info.subscribe === 0) {
        ret.code = 1;
      }
      var openid = response.openid;
      var uid = state;
      var tiaojian = { "wechat.openid": openid, "source": "wpp" };
      var time = Template.get_time();
      var update = { $set: { "wechat": response, "info": response_info } };
      //连接组件，选择数据库
      var Wechatusers = await wechatdb.findOneAndUpdate(tiaojian, update);
      var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
      if (wechatusers["wechat"] === undefined) {
        var createdwechatuser = new wechat({
          "wechat": response,
          "time": time,
          "source": state,
          "info": response_info
        });
        await createdwechatuser.save();
        ret.code = 0;
      } else {
        ret.code = 1;
      }
    } else {
      //console.log('111')
      ret.code = 1;
    }
    //console.log('333')
    return ret;
  }

  //领券之后更新 {"openid":"xxxxxxxxxxxxxx","tags":['chocolate'],"tikets":['chocolate']}
  async wpp_get_tickets(data) {
    let access_DB = new JsonDB("./db/access_token.json", true, false);
    var wechat = access_DB.getData("/access");
    var time = Template.get_time();
    var ticket = data;
    console.log(ticket);

    async function reserve(data) {
      var body = Template.get_tickets(data, ticket);
      var access_token = wechat.access_token;
      var response = await axios.post("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + access_token, body);
      if (response.data) {

      }
      console.log(response.data);
    }

    console.log(data);
    let ret: RetObject = new RetObject;
    ret.code = 0;
    var tiaojian = { "wechat.openid": data.openid, "source": "wpp" };
    var update = { $set: { "tags": data.tags, "tikcets": data.tickets } };
    //选择
    var Wechatusers = await wechatdb.findOneAndUpdate(tiaojian, update);
    var wechatusers = JSON.parse(JSON.stringify(Wechatusers));

  }

  //获取最新的token
  async get_token() {
    let ret: RetObject = new RetObject;
    for (var i = 0; i < WeChatInfo['siteId'].length; i++) {
      let access_DB = new JsonDB("./db/access_token.json", true, false);
      var wechat = access_DB.getData("/" + WeChatInfo["siteId"][i] + "/access");
      var siteId = WeChatInfo["siteId"][i];
      var time = new Date().getTime();
      if ((time - wechat.get_time) > 7200000 || wechat.access_token === undefined) {
        try {
          console.log(time);
          let response = await axios.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + WeChatInfo[siteId].appid + "&secret=" + WeChatInfo[siteId].secret);
          var access_token = response.data.access_token;
          access_DB.push("/" + WeChatInfo["siteId"][i] + "/access", {
            "access_token": access_token,
            "expires_in": "7200",
            "get_time": time
          });
          ret.code = 0;
          ret.result = response.data.access_token;
        }
        catch (error) {

        }
      } else {
        ret.code = 0;
        var access_token = wechat.access_token;
        ret.result = access_token;
      }
    }

    return ret;
  }

  async get_jsapi_ticket(url, siteId) {
    console.log(siteId);
    console.log(url);
    let ret: RetObject = new RetObject;
    let access_DB = new JsonDB("./db/access_token.json", true, false);
    var jsapi = access_DB.getData("/" + siteId + "/jsapi");
    var access = access_DB.getData("/" + siteId + "/access");
    var siteId = siteId;
    var time = new Date().getTime();
    var noncestr = "siiva123456";
    var timestamp = String((time / 1000)).split(".")[0];
    console.log(time);
    console.log(timestamp);
    console.log((time - jsapi.get_time) / 1000);
    if ((time - jsapi.get_time) > 7200000 || jsapi.ticket === undefined) {
      try {
        var url = url.split("#")[0];
        console.log(access.access_token);
        let response = await axios.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access.access_token + "&type=jsapi");

        //access_token失效
        if (response.data.errcode !== 0) {
          let newresponse = await axios.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=" + WeChatInfo[siteId].appid + "&secret=" + WeChatInfo[siteId].secret);
          var access_token = newresponse.data.access_token;
          let response = await axios.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token=" + access_token + "&type=jsapi");
          var jsapi_ticket = response.data.ticket;
          access_DB.push("/" + siteId + "/access", {
            "access_token": access_token,
            "expires_in": "7200",
            "get_time": time
          });
          access_DB.push("/" + siteId + "/jsapi", { "ticket": jsapi_ticket, "expires_in": "7200", "get_time": time });
          var string = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
          // console.log(string);
          // 用sha1加密
          let signature = crypto.createHash("sha1").update(string).digest("hex");
          console.log(signature);
          console.log(typeof (signature));
          ret.code = 1;
          ret.result = { "time": timestamp, "signature": signature };
        } else {
          var jsapi_ticket = response.data.ticket;
          console.log(response.data);
          access_DB.push("/" + siteId + "/jsapi", { "ticket": jsapi_ticket, "expires_in": "7200", "get_time": time });
          var string = "jsapi_ticket=" + jsapi_ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
          // console.log(string);
          // 用sha1加密
          let signature = crypto.createHash("sha1").update(string).digest("hex");
          console.log(signature + "zzzzzzzzzzzzzzz");
          console.log(typeof (signature));
          ret.code = 1;
          ret.result = { "time": timestamp, "signature": signature };
        }

      }
      catch (error) {
        ret.code = 0;
        return ret;
      }
    } else {
      var url = url.split("#")[0];
      var string = "jsapi_ticket=" + jsapi.ticket + "&noncestr=" + noncestr + "&timestamp=" + timestamp + "&url=" + url;
      // console.log(string);
      // 用sha1加密
      let signature = crypto.createHash("sha1").update(string).digest("hex");
      console.log("zzzzzzzzzzzzzzzzzzz");
      console.log(signature);
      console.log(typeof (signature));
      ret.code = 1;
      ret.result = { "time": timestamp, "signature": signature };
    }


    return ret;
  }

  //自动分发
  async auto_push(id, siteId) {
    let access_DB = new JsonDB("./db/access_token.json", true, false);
    var wechat = access_DB.getData("/access");
    //更新一下token
    this.get_token();
    var time = Template.get_time();
    let ret: RetObject = new RetObject;
    //console.log(wechat)
    var access_token = wechat.access_token;

    async function send(data) {
      var body = {
        "touser": id,
        "template_id": WeChatInfo[siteId].template.get_video,
        "url": "https://bt.siiva.com/#/result?id=" + id,
        "miniprogram": {
          "appid": "",
          "pagepath": ""
        },
        "data": {
          "first": {
            "value": "你好，您在hello Kitty主题乐园拍摄的时光子弹纪念视频已制作成功",
            "color": "#173177"
          },
          "keyword1": {
            "value": "时光子弹定制视频",
            "color": "#173177"
          },
          "keyword2": {
            "value": time,
            "color": "#173177"
          },
          "remark": {
            "value": "点击详情，查看您的专属时光子弹短视频",
            "color": "#173177"
          }
        }
      };
      var response = await axios.post("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + access_token, body);
      if (response.data.errcode === 40001) {
        send(data);
      }
      //console.log(response);
    }

    var tiaojian = { "wechat.openid": id };

    var Wechatusers = await wechatdb.findOne(tiaojian);
    var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
    if (wechatusers.gameInfo !== undefined) {
      ret.code = 1;
    } else {
      ret.code = 0;
    }

    return ret;

  }

  //现阶段是wpp需要这个
  async get_wechatuser() {
    let ret: RetObject = new RetObject;
    ret.code = 2;
    var tiaojian = { "source": "wpp" };
    //连接组件，选择数据库
    var Wechatusers = await wechatdb.find(tiaojian);
    var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
    if (wechatusers["wechat"] !== undefined) {
      ret.code = 1;
      ret.result = wechatusers;
    } else {
      ret.code = 0;
    }
    return ret;

  }

  //主动进入视频页面
  async get_videos(code, state, res) {
    console.log(code, state);
    let access_DB = new JsonDB("./db/access_token.json", true, false);
    var wechat = access_DB.getData("/" + state + "/access");
    let ret: RetObject = new RetObject;
    //获取关注公众号的微信用户openid
    if (code.length > 0) {
      var response = await axios.post("https://api.weixin.qq.com/sns/oauth2/access_token?appid=" + WeChatInfo[state].appid + "&secret=" + WeChatInfo[state].secret + "&code=" + code + "&grant_type=authorization_code", {});
      //获取用户基本信息
      console.log(response.data);
      var openid = response.data.openid;
      var uid = state;
      //连接组件，选择数据库
      var tiaojian = { "wechat.openid": openid, "source": state };
      console.log(tiaojian);
      var Wechatusers = await wechatdb.findOne(tiaojian);
      var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
      console.log(wechatusers);
      if (wechatusers !== null) {
        if (wechatusers["wechat"] !== undefined) {
          ret.code = 1;
          ret.description = openid;
          ret.result = wechatusers;
          console.log("有这个人");
          ret.description = openid;
          ret.name = wechatusers.info.nickname;
          console.log(wechatusers.videoNames);
          var str = undefined;
          ret.statusMsg = undefined;

          if (wechatusers.videoNames !== undefined) {
            var length = wechatusers.videoNames.length;
            ret.statusMsg = wechatusers.videoNames[length - 1];
          }
          console.log(`wechat.service.ts >>> get_videos >>> isTicket = ${wechatusers.isTicket}`);
          res.redirect(environment.apiServer + state + "/#/result?id=" + ret.description + "&name=" + ret.name + "&videonames=" + ret.statusMsg + "&videonumber=" + length + "&isTicket=" + (wechatusers.isTicket || false));
        } else {
          ret.code = 0;
          console.log("没有这个人");
          res.redirect(environment.apiServer + state + "/#/result?is_play=no");
        }
      } else {
        ret.code = 0;
        console.log("没有这个人");
        res.redirect(environment.apiServer + state + "/#/result?is_play=no");
      }

    } else {
      ret.code = -1;
    }
    return ret;
  }


  //点赞功能先用mongodb做，之后用redies玩一下
  //who get a like from who
  async get_like(data) {
    console.log(data);
    let ret: RetObject = new RetObject;
    if (data.friend_id) {
      // var Likes = await this.wechatModel.findOne({ 'wechat.openid': data.open_id, "source": data.siteId })
      // var likes = JSON.parse(JSON.stringify(Likes))
      var Wechatusers = await wechatdb.findOne({ "wechat.openid": data.open_id, "source": data.siteId });
      var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
      //console.log(wechatusers['likes'])
      if (wechatusers !== null) {
        console.log("已经进入了点赞");
        if (wechatusers["likes"] !== undefined) {
          console.log("已经进入了点赞>>>>>>>>>>>>>>>");
          console.log(wechatusers.likes);
          if (wechatusers["likes"]["friends_like"].indexOf(data.friend_id) < 0) {
            var friends = wechatusers["likes"]["friends_like"] + "," + data.friend_id;
            await wechatdb.update({
              "wechat.openid": data.open_id,
              "source": data.siteId
            }, { $set: { "likes.friends_like": friends } });
            ret.code = 1;
          } else {
            ret.code = 1;
            console.log("已经存在了");
          }
          //DatareportService.point_page({"mode":"like","siteId":data.siteId})
        } else {
          console.log("有新的id点赞");
          var friends = "there is," + data.friend_id;
          await wechatdb.update({
            "wechat.openid": data.open_id,
            "source": data.siteId
          }, { $set: { "likes.friends_like": friends } });
          ret.code = 1;
        }
      }

    }
    console.log(ret);
    return ret;


  }

  async is_user(code, state, res) {
    let access_DB = new JsonDB("./db/access_token.json", true, false);
    var user_id = state.split(",")[0];
    var video_name = state.split(",")[1];
    var user_name = state.split(",")[2];
    var urlnumber = state.split(",")[3];
    var siteId = state.split(",")[4];
    var wechat = access_DB.getData("/" + siteId + "/access");
    var WechatUserInfo = await WechatWeb.get_wechat(code, siteId);
    let ret: RetObject = new RetObject;
    //获取关注公众号的微信用户openid

    // var Likes = await this.wechatModel.findOne()
    // var likes = JSON.parse(JSON.stringify(Likes))
    var Wechatusers = await wechatdb.findOne({ "wechat.openid": user_id, "source": siteId });
    var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
    if (wechatusers !== null) {
      if (wechatusers["likes"] !== undefined) {
        if (wechatusers["likes"]["friends_like"].indexOf(WechatUserInfo["wechat"].openid) > 0) {
          console.log("存在，已点赞");
          ret.code = 1;
          ret.statusMsg = user_id;
          ret.status = wechatusers["likes"]["friends_like"].split(",").length - 1;
          ret.description = WechatUserInfo["wechat"].openid;
          ret.is_like = 1;
          ret.name = user_name;
          ret.siteId = video_name;
          res.redirect(environment.apiServer + siteId + "/#/result?id=" + ret.statusMsg + "&friend_id=" + ret.description + "&is_like=" + ret.is_like + "&number=" + ret.status + "&videonames=" + ret.siteId + "&name=" + ret.name);
          console.log(ret);
        } else {
          console.log("不存在，未点赞");
          // console.log(response.data.openid)
          ret.code = 0;
          ret.statusMsg = user_id;
          ret.status = wechatusers["likes"]["friends_like"].split(",").length - 1;
          ret.description = WechatUserInfo["wechat"].openid;
          ret.is_like = 0;
          ret.name = user_name;
          ret.siteId = video_name;
          res.redirect(environment.apiServer + siteId + "/#/result?id=" + ret.statusMsg + "&friend_id=" + ret.description + "&is_like=" + ret.is_like + "&number=" + ret.status + "&videonames=" + ret.siteId + "&name=" + ret.name);
          console.log(ret);
        }
      } else {
        console.log("该用户没人点赞");
        ret.code = -1;
        ret.statusMsg = user_id;
        ret.status = 0;
        ret.description = WechatUserInfo["wechat"].openid;
        ret.is_like = 0;
        ret.name = user_name;
        ret.siteId = video_name;
        res.redirect(environment.apiServer + siteId + "/#/result?id=" + ret.statusMsg + "&friend_id=" + ret.description + "&is_like=" + ret.is_like + "&number=" + ret.status + "&videonames=" + ret.siteId + "&name=" + ret.name);
      }
    }


    return ret;
  }

  //记录result页面加载次数
  async create_number(data) {
    let ret: RetObject = new RetObject;
    var db = mongoose.createConnection("mongodb://localhost/numbers");
    //建立Schema
    var monSchema = new mongoose.Schema({
      url: String,
      urlnumber: Number,
      sharenumber: Number
    });
    //建立collections
    var number = db.model("numbers", monSchema);

    await number.findOne({ "url": data.url }, function(err, numbers) {
      if (err) {
        return err;
      }
      if (numbers) {
        console.log(typeof (data.urlnumber));
        console.log(typeof (numbers.urlnumber));
        var urlnumber = data.urlnumber + numbers.urlnumber;
        var sharenumber = data.sharenumber + numbers.sharenumber;
        number.update({ "url": data.url }, {
          $set: {
            "urlnumber": urlnumber,
            "sharenumber": sharenumber
          }
        }, function(err, docs) {
          ret.code = 1;
          if (err) {
            console.log(err);
            ret.code = -1;
          }
          console.log("更改成功：" + docs);

        });
      } else {
        var Number = new number({ "url": data.url, "urlnumber": 1, "sharenumber": 0 });

        Number.save(function(err, docs) {
          ret.code = 1;
          if (err) {
            console.log(err);
            ret.code = -1;
          }
          console.log("保存成功：" + docs);
        });
      }
    });
  }

  async video_name(data) {
    let ret: RetObject = new RetObject;
    var videoname;
    var tiaojian = { "wechat.openid": data.task.userId, "source": data.task.siteId };
    // console.log(tiaojian);
    var Wechatusers = await wechatdb.findOne(tiaojian);
    var wechatusers = JSON.parse(JSON.stringify(Wechatusers));
    var userData;


    if (wechatusers && wechatusers.videoNames !== undefined) {
      wechatusers.videoNames[wechatusers.videoNames.length] = data["task"]["output"]["name"].split(".")[0];
      videoname = wechatusers.videoNames;
      var update = { $set: { "videoNames": videoname } };
      await wechatdb.update(tiaojian, update);
    } else if (data["task"]["output"]){
      // videoname = [data["task"]["output"]["name"].split(".")[0]];
      videoname = data["task"]["output"]["name"]?[data["task"]["output"]["name"].split(".")[0]]:videoname;
      var update = { $set: { "videoNames": videoname } };
      await wechatdb.update(tiaojian, update);
    }

    return ret;
  }

  async get_data() {
    let ret: RetObject = new RetObject;
    var Number = mongoose.createConnection("mongodb://localhost/numbers");
    var Like = mongoose.createConnection("mongodb://localhost/likes");
    //建立Schema
    var monSchema = new mongoose.Schema({});
    //建立collections
    var number = Number.model("numbers", monSchema);
    var like = Like.model("likes", monSchema);

    try {
      var numbers = await number.find({});
      var numbers = JSON.parse(JSON.stringify(numbers));
    } catch (err) {

    }

    try {
      var likes = await like.find({});
      var likes = JSON.parse(JSON.stringify(likes));
    } catch (err) {

    }

    var data = {};
    console.log();
    console.log(likes);

    var like_number = 0;
    for (var i = 0; i < likes.length; i++) {
      like_number += likes[i].friends_like.split(",").length - 1;
    }
    data["005"] = { "urlnumber": numbers[1].urlnumber, "sharenumber": numbers[1].sharenumber };
    data["006"] = { "urlnumber": numbers[0].urlnumber, "sharenumber": numbers[0].sharenumber };
    data["like_number"] = like_number;
    ret.result = data;
    return ret;

    //data['urlnumber'] = numbers.
  }

  // async wechatLogin(code) {
  //   let ret: RetObject = new RetObject;
  //   var response = await axios.post('https://api.weixin.qq.com/sns/jscode2session?appid=wxb4156cd7e9c16be9&secret=fa5044fa0c707f508c7f6522b342b4e7&js_code=' + code + '&grant_type=authorization_code', {});
  //   ret.code = 1;
  //   ret.result = response.data;
  //   return ret;
  // }

  //微信小程序相关api
  async wechatApplogin(code, siteId) {
    let ret: RetObject = new RetObject;
    var response = await axios.get("https://api.weixin.qq.com/sns/jscode2session?appid=wxb4156cd7e9c16be9&secret=fa5044fa0c707f508c7f6522b342b4e7&js_code=" + code + "&grant_type=authorization_code", {});

    if (response.data.errcode == undefined) {
      ret.code = 1;
      ret.result = { "info": "", "wechatapp": response.data };
      if (response.data.unionid !== undefined) {
        // console.log(siteId + ">>>>>>>>>>>>>>>>>");
        var WechatUser = await wechatdb.findOneAndUpdate({
          "info.unionid": response.data.unionid,
          "source": siteId
        }, { "wechatapp": response.data });
        if (WechatUser !== null) {
          ret.result = { "info": WechatUser, "wechatapp": response.data };
        }
      }
    } else {
      ret.code = 0;
      ret.result = response.data;
    }

    function callback(res) {
    }

    return ret;
  }

  async deleteVideo(videoname) {
    console.log(videoname);
    let ret: RetObject = new RetObject;
    FS.unlinkSync("./wechatTXT/" + videoname);
    if (FS.existsSync("./wechatTXT/" + videoname)) {
      ret.code = 0;
    } else {
      ret.code = 1;
    }
  }

  // old version
  // async downloadVideo(videoname) {
  //   console.log(videoname);
  //   let ret: RetObject = new RetObject;
  //   var dirnames = FS.readdirSync("./wechatTXT");
  //   if (FS.existsSync("./wechatTXT/" + videoname)) {
  //     console.log("cunzailalallalalalalalal");
  //     var videosize = FS.readFileSync("./wechatTXT/" + videoname).length;
  //   }
  //   // var videosize = FS.readFileSync("./wechatTXT/"+videoname).length;
  //   console.log(videosize);
  //   ret.code = 1;
  //   console.log(videoname.length+'LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL')
  //   if(videoname.length>40){
  //     console.log('时光子弹视频下载LLLLLLLLLLLLLLLLL')
  //     if (dirnames.join(",").indexOf(videoname) < 0 || videosize < 1024000) {
  //       const bucket = "siiva",
  //         key = `ucloud/${videoname}`,
  //         file_path = `./wechatTXT/${videoname}`,
  //         method = "GET",
  //         url_path_params = "/" + key;
  //       const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
  //       const client = new AuthClient(req);
  //       console.log("zhangjainxishishabi??????????");
  //       for (var i = 0; i < 3; i++) {
  //         console.log("zhaozheng>>>>>>>>");
  //         const res = await client.SendRequest(callback);
  //         if (res instanceof Error) {
  //           ret.code = 0;
  //           console.log("err>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  //         } else {
  //           ret.code = 1;
  //           console.log("success>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  //           break;
  //         }
  //
  //         function callback(res) {
  //         }
  //       }
  //     }
  //   }else{
  //     console.log('得分时刻视频下载LLLLLLLLLLLLLLLLL')
  //     if (dirnames.join(",").indexOf(videoname) < 0 || videosize < 1024000) {
  //       const bucket = "siiva",
  //         key = `${videoname}`,
  //         file_path = `./wechatTXT/${videoname}`,
  //         method = "GET",
  //         url_path_params = "/" + key;
  //       const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
  //       const client = new AuthClient(req);
  //       console.log("zhangjainxishishabi??????????");
  //       for (var i = 0; i < 3; i++) {
  //         console.log("zhaozheng>>>>>>>>");
  //         const res = await client.SendRequest(callback);
  //         if (res instanceof Error) {
  //           ret.code = 0;
  //           console.log("err>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  //         } else {
  //           ret.code = 1;
  //           console.log("success>>>>>>>>>>>>>>>>>>>>>>>>>>>");
  //           break;
  //         }
  //
  //         function callback(res) {
  //         }
  //       }
  //     }
  //   }
  //
  //   return ret;
  // }

  // from ali-oss version
  async downloadVideo(videoName) {
    let ret: RetObject = new RetObject();
    let originFileName = videoName;
    let localFileName = `./wechatTXT/${videoName}`;
    let callback = {
      onSuccess: result => {
        ret.code = 0;   //  todo 需要修改为0 0表示成功
        console.log(`wechat video download success`);
      },
      onError: err => {
        ret.code = 1;
        console.log(`wechat video download error: ${err}`);
      }
    } as HttpClientCallback;

    await httpclient.get(
        originFileName,
        localFileName,
        callback,
        5,
        HttpClientBuckets.PUBLIC_BUCKET
    );

    console.log(`wechat video download return ret: ${ret.code}`);
    return ret;
  }

  //微信web相关的api
  async web_login(code, state) {
    let ret: RetObject = new RetObject;
    var response = await axios.post("https://api.weixin.qq.com/sns/oauth2/access_token?appid=wxa1281d9d88f34304&secret=0b091a100bc3040ef7e5d032b751bf98&code=" + code + "&grant_type=authorization_code");
    ret.result = response.data;
    ret.description = response.data.openid;
    ret.name = "siiva";
    ret.siteId = state;
    ret.code = 1;
    console.log(response.data);
    console.log(ret);
    return ret;
  }

  async create_qrcode(siteId) {
    let ret: RetObject = new RetObject;
    let access_DB = new JsonDB("./db/access_token.json", true, false);
    var wechat = access_DB.getData("/" + siteId + "/access");
    var data = { "scene": siteId, "page": "pages/index/index", "width": 430, "auto_color": true, "is_hyaline": false };
    var response = await axios.post("https://api.weixin.qq.com/wxa/getwxacodeunlimit?access_token=" + wechat.access_token, data);
    ret.result = response.data;
  }

  async get_siteId() {
    let ret: RetObject = new RetObject;
    ret.description = "0013";
    return ret;
  }

  async get_video_name(siteId, openid) {
    let ret: RetObject = new RetObject;
    var WechatUser = await wechatdb.findOne({ "wechat.openid": openid, "source": siteId });
    if (WechatUser.videoNames != undefined || WechatUser.videoNames != null) {
      let length = WechatUser.videoNames.length;
      ret.description = WechatUser.videoNames[length - 1].split(".")[0].split(openid)[1].split("_")[1];
      ret.name = openid;
    } else {
      ret.description = "no videos";
    }

    return ret;
  }


  async get_tickets_statistics(query) {
    let ret = new RetObject();

    try {
      let conditions = {};
      let retOfIsTicket = new RetObject();
      let retOfNotTicket = new RetObject();
      let retOfNullTicket = new RetObject();

      if (query.siteId) {
        conditions = { source: query.siteId };
      }

      await wechatdb.aggregate([{ $match: { ...conditions, "isTicket": true } }, {
        $group: {
          "_id": "$time",
          "count": { $sum: 1 }
        }
      }, {
        $project: {
          "_id": 0,
          "time": "$_id",
          "count": 1,
          "isTicket": 1
        }
      }], (err, raw) => retOfIsTicket = dbTools.execSQLCallback({
        method: "find",
        err,
        raw,
        fileName: "wechat.service.ts",
        funcName: "get_tickets_statistics"
      }));

      await wechatdb.aggregate([{ $match: { ...conditions, "isTicket": false } }, {
        $group: {
          "_id": "$time",
          "count": { $sum: 1 }
        }
      }, {
        $project: {
          "_id": 0,
          "time": "$_id",
          "count": 1,
          "isTicket": 1
        }
      }], (err, raw) => retOfNotTicket = dbTools.execSQLCallback({
        method: "find",
        err,
        raw,
        fileName: "wechat.service.ts",
        funcName: "get_tickets_statistics"
      }));

      await wechatdb.aggregate([{ $match: { ...conditions, "isTicket": null } }, {
        $group: {
          "_id": "$time",
          "count": { $sum: 1 }
        }
      }, {
        $project: {
          "_id": 0,
          "time": "$_id",
          "count": 1,
          "isTicket": 1
        }
      }], (err, raw) => retOfNullTicket = dbTools.execSQLCallback({
        method: "find",
        err,
        raw,
        fileName: "wechat.service.ts",
        funcName: "get_tickets_statistics"
      }));

      ret.result = {
        isTicket: retOfIsTicket.result,
        notTicket: (retOfNotTicket.result as Array<Object>).concat(retOfNullTicket.result)
      };

      if ((ret.result['isTicket'] as Array<Object>).length ||
        (ret.result['notTicket'] as Array<Object>).length) {
        ret.code = 0;
      } else {
        ret.code = 1;
      }

    } catch (e) {
      ret.code = 2;
      ret.description = `获取包票、散票用户统计信息失败：${e}`;
    }

    return ret;
  }

}
