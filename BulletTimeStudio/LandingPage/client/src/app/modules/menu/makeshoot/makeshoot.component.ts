import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SocketService } from '../../../shared/socket.service';
import { ActivatedRoute, Params } from '@angular/router';
@Component({
    selector: 'ngx-makeshoot',
    templateUrl: './makeshoot.component.html',
    styleUrls: ['./makeshoot.component.css'],
})
export class MakeshootComponent implements OnInit {
    activitylist:any;
    qrcode_url:string;
    qrcode_urlList: Array<string> =[];
    isShowModal:boolean = false;
    isshow_qrcode:boolean=true;
    isshow_qrcodeList:Array<boolean>=[];
    // deviceList:Array<any>;
    // @ViewChildren modal

    constructor(private activatedRoute: ActivatedRoute, 
        private http: HttpClient,
        private socketService: SocketService ) { }

    ngOnInit() {
       
        this.activatedRoute.queryParams.subscribe((params: Params) => {
        }) 
        // 取得该账号下活动列表
        this.activitylist=JSON.parse(localStorage.getItem('activitylist'))
        this.activitylist.map((_, i) => this.isshow_qrcodeList[i] = false);
        // console.log(this.activitylist)
        localStorage['browser_device_id'] = localStorage.getItem('browser_device_id') || Date.now()
        
    }
   


    
    // 点击拍摄
    async touchToStart(activity_id, index) {
        this.isshow_qrcode=true;
        this.isshow_qrcodeList[index]=false;
        // this.qrcode_url='';
        this.qrcode_urlList[index]='';

        this.activitylist[index]['status']='shoot_start'
        // console.log('拍摄activity_id:', activity_id)
    // console.log(this.activitylist)
        this.socketService.cmdRegister({ 'deviceId': localStorage['browser_device_id'] })
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
        let res = await this.http.get("https://iva.siiva.com/activity/start_prompt?activity_id=" + activity_id + '&from=' + localStorage['browser_device_id'] + '&requestId=' + localStorage['browser_device_id'] + '_' + Date.now()).toPromise().catch(err => console.log(err));
        console.log(res)
        if (res && res['code'] == 1) {
            alert(res['description'])
        }
        if(res && res['code']==0){
            // console.log(res['result']['taskId'])
            // var taskId=res['result']['taskId']
            this.socketService.receiveCmd((res1) => {
                // console.log('receive data:', res1)
                if (res1['action'] == 'post_make_shoot') {
                    for (var i = 0; i <= this.activitylist.length - 1; i++) {
                        if (this.activitylist[i]['settings']['camera_setting']['cameras'][0]['deviceId'] == res1['from']) {
                            // console.log(res1)
                            // console.log(res1['from'])
                            console.log(res1['state']);
                            // console.log(Math.ceil(res1['rate'] * 100))
                            this.activitylist[i]['width'] = Math.ceil(res1['rate'] * 100);
                            this.activitylist[i]['status'] = res1['state'];
                            this.activitylist[i]['reason'] = res1['reason'];
                            // if(res1['rate']==1){
                            //    console.log('上传成功')
                            //    this.qrcode_url='https://iva.siiva.com/me_photo/qrcode_img/mini_'+taskId+'.png';
                            // }
                        }
                    }
                }
                // task剪辑成功显示出qrcode
                if(res1.param){
                    if(res1['param']['action']=='task_complete'){
                        this.isshow_qrcode=false;
                        var taskId=res1['param']['taskId'];
                        console.log(taskId)
                        // this.qrcode_url='https://iva.siiva.com/me_photo/qrcode_img/mini_'+taskId+'.png';
                        this.qrcode_urlList[index]='https://siiva-video.oss-cn-hangzhou.aliyuncs.com/qrcode/'+taskId+'.png';
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
    // 点击拍摄
    async makeMovie(activity_id, index) {
        this.isshow_qrcode=true;
        this.qrcode_urlList[index]='';
        this.isshow_qrcodeList[index]=false;

        this.activitylist[index]['status']='shoot_start'
        // this.ishow_set_activity=false;
        // console.log('拍摄activity_id:', activity_id)
        // console.log('browser_device_id:', localStorage['browser_device_id'])
    //   for (var i = 0; i <= this.activitylist.length - 1; i++) {
    //     this.activitylist[i]['width'] = 0;
    //     this.activitylist[i]['status'] = '';
    //     console.log(this.activitylist[i]['settings']['camera_setting']['cameras'][0]['deviceId'])
    //   }
    //   for (var i = 0; i <= this.deviceList.length - 1; i++) {
    //     this.deviceList[i]['width'] = 0;
    //     this.deviceList[i]['status'] = '';
    //   }
        this.socketService.cmdRegister({ 'deviceId': localStorage['browser_device_id'] })
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
        let res = await this.http.get('https://iva.siiva.com/activity/make_move?activity_id='+activity_id  + '&from=' + localStorage['browser_device_id'] + '&requestId=' + localStorage['browser_device_id'] + '_' + Date.now()).toPromise().catch(err => console.log(err));
        console.log(res)
        if (res && res['code'] == 1) {
            alert(res['description'])
        }
        if(res && res['code']==0){
            // console.log(res['result']['taskId'])
            // var taskId=res['result']['taskId']
            this.socketService.receiveCmd((res1) => {
                // console.log('receive data:', res1)
                if (res1['action'] == 'post_make_shoot') {
                    for (var i = 0; i <= this.activitylist.length - 1; i++) {
                        if (this.activitylist[i]['settings']['camera_setting']['cameras'][0]['deviceId'] == res1['from']) {
                            // console.log(this.activitylist[i]['settings']['camera_setting']['cameras'][0]['deviceId'])
                            // console.log(res1)
                            // console.log(res1['from'])
                            // console.log(Math.ceil(res1['rate'] * 100))
                            this.activitylist[i]['width'] = Math.ceil(res1['rate'] * 100);
                            this.activitylist[i]['status'] = res1['state'];
                            this.activitylist[i]['reason'] = res1['reason'];
                            // if(res1['rate']==1){
                            //    console.log('上传成功')
                            //    this.qrcode_url='https://iva.siiva.com/me_photo/qrcode_img/mini_'+taskId+'.png';
                            // }
                        }
                    }
                }
                // task剪辑成功显示出qrcode
                if(res1.param){
                    if(res1['param']['action']=='task_complete'){
                        var taskId=res1['param']['taskId']
                        console.log(taskId)
                        this.isshow_qrcode=false;
                        // this.qrcode_url='https://iva.siiva.com/me_photo/qrcode_img/mini_'+taskId+'.png';
                        this.qrcode_urlList[index]='https://siiva-video.oss-cn-hangzhou.aliyuncs.com/qrcode/'+taskId+'.png';
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
    async touchToCancel(activity_id, index) {
        this.activitylist[index]['status']=false
        let res = await this.http.get("https://iva.siiva.com/activity/stop_prompt?activity_id=" + activity_id + '&from=' + localStorage['browser_device_id'] + '&requestId=' + localStorage['browser_device_id'] + '_' + Date.now()).toPromise().catch(err => console.log(err));

    }
    touchToToggleModal() {
        // console.log(this.isShowModal);
        return this.isShowModal=!this.isShowModal;

    }

    replaceMakeShootState(state) {
        switch (state) {
          case 'shoot_start':
            return '开始拍摄';
          case 'shooting':
            return '录制中';
          case 'shoot_fail':
            return '拍摄中';
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
      toggleqrcode(i) {
        return this.isshow_qrcodeList[i] = !this.isshow_qrcodeList[1];
      }
}