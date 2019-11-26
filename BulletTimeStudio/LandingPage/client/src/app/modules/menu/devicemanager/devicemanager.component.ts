import { Component, OnInit } from '@angular/core';
import { SocketService } from '../../../shared/socket.service';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { FormBuilder  } from '@angular/forms'
import { Buffer} from 'buffer'
import flvjs from 'flv.js';

import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-devicemanager',
  templateUrl: './devicemanager.component.html',
  styleUrls: ['./devicemanager.component.css']
})
export class DevicemanagerComponent implements OnInit {



  shutterList:Array<string>=[
    '1/1', '1/2', '1/3', '1/6',
'1/12', '1/25', '1/50', '1/75', '1/100', '1/120', '1/125', '1/150', '1/175', '1/215', '1/225', '1/300', '1/400', '1/425',
'1/600', '1/1000', '1/1250', '1/1750', '1/2500', '1/3500', '1/6000', '1/10000'
  ]
  activityList:any;
  selActivity:any;
  selActivityId:string;
  DeviceStatusList:Array<object>=[{
    account: '',
    password: ''
  }];
  user_id:any;
  porjectList:any;
  selProjectId:any;
  deviceType:string = 'ipc';
  /* 收到cmd的数据 */
  receivePreview = '';
  deviceTypeName='';
  
  isReceiveLive:Boolean = false;
  /* 本次套用请求的requestId */
  requestId = '';
  
  param: string;
  
  // /* 设备设定ipc的url */
  // url: String;
  
  // /* 设备设定ipc的port */
  // port: number;
  // /* 设备设定ipc的uid */
  // uid: string;
  // /* 设备设定ipc的pwd */
  // pwd: string;
  /* 设定页面的mome的cmd响应 */
  mome_res: any;
  selDeviceId: string;
  account:string;
  passwd:string;
  subtype: string = 'sub';
  
  
  /* 设备设定deviceId */
  settingDeviceId = ''
  // 动态添加的活动列表
  activy:any;
  
  /* 设备设定的绑定活动的activity_id */
  mySelActivityId = '';
  
  /* 设备设定摄像头种类, 手机或者IPC */
  mark = "";

  
  /* 设定页面的登录user_id */
  settingUserId = ''
  
  /*给设定界面用的活动列表, 不含'全部'*/
  settingActivityList: any;

  // manageForm:{camera:string};
  videoElement: HTMLMediaElement;
  flvPlayer:any;
  browser_device_id:string;
  ipcBaseForm = this.fb.group({
    url:'',
    port: '',
    uid: '',
    pwd: ''
  });
  // ipcLiveForm = this.fb.group({
  //   portDes: '',
  //   portRes: '',
  //   myapp: '',
  //   stream: '',
  //   codec: '',
  //   channel: '',
  //   subtype: ''
  // });
  ipcLiveForm = {
    'value': {

      "myapp": "live",
      "stream": this.requestId || localStorage['browser_device_id'] + '_' + Date.now(),
      "subtype": 'sub',
      "channel": 'ch1',
      "codec": 'h264',
      "portDes": '1935',
      "portRes": '8080',
    }
  }
  ipcShutterForm = this.fb.group({
    method: 'get',
    path: '/',
    ShutterLevel: '',
    maxShutterLevelLimit: '',
    minShutterLevelLimit: '',
  })
  // ipcSetForm = this.fb.group({
  //   method: '',
  //   path: '',
  //   params: '',
  //   focus: '',
  //   ShutterLevel: '',
  //   maxShutterLevelLimit: '',
  //   minShutterLevelLimit: '',
  //   codeRate: '',
  //   FPs: '',
  // })
  ipcSetForm = {
    value: {

      method: 'get',
      path: '/ISAPI/Image/channels/1/color/day',
    }
  }

  // 界面错误显示
  temp_showdevcam: string;

  constructor(private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private socketService: SocketService,
    private sanitizer: DomSanitizer,
    private fb: FormBuilder
  ) { 
  }

  ngOnInit() {
    // let url = 'http://47.99.102.107:8001/live/test.flv'
    // this.playVideo(url)
    this.user_id=localStorage['user_id']
    this.selDeviceId=localStorage['deviceId']
    
    this.settingDeviceId = this.selDeviceId;
    // 取得该账号下活动列表
    this.activityList=JSON.parse(localStorage.getItem('activitylist')) 
    console.log(this.activityList)
    this.getProjectList()
    this.browser_device_id=localStorage['browser_device_id'];
    this.socketService.cmdRegister({'deviceId': localStorage['browser_device_id'], 'type': 'browser', 'project_id':localStorage.getItem('project_id')})
    this.socketService.receiveCmd((res) => {
      console.log('receive data:', res)
      if (res.preview) {
        this.receivePreview = res.preview;
        console.log(res.preview)
      }
      if (res.live) {
        console.log(res.live)
        let {stream, myapp} = this.ipcLiveForm.value
        
        let name =  myapp+'/'+stream+ '.flv'
        let url = `https://live.siiva.com/${name}`
        console.log(url)
        this.playVideo(url);
      }
      if (res.devCam) {
        console.log(res.devCam)
        this.temp_showdevcam = res.devCam;

      }
      if (!res.param) {
        this.mome_res = JSON.stringify(res)
      }
      if (res.param && res.param.action == 'heartbeat') {
        // 收到mome_u的状态更新
        let listHasThis = false
        for (let i = 0; i < this.DeviceStatusList.length; i++) {
          if (this.DeviceStatusList[i]['device_id'] == res.deviceId) {
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


    // var url = 'http://192.168.1.104:80/live?port=1935&app=myapp&stream=1557144123095_1558925314551'
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
  changeDeviceType() {
    console.log('device.type:', this.deviceType)
  }

  async getDeviceStatus() {
    // this.http.get(environment.apiServerData + '/device/list?activity_ids=1541382418,1541732870qz').subscribe((data: any) => {
    // let res = await this.http.get(environment.apiServerData + '/device/list?company_id=' + this.user_id + '&activity_id=' + this.selActivityId).toPromise()
    let res = await this.http.get(environment.apiServer + '/activity/mome_ubuntu_status?company_id=' + this.user_id + '&activity_id=' + this.selActivityId).toPromise().catch(err => console.log(err))
    this.DeviceStatusList =<Array<Object>> res;
    console.log('DeviceStatusList:', this.DeviceStatusList)

  }
  /* 预览 */
  preview() {
    // 点击预览, 重新注册一次socket, 在设定页面停留时间长, 会断掉
    this.socketService.cmdRegister({'deviceId': localStorage['browser_device_id'], 'type': 'browser', 'project_id':localStorage.getItem('project_id') })

    this.requestId = this.requestId || localStorage['browser_device_id'] + '_' + Date.now()
    this.receivePreview = ''
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
          "action": "get_preview",
          // "url": 'rtsp://'+this.uid+':'+this.pwd+'@'+this.url+':'+this.port
          "source": "ipc",
          ...this.ipcBaseForm.value
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
          ...this.ipcLiveForm.value,
          ...this.ipcBaseForm.value,
          'subtype': this.subtype,
          // ...this.ipcLiveForm.value,
          // "url": 'rtsp://'+this.uid+':'+this.pwd+'@'+this.url+':'+this.port
          // "myapp": this.myapp,
          // "stream": this.stream,
          // "url": this.url,
          // "port": this.port,
          // "uid": this.uid,
          // "pwd": this.pwd,
          // "portDes": this.portDes,
          // "portRes": this.portRes
        }
      }
      console.log('body:', body)
      
      this.mome_res = '等待'
      this.socketService.DeviceCMDEVENT(body, (res) => {
        let url = res;
        console.log('cmd:' + res);
        // this.playVideo(url)
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
        console.log(res.live)
        // this.playVideo(res.live);
        // var url = 'http://'+res.url+':'+res.port1+'/live?port='+res.port2+'&myapp='+res.myapp+'&stream='+res.stream

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
  /* 套用 */
  sendParam() {
    // 点击套用, 重新注册一次socket, 在设定页面停留时间长, 会断掉
    this.socketService.cmdRegister({'deviceId': localStorage['browser_device_id'], 'type': 'browser', 'project_id':localStorage.getItem('project_id')})
    // if (this.myModelActions.length == 0) {
    //   alert('请选择辨识动作')
    //   return
    // }
    this.requestId = localStorage['browser_device_id'] + '_' + Date.now()
    let video_source = {
      "source": this.deviceType,
      // "position": this.position,
    }
    if (this.deviceType == "ipc") {
      video_source = {
        ...video_source,
        ...this.ipcBaseForm.value,
        ...this.ipcLiveForm.value,
        ...this.ipcSetForm.value,
      }
    }
    
    let acc = localStorage.getItem('acc');
    let newpwd = localStorage.getItem('pwd');
    let pwd = (Buffer.from(newpwd, 'base64')).toString('ascii');
    // let activityL = this.activityList.map(item => item.activity_id)
    let multiCount = []
      let temp = {
        "activity_id": this.selActivityId,
        "account": {
          "type": "phone",
          "phone": acc,
          "code": pwd,
        }
      }
      multiCount.push(temp)
    let data = {
      "deviceId": this.selDeviceId,
      "from": localStorage['browser_device_id'],
      "requestId": this.requestId,
      "param": {
        "action": "setup",
        "account": {
          "type": "phone",
          "phone": acc,
          "code": pwd
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
          "recognition_type": []
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
  
  
  async getSettingActivityList(i) {
    let res = await this.http.get(environment.apiServer + '/activity/list?user_id=' + this.settingUserId).toPromise();
    console.log('res:', res)
    this.DeviceStatusList = <Array<Object>> res;
    localStorage.setItem('settingActivityList', JSON.stringify(this.settingActivityList));
    this.activy[i].DeviceStatusList = res
    // if (this.DeviceStatusList.length > 0) {
    //   this.mySelActivityId = this.DeviceStatusList[0].activity_id
    // }
  }
  
  // /* 获取活动列表*/
  // async getActivityList() {
  //   let res = await this.http.get(environment.apiServer + '/activity/list?company_id=' + this.user_id).toPromise()
  //   this.activityList = res;
  //   this.activityList.unshift({'activity_name': '全部', 'activity_id': ''});
  //   this.getDeviceStatus()
  // }

  changedManufacturer(){
    this.deviceTypeName === 'hikvision'
  }

  changeCamtype(){
    this.http.get(environment.apiServer + '/activity?camera_device_id=' + this.selDeviceId).subscribe(
      res => {
        if(res && res['activity_id']){

          this.selActivity = res['activity_id']
          this.ipcBaseForm.patchValue({...res['settings'].camera_setting.cameras[0].video_source})
          // this.ipcSetForm.patchValue({...res['settings'].camera_setting.cameras[0].video_source})
          // this.ipcLiveForm.patchValue({...res['settings'].camera_setting.cameras[0].video_source})
        }
      }
    );
  }
   /* 获取项目列表*/
   getProjectList() {
    this.http.get(environment.apiServer + '/project/list?user_id=' + this.user_id).subscribe(res => {
        this.porjectList = res;
        console.log(res)
        this.selProjectId = res[0].project_id
        console.log(this.selProjectId)
        this.getActivityList();
    });
}
  /* 获取活动列表*/
  getActivityList() {
    this.http.get(environment.apiServer + '/activity/list?project_id=' + this.selProjectId).subscribe(
        res => {
            this.selActivityId = res[0] && res[0].activity_id
            console.log(this.selActivityId)
            this.activityList = res;
            this.getSetting();
        }
    );
    
}
getSetting() {
  this.http.get(environment.apiServer + '/activity?camera_device_id=' + this.selDeviceId).subscribe(
    res => {
      if(res && res['activity_id']){
        this.selActivity = res['activity_id']
        this.ipcBaseForm.patchValue({...res['settings'].camera_setting.cameras[0].video_source})
        // this.ipcSetForm.patchValue({...res['settings'].camera_setting.cameras[0].video_source})
        // this.ipcLiveForm.patchValue({...res['settings'].camera_setting.cameras[0].video_source})
      }
    }
  );
  // console.log(res)
}
createBody(action, params: object) {
  let body = {
    "deviceId": this.selDeviceId,
    "from": localStorage['browser_device_id'],
    "requestId": this.requestId,
    "param": {
      "action": action,
      ...params
    }
  }
  return body;
}
settingParam(method?, path?, params?) {
  console.log('settingParam')
  let bodyTemp = {
    ...this.ipcBaseForm.value,
    ...this.ipcSetForm.value
  }
  
  method ? bodyTemp['method'] = method : ''
  path ? bodyTemp['path'] = path : ''
  params ? bodyTemp['params'] = params : ''
  let body = this.createBody('devCam_config', bodyTemp)
  console.log(body)
  this.mome_res = '等待'
  this.socketService.DeviceCMDEVENT(body, (res) => {
    console.log(res)
  })
}
touchToShutter() {
  
  let {ShutterLevel, maxShutterLevelLimit,minShutterLevelLimit } = this.ipcShutterForm.value;
  console.log(ShutterLevel, maxShutterLevelLimit, minShutterLevelLimit)

  let params = {Shutter:{ShutterLevel:ShutterLevel,maxShutterLevelLimit:maxShutterLevelLimit, minShutterLevelLimit:minShutterLevelLimit}}
  this.settingParam('put', '/ISAPI/Image/channels/1/shutter', params)
  
}
// 获取ipc能力
getcapabilities() {
  let channel = 1
  let path = `/ISAPI/PTZCtrl/channels/${channel}/capabilities`
  this.settingParam('get', path, '')
}

touchToFocus() {
  let channel = 1
  let pan
  let tilt
  let zoom
  let patams = {
    PTZData: {
      pan: pan,
      tilt: tilt,
      zoom: zoom,
    }
  }
  let path = `/ISAPI/PTZCtrl/channels/${channel}/continuous`
  this.settingParam('put', path, patams)

}
touchToCodeRate() {
  let channel = 1
  let pan
  let tilt
  let zoom
  let patams = {
    PTZData: {
      pan: pan,
      tilt: tilt,
      zoom: zoom,
    }
  }
  let path = `/ISAPI/PTZCtrl/channels/${channel}/continuous`
  this.settingParam('put', path, patams)

}
touchToFPs() {
  let channel = 1
  let pan
  let tilt
  let zoom
  let patams = {
    PTZData: {
      pan: pan,
      tilt: tilt,
      zoom: zoom,
    }
  }
  let path = `/ISAPI/PTZCtrl/channels/${channel}/continuous`
  this.settingParam('put', path, patams)

}
  


  


}
