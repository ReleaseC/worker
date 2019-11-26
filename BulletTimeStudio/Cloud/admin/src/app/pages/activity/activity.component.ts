import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {SocketService} from '../common/socket.service';
import {UploadImageService} from '../share/upload-image.service';
import {initDomAdapter} from '@angular/platform-browser/src/browser';
import {ConstantPool} from '@angular/compiler/src/constant_pool';

@Component({
  selector: 'ngx-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss'],
})
export class ActivityComponent implements OnInit {
  /*公司过滤*/
  companyList: any;
  selCompany = '全部';
  selCompanyId = '';
  /* 所有活动 */
  activityList: any;


  isshow_SetupMonitor = false;
  isshow_Photo = false;
  time1: Date;
  time2: Date;
  time3: Date;
  time4: Date;
  weekday_times_begin: Date;
  weekday_times_end: Date;
  Simulate_time_begin: Date;
  Simulate_time_end: Date;
  interval = 60;

  /* 点击设定的activity_id */
  activity_id: '';

  /* 点击拍摄的activity_id */
  make_movie_activity_id: '';
  /* 设备拍摄的状态*/
  status = "离线";

  // time: any;

  ishow_set_activity: boolean = false;
  isshow_later_stage: boolean = false;
  isshow_homepage: boolean = true;
  deviceList = [];
  later_deviceList = [];
  later_deviceLists = [];//多组设备数组,即选项框
  later_device = [];
  collect_style: string = 'random';
  screen_style: string = 'vertical';
  trigger_style: string = 'manual_Trigger';
  /* 设备设定的辨识模型 */
  modelList = [{
    "name": "凯蒂猫",
    "model": "hello_kitty_home",
    "actions": [{"name": "握手", "act": "handshake"}, {"name": "比赞", "act": "thumb-up"}, {
      "name": "五指",
      "act": "hand-five"
    }, {"name": "有人", "act": "has_person"}]
  },
    {
      "name": "篮球",
      "model": "basketball",
      "actions": [{"name": "三分", "act": "three"}, {"name": "盖帽", "act": "hotpot"}, {"name": "灌篮", "act": "dunk"}]
    },
{"name": "小汽车", "model": "mini_car", "actions": [{"name": "出现", "act": "appear"}, {"name": "离开", "act": "leave"}]},
{"name": "人物", "model": "human", "actions": [{"name": "正脸", "act": "front_face"}]},
{"name": "船", "model": "boat", "actions": [{"name": "出现", "act": "appear"}]},
]
    mySelActs = [];
    myModel: any;
    myTriggerModel: any;
    myModelActions = [];
    isshow_APITrigger: boolean = false;
    isshow_Trigger: boolean = false;
    i: number = 0;
    api_local_cmd: '';
    api_start_cmd: '';
    api_end_cmd: '';

    deviceList_backup: any;
    later_deviceList_backup: any;
    account = {};
    shoot_count: number = 1;
    start_signal: '';
    end_signal: '';

    weekdays = [1, 2, 3, 4, 5, 6, 7];
    message_add: '';
    email_add: '';
    message_delete: '';
    email_delete: '';
    messageList = ['199999999999', '16666666666', '1888888888888', '17777777777']
    emailList = ['123456@gmail.com', '999636@gmail.com', '8888888@gmail.com', '666666@gmail.com']
    time_type: string = '';
    mome_res: any = '';
    isshow_response: boolean = false;
    isshow_PromptScreen: boolean = false;

    width = 0;


    fileToUpload: File = null;
    prompt_wait: '';
    prompt_url: '';
    begin_url: '';
    end_url: '';
    progress_url: '';
    bgmusic_url: '';//背景音乐url
    bgmvolume: '';//背景音乐音量
    borderpic_url: '';//边框图片url
    bgvideo_url: '';//背景视频url
    gvvolume: '';//背景视频音量
    start: '';//效果起点
    duration: '';//效果时长
    speed: '';//效果倍速
    rotate: '';//旋转角度
    color: '';//绿屏颜色
    similar: '';//相似度
    mix: '';//混合
    audio: '';//收音
    logo: '';//logo的url
    x: '';//x坐标
    y: '';//y坐标
    cliptype: number = 0;//素材或片花
    checkbgm: boolean = false;//背景音乐复选框
    checkframe: boolean = false;//边框图片复选框
    checkgv: boolean = false;//绿屏背景复选框
    checkgs: boolean = false;//绿屏复选框
    checkaudio: boolean = false;//收音复选框
    checklogo: boolean = false;//logo复选框
    checkeffect_speed: boolean = false;//速度效果复选框
    checkeffect_rotate: boolean = false;//旋转效果复选框
    choose = [{ "value": "素材" }, { "value": "片花" }];
    template = [];//模板
    isshow_table: boolean = false;//是否显示设定内容
    name: '';//模板名称
    desc: '';//模板描述
    isshowdisc: boolean = false;//是否显示显示名称描述
    isshowtmpsel: boolean = false;//是否显示模板选项
    isshowdel: boolean = true;
    templates = [];
    tempId = '';
    templateName = [];
    templateIndex: number = 0;
    isuploadprompt: boolean = false;
    isuploadbegin: boolean = false;
    isuploadprogress: boolean = false;
    isuploadend: boolean = false;
    isuploadbgm: boolean = false;
    isuploadborder: boolean = false;
    isuploadbg: boolean = false;
    isuploadbefore: boolean = false;
    isuploadlast: boolean = false;
    isuploadlogo: boolean = false;
    isshowact_prompt: boolean = false;
    isshowact_end: boolean = false;
    isshowact_begin: boolean = false;
    isshowact_progress: boolean = false;
    isshowact_bgm: boolean = false;
    isshowact_border: boolean = false;
    isshowact_bg: boolean = false;
    isshowact_before: boolean = false;
    isshowact_last: boolean = false;
    isshowact_logo: boolean = false;
    qrcode_url: string = '';
    guide = {
        "steps": []
    }

    steps = [];
    setprompt_deviceId: '';
    isshowQRcode: boolean = true;
    constructor(
        private http: HttpClient,
        private socketService: SocketService, private imageService: UploadImageService
    ) {
    }


    ngOnInit() {
        this.getCompanyList()
        // this.socketService.cmdRegister({'deviceId': localStorage['browser_device_id']})
        // this.socketService.receiveCmd((res) => {
        //   console.log('receive data:', res)
        //   if(res['state']=='-1'){
        //     this.isshow_response=true;
        //     this.mome_res = this.mome_res+'\n'+JSON.stringify(res)
        //   }
        // })


    }
    async getCompanyList() {

        let res = await this.http.get(environment.apiServerData + '/company/list').toPromise()
        console.log('company.res:', res)
        this.companyList = res
        this.companyList.unshift({ 'company_name': '全部', 'company_id': '' });
        this.getActivityList()

  }

  /*
   * 选择公司
   */
  onCompanySelected() {


    for (let i = 0; i < this.companyList.length; i++) {
      if (this.companyList[i].company_name === this.selCompany)
        this.selCompanyId = this.companyList[i].company_id
    }
    // localStorage['selUserId'] = this.selCompanyId;
    // localStorage['selPhone'] = this.selPhone;
    this.getActivityList();
    // this.selCompanyId = this.companyList[0].company_id
    // this.selCompany = this.companyList[0].company_name

  }

  /*获取活动列表*/
  async getActivityList() {
    console.log('this.selCompanyId:', this.selCompanyId)

    let res = await this.http.get(environment.apiServerData + '/activity/list?company_id=' + this.selCompanyId).toPromise()
    console.log('activity res:', res)
    this.activityList = res
    console.log('this.activityList:', this.activityList)
  }

  // 上传文件（包括视频、音频、图片）
  handleFileInput(file: FileList, Type: string, Name?: string) {
    console.log(this.activity_id)
    this.fileToUpload = file.item(0);
    console.log(this.fileToUpload)
    for (let i = 0; i < this.later_device.length; i++) {
      if (Number(Type) == i && Name && Name !== "paste_mov") {
        this.later_device[Type].isshow_paste = true;
        this.later_device[Type].isuploadpaste = false;
      }
      if(Number(Type) == i && Name && Name === "paste_mov"){
        this.later_device[Type].isshow_paste_mov = true;
        this.later_device[Type].isuploadpaste_mov = false;
      }
    }
    switch (Type) {
      case 'prompt':
        this.isshowact_prompt = true;
        this.isuploadprompt = false;
        break;
      case 'begin':
        this.isshowact_begin = true;
        this.isuploadbegin = false;
        break;
      case 'progress':
        this.isshowact_progress = true;
        this.isuploadprogress = false;
        break;
      case 'end':
        this.isshowact_end = true;
        this.isuploadend = false;
        break;
      case 'bgmusic':
        this.isshowact_bgm = true;
        this.isuploadbgm = false;
        break;
      case 'borderpic':
        this.isshowact_border = true;
        this.isuploadborder = false;
        break;
      case 'bgvideo':
        this.isshowact_bg = true;
        this.isuploadbg = false;
        break;
      case 'logo':
        this.isshowact_logo = true;
        this.isuploadlogo = false;
        break;
      default:
        console.log('片花');
        break;
    }
    this.imageService.postFile(this.fileToUpload, this.activity_id).subscribe(
      data => {
        console.log(data)
        // 上传成功
        if (data['code'] == 0) {
          for (let i = 0; i < this.later_device.length; i++) {
            if (Number(Type) == i) {
              this.later_device[Type].isshow_paste = false;
              this.later_device[Type].isuploadpaste = true;
              this.later_device[Type].paste = data['info']
            }
            
            if(Name === "paste_mov"){
              this.later_device[Type].isshow_paste_mov = false;
              this.later_device[Type].isuploadpaste_mov = true;
              this.later_device[Type].paste_mov = data['info']

            }
          }
          switch (Type) {
            case 'prompt':
              this.prompt_url = data['info'];
              this.isshowact_prompt = false;
              this.isuploadprompt = true;
              var step = this.get_steps(this.prompt_url, 1)
              console.log(step)
              this.steps.splice(0, 1, step)
              console.log(this.steps)
              break;
            case 'begin':
              this.begin_url = data['info'];
              this.isshowact_begin = false;
              this.isuploadbegin = true;
              var step = this.get_steps(this.begin_url, 2)
              console.log(step)
              this.steps.splice(1, 1, step)
              console.log(this.steps)
              break;
            case 'progress':
              this.progress_url = data['info'];
              this.isshowact_progress = false;
              this.isuploadprogress = true;
              var step = this.get_steps(this.progress_url, 3)
              console.log(step)
              this.steps.splice(2, 1, step)
              console.log(this.steps)
              break;
            case 'end':
              this.end_url = data['info'];
              this.isshowact_end = false;
              this.isuploadend = true;
              var step = this.get_steps(this.end_url, 4)
              console.log(step)
              this.steps.splice(3, 1, step)
              console.log(this.steps)
              break;
            case 'borderpic':
              this.borderpic_url = data['info'];
              this.isshowact_border = false;
              this.isuploadborder = true;
              break;
            case 'bgmusic':
              this.bgmusic_url = data['info'];
              this.isshowact_bgm = false;
              this.isuploadbgm = true;
              break;
            case 'bgvideo':
              this.bgvideo_url = data['info'];
              this.isshowact_bg = false;
              this.isuploadbg = true;
              break;
            case 'logo':
              this.logo = data['info'];
              this.isshowact_logo = false;
              this.isuploadlogo = true;
              break;
            default:
              console.log('片花');
              break;
          }
        } else {
          alert('上传失败，请重新上传')
        }
      }
    );

  }

  checkQrcode(value) {
    console.log(value)
    if (value == 'true') {
      this.guide['showQRCode'] = true;
    } else {
      this.guide['showQRCode'] = false;
    }
    console.log(this.steps)
  }

  get_steps(url, value) {
    var type = url.split('.')[url.split('.').length - 1];
    console.log(type)
    switch (type) {
      case 'mp4':
      case 'avi':
      case 'mov':
        return {"step": value, "video": url};
      //  break;
      case 'jpg':
      case 'png':
      case 'jpeg':
      case 'gif':
        return {"step": value, "bg": url};
      //  break;
      case 'mp3':
        return {"step": value, "music": url};
      //  break;
      default:
        alert('不支持此文件类型');
        break;
    }
  }

  // 确认提交提示屏设定
  confirm_prompt() {
    for (var i = 0; i <= this.deviceList.length - 1; i++) {
      if (this.deviceList[i]['deviceId'] == this.setprompt_deviceId) {
        this.guide['steps'] = this.steps;
        this.deviceList[i]['guide'] = this.guide;
      }
    }
    console.log(this.deviceList)
    /*将资料提交进资料库 */
    let body = {
      "from": localStorage['browser_device_id'],
      "requestId": localStorage['browser_device_id'] + '_' + Date.now(),
      "activity_id": this.activity_id,
      "trigger": this.collect_style,
      "account": this.account,
      "direction": this.screen_style,
      "collects": this.deviceList,
      "start_signal": this.start_signal,
      "end_signal": this.end_signal,
      "shoot_count": this.shoot_count

    }
    console.log(body)
    this.http
      .post(`${environment.apiServer}/activity/set_cameras`, body)
      .subscribe(data => {
        console.log(data)
        if (data['code'] == 0) {
          alert("资料保存成功")
        } else {
          alert("资料保存失败，请重新设定")
        }
      });
    /*socket通知采集盒更新设定 */
    // 重新注册一遍
    this.socketService.cmdRegister({'deviceId': localStorage['browser_device_id']})
    let update_device_seetings = {
      "from": localStorage['browser_device_id'],
      "requestId": localStorage['browser_device_id'] + '_' + Date.now(),
      "deviceId": this.setprompt_deviceId,
      "param": {
        "action": "update_device_settings",
        "activity": {
          "activity_id": this.activity_id

        }
      }
    }
    console.log(update_device_seetings)
    this.socketService.DeviceCMDEVENT(update_device_seetings, (res) => {
      console.log('cmd:' + res);
    })

    this.isshow_PromptScreen = false;
  }

  click_weekday(i) {
    console.log(i)
  }

  set_PromptScreen(deviceId) {
    this.initset_PromptScreen()
    console.log(deviceId)
    this.setprompt_deviceId = deviceId;
    this.isshow_PromptScreen = true;
    for (var i = 0; i <= this.deviceList.length - 1; i++) {
      if (this.deviceList[i]['deviceId'] == deviceId) {
        if (this.deviceList[i]['guide'] != undefined && this.deviceList[i]['guide']['steps'] != undefined) {
          this.steps = this.deviceList[i]['guide']['steps']
          for (var j = 0; j <= this.deviceList[i]['guide']['steps'].length - 1; j++) {
            if (this.deviceList[i]['guide']['steps'][j]['step'] == 1) {
              this.isuploadprompt = true;
              this.prompt_url = this.deviceList[i]['guide']['steps'][j]['bg'] || this.deviceList[i]['guide']['steps'][j]['music'] || this.deviceList[i]['guide']['steps'][j]['video']
            }
            if (this.deviceList[i]['guide']['steps'][j]['step'] == 2) {
              this.isuploadbegin = true;
              this.begin_url = this.deviceList[i]['guide']['steps'][j]['bg'] || this.deviceList[i]['guide']['steps'][j]['music'] || this.deviceList[i]['guide']['steps'][j]['video']
            }
            if (this.deviceList[i]['guide']['steps'][j]['step'] == 3) {
              this.isuploadprogress = true;
              this.progress_url = this.deviceList[i]['guide']['steps'][j]['bg'] || this.deviceList[i]['guide']['steps'][j]['music'] || this.deviceList[i]['guide']['steps'][j]['video']
            }
            if (this.deviceList[i]['guide']['steps'][j]['step'] == 4) {
              this.isuploadend = true;
              this.end_url = this.deviceList[i]['guide']['steps'][j]['bg'] || this.deviceList[i]['guide']['steps'][j]['music'] || this.deviceList[i]['guide']['steps'][j]['video']
            }
            if (this.deviceList[i]['guide']['steps']['showQRCode'] != undefined) {
              this.isshowQRcode = this.deviceList[i]['guide']['steps']['showQRCode']
              console.log(this.isshowQRcode)
              console.log(typeof this.isshowQRcode)
            } else {
              this.guide['showQRCode'] = true;
            }
          }
        }
      }
    }
  }

  // 初始化设定界面
  initset_PromptScreen() {
    this.fileToUpload = null;
    this.prompt_wait = '';
    this.prompt_url = '';
    this.begin_url = '';
    this.end_url = '';
    this.progress_url = '';
    this.isuploadprompt = false;
    this.isuploadbegin = false;
    this.isuploadprogress = false;
    this.isuploadend = false;
    this.isuploadbgm = false;
    this.isuploadborder = false;
    this.isuploadbg = false;
    this.isuploadbefore = false;
    this.isuploadlast = false;
    this.isuploadlogo = false;
    this.isshowact_prompt = false;
    this.isshowact_end = false;
    this.isshowact_begin = false;
    this.isshowact_progress = false;
    this.isshowact_bgm = false;
    this.isshowact_border = false;
    this.isshowact_bg = false;
    this.isshowact_before = false;
    this.isshowact_last = false;
    this.isshowact_logo = false;
    this.steps = [];
    this.guide['showQRCode'] = true;
  }

  close() {
    this.isshow_PromptScreen = false;
  }

  /*选择模拟拍摄时间段或时间点 */
  checkTimeType(type) {
    console.log(type)
    this.time_type = type;
  }

  /*暂停警报*/
  stopMonitor() {
    console.log('暂停报警至24点')
  }

  /* 增加通知人信息*/
  addInform() {
    console.log('增加通知人信息')
  }

  /*删除通知人信息*/
  deleteInform() {
    console.log('删除通知人信息')
  }

  /*选择是否带上心跳*/
  chooseHeartbeat(check: boolean, beat: string) {
    console.log(check)
    console.log(beat)
  }


  // 选择deviceId
  chooseDeviceId(i) {
    console.log(i)
    for (var k = 0; k <= this.deviceList_backup.length - 1; k++) {
      console.log(this.deviceList[i]['deviceId'])
      if (this.deviceList_backup[k]['deviceId'] == this.deviceList[i]['deviceId']) {
        console.log('K=' + k)
        this.deviceList[i] = this.deviceList_backup[k];
      }
    }
    console.log(this.deviceList)
    this.deviceList_backup = JSON.parse(localStorage.getItem('deviceList'))
    console.log(this.deviceList_backup)

  }

  // 选择order
  chooseOrder(i) {
    console.log('行' + i); //行数
    console.log(this.later_device[i].order);
    console.log(this.later_deviceList_backup[0].order);
    for (var k = 0; k < this.later_deviceList_backup.length; k++) {
      if (this.later_deviceList_backup[k]['order'] == this.later_device[i]['order']) {
        this.later_device[i] = this.later_deviceList_backup[k];
        this.later_device[i].everytype = 'device'
        console.log('K=' + k)
      }
    }
    this.later_deviceList_backup = JSON.parse(localStorage.getItem('later_deviceLists'))
    console.log(this.later_deviceList_backup)
    for (var j = 0; j < this.later_deviceList_backup.length; j++) {
      this.later_deviceList_backup[j].order = j;
    }
  }

  // 删除后期设备的设定
  delete(i) {
    this.later_device.splice(i, 1)
    console.log(this.later_device.length);
  }

  // 删除已上传的素材
  delsource(type, url) {
    console.log(url)
    if (type == 'music') {
      this.bgmusic_url = ''
      this.isshowact_bgm = false
      this.isuploadbgm = false
    } else if (type == 'border') {
      this.borderpic_url = ''
      this.isshowact_border = false
      this.isuploadborder = false
    } else {
      this.bgvideo_url = ''
      this.isshowact_bg = false
      this.isuploadbg = false
    }
    this.http.get(environment.apiServerData + '/file/delete?fileName=' + this.activity_id + '/' + url).subscribe((data: any) => {
      alert(data.info)
    })
  }

  // 后期确认
  confirm_laterStage() {
    this.update_laterStage();
    this.logout_latersetting();
  }

  // 查看模板
  view() {
    this.isshow_table = true;
  }

  // 创建模板
  addfound() {
    if (this.isshow_table == true) {
        this.isshow_table = false;
        this.name = "";
        this.desc = "";
        this.later_device = [];
        this.isshowdisc = true;
        this.bgmusic_url = "";
        this.bgmvolume = "";
        this.borderpic_url = "";
        this.bgvideo_url = ""
        this.gvvolume = ""
        this.start = ""
        this.duration = ""
        this.speed = ""
        this.rotate = ""
        this.color = ""
        this.mix = ''
        this.similar = ''
        this.audio = ''
        this.logo = ''
        this.x = ''
        this.y = ''
        this.checkbgm = false
        this.checkframe = false
        this.checkgv = false
        this.checkeffect_speed = false
        this.checkeffect_rotate = false
        this.checkgs = false
        this.checkaudio = false
        this.checklogo = false
    } else {
        this.isshowdisc = true;
    }

}
  // 添加模板
  addSetting() {
    console.log('add');
    if (this.name != undefined && this.desc != undefined) {
      this.isshow_table = true;
      console.log(this.template);
      this.template.push(this.name);
      console.log(this.template);
    } else {
      alert('请输入名称和描述')
    }
  }

  // 添加后期设定
  add(i) {
    for (let j = 0; j < this.later_device.length; j++) {
      if (this.later_device.length == 0) {
        i = this.i
      } else {
        i = this.i + j + 1
      }
    }
    if (this.later_device.length == 0) {
      i = this.i
    }
    if (this.later_deviceList_backup.length == 0) {
      alert('该活动下未绑定采集盒');
    } else if (this.cliptype == 0) {
      this.later_device.push(this.later_deviceList_backup[0])
      this.later_device[i].everytype = 'device'
    } else {
      this.later_device.push(this.later_deviceList_backup[0])
      this.later_device[i].everytype = 'flower'
      if (this.later_device[i].deviceId) {
        this.later_device[i].deviceId = ''
        this.later_device[i].order = ''
      }
    }
    this.later_deviceList_backup = JSON.parse(localStorage.getItem('later_deviceLists'))
    console.log(this.later_deviceList_backup)
    for (var j = 0; j < this.later_deviceList_backup.length; j++) {
      this.later_deviceList_backup[j].order = j;
    }
  }

  // 获取活动设备列表
  async getDeviceList(activity_id) {
    console.log('进来一次')
    this.http.get(environment.apiServerData + '/activity?activity_id=' + activity_id).subscribe((data: any) => {
      console.log(data)
      this.account = data['account']
      console.log(typeof data['settings']['camera_setting']['cameras'])
      console.log(data['settings']['camera_setting']['cameras'].length)
      if (data['settings']['camera_setting']['cameras'] == undefined || data['settings']['camera_setting']['cameras'].length == 0) {
        alert('该活动下还未绑定采集盒，请前往采集盒设定界面进行设定')
      } else {
        this.deviceList.splice(0, this.deviceList.length)
        for (var i = 0; i < data['settings']['camera_setting']['cameras'].length; i++) {
          data['settings']['camera_setting']['cameras'][i].collect.duration = data['settings']['camera_setting']['cameras'][i].collect.duration / 1000;
          data['settings']['camera_setting']['cameras'][i].collect.time_before = data['settings']['camera_setting']['cameras'][i].collect.time_before / 1000;
          data['settings']['camera_setting']['cameras'][i].collect.wait = data['settings']['camera_setting']['cameras'][i].collect.wait / 1000;
          this.deviceList.push(data['settings']['camera_setting']['cameras'][i])
        }
        if (data['settings']['camera_setting']['trigger'] != undefined) {
          this.collect_style = data['settings']['camera_setting']['trigger'];
        }
        if (data['settings']['camera_setting']['direction'] != undefined) {
          this.screen_style = data['settings']['camera_setting']['direction'];
        }
        if (data['settings']['camera_setting']['start_signal'] != undefined) {
          this.start_signal = data['settings']['camera_setting']['start_signal'];
        }
        if (data['settings']['camera_setting']['end_signal'] != undefined) {
          this.end_signal = data['settings']['camera_setting']['end_signal'];
        }
        if (data['settings']['camera_setting']['shoot_count'] != undefined) {
          this.shoot_count = data['settings']['camera_setting']['shoot_count'];
        }
        console.log(this.deviceList)
        localStorage.setItem('deviceList', JSON.stringify(this.deviceList));
        this.deviceList_backup = JSON.parse(localStorage.getItem('deviceList'))
        console.log(this.deviceList_backup)
      }
    })
  }

  // 获取后期设备列表
  async getLaterList(activity_id) {
    this.http.get(environment.apiServerData + '/activity?activity_id=' + activity_id).subscribe((data: any) => {
      if (data['settings']['camera_setting']['cameras'] == undefined || data['settings']['camera_setting']['cameras'].length == 0) {
        alert('该活动下还未绑定采集盒，请前往采集盒设定界面进行设定')
      } else {
        console.log(data);
        this.later_device.splice(0, this.later_device.length)
        this.later_deviceLists.splice(0, this.later_deviceLists.length)
        this.later_deviceList.splice(0, this.later_deviceList.length)
        for (var i = 0; i < data['settings']['camera_setting']['cameras'].length; i++) {
          this.later_deviceList.push(data['settings']['camera_setting']['cameras'][i])
        }
        for (var j = 0; j < data.settings.camera_setting.shoot_count; j++) {
          for (var i = 0; i < data['settings']['camera_setting']['cameras'].length; i++) {
            this.later_deviceLists.push(this.later_deviceList[i]);
          }
        }
        localStorage.setItem('later_deviceLists', JSON.stringify(this.later_deviceLists));
        this.later_deviceList_backup = JSON.parse(localStorage.getItem('later_deviceLists'))
        console.log(this.later_deviceList_backup)
        for (var j = 0; j < this.later_deviceList_backup.length; j++) {
          this.later_deviceList_backup[j].order = j;
        }
      }
    })
  }

  // 新增机位设定
  Add_device() {
    // let data = {
    //   "deviceId": "",
    //   "mark": "",
    //   "collect": {"len": "", "prev": "", "next": "", "wait": "", "order": ""}
    // }
    this.deviceList.push(this.deviceList_backup[0])
    console.log(this.deviceList)
  }

  // 更新deviceList
  update_deviceList() {
    console.log(this.deviceList)
    // console.log(this.collect_style)
    // console.log(this.screen_style)
    // this.requestId = localStorage['browser_device_id'] + '_' + Date.now()
    localStorage.setItem('deviceList', JSON.stringify(this.deviceList))
    let deviceList1 = JSON.parse(localStorage.getItem('deviceList'))
    for (var i = 0; i < deviceList1.length; i++) {
      deviceList1[i].collect.duration = deviceList1[i].collect.duration * 1000;
      deviceList1[i].collect.time_before = deviceList1[i].collect.time_before * 1000;
      deviceList1[i].collect.wait = deviceList1[i].collect.wait * 1000;

    }

    let body = {
      "from": localStorage['browser_device_id'],
      "requestId": localStorage['browser_device_id'] + '_' + Date.now(),
      "activity_id": this.activity_id,
      "trigger": this.collect_style,
      "account": this.account,
      "direction": this.screen_style,
      "collects": deviceList1,
      "start_signal": this.start_signal,
      "end_signal": this.end_signal,
      "shoot_count": this.shoot_count

    }
    console.log(body)
    this.http
      .post(`${environment.apiServer}/activity/set_cameras`, body)
      .subscribe(data => {
        console.log(data)
        if (data['code'] == 0) {
          alert("资料更新成功, 请前往后期设定")
        } else {
          alert("资料保存失败，请重新设定")
        }
      });
    /* 接收采集盒的回报资讯*/
    this.socketService.cmdRegister({'deviceId': localStorage['browser_device_id']})
    this.socketService.receiveCmd((res) => {
      console.log('receive data:', res)
      if (res['state'] == '-1') {
        this.isshow_response = true;
        this.mome_res = this.mome_res + '\n' + JSON.stringify(res)
      }
    })

  }

    // 后期应用
    update_laterStage() {
        console.log(this.templateIndex);
        localStorage.setItem('later', JSON.stringify(this.later_device))
        let later_device1 = JSON.parse(localStorage.getItem('later'))
        for (var i = 0; i < later_device1.length; i++) {
            later_device1[i].duration = later_device1[i].duration * 1000;
            later_device1[i].begin = later_device1[i].begin * 1000;
        }
        let datas = {
            "record": later_device1,
            "source": {
                "bgm": {
                    "src": this.bgmusic_url,
                    "volume": this.bgmvolume
                },
                "frame": this.borderpic_url,
                "ground_video": {
                    "src": this.bgvideo_url,
                    "volume": this.gvvolume
                },
                "effect_speed": {
                    "start": this.start,
                    "duration": this.duration,
                    "speed": this.speed
                },
                "effect_rotate": {
                    "rotate": this.rotate
                },
                "green_screen": {
                    "color": this.color,
                    "similar": this.similar,
                    "mix": this.mix
                },
                "audio": this.audio,
                "logo": {
                    "src": this.logo,
                    "x": this.x,
                    "y": this.y
                }
            },
            "cut_param": {
                "enablebgm": this.checkbgm,
                "enableborder": this.checkframe,
                "enablebggreen": this.checkgv,
                "enableeffect_speed": this.checkeffect_speed,
                "enableeffect_rotate": this.checkeffect_rotate,
                "enablegreenscreen": this.checkgs,
                "enableaudio": this.checkaudio,
                "enablelogo": this.checklogo
            },
            "template_name": this.name,
            "mark": this.desc

        }

        if (this.templateIndex == -1) {
            this.templates.push(datas)
        } else {
            this.templates.splice(this.templateIndex, 1)
            this.templates.push(datas)
        }
        let cut_templates = {
            "activity_id": this.activity_id,
            "record": later_device1,
            "source": {
                "bgm": {
                    "src": this.bgmusic_url,
                    "volume": this.bgmvolume
                },
                "frame": this.borderpic_url,
                "ground_video": {
                    "src": this.bgvideo_url,
                    "volume": this.gvvolume
                },
                "effect_speed": {
                    "start": this.start,
                    "duration": this.duration,
                    "speed": this.speed
                },
                "effect_rotate": {
                    "rotate": this.rotate
                },
                "green_screen": {
                    "color": this.color,
                    "similar": this.similar,
                    "mix": this.mix
                },
                "audio": this.audio,
                "logo": {
                    "src": this.logo,
                    "x": this.x,
                    "y": this.y
                }
            },
            "cut_param": {
                "enablebgm": this.checkbgm,
                "enableborder": this.checkframe,
                "enablebggreen": this.checkgv,
                "enableeffect_speed": this.checkeffect_speed,
                "enableeffect_rotate": this.checkeffect_rotate,
                "enablegreenscreen": this.checkgs,
                "enableaudio": this.checkaudio,
                "enablelogo": this.checklogo
            },
            "cut_templates": this.templates
        }
        console.log(cut_templates)
        this.http.post(`${environment.apiServer}/activity/later_setting`, cut_templates).subscribe(data => {
            console.log(data)
            if (data['code'] == 0) {
                alert('保存成功')
            } else {
                alert('保存失败，请重新设定!')
            }
        });
  }

  // 删除这一机位的设定
  delete_device(i) {
    console.log(i)
    this.deviceList.splice(i, 1)
  }

  // 选择线性、同步
  checkMode(value) {
    console.log(value)
    this.collect_style = value;
  }

  // 选择横屏、竖屏
  checkScreen(value) {
    this.screen_style = value;
  }

  // 选择触发方式
  checkTrigger(value) {
    this.trigger_style = value;
  }


  //选择添加的类型
  choosetype(i) {
    if (i == "片花") {
      this.cliptype = 1
    } else {
      this.cliptype = 0
    }
  }

  // 选择API
  chooseAPI(val, i) {
    console.log(val)
    if (val == 'HIT') {
      this.later_device[i].API = 'HIT'
    }
    if (val == '请选择') {
      this.later_device[i].API = ''
    }
  }

  // 退出设定界面
  logout() {
    this.deviceList = [];
    this.ishow_set_activity = false;
    this.isshow_homepage = true;
  }

  //退出活动后期设定界面
  logout_latersetting() {
    this.isshow_later_stage = false;
    this.isshow_homepage = true;
    this.later_device = [];
    this.isshowdisc = false;
    this.isshow_table = false;
  }

  // 选择辨识类型
  chooseTriggerModel(i) {
    console.log(i)
    this.i = i;
    // console.log(this.deviceList[i]['trigger_name'])
    // if(this.deviceList[i]['trigger_name']=='manual'){
    //   this.deviceList[i]['trigger_type']={
    //     "trigger_type_name":"manual"
    //   }
    //   console.log(this.deviceList[i]['trigger_type'])
    // }
    // if(this.deviceList[i]['trigger_name']=='auto'){this.isshow_Trigger=true;this.isshow_APITrigger=false;}
    // if(this.deviceList[i]['trigger_name']=='api'){this.isshow_Trigger=true;this.isshow_APITrigger=true;}
    console.log('trigger_type_name:', this.deviceList[i]['trigger_type']['trigger_type_name'])
    if (this.deviceList[i]['trigger_type']['trigger_type_name'] == 'manual') {

      this.deviceList[i]['trigger_type'] = {
        "trigger_type_name": "manual",
        "model": {
          "model_name": "",
          "model_url": "",
          "recognition_type": [],
          "version": ""
        }
      }

      console.log(this.deviceList[i]['trigger_type'])
    }
    if (this.deviceList[i]['trigger_type']['trigger_type_name'] == 'auto') {
      this.isshow_Trigger = true;
      this.isshow_APITrigger = false;
    }
    if (this.deviceList[i]['trigger_type']['trigger_type_name'] == 'api') {
      this.isshow_Trigger = true;
      this.isshow_APITrigger = true;
    }
  }


  // 辨识设定确认
  verifyTrigger(value) {
    console.log(value)
    console.log(this.i)
    if (value == 'auto') {
      this.deviceList[this.i]['trigger_type'] = {
        "trigger_type_name": "auto",
        "model": {
          "model_name": this.myModel,
          "model_url": "",
          "recognition_type": this.mySelActs,
          "version": ""
        }
      }
    }
    if (value == 'api') {
      this.deviceList[this.i]['trigger_type'] = {
        "trigger_type_name": "api",
        "api_source": {
          "start": this.api_start_cmd,
          "end": this.api_end_cmd,
          "local_device": this.api_local_cmd
        },
        "model": {
          "model_name": "",
          "model_url": "",
          "recognition_type": [],
          "version": ""
        }
      }
    }
    this.isshow_Trigger = false;
  }

  // 选择辨识模组
  chooseModel(param) {
    console.log(this.myModel)
    if (param == 'init') {
      this.mySelActs = []
    }
    for (let i = 0; i < this.modelList.length; i++) {
      if (this.myModel == this.modelList[i].model) {
        // this.myModel = this.modelList[i]
        this.myModelActions = this.modelList[i].actions
        return
      }
    }
}

// 选择识别动作
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

    // 选择模板名称
    choosetmpId(i) {
        for (let j = 0; j < this.templateName.length; j++) {
            if (i == this.templateName[j]) {
                this.templateIndex = j;
                this.name = this.templates[j].template_name;
                this.desc = this.templates[j].mark;
                this.later_device = this.templates[j].record;
                this.bgmusic_url = this.templates[j].source.bgm.src;
                this.bgmvolume = this.templates[j].source.bgm.volume;
                this.borderpic_url = this.templates[j].source.frame;
                this.bgvideo_url = this.templates[j].source.ground_video.src;
                this.gvvolume = this.templates[j].source.ground_video.volume;
                this.start = this.templates[j].source.effect_speed.start;
                this.speed = this.templates[j].source.effect_speed.speed;
                this.duration = this.templates[j].source.effect_speed.duration;
                this.rotate = this.templates[j].source.effect_rotate.rotate;
                this.color = this.templates[j].source.green_screen.color;
                this.mix = this.templates[j].source.green_screen.mix;
                this.similar = this.templates[j].source.green_screen.similar;
                this.audio = this.templates[j].source.audio;
                this.logo = this.templates[j].source.logo.src;
                this.x = this.templates[j].source.logo.x;
                this.y = this.templates[j].source.logo.y;
                this.checkbgm = this.templates[j].cut_param.enablebgm;
                this.checkframe = this.templates[j].cut_param.enableborder;
                this.checkgv = this.templates[j].cut_param.enablebggreen;
                this.checkeffect_speed = this.templates[j].cut_param.enableeffect_speed;
                this.checkeffect_rotate = this.templates[j].cut_param.enableeffect_rotate;
                this.checkgs = this.templates[j].cut_param.enablegreenscreen;
                this.checkaudio = this.templates[j].cut_param.enableaudio;
                this.checklogo = this.templates[j].cut_param.enablelogo;
            }
        }

        if (i == "--创建模板--") {
            this.templateIndex = -1
        }
        this.tempId = i;//模板id
        // 调用接口参数为模板id
    }

    // 删除模板
    deltemplate() {
        for (let i = 0; i < this.templateName.length; i++) {
            if (this.tempId == this.templateName[i]) {
                this.templates.splice(i, 1);
            }
        }
        localStorage.setItem('later', JSON.stringify(this.later_device))
        let later_device1 = JSON.parse(localStorage.getItem('later'))
        for (var i = 0; i < later_device1.length; i++) {
            later_device1[i].duration = later_device1[i].duration * 1000;
            later_device1[i].begin = later_device1[i].begin * 1000;
        }

        localStorage.setItem('templates', JSON.stringify(this.templates))
        let templates = JSON.parse(localStorage.getItem('templates'))
        console.log(this.template.length)
        if (this.templates.length == 0) {
            templates = []
            var cut_templates = {
                "activity_id": this.activity_id,
                "record": "",
                "source": "",
                "cut_param": "",
                "cut_templates": templates
            }
        } else {
            for (var i = 0; i < templates.length; i++) {
                for (let j = 0; j < this.templates[i].record.length; j++) {
                    templates[i].record[j].duration = templates[i].record[j].duration * 1000;
                    templates[i].record[j].begin = templates[i].record[j].begin * 1000;
                }
            }
            cut_templates = {
                "activity_id": this.activity_id,
                "record": templates[templates.length - 1].record,
                "source": templates[templates.length - 1].source,
                "cut_param": templates[templates.length - 1].cut_param,
                "cut_templates": templates
            }
        }
        this.http.post(`${environment.apiServer}/activity/later_setting`, cut_templates).subscribe(data => {
            console.log(data)
            if (data['code'] == 0) {
                alert('删除成功')
            } else {
                alert('删除失败!')
            }
        });
    }

    click(i) {
        console.log(i)
        console.log(this.deviceList[i])
        this.i = i;
        switch (this.deviceList[i]['trigger_type']['trigger_type_name']) {
            case 'auto':
                this.isshow_Trigger = true;
                this.isshow_APITrigger = false;
                this.myModel = this.deviceList[i]['trigger_type']['model']['model_name'];
                this.mySelActs = this.deviceList[i]['trigger_type']['model']['recognition_type'];
                this.chooseModel('update')
                console.log(this.myModel)
                console.log(this.mySelActs)
                break;
            case 'api':
                this.isshow_Trigger = true;
                this.isshow_APITrigger = true;
                this.api_start_cmd = this.deviceList[i]['trigger_type']['api_source']['start'];
                this.api_end_cmd = this.deviceList[i]['trigger_type']['api_source']['end'];
                this.api_local_cmd = this.deviceList[i]['trigger_type']['api_source']['local_device'];
                break;
            case 'manual':
                this.isshow_Trigger = false;
        }
  }

  async delActivity(activity) {

    if (confirm("确定删除?")) {
      this.http.get(`${environment.apiServerData}/activity/del?activity_id=${activity.activity_id}`).subscribe((data: any) => {
        if (data.code === 0) {
          const delIndex = this.activityList.indexOf(activity);
          if (delIndex >= 0) {
            this.activityList.splice(delIndex, 1)
          }
        }
      })
    }

  }

  /* 活动设定 */
  async setupActivity(activity_id) {

    // this.showSetup = true
    this.activity_id = activity_id;

    console.log('activity_id:', activity_id)
    this.ishow_set_activity = true;
    this.isshow_homepage = false;
    // 获取活动下设备绑定列表
    this.getDeviceList(activity_id)

  }

  async setupMonitor(activity_id) {

    this.isshow_SetupMonitor = true;
    this.isshow_homepage = false;
    this.activity_id = activity_id;
    console.log('activity_id:', activity_id)
  }

      /* 后期设定 */
      async setlaterStage(activity_id) {
        this.activity_id = activity_id;
        this.isshow_later_stage = true;
        this.isshow_homepage = false;
        this.ishow_set_activity = false;
        this.getLaterList(activity_id);
        this.http.get(environment.apiServerData + '/activity?activity_id=' + activity_id).subscribe((data: any) => {
            let result = data.settings.later_setting;
            this.templates = result.cut_templates;
            if (this.templates == null) {
                this.templates = []
            }
            console.log(result);
            if (result.cut_templates != undefined || result.cut_templates != null) {
                this.templateIndex = this.templates.length
                this.templateName = []
                for (let i = 0; i < result.cut_templates.length; i++) {
                    this.templateName.push(result.cut_templates[i].template_name)
                }
                let index = result.cut_templates.length - 1;
                this.name = result.cut_templates[index].template_name
                this.desc = result.cut_templates[index].mark
                this.later_device = result.cut_templates[index].record;
                console.log(this.later_device)
                for (var i = 0; i < result.cut_templates[index].record.length; i++) {
                    result.cut_templates[index].record[i].duration = result.cut_templates[index].record[i].duration / 1000;
                    result.cut_templates[index].record[i].begin = result.cut_templates[index].record[i].begin / 1000;
                    result.cut_templates[index].record[i].isshow_paste = false
                    result.cut_templates[index].record[i].isuploadpaste = false
                    result.cut_templates[index].record[i].isshow_paste_mov = false
                    result.cut_templates[index].record[i].isuploadpaste_mov = false
                }
                this.isshowtmpsel = true;
                this.isshowdisc = true;
                this.isshow_table = true;
                this.bgmusic_url = result.cut_templates[index].source.bgm.src;
                this.bgmvolume = result.cut_templates[index].source.bgm.volume;
                this.borderpic_url = result.cut_templates[index].source.frame;
                this.bgvideo_url = result.cut_templates[index].source.ground_video.src;
                this.gvvolume = result.cut_templates[index].source.ground_video.volume;
                this.start = result.cut_templates[index].source.effect_speed.start;
                this.speed = result.cut_templates[index].source.effect_speed.speed;
                this.duration = result.cut_templates[index].source.effect_speed.duration;
                this.rotate = result.cut_templates[index].source.effect_rotate.rotate;
                this.color = result.cut_templates[index].source.green_screen.color;
                this.mix = result.cut_templates[index].source.green_screen.mix;
                this.similar = result.cut_templates[index].source.green_screen.similar;
                this.audio = result.cut_templates[index].source.audio;
                this.logo = result.cut_templates[index].source.logo.src;
                this.x = result.cut_templates[index].source.logo.x;
                this.y = result.cut_templates[index].source.logo.y;
                this.checkbgm = result.cut_templates[index].cut_param.enablebgm;
                this.checkframe = result.cut_templates[index].cut_param.enableborder;
                this.checkgv = result.cut_templates[index].cut_param.enablebggreen;
                this.checkeffect_speed = result.cut_templates[index].cut_param.enableeffect_speed;
                this.checkeffect_rotate = result.cut_templates[index].cut_param.enableeffect_rotate;
                this.checkgs = result.cut_templates[index].cut_param.enablegreenscreen;
                this.checkaudio = result.cut_templates[index].cut_param.enableaudio;
                this.checklogo = result.cut_templates[index].cut_param.enablelogo;
            } else {
                this.later_device = [];
                this.isshowtmpsel = false;
                this.isshowdel = false;
            }

        })
    }
  // 点击拍摄
  async makeMovie() {
    this.qrcode_url = '';
    // this.ishow_set_activity=false;
    for (var i = 0; i <= this.deviceList.length - 1; i++) {
      this.deviceList[i]['width'] = 0;
      this.deviceList[i]['status'] = '';
    }
    this.socketService.cmdRegister({'deviceId': localStorage['browser_device_id']})
    // this.socketService.receiveCmd((res) => {
    //     // console.log('receive data:', res)
    //     if (res['action'] == 'post_make_shoot') {
    //         for (var i = 0; i <= this.deviceList.length - 1; i++) {
    //             if (this.deviceList[i]['deviceId'] == res['from']) {
    //                 console.log(res)
    //                 console.log(res['from'])
    //                 console.log(Math.ceil(res['rate'] * 100))
    //                 this.deviceList[i]['width'] = Math.ceil(res['rate'] * 100);
    //                 this.deviceList[i]['status'] = res['state'];
    //                 if(res['state']==1){
    //                     // this.qrcode_url=''
    //                 }
    //             }
    //         }
    //     }

    // })
    console.log('拍摄activity_id:', this.make_movie_activity_id)
    let res = await this.http.get(environment.apiServer + '/activity/make_move?activity_id=' + this.make_movie_activity_id + '&from=' + localStorage['browser_device_id'] + '&requestId=' + localStorage['browser_device_id'] + '_' + Date.now()).toPromise();
    console.log(res)
    if (res && res['code'] == 1) {
      alert(res['description'])
    }
    if (res && res['code'] == 0) {
      console.log(res['result']['taskId'])
      var taskId = res['result']['taskId']
      this.socketService.receiveCmd((res1) => {
        console.log('receive data:', res1)
        if (res1['action'] == 'post_make_shoot') {
          for (var i = 0; i <= this.deviceList.length - 1; i++) {
            if (this.deviceList[i]['deviceId'] == res1['from']) {
              console.log(res1)
              console.log(res1['from'])
              console.log(Math.ceil(res1['rate'] * 100))
              this.deviceList[i]['width'] = Math.ceil(res1['rate'] * 100);
              this.deviceList[i]['status'] = res1['state'];
              this.deviceList[i]['reason'] = res1['reason'];
              // if(res1['rate']==1){
              //    console.log('上传成功')
              //    this.qrcode_url='https://iva.siiva.com/me_photo/qrcode_img/mini_'+taskId+'.png';
              // }
            }
          }
        }
        // task剪辑成功显示出qrcode
        if (res1.param) {
          if (res1['param']['action'] == 'task_complete') {
            this.qrcode_url = 'https://iva.siiva.com/me_photo/qrcode_img/mini_' + taskId + '.png';
          }
        }

      })
    }
    // this.socketService.cmdRegister({'deviceId': localStorage['browser_device_id']})
    // this.socketService.receiveCmd((res) => {
    //   console.log('receive data:', res)
    //   if(res['action']=='post_make_shoot'){
    //     for(var i=0;i<=this.deviceList.length-1;i++){
    //       if(this.deviceList[i]['deviceId']==res['from']){
    //         console.log(Math.ceil(res['rate']*100))
    //         this.deviceList[i]['width']=Math.ceil(res['rate']*100);
    //       }
    //     }
    //   }
    // })


  }

  async endMovie() {
    console.log('结束拍摄activity_id:', this.make_movie_activity_id)
    let res = await this.http.get(environment.apiServer + '/activity/end_move?activity_id=' + this.make_movie_activity_id + '&from=' + localStorage['browser_device_id'] + '&requestId=' + localStorage['browser_device_id'] + '_' + Date.now()).toPromise();
    if (res && res['code'] == 1) {
      alert(res['description'])
    }
  }


  async cancel_Monitor() {
    this.isshow_SetupMonitor = false;
    this.isshow_homepage = true;
  }

  /* 确认设定报警时间 */
  async makesureSetupMonitor() {

    let body = {}
    if (this.time_type == 'point') {
      let times = []
      if (this.time1) {
        console.log('time1:', this.addZero(this.time1.getHours()) + ':' + this.addZero(this.time1.getMinutes()))
        times.push(this.addZero(this.time1.getHours()) + ':' + this.addZero(this.time1.getMinutes()))
      }
      if (this.time2) {
        console.log('time2:', this.addZero(this.time2.getHours()) + ':' + this.addZero(this.time2.getMinutes()))
        times.push(this.addZero(this.time2.getHours()) + ':' + this.addZero(this.time2.getMinutes()))
      }
      if (this.time3) {
        console.log('time3:', this.addZero(this.time3.getHours()) + ':' + this.addZero(this.time3.getMinutes()))
        times.push(this.addZero(this.time3.getHours()) + ':' + this.addZero(this.time3.getMinutes()))
      }
      // if (this.time4) {
      //   console.log('time4:', this.addZero(this.time4.getHours()) + ':' + this.addZero(this.time4.getMinutes()))
      //   times.push(this.addZero(this.time4.getHours()) + ':' + this.addZero(this.time4.getMinutes()))
      // }

      if (times.length == 0) {
        if (confirm("时间点提醒方式, 时间点不能为空")) {
          return
        }

      }

      body = {
        'activity_id': this.activity_id,
        'check_type': 'point',
        'times': times
      }

    } else {

      if (!this.Simulate_time_begin || !this.Simulate_time_end) {
        if (confirm("时间段提醒方式, 开始或结束不能为空")) {
          return
        }
      }

      body = {
        'activity_id': this.activity_id,
        'check_type': 'interval',
        'times': {
          'begin': this.addZero(this.Simulate_time_begin.getHours()) + ':' + this.addZero(this.Simulate_time_begin.getMinutes()),
          'end': this.addZero(this.Simulate_time_end.getHours()) + ':' + this.addZero(this.Simulate_time_end.getMinutes()),
          'interval': this.interval
        }
      }
      console.log(this.Simulate_time_end)
      console.log(this.Simulate_time_begin)
    }

    console.log('body:', body);
    this.http
      .post(`${environment.apiServer}/activity/set_check_time`, body)
      .subscribe(data => {
        console.log('data:', data)
        if (data['code'] == 0) {
          alert("设定成功")
          this.isshow_SetupMonitor = false;
          this.isshow_homepage = true;
        }
      });

  }


  addZero(data) {
    // console.log('data:', data)
    let res = ''
    res = (data > 9) ? '' + data : '0' + data
    return res
  }

  // Add_activity(){
  //    this.ishow_set_activity=true;
  // }
  // 拍摄界面

  goMakeMoviePage(activity_id) {

    this.make_movie_activity_id = activity_id
    console.log(this.isshow_Photo);
    this.isshow_Photo = true;
    this.isshow_homepage = false;
    // this.progress0 = 0.1;
    // this.progress1 = 0.2 ;
    // this.progress2 = 0.3;
    // console.log(this.progress0);

    //   var m = angular.module('module', []);
    //  m.controller('ctrl', ['$scope', function ($scope) {
    //    this.progress0 = 0.1;
    //     this.progress1 = 0.2 ;
    //     this.progress2 = 0.3;
    //  }]);
    this.getDeviceList(activity_id)
    for (var i = 0; i <= this.deviceList.length - 1; i++) {
      this.deviceList[i]['width'] = '0';
      this.deviceList[i]['status'] = "离线";
    }


  }

  //关闭弹出框
  closePhoto() {
    console.log(this.isshow_Photo);
    this.isshow_Photo = false;
    this.isshow_homepage = true;
  }

  /*
 * 替换任务状态为汉字
 */
  replaceMakeShootState(state) {
    switch (state) {
      case 'shoot_start':
        return '开始拍摄';
      case 'shooting':
        return '录制中';
      case 'shoot_fail':
        return '录制失败';
      case 'triming':
        return '剪辑中';
      case 'trimed':
        return '剪辑完成';
      case 'trim_fail':
        return '剪辑失败';
      case 'upload_start':
        return '开始上传';
      case 'uploading':
        return '上传中';
      case 'uploaded':
        return '上传完成';
      case 'upload_fail':
        return '上传失败';
      default:
        return '未知'
    }
  }

  async upload_test(activity){

    if (confirm("确定上传?")) {
      let res = await this.http.get(environment.apiServer + '/activity/upload_test?activity_id=' + activity.activity_id + '&from=' + localStorage['browser_device_id'] + '&requestId=' + localStorage['browser_device_id'] + '_' + Date.now()).toPromise();

      console.log(res)
      if (res && res['code'] == 1) {
        alert(res['description'])
      }
      if (res && res['code'] == 0) {
        alert('开始上传')
      }
    }
  }

}
