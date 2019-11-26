import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';

import { environment } from '../../../../environments/environment';
import { SocketService } from '../../common/socket.service';
import flvjs from 'flv.js';

import * as grpcWeb from 'grpc-web';
// import {statusClient} from '../grpc/device_grpc_web_pb';
// import {GetDeviceStatusRequest} from '../grpc/device_pb';
import { SOCCER_EVENT, SOCKET_EVENT } from "../../../../../../server/src/common/socket.interface";
import { NgbCheckBox } from '@ng-bootstrap/ng-bootstrap';
import { start } from 'repl';
import { $$iterator } from 'rxjs/internal/symbol/iterator';


@Component({
  selector: 'ngx-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.scss'],
})
export class DeviceStatusComponent implements OnInit {


  /* 公司过滤 */
  companyList: any;
  selCompany = '全部';
  selCompanyId = '';

  /* 设备列表的活动过滤 */
  activityList: any;
  selActivity = '全部';
  selActivityId = '';


  /*用户过滤*/
  userList = [];
  selPhone: string;
  selUserId = '';
  /* 设备设定deviceId */
  settingDeviceId = ''
  /* 浏览器的deviceId */
  browser_device_id = ''
  /* 设备设定的账号 */
  account = '';
  /* 设备设定的密码 */
  passwd = '';
  /* 设备设定的绑定活动活动名称 */
  myActivity: string;
  /* 设备设定的绑定活动的activity_id */
  mySelActivityId = '';
  param: string;
  /* 设备设定的默认模型 */
  // myModel = "凯蒂猫";
  // myModel = {"name":"凯蒂猫", "model": "hello_kitty_home"};
  myModel: any;
  /* 设备设定的默认辨识模型 */
  // myModelActions = [{"name":"握手", "action":"handshake"},{"name":"比赞", "action":"thumb-up"}, {"name":"五指", "action":"hand-five"}, {"name":"有人", "action":"has_person"}];
  myModelActions = [];
  selDeviceId: string;
  /* 设备设定摄像头种类, 手机或者IPC */
  deviceType = "cam";
  /* 设备设定摄像头种类, 手机或者IPC */
  mark = "";
  /* 设备设定的辨识模型 */
  modelList = [{
    "name": "凯蒂猫",
    "model": "hello_kitty_home",
    "actions": [{ "name": "握手", "act": "handshake" }, { "name": "比赞", "act": "thumb-up" }, {
      "name": "五指",
      "act": "hand-five"
    }, { "name": "有人", "act": "has_person" }]
  },
  {
    "name": "篮球",
    "model": "basketball",
    "actions": [{ "name": "三分", "act": "three" }, { "name": "盖帽", "act": "hotpot" }, { "name": "灌篮", "act": "dunk" }]
  },
  { "name": "小汽车", "model": "mini_car", "actions": [{ "name": "出现", "act": "appear" }, { "name": "离开", "act": "leave" }] },
  { "name": "人物", "model": "human", "actions": [{ "name": "正脸", "act": "front_face" }] },
  ]
  mySelActs = [];
  /* 设备设定的拍摄时段 */
  time_before = 0;
  duration = 10000;
  /* 本次套用请求的requestId */
  requestId = '';
  /* 设备设定的机位 */
  position = 0;
  /* 设备设定ipc的url */
  url: string;
  /* 设备设定ipc的port */
  port = 554;
  /* 设备设定ipc的uid */
  uid: string;
  /* 设备设定ipc的pwd */
  pwd: string;
  subtype: string='sub';
  /*给设定界面用的活动列表, 不含'全部'*/
  settingActivityList: any;

  // 动态添加的活动列表
  activities = [];
  activy = [];


  /* 设定页面的登录user_id */
  settingUserId = ''

  /* 设定页面的登录project_id */
  settingProjectId = ''

  /* 设定页面的mome的cmd响应 */
  mome_res: any;
  // mome_res_json: {};

  /* 点击设定, 该设备已绑定的活动 */
  has_bind_activity_res: any;
  /* 收到cmd的数据 */
  receivePreview = {};

  /*设备状态*/
  DeviceStatusList: any;
  // 鼠标位置
  Mouseposition = {}

  isshowSetting: boolean = true;
  isONsuccess: boolean = true;

  // ROI
  x = ''
  y = ''
  w = ''
  h = ''
  flag: boolean;
  rect = "r"
  index = 0
  startX = 0
  startY = 0;
  scrollLeft = 0;
  scrollTop = 0;
  x1 = 0
  y1 = 0
  h1 = 0
  w1 = 0
  threshold = 0;
  Widthtimes: any;
  Heighttimes: any;
  Zoomratio:any

  // roi 选取反馈
  canvasError:string;
  // 直播按钮状态控制
  isReceiveLive:Boolean = false;


  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    private socketService: SocketService,
  ) {
  }


  ngOnInit() {

    /* 给一个浏览器一个固定的值作为device_id */
    localStorage['browser_device_id'] = localStorage.getItem('browser_device_id') || Date.now()
    this.browser_device_id = localStorage['browser_device_id']
    // this.requestId = localStorage['browser_device_id']+'_'+ Date.now()

    this.socketService.cmdRegister({ 'deviceId': localStorage['browser_device_id'], 'type': 'browser' })
    this.socketService.receiveCmd((res) => {
      console.log('receive data:', res)
      if (res.preview) {
        this.receivePreview = res.preview;
      }

      if (!res.param) {
        this.mome_res = JSON.stringify(res)
      }
      
      if (res.live) {
        console.log(res.live)
        let stream = this.requestId;
        let myapp = 'live'
        let name =  myapp+'/'+stream+ '.flv'
        let url = `https://live.siiva.com/${name}`
        console.log(url)
        this.playVideo(url);
      }

      if (res.param && res.param.action == 'heartbeat') {
        // 收到mome_u的状态更新
        let listHasThis = false
        for (let i = 0; i < this.DeviceStatusList.length; i++) {
          if (this.DeviceStatusList[i].device_id == res.deviceId) {
            listHasThis = true
            let temp = this.DeviceStatusList[i]
            temp['app_name'] = res.param.app_name
            temp['app_version'] = res.param.app_version
            temp['device_name'] = res.param.device_name
            temp['free_disk'] = res.param.free_disk
            temp['is_charging'] = res.param.is_charging
            temp['power'] = res.param.power
            temp['temperature'] = res.param.temperature
            // temp['timestamp'] = new Date(res.param.timestamp).getTime()
            temp['timestamp'] = res.param.timestamp
            temp['ttl'] = res.param.ttl
            // temp['device_id'] = res.param.device_id
            this.DeviceStatusList.splice(i, 1, temp);
          }
        }
        if (!listHasThis) {
          // 原来的list里没有这个device的状态

          // let temp = {}
          // temp['app_name'] = res.param.app_name
          // temp['app_version'] = res.param.app_version
          // temp['device_name'] = res.param.device_name
          // temp['free_disk'] = res.param.free_disk
          // temp['isCharging'] = res.param.is_charging
          // temp['power'] = res.param.power
          // temp['temperature'] = res.param.temperature
          // temp['timestamp'] = new Date(res.param.timestamp).getTime()
          // temp['ttl'] = res.param.ttl
          // temp['device_id'] = res.param.device_id
          // this.DeviceStatusList.push(temp)

        }

      }


    })

    this.getCompanyList()

    this.getDeviceStatus()
    // setInterval(() => {
    //   this.getDeviceStatus()
    // }, 60000);

    /*
    // var statusClient = new DeviceServiceClient.statusPromiseClient('http://101.37.151.52:10000', null, null);
    var statusClient1 = new statusClient('http://101.37.151.52:12345', null, null);
    // var metadata = {'activity_ids': '1541732870qz', 'device_ids': '8840B811'};
    var metadata = {'activity_ids': ['1541732870qz', '1541382418']};
    console.log(statusClient1)
    var myrequest = new GetDeviceStatusRequest();
    var call = statusClient1.getDeviceStatus(myrequest, metadata, function (err, response) {
      console.log('response:', response);
      if (err) {
        console.log('err:', err);
        console.log('code:', err.code);
        console.log('msg:', err.message);
      } else {
        console.log('response:', response);
      }
    });
  
    // call.on('status', function (status) {
    //   console.log('status:', status);
    //   console.log('status.code:', status.code);
    //   console.log('status.details:', status.details);
    //   console.log('status.metadata:', status.metadata);
    // });
    */


  }

  /*获取用户列表*/
  // async getUserList() {
  //   this.http.get(environment.apiServerData + '/user/list').subscribe((data: any) => {
  //     this.userList = data;
  //     this.userList.unshift({'phone': '全部', 'user_id': ''});
  //     this.getActivityList()
  //   })
  // }

  /*用户选择 */
  // onUserSelected() {
  //   for (let i = 0; i < this.userList.length; i++) {
  //     if (this.userList[i].phone === this.selPhone)
  //       this.selUserId = this.userList[i].user_id
  //   }
  //   localStorage['selUserId'] = this.selUserId;
  //   localStorage['selPhone'] = this.selPhone;
  //   this.getActivityList();
  //   this.selActivityId = this.activityList[0].activity_id;
  //   this.selActivity = this.activityList[0].activity_name;
  // }


  /* 获取公司列表*/
  async getCompanyList() {
    let res = await this.http.get(environment.apiServerData + '/company/list').toPromise()
    this.companyList = res;
    console.log('this.companyList:', this.companyList)
    this.companyList.unshift({ 'company_name': '全部', 'company_id': '' });
    this.getActivityList();

  }

  /* 公司选择 */
  onCompanySelected() {
    for (let i = 0; i < this.companyList.length; i++) {
      if (this.companyList[i].company_name === this.selCompany)
        this.selCompanyId = this.companyList[i].company_id
    }
    // localStorage['selCompanyId'] = this.selCompanyId;
    // localStorage['selCompany'] = this.selCompany;
    this.getActivityList();
  }

  /* 获取活动列表*/
  async getActivityList() {
    let res = await this.http.get(environment.apiServerData + '/activity/list?company_id=' + this.selCompanyId).toPromise()
    this.activityList = res;
    this.activityList.unshift({ 'activity_name': '全部', 'activity_id': '' });
    this.getDeviceStatus()
  }

  // 添加按钮绑定一或多个活动
  add() {
    // if(this.settingActivityList == ""){
    this.activy.push(this.DeviceStatusList[0])
    // }else{
    //   this.activy.push(this.settingActivityList[0])
    // } 
    // this.activy.push(this.settingActivityList[0])
    // localStorage.setItem('activities',JSON.stringify(this.activities));
    // this.activy = JSON.parse(localStorage.getItem('activities'));

    // console.log(this.mySelActivityId);

    console.log(this.activy)
    console.log(this.activityList[0])
  }

  /*活动选择*/
  onActivitySelected() {
    for (let i = 0; i < this.activityList.length; i++) {
      if (this.activityList[i].activity_name === this.selActivity)
        this.selActivityId = this.activityList[i].activity_id
    }
    localStorage['selActivityId'] = this.selActivityId;
    localStorage['selActivity'] = this.selActivity;
    this.getDeviceStatus();
  }

  async getDeviceStatus() {
    // this.http.get(environment.apiServerData + '/device/list?activity_ids=1541382418,1541732870qz').subscribe((data: any) => {
    // let res = await this.http.get(environment.apiServerData + '/device/list?company_id=' + this.selCompanyId + '&activity_id=' + this.selActivityId).toPromise()
    let res = await this.http.get(environment.apiServer + '/activity/mome_ubuntu_status?company_id=' + this.selCompanyId + '&activity_id=' + this.selActivityId).toPromise()
    this.DeviceStatusList = res;
    console.log('DeviceStatusList:', this.DeviceStatusList)

  }


  async makeMovie(device_id) {

    console.log('拍摄device_id:', device_id)
    let body = { "deviceId": device_id, "doTrigger": true }
    this.socketService.rebootDevice(body)

    // let activity = await this.http.get(environment.apiServerData + '/activity?camera_device_id='+device_id).toPromise();
    // if (activity){
    //
    //   let body = {
    //     // "deviceId": device_id,
    //     "deviceId": activity['activity_id'],
    //     "from": localStorage['browser_device_id'],
    //     "requestId": this.requestId,
    //     "param": {
    //       "action": "send_local_cloud"
    //     }
    //   }
    //   console.log('sent_body:', body)
    //   this.socketService.DeviceCMDEVENT(body, (res) => {
    //     console.log('cmd:' + res);
    //   })
    // } else {
    //   alert('未找到该设备绑定的活动')
    // }

  }

  reboot(device_id) {

    if (confirm("确定重启" + device_id + "?")) {
      console.log('重启device_id:', device_id)
      // let body = { "deviceId": device_id }
      // this.socketService.rebootDevice(body) // 过去borcast重启方式

      // 单个重启
      let singleBody = {
        "deviceId": device_id,
        "from": localStorage['browser_device_id'],
        "requestId": this.requestId,
        "param": {
          "action": "restart"
        }
      }
      this.socketService.DeviceCMDEVENT(singleBody, (res) => {
        console.log('cmd:' + res);
      })
    }

  }

  rebootvnc(device_id) {

    if (confirm("刷新" + device_id + "的vnc?")) {
      console.log('重启vnc, device_id:', device_id)
      // let body = { "deviceId": device_id }
      // this.socketService.rebootDevice(body) // 过去borcast重启方式

      // 单个重启
      let singleBody = {
        "deviceId": device_id,
        "from": localStorage['browser_device_id'],
        "requestId": this.requestId,
        "param": {
          "action": "restart_frpc"
        }
      }
      this.socketService.DeviceCMDEVENT(singleBody, (res) => {
        console.log('cmd:' + res);
      })
    }

  }

  getUpdateDescrip(timestamp) {

    let originalTime = new Date(timestamp)
    var now = (new Date()).getTime();
    if (now - originalTime.getTime() < 65000) {
      return '在线'
    }
    return '离线'

  }

  attent(activity_id, device_id, remove) {

    let url = remove ? environment.apiServer + '/device/update_attent?device_id=' + device_id + '&activity_id=' + activity_id + '&remove=1' : environment.apiServer + '/device/update_attent?device_id=' + device_id + '&activity_id=' + activity_id
    console.log('url:', url)
    this.http.get(url).subscribe((data: any) => {
      console.log('attent_res:', data)
      this.getDeviceStatus()
    })

  }

  chooseModel() {


    console.log('name:', this.myModel)
    // console.log('model:', this.myModel.model)
    // console.log('myModel:', this.myModel)
    // console.log('myModel:', JSON.stringify(this.myModel))


    this.mySelActs = []
    for (let i = 0; i < this.modelList.length; i++) {
      if (this.myModel == this.modelList[i].name) {
        this.myModel = this.modelList[i]
        this.myModelActions = this.modelList[i].actions
        return
      }
    }
  }

  /*时间戳转化日期格式*/
  add0(m) {
    return m < 10 ? '0' + m : m
  }

  format(timestamp) {
    var time = new Date(timestamp);
    var y = time.getFullYear();
    var m = time.getMonth() + 1;
    var d = time.getDate();
    var h = time.getHours();
    var mm = time.getMinutes();
    var s = time.getSeconds();
    return y + '-' + this.add0(m) + '-' + this.add0(d) + ' ' + this.add0(h) + ':' + this.add0(mm) + ':' + this.add0(s);
  }

  updataDeviceVersion(device_id) {

    console.log('升级:', device_id)
    if (confirm("确定升级" + device_id + "?")) {
      let body = {
        "deviceId": device_id,
        "from": localStorage['browser_device_id'],
        "requestId": this.requestId,
        "param": {
          "action": "upgrade"
        }
      }
      this.socketService.DeviceCMDEVENT(body, (res) => {
        console.log('cmd:' + res);
      })
    }
  }

  /* 清空闪退次数 */

  async clearCrash(device_id) {

    console.log('device_id:', device_id)
    let res = await this.http.get(environment.apiServerData + '/device/clear_crash?device_id=' + device_id).toPromise();
    console.log('res:', res)
    if (res['code'] == 0) {
      for (let i = 0; i < this.DeviceStatusList.length; i++) {
        if (this.DeviceStatusList[i].device_id == device_id) {
          this.DeviceStatusList[i].crash = 0
        }
      }
    } else {
      alert(res['info'])
    }

  }

  /* 点击设定 */
  async goSetting(device_id) {

    console.log('device_id:', device_id)

    this.account = ''
    this.passwd = ''
    this.url = ''
    this.uid = ''
    this.pwd = ''
    this.mark = ''
    this.param = ''
    this.myActivity = ''
    this.mySelActivityId = ''
    this.receivePreview = {}
    this.has_bind_activity_res = undefined
    this.activities = [];
    let res = await this.http.get(environment.apiServerData + '/activity?camera_device_id=' + device_id).toPromise();
    console.log('res:', res)

    if (!res['code']) {
      this.has_bind_activity_res = res;
    }
    console.log('this.has_bind_activity_res:', this.has_bind_activity_res)

    if (this.has_bind_activity_res) {
      // this.activy = this.has_bind_activity_res.activitys
      console.log('this.mySelActivityId:', this.mySelActivityId)
      this.activy =  this.has_bind_activity_res.activitys.map(activityItem => {
        // let { phone:account, code:passwd  } = activity.user_account;
        let { activity, user_account:{ phone:account, code:passwd} } = activityItem;
        // 初始化选择第一个活动
        console.log(activity,account, passwd )
        // let {activity_name} = activity;
        return {
          account,
          passwd,
          activity_name: '',
          DeviceStatusList: [activity],
        }
      })
      this.mark = this.has_bind_activity_res.mark;
      // for (let i = 0; i < this.has_bind_activity_res.activitys.length; i++) {
      //   this.activy[i].account = this.has_bind_activity_res.activitys[i].user_account.phone;
      //   this.activy[i].passwd = this.has_bind_activity_res.activitys[i].user_account.code;
      //   let arr = []
      //   arr.push(this.has_bind_activity_res.activitys[i].activity)
      //   console.log(arr)
      //   this.activy[i].DeviceStatusList = arr
      //   console.log(this.activy[i].DeviceStatusList)

      // }
      console.log('activy:', this.activy)


      this.myActivity = this.has_bind_activity_res.activity_name
      this.mySelActivityId = this.has_bind_activity_res.activity_id
      this.settingActivityList = [{ 'activity_id': this.mySelActivityId, 'activity_name': this.myActivity }];
      let userInfo = await this.http.get(environment.apiServerData + '/user_info?user_id=' + this.has_bind_activity_res.user_id).toPromise();
      console.log('userInfo:', userInfo)
      if (!userInfo['code']) {
        this.account = userInfo['phone']
      }

      for (let i = 0; i < this.has_bind_activity_res.settings.camera_setting.cameras.length; i++) {

        if (this.has_bind_activity_res.settings.camera_setting.cameras[i].deviceId == device_id) {
          this.position = this.has_bind_activity_res.settings.camera_setting.cameras[i].position
          this.deviceType = this.has_bind_activity_res.settings.camera_setting.cameras[i].video_source.source
          this.url = this.has_bind_activity_res.settings.camera_setting.cameras[i].video_source.url
          this.port = this.has_bind_activity_res.settings.camera_setting.cameras[i].video_source.port
          this.uid = this.has_bind_activity_res.settings.camera_setting.cameras[i].video_source.uid
          this.pwd = this.has_bind_activity_res.settings.camera_setting.cameras[i].video_source.pwd
          let roi = this.has_bind_activity_res.settings.camera_setting.cameras[i].video_source.roi
          if(roi){
            this.x1 = roi.x
            this.y1 = roi.y
            this.h1 = roi.h
            this.w1 = roi.w
            this.threshold = roi.threshold
          }
          // let originUrl = this.has_bind_activity_res.settings.camera_setting.cameras[i].video_source.url
          // this.uid = originUrl.split('//')[1].split(':')[0]
          // this.pwd = originUrl.split(':')[2].split('@')[0]
          // this.url = originUrl.split('//')[0] + '//' + originUrl.split('@')[1]

          // for (let j = 0; j < this.modelList.length; j++) {
          // if (this.has_bind_activity_res.settings.camera_setting.cameras[i].trigger_type.model.model_name == this.modelList[j].model) {
          //   this.myModel = this.modelList[j].name
          // }
          // }

          // console.log('this.position:', this.position)
          // console.log('this.deviceType:', this.deviceType)
          // console.log('this.model:', this.myModel)
          // console.log('this.url:', this.url)
          // console.log('this.uid:', this.uid)
          // console.log('this.pwd:', this.pwd)

        }
      }
    }

    this.settingDeviceId = device_id;
    this.receivePreview = {}
    this.mome_res = ''
    this.selDeviceId = device_id
    this.isshowSetting = false;
    this.isONsuccess = true;

  }


  changeDeviceType() {
    console.log('device.type:', this.deviceType)
  }

  chooseActivity(j) {
    console.log(j);

    for (let i = 0; i < this.activityList.length; i++) {
      if (this.activityList[i].activity_name == this.activy[j].activity_name) {
        this.mySelActivityId = this.activityList[i].activity_id
        this.activy[j].activity_id = this.mySelActivityId
      }
    }
    localStorage.setItem('DeviceStatusList', JSON.stringify(this.DeviceStatusList));
    this.DeviceStatusList = JSON.parse(localStorage.getItem('DeviceStatusList'))
    console.log('this.mySelActivityId:', this.mySelActivityId)
    console.log(this.activy);
  }

  /* 选择识别动作 */
  chooseAction(act) {
    console.log('act:', act)
    let flag = false
    for (let i = 0; i < this.mySelActs.length; i++) {
      if (act == this.mySelActs[i]) {
        this.mySelActs.splice(i, 1)
        flag = true
        break
      }
    }
    if (!flag) {
      this.mySelActs.push(act)
    }
    console.log('this.mySelActs:', this.mySelActs)


  }
  getNaturalWidth(img) {
    var image = new Image()
    image.src = img.src
    var naturalWidth = image.width
    return naturalWidth
  }
  getNaturalHeight(img) {
    var image = new Image()
    image.src = img.src
    var naturalHeight = image.height
    return naturalHeight
  }
  /* 预览 */
  preview() {

    var img = document.getElementsByTagName('img')[0]
    console.log(img)
    
    this.Widthtimes = this.getNaturalWidth(img) / 400
    this.Heighttimes = this.getNaturalHeight(img) / this.Widthtimes
    console.log(this.Widthtimes, this.Heighttimes)

    var canvas = document.getElementById("canvas-content");
    canvas.style.width = "400px";
    canvas.style.height = this.Heighttimes + "px"

    // 点击预览, 重新注册一次socket, 在设定页面停留时间长, 会断掉
    this.socketService.cmdRegister({ 'deviceId': localStorage['browser_device_id'], 'type': 'browser' })

    this.requestId = this.requestId || localStorage['browser_device_id'] + '_' + Date.now()
    this.receivePreview = {}
    if (this.deviceType == 'ipc') {
      this.param = 'rtsp://' + this.uid + ':' + this.pwd + '@' + this.url + ':' + this.port
      if (!this.url) {
        alert('URL不能为空')
      }
      let body = {
        "deviceId": this.selDeviceId,
        "from": localStorage['browser_device_id'],
        "requestId": this.requestId,
        "param": {
          // "who": localStorage['browser_device_id'],
          "action": "get_preview",
          // "url": 'rtsp://'+this.uid+':'+this.pwd+'@'+this.url+':'+this.port
          "source": "ipc",
          "url": this.url,
          "port": this.port,
          "uid": this.uid,
          "pwd": this.pwd
        }
      }
      console.log('body:', body)
      this.mome_res = '等待'
      this.socketService.DeviceCMDEVENT(body, (res) => {
        console.log('cmd:' + res);
      })

    }

    if (this.deviceType == 'cam') {
      let body = {
        "deviceId": this.selDeviceId,
        "from": localStorage['browser_device_id'],
        "requestId": this.requestId,
        "param": {
          "action": "get_preview",
          "source": "cam",
          "cam_place": "backcam"
        }
      }
      console.log('body:', body)
      this.mome_res = '等待'
      this.socketService.DeviceCMDEVENT(body, (res) => {
        console.log('cmd:' + res);
      })
    }
    if (this.deviceType == 'uvc') {
      let body = {
        "deviceId": this.selDeviceId,
        "from": localStorage['browser_device_id'],
        "requestId": this.requestId,
        "param": {
          "action": "get_preview",
          "source": "uvc",
          "cam_place": "uvc"
        }
      }
      console.log('body:', body)
      this.mome_res = '等待'
      this.socketService.DeviceCMDEVENT(body, (res) => {
        console.log('cmd:' + res);
      })
    }

  }

  /* 套用 */
  sendParam() {

    // 点击套用, 重新注册一次socket, 在设定页面停留时间长, 会断掉
    this.socketService.cmdRegister({ 'deviceId': localStorage['browser_device_id'], 'type': 'browser' })

    for (let i = 0; i < this.activy.length; i++) {
      if (this.activy[i].account.length == 0) {
        alert('请输入用账号')
        return
      }
      if (this.activy[i].passwd.length == 0) {
        alert('请输入密码')
        return
      }

    }

    if (this.mySelActivityId.length == 0) {
      alert('请选择活动')
      return
    }
    // if (this.myModelActions.length == 0) {
    //   alert('请选择辨识动作')
    //   return
    // }

    this.requestId = localStorage['browser_device_id'] + '_' + Date.now()

    let activity_name = ''
    let activity_type = 'moment'
    for (let i = 0; i < this.activityList.length; i++) {
      if (this.activityList[i].activity_id === this.mySelActivityId) {
        activity_name = this.activityList[i].activity_name
        activity_type = this.activityList[i].type
      }
    }


    let video_source = {
      "source": this.deviceType,
      // "position": this.position,
    }
    if (this.deviceType == "ipc") {

      if (!this.url) {
        alert('url不能为空')
      }

      video_source['url'] = this.url
      video_source['port'] = this.port
      video_source['uid'] = this.uid
      video_source['pwd'] = this.pwd
      // roi 临时放在这里
      let roi = {
        "x": this.x1,
        "y": this.y1,
        "w": this.w1,
        "h": this.h1,
        "threshold": this.threshold
      }
      video_source['roi'] = roi

      this.param = 'rtsp://' + this.uid + ':' + this.pwd + '@' + this.url + ':' + this.port
      // let index = this.url.indexOf('//')
      // if (index < 0) {
      //   alert('url格式错误, 例: rtsp://192.168.1.114:554')
      // } else if (this.uid && this.pwd) {
      //   video_source['url'] = this.url.split('//')[0] + '//' + this.uid + ':' + this.pwd + '@' + this.url.split('//')[1]
      // }
    }

    let multiCount = []

    for (let i = 0; i < this.activy.length; i++) {
      let temp = {
        "activity_id": this.activy[i].activity_id,
        "account": {
          "type": "phone",
          "phone": this.activy[i].account,
          "code": this.activy[i].passwd,
        }
      }
      multiCount.push(temp)
    }


    let data = {
      "deviceId": this.selDeviceId,
      "from": localStorage['browser_device_id'],
      "requestId": this.requestId,
      "param": {
        "action": "setup",
        "account": {
          "type": "phone",
          "phone": this.activy[0].account,
          "code": this.activy[0].passwd
        },
        "activity": {
          "activity_id": this.mySelActivityId
          // "activity_name": activity_name,
          // "type": activity_type
        },
        "activitys": multiCount,//保存所有活动id的数组, 去掉了部分不需要的字段
        "mark": this.mark,
        "video_source": video_source,
        // "recognition": {
        //   "model": this.myModel.model,
        //   "model_url": "url of model",
        //   "version": "version of model",
        //   "recognition_type": this.mySelActs
        // },
        "recognition": {
          "model_name": 'model name',
          "model_url": "url of model",
          "version": "version of model",
          "recognition_type": [],
          "roi": {
            "x": this.x1,
            "y": this.y1,
            "w": this.w1,
            "h": this.h1,
            "threshold": this.threshold
          }
        },
        "record": {
          // "time_before": '',
          // "time_after": ''
          "time_before": 0,
          "duration": 0,
          // "len": "", // 长度
          // "next": "", // 触发后8s(暂时用不上)
          // "order": "", // 序列(暂时用不上)
          // "prev": "", // 触发前2s
          "wait": 0 // 等待长度

        }

      }
    }

    console.log('param:', data)

    this.mome_res = '等待'
    this.socketService.DeviceCMDEVENT(data, (res) => {
      console.log('cmd:' + res);
    })


  }

  /* 确认 */
  makeSureSetup() {
    this.sendParam()
    this.isshowSetting = true;
  }

  /* 发送 */
  async testMakesureSetup() {

    // 点击发送, 重新注册一次socket, 在设定页面停留时间长, 会断掉
    this.socketService.cmdRegister({ 'deviceId': localStorage['browser_device_id'], 'type': 'browser' })
    let data = JSON.parse(this.param)
    console.log('data:', data)
    this.mome_res = '等待'
    this.socketService.DeviceCMDEVENT(data, (res) => {
      console.log('cmd:' + res);
    })

  }

  /* 设定界面登录 */
  async login(i) {
    console.log(i);
    let body = { "phone": this.activy[i].account, "passwd": this.activy[i].passwd }
    console.log(this.activy);
    console.log(body);
    console.log(this.activy[i].passwd)
    let res = await this.http.post(environment.apiServerData + '/login_get_user_id', body).toPromise();
    console.log('res:', res)
    if (res["user_id"]) {
      this.isONsuccess = false;
      this.settingUserId = res["user_id"]
      this.settingProjectId = res["project_id"]
      this.getSettingActivityList(i)
    } else {
      alert('账号或密码错误')
    }
    console.log(this.activy[i].settingActivityList)
  }

  /* 关闭 */
  shut() {
    this.isshowSetting = true;
    this.activy = [];
  }

  /* 退出 */
  async logout() {
    // this.isshowSetting = true;
    let res = await this.http.get(environment.apiServer + '/activity/fire_device?deviceId=' + this.settingDeviceId).toPromise();
    console.log('res:', res)
    this.goSetting(this.settingDeviceId)

  }

  async getSettingActivityList(i) {
    // let res = await this.http.get(environment.apiServerData + '/activity/list?user_id=' + this.settingUserId).toPromise();
    let res
    if(this.settingProjectId !== ''){
      res = await this.http.get(environment.apiServerData + '/activity/list?project_id=' + this.settingProjectId).toPromise()
    }else {
      res = await this.http.get(environment.apiServerData + '/activity/list?user_id=' + this.settingUserId).toPromise();
    }
    console.log('res:', res)
    this.DeviceStatusList = res;
    localStorage.setItem('settingActivityList', JSON.stringify(this.settingActivityList));
    this.activy[i].DeviceStatusList = res
    // if (this.DeviceStatusList.length > 0) {
    //   this.mySelActivityId = this.DeviceStatusList[0].activity_id
    // }
  }

  // ROI部分
  getCrossBrowserElement(mouseEvent) {
    var result = {
      x: 0,
      y: 0,
      relativeX: 0,
      relativeY: 0,
      currentDomId: ""
    };

    if (!mouseEvent) {
      mouseEvent = window.event;
    }

    if (mouseEvent.pageX || mouseEvent.pageY) {
      result.x = mouseEvent.pageX;
      result.y = mouseEvent.pageY;
    }
    else if (mouseEvent.clientX || mouseEvent.clientY) {
      result.x = mouseEvent.clientX + document.body.scrollLeft +
        document.documentElement.scrollLeft;
      result.y = mouseEvent.clientY + document.body.scrollTop +
        document.documentElement.scrollTop;
    }
    result.relativeX = result.x;
    result.relativeY = result.y;
    if (mouseEvent.target) {
      var offEl = mouseEvent.target;
      var offX = 0;
      var offY = 0;
      if (typeof (offEl.offsetParent) != "undefined") {
        while (offEl) {
          offX += offEl.offsetLeft;
          offY += offEl.offsetTop;
          offEl = offEl.offsetParent;
        }
      }
      else {
        offX = offEl.x;
        offY = offEl.y;
      }
      result.relativeX -= offX;
      result.relativeY -= offY;
    }
    result.currentDomId = mouseEvent.target.id;
    console.log(result)
    return result;
  }


  mousedown(event) {
    if (this.index > 0) {
      document.getElementById("canvas-container").removeChild(this.$(this.rect + this.index));
    }
    let imgLength = document.getElementsByTagName('img').length
    let tempNode = imgLength=== 0 ? document.getElementsByTagName('video') : document.getElementsByTagName('img')
    console.log(tempNode, imgLength)
    this.canvasError = '';
    if(tempNode.length === 0){
      this.canvasError = '请先加载预览图或者视频';
      return;
    }
    // var img = document.getElementsByTagName('img')[0]
    var img = tempNode[0]
    if(img.width === 0){
      this.canvasError = '请先加载预览图或者视频';
      return;
    }
    this.Widthtimes = img.width / 400
    this.Zoomratio = this.getNaturalWidth(img) / 400
    
    this.Heighttimes = img.height / this.Widthtimes
    // this.Widthtimes = this.getNaturalWidth(img) / 400
    // this.Heighttimes = this.getNaturalHeight(img) / this.Widthtimes
    console.log(this.Widthtimes, this.Heighttimes)
    var canvas = document.getElementById("canvas-content");
    canvas.style.width = "400px";
    canvas.style.height = this.Heighttimes + "px" 
    this.flag = true;
    console.log(this.Widthtimes, this.getCrossBrowserElement(event).relativeX, this.getCrossBrowserElement(event).relativeX * this.Widthtimes)
    this.x1 = this.getCrossBrowserElement(event).relativeX * this.Zoomratio
    this.y1 = this.getCrossBrowserElement(event).relativeY * this.Zoomratio
    
    try {
      this.scrollTop = this.getCrossBrowserElement(event).y
      this.scrollLeft = this.getCrossBrowserElement(event).x
      this.x = this.getCrossBrowserElement(event).relativeX + "px";
      this.y = this.getCrossBrowserElement(event).relativeY + "px";
      
      this.index++
      var div = document.createElement("div");
      div.style.position = "absolute";
      div.style.left = "0";
      div.style.top = "0";
      div.id = this.rect + this.index;
      div.style.marginLeft = this.x + "px";
      div.style.marginTop = this.y + "px";
      div.style.border = "1px dashed red";
      document.getElementById("canvas-container").appendChild(div);

    } catch (e) {
      alert(e);
    }
  }

  mousemove(event) {
    if (this.flag == true) {
      try {
        this.w = (this.getCrossBrowserElement(event).x - this.scrollLeft) + "px"
        this.h = (this.getCrossBrowserElement(event).y - this.scrollTop) + "px";
        this.$(this.rect + this.index).style.marginLeft = this.x;
        this.$(this.rect + this.index).style.marginTop = this.y;
        this.$(this.rect + this.index).style.position = "absolute";
        this.$(this.rect + this.index).style.left = "0";
        this.$(this.rect + this.index).style.top = "0";
        this.$(this.rect + this.index).style.border = "1px dashed red";
        this.$(this.rect + this.index).style.width = this.w;
        this.$(this.rect + this.index).style.height = this.h;
        console.log(this.x, this.y)
      } catch (e) {
        alert(e)
      }
    }
  }

  mouseup() {
    this.flag = false;
    try {
      var div = document.createElement("div")
      div.style.position = "absolute";
      div.style.left = "0";
      div.style.top = "0";
      div.style.marginLeft = this.x
      div.style.marginTop = this.y;
      div.style.width = this.w;
      div.style.height = this.h;
      div.style.border = "1px dashed red";
      document.getElementById("canvas-container").appendChild(div)
      this.h1 = (this.getCrossBrowserElement(event).y - this.scrollTop) * this.Zoomratio
      this.w1 = (this.getCrossBrowserElement(event).x - this.scrollLeft) * this.Zoomratio
      document.getElementById("canvas-container").removeChild(div);
    } catch (e) {
      alert(e)
    }
  }

  $(id) {
    return document.getElementById(id)
  }
    
  playVideo(url) {
    if (flvjs.isSupported()) {
      console.log('开始直播');
      console.log(url);
      var videoElement = <HTMLMediaElement> document.getElementById('videoElement');
      var flvPlayer = flvjs.createPlayer({
          type: 'flv',
        isLive: true,       // 开启直播
        hasAudio: false,    // 关闭声音
        cors: true,         // 开启跨域访问
      
          // url: 'http://localhost:8000/live/STREAM_NAME.flv'
          url: url
      });
        flvPlayer.attachMediaElement(videoElement);
        flvPlayer.load();
        flvPlayer.play();
    }
  }

  
  /* 实时显示 */
  live() {
    this.isReceiveLive = true
    // 点击直播, 重新注册一次socket, 在设定页面停留时间长, 会断掉
    this.socketService.cmdRegister({'deviceId': localStorage['browser_device_id'], 'type': 'browser', 'project_id':localStorage.getItem('project_id')})
    this.requestId = this.requestId || localStorage['browser_device_id'] + '_' + Date.now()
    // this.isReceiveLive = true;
    if (this.deviceType == 'ipc') {
      // this.param = 'rtsp://' + this.uid + ':' + this.pwd + '@' + this.url + ':' + this.port
      // if (!this.url) {
      //   alert('URL不能为空')
      // }
      let body = {
        "deviceId": this.selDeviceId,
        "from": localStorage['browser_device_id'],
        "requestId": this.requestId,
        "param": {
          // "who": localStorage['browser_device_id'],
          "action": "get_live",
          "source": "ipc",
          "myapp": "live",
          "stream": this.requestId,
          "subtype": this.subtype,
          "channel": 'ch1',
          "codec": 'h264',
          "url": this.url,
          "port": this.port,
          "uid": this.uid,
          "pwd": this.pwd,
          "portDes": '1935',
          "portRes": '8080'
        }
      }
      console.log('body:', body)
      this.mome_res = '等待'
      this.socketService.DeviceCMDEVENT(body, (res) => {
        let url = res;
        console.log('cmd:' + res);
      })
    }
    if (this.deviceType == 'cam') {
      let body = {
        "deviceId": this.selDeviceId,
        "from": localStorage['browser_device_id'],
        "requestId": this.requestId,
        "param": {
          "action": "get_live",
          "source": "cam",
          "cam_place": "backcam",
          "stream": this.requestId,
        }
      }
      console.log('body:', body)
      this.mome_res = '等待'
      this.socketService.DeviceCMDEVENT(body, (res) => {
        console.log('cmd:' + res);
      })
    }
    if (this.deviceType == 'uvc') {
      let body = {
        "deviceId": this.selDeviceId,
        "from": localStorage['browser_device_id'],
        "requestId": this.requestId,
        "param": {
          "action": "get_live",
          "app": 'myapp',
          "stream": this.requestId,
          "source": "uvc",
          "cam_place": "uvc"
        }
      }
      console.log('body:', body)
      this.mome_res = '等待'
      this.socketService.DeviceCMDEVENT(body, (res) => {
      })
    }

  }
  live_stop() {
    this.isReceiveLive = false
    
    let body = {
      "deviceId": this.selDeviceId,
      "from": localStorage['browser_device_id'],
      "requestId": this.requestId,
      "param": {
        "action": "stop_live",
      }
    }
    this.socketService.DeviceCMDEVENT(body, (res) => {
      console.log(res.live)
    })
  }
}
