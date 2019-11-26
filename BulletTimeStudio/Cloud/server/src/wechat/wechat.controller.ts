import { Controller, Post, Get, Body, Req, Query, Res, HttpStatus } from "@nestjs/common";
import * as bodyParser from "body-parser";
import * as express from "express";
import * as crypto from "crypto";
import * as jsSHA from "jssha";
import * as Http from "http";
import { RetObject } from "../common/ret.component";
import { WechatService } from "./wechat.service";
import { environment } from "../environment/environment";


@Controller("wechat")
export class WechatController {
  constructor(private readonly wechatService: WechatService) {
  }

  /**
   * @api {get} /wechat/wx
   * @apiVersion 1.1.0
   * @apiName wx
   * @apiGroup wechat
   *
   * @apiParam {String} signature signature
   * @apiParam {String} timestamp timestamp
   * @apiParam {String} echostr echostr
   * @apiParam {String} nonce nonce
   *
   * @apiSuccess {String} echostr return echostr
   *
   * @apiError {String} string return string
   *
   */
  @Get("wx")
  Wx(
    @Query("signature") signature: string,
    @Query("timestamp") timestamp: string,
    @Query("echostr") echostr: string,
    @Query("nonce") nonce: string) {
    /*var wechat = require('node-wechat');

   wechat.token = 'siiva123456';
   //检验 token
  wechat.checkSignature(req, res);
  //预处理
  //wechat.handler(req, res);
     */
    var token = "siiva123456";
    console.log(echostr);

    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = token;
    oriArray.sort();
    var original = oriArray.join("");
    //var jsSHA = require('jssha');
    var shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(original);
    var scyptoString = shaObj.getHash("HEX");
    if (signature == scyptoString) {
      //验证成功
      return echostr;
    } else {
      //验证失败
      return "verify fail.";
    }

  }

  // @Get('is_reservate')
  // async is_reservate(@Res() res, @Query('code') code: string, @Query('state') state: String) {

  //     let ret = await this.wechatService.is_reservate(code, state);
  //     console.log(ret)
  //     res.redirect(environment.apiServer + state + '/#/login?openid=' + ret.description + '&is_reservate=' + ret.code);
  // }

  /**
   * @api {get} /wechat/test
   * @apiVersion 1.1.0
   * @apiName test
   * @apiGroup wechat
   *
   * @apiParam {String} code code
   * @apiParam {String} state state
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return result
   *
   */
  @Get("test")
  async test(@Res() res, @Query("code") code: string, @Query("state") state: String) {
    let ret = await this.wechatService.test(code, state);
    res.status(HttpStatus.OK).json(ret);
  }


  // @Post('add_user')
  // async add_user(@Res() res, @Body() data) {
  //     let ret = await this.wechatService.add_user(data);
  //     console.log(ret)
  //     console.log(">>>>>>>>>>>>>>>>>>>>>>>>")
  //     res.status(HttpStatus.OK).json(ret);

  // }

  /**
   * @api {get} /wechat/get_code
   * @apiVersion 1.1.0
   * @apiName get_code
   * @apiGroup wechat
   *
   * @apiParam {String} code code
   * @apiParam {String} state state
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return result
   *
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   *
   */
  @Get("get_code")
  async get_code(@Res() res, @Query("code") code: string, @Query("state") state: string) {
    let ret = await this.wechatService.get_code(code, state,res);
    if(state.indexOf(",")!=-1){
      let state_siteid=state.split(',')[0];
      let state_activityId=state.split(',')[1];
      state_siteid = state_siteid.endsWith("Ticket") ? state_siteid.replace("Ticket", "") : state_siteid;
      switch(state_siteid)
      {
        case "SiivaPage":
           res.redirect(environment.uiServer + state_siteid + "/#/homepage?id=" + ret.description + "&activity_id="+state_activityId);
           break;
        case "hellokitty":
           res.redirect(environment.uiServer + "SiivaPage/#/HK_homepage?id=" + ret.description + "&activity_id=1541382417");
           break;
        case "Local_hellokitty":
           res.redirect(environment.uiServer +  "SiivaPage/#/Local_homepage?id=" + ret.description + "&activity_id=1541382417");
           break;
        default:
           res.redirect(environment.apiServer + state_siteid + "/#/login?user_id=" + ret.description + "&nickname=" + ret.name + "&code=" + ret.code + "&siiva=wechat" + "&where=" + ret.siteId);
      }
    }else{
      let state_siteid=state;
      state_siteid = state_siteid.endsWith("Ticket") ? state_siteid.replace("Ticket", "") : state_siteid;
      switch(state_siteid)
      {
        case "SiivaPage":
           res.redirect(environment.uiServer + state + "/#/homepage?id=" + ret.description + "&activity_id=1541382417");
           break;
        case "hellokitty":
           res.redirect(environment.uiServer + "SiivaPage/#/HK_homepage?id=" + ret.description + "&activity_id=1541382417");
           break;
        case "Local_hellokitty":
           res.redirect(environment.uiServer +  "SiivaPage/#/Local_homepage?id=" + ret.description + "&activity_id=1541382417");
           break;
        default:
           res.redirect(environment.apiServer + state + "/#/login?user_id=" + ret.description + "&nickname=" + ret.name + "&code=" + ret.code + "&siiva=wechat" + "&where=" + ret.siteId);
      }
    }
}

    @Get("get_payid")
    async get_payid(@Res() res, @Query("code") code: string, @Query("state") state: string) {
        let ret = await this.wechatService.get_payid(code, state,res);
        let resulr_url=state.split(',')[1];
        switch(resulr_url)
        {
            case "GYMVertical_result":
                res.redirect(environment.uiServer +"SiivaPage/#/GYMVertical_result?id=" + ret.description+"&taskId="+state.split(',')[2]+"&activity_id="+state.split(',')[3]+'&HK_id='+state.split(',')[4]);
                break;
            case "GYMHorizontal_result":
                res.redirect(environment.uiServer +"SiivaPage/#/GYMHorizontal_result?id=" + ret.description+"&taskId="+state.split(',')[2]+"&activity_id="+state.split(',')[3]+'&HK_id='+state.split(',')[4]);
                break;
            case "Single_result":
                res.redirect(environment.uiServer +"SiivaPage/#/Single_result?id=" + ret.description+"&taskId="+state.split(',')[2]+"&activity_id="+state.split(',')[3]);
                break;
            case "pay":
                res.redirect(environment.uiServer +"SiivaPage/#/pay?id=" + ret.description+"&taskId="+state.split(',')[2]+"&activity_id="+state.split(',')[3]);
                break;
            default:
                res.redirect(environment.uiServer + "SiivaPage/#/HK_result?payid=" + ret.description+"&id="+state.split(',')[1]+"&taskId="+state.split(',')[2]+"&activity_id="+state.split(',')[3]+"&isPay="+state.split(',')[4]);
        }
    }



  //参与wpp演示
  /**
   * @api {get} /wechat/wpp_get_code
   * @apiVersion 1.1.0
   * @apiName wpp_get_code
   * @apiGroup wechat
   *
   * @apiParam {String} code code
   * @apiParam {String} state state
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   * @apiSuccess {Object} ret.result return result
   *
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 1
   *
   */
  @Get("wpp_get_code")
  async wpp_get_code(@Res() res, @Query("code") code: string, @Query("state") state: String) {
    let ret = await this.wechatService.wpp_get_code(code, state);
    res.redirect(environment.apiServer + "0004/#/wpp?user_id=" + ret.description + "&code=" + ret.code + "&siiva=wpp" + "&where" + ret.status);
  }

  //参与wpp演示
  /**
   * @api {post} /wechat/wpp_get_tickets
   * @apiVersion 1.1.0
   * @apiName wpp_get_tickets
   * @apiGroup wechat
   *
   * @apiParam {Object} data Client object data
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   *
   */
  @Post("wpp_get_tickets")
  async wpp_get_tickets(@Res() res, @Body() data) {

    let ret = await this.wechatService.wpp_get_tickets(data);
    res.status(HttpStatus.OK).json(ret);
  }


  /**
   * @api {get} /wechat/get_token
   * @apiVersion 1.1.0
   * @apiName get_token
   * @apiGroup wechat
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   *
   */
  @Get("get_token")
  async get_token(@Res() res) {
    let ret = await this.wechatService.get_token();
    console.log(ret);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /wechat/get_jsapi_ticket
   * @apiVersion 1.1.0
   * @apiName get_jsapi_ticket
   * @apiGroup wechat
   *
   * @apiParam {String} url url
   * @apiParam {String} siteId siteId
   *
   */
  @Get("get_jsapi_ticket")
  async get_jsapi_ticket(@Res() res, @Query("url") url, @Query("siteId") siteId) {
    let ret = await this.wechatService.get_jsapi_ticket(url, siteId);
    //console.log(ret)
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /wechat/get_wechatuser
   * @apiVersion 1.1.0
   * @apiName get_wechatuser
   * @apiGroup wechat
   *
   * @apiSuccess {Object} ret Return object
   * @apiSuccess {Number} ret.code return 0
   *
   * @apiError {Object} ret Return object
   * @apiError {Number} ret.code return 0
   *
   */
  @Get("get_wechatuser")
  async get_wechatuser(@Res() res) {

    let ret = await this.wechatService.get_wechatuser();
    //console.log(ret)
    res.status(HttpStatus.OK).json(ret);
  }


  /**
   * @api {get} /wechat/auto_push
   * @apiVersion 1.1.0
   * @apiName auto_push
   * @apiGroup wechat
   *
   * @apiParam {String} id id
   * @apiParam {String} siteId siteId
   *
   */
  @Get("auto_push")
  async auto_push(@Res() res, @Query("id") id: string, @Query("siteId") siteId: string) {

    let ret = await this.wechatService.auto_push(id, siteId);
    // console.log(ret)
    res.status(HttpStatus.OK).json(ret);
  }


  /**
   * @api {get} /wechat/get_videos
   * @apiVersion 1.1.0
   * @apiName get_videos
   * @apiGroup wechat
   *
   * @apiParam {String} code code
   * @apiParam {String} state state
   *
   */
  @Get("get_videos")
  async get_videos(@Res() res, @Query("code") code: string, @Query("state") state: String) {

    var ret = await this.wechatService.get_videos(code, state, res);
    //console.log(ret)
    //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>')
    // if (ret.description) {
    //     res.redirect(environment.apiServer +state+'/#/result?id=' + ret.description+'&name='+ret.name+'&videonames='+ret.statusMsg);
    // }
  }

  /**
   * @api {get} /wechat/get_like
   * @apiVersion 1.1.0
   * @apiName get_like
   * @apiGroup wechat
   *
   * @apiParam {String} data data
   *
   */
  @Post("get_like")
  async get_like(@Res() res, @Body() data) {
    let ret = await this.wechatService.get_like(data);
    //console.log(ret)
    res.status(HttpStatus.OK).json(ret);

  }

  /**
   * @api {get} /wechat/is_user
   * @apiVersion 1.1.0
   * @apiName is_user
   * @apiGroup wechat
   *
   * @apiParam {String} code code
   * @apiParam {String} state state
   *
   */
  @Get("is_user")
  async is_user(@Res() res, @Query("code") code: string, @Query("state") state: String) {

    let ret = await this.wechatService.is_user(code, state, res);
    //console.log(ret)


  }

  /**
   * @api {post} /wechat/create_number
   * @apiVersion 1.1.0
   * @apiName create_number
   * @apiGroup wechat
   *
   * @apiParam {String} data data
   *
   */
  @Post("create_number")
  async create_number(@Res() res, @Body() data) {

    let ret = await this.wechatService.create_number(data);
    //console.log(ret)
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {post} /wechat/video_name
   * @apiVersion 1.1.0
   * @apiName video_name
   * @apiGroup wechat
   *
   * @apiParam {String} data data
   *
   */
  @Post("video_name")
  async video_name(@Res() res, @Body() data) {

    let ret = await this.wechatService.video_name(data);
    //console.log(ret)
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /wechat/get_data
   * @apiVersion 1.1.0
   * @apiName get_data
   * @apiGroup wechat
   *
   *
   */
  @Get("get_data")
  async get_data(@Res() res) {

    let ret = await this.wechatService.get_data();
    //console.log(ret)
    res.status(HttpStatus.OK).json(ret);
  }

  // @Get('wechatLogin')
  // async wechatLogin(@Res() res,@Query('code') code) {

  //     let ret = await this.wechatService.wechatLogin(code);
  //     //console.log(ret)
  //     res.status(HttpStatus.OK).json(ret);
  // }


  //微信小程序相关的方法
  /**
   * @api {get} /wechat/wechatapp
   * @apiVersion 1.1.0
   * @apiName wechatapp
   * @apiGroup wechat
   *
   * @apiParam {String} signature signature
   * @apiParam {String} timestamp timestamp
   * @apiParam {String} echostr echostr
   * @apiParam {String} nonce nonce
   *
   */
  @Get("wechatapp")
  Wechatapp(
    @Query("signature") signature: string,
    @Query("timestamp") timestamp: string,
    @Query("echostr") echostr: string,
    @Query("nonce") nonce: string) {
    /*var wechat = require('node-wechat');

   wechat.token = 'siiva123456';
   //检验 token
  wechat.checkSignature(req, res);
  //预处理
  //wechat.handler(req, res);
     */
    var token = "siiva123456";

    var oriArray = new Array();
    oriArray[0] = nonce;
    oriArray[1] = timestamp;
    oriArray[2] = token;
    oriArray.sort();
    var original = oriArray.join("");
    //var jsSHA = require('jssha');
    var shaObj = new jsSHA("SHA-1", "TEXT");
    shaObj.update(original);
    var scyptoString = shaObj.getHash("HEX");
    return echostr;

    // if (signature == scyptoString) {
    //     //验证成功
    //     return echostr;
    // } else {
    //     //验证失败
    //     return false;
    // }

  }

  /**
   * @api {get} /wechat/wechatApplogin
   * @apiVersion 1.1.0
   * @apiName wechatApplogin
   * @apiGroup wechat
   *
   * @apiParam {String} code code
   * @apiParam {String} siteId siteId
   *
   */
  @Get("wechatApplogin")
  async wechatApplogin(@Res() res, @Query("code") code, @Query("siteId") siteId) {
    let ret = await this.wechatService.wechatApplogin(code, siteId);
    console.log(ret);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /wechat/downloadVideo
   * @apiVersion 1.1.0
   * @apiName downloadVideo
   * @apiGroup wechat
   *
   * @apiParam {String} videoname videoname
   *
   */
  @Get("downloadVideo")
  async download(@Res() res, @Query("videoname") videoname: string) {
    let ret = await this.wechatService.downloadVideo(videoname);
    console.log(ret);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /wechat/deleteVideo
   * @apiVersion 1.1.0
   * @apiName deleteVideo
   * @apiGroup wechat
   *
   * @apiParam {String} videoname videoname
   *
   */
  @Get("deleteVideo")
  async deleteVideo(@Res() res, @Query("videoname") videoname: string) {
    let ret = await this.wechatService.deleteVideo(videoname);
    console.log(ret);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /wechat/web_login
   * @apiVersion 1.1.0
   * @apiName web_login
   * @apiGroup wechat
   *
   * @apiParam {String} code code
   * @apiParam {String} state state
   *
   */
  @Get("web_login")
  async web_login(@Res() res, @Query("code") code: string, @Query("state") state: string) {
    let ret = await this.wechatService.web_login(code, state);
    console.log(ret);
    res.redirect(environment.apiServer + state + "/#/login?user_id=" + ret.description + "&nickname=" + ret.name + "&code=" + ret.code + "&siiva=wechat" + "&where=" + ret.siteId);
  }

  /**
   * @api {get} /wechat/create_qrcode
   * @apiVersion 1.1.0
   * @apiName create_qrcode
   * @apiGroup wechat
   *
   * @apiParam {String} siteId siteId
   *
   */
  @Get("create_qrcode")
  async create_qrcode(@Res() res, @Query("siteId") siteId: string) {
    let ret = await this.wechatService.create_qrcode(siteId);
    console.log(ret);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /wechat/get_siteId
   * @apiVersion 1.1.0
   * @apiName get_siteId
   * @apiGroup wechat
   *
   *
   */
  @Get("get_siteId")
  async get_siteId(@Res() res) {
    let ret = await this.wechatService.get_siteId();
    console.log(ret);
    res.status(HttpStatus.OK).json(ret);
  }

  /**
   * @api {get} /wechat/get_video_name
   * @apiVersion 1.1.0
   * @apiName get_video_name
   * @apiGroup wechat
   *
   * @apiParam {String} siteId siteId
   * @apiParam {String} openid openid
   *
   */
  @Get("get_video_name")
  async get_video_name(@Res() res, @Query("siteId") siteId: string, @Query("openid") openid: string) {
    let ret = await this.wechatService.get_video_name(siteId, openid);
    console.log(ret);
    res.status(HttpStatus.OK).json(ret);
  }


  /**
   * @api {get} /wechat/get_tickets_statistics 获取包票或散票用户的统计信息
   * @apiVersion 1.0.0
   * @apiName get_tickets_statistics
   * @apiGroup wechat
   *
   * @apiParam {String} [siteId] 站点ID
   *
   * @apiSuccess {Object} ret
   * @apiSuccess {Number} ret.code 0
   * @apiSuccess {Object} ret.result
   * @apiSuccess {Object} ret.result.isTicket 包票用户
   * @apiSuccess {Number} ret.result.isTicket.count 当天包票用户数量
   * @apiSuccess {Array} ret.result.isTicket.time 当天日期
   * @apiSuccess {Object} ret.result.notTicket 散客用户
   * @apiSuccess {Number} ret.result.notTicket.count 当天散客用户数量
   * @apiSuccess {Array} ret.result.notTicket.time 当天日期
   *
   * @apiError {Object} ret
   * @apiError {Number} ret.code not 0
   * @apiError {String} ret.description the detail of exec
   *
   * @apiSuccessExample Success-Response:
   * HTTP/1.1 200 OK
   * {
   *   "code": 0,
   *   "result": {
   *     "isTicket": [
   *            {
   *              "count": 1,
   *              "time": "yyyy-mm-dd"
   *            }
   *      ],
   *     "notTicket": [
   *            {
   *              "count": 1,
   *              "time": "yyyy-mm-dd"
   *            }
   *       ]
   *    }
   * }
   */
  @Get("get_tickets_statistics")
  async get_tickets_statistics(@Res() res, @Query() query) {
    let ret = await this.wechatService.get_tickets_statistics(query);

    res.status(HttpStatus.OK).json(ret);
  }
};

