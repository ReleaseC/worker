import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import{ShareService}from '../share/share.service';
@Component({
  selector: 'app-GYMHorizontal_result',
  templateUrl: './GYMHorizontal_result.component.html',
  styleUrls: ['./GYMHorizontal_result.component.css'],
})
@Injectable()
export class GYMHorizontal_ResultComponent implements OnInit {
  HK_id: '';
  taskId: string = '';
  videourl: string = '';
  isLove: boolean = false;
  isnoLove:boolean=true;
  isCollect:boolean=false;
  isnoCollect:boolean=true;
  isPlay: boolean = true;
  isPlay_number: boolean = true;
  isShare: boolean = false;
  isShareimg: boolean = false;
  isClick: boolean = false;
  isResult: boolean = true;
  // isShow: boolean = true;
  isPay: boolean = false;
  ismengban: boolean = true;
  isText:boolean=true;
  love_number: number = 0;
  i: any;
  value: number = 0;
  is_share: any;
  isplay: any;
  baseUrl: any;
  number: any;
  // payid:any;
  img_url:any;
  activity_id:any;
  createdAt:any;
  activityName:any;
  author:string='当当老师';
  isshowInfo:boolean=false;
  isshowTaskDelInfo:boolean=false;
  // isshow_del:boolean=false;
  img_code:any;
  id:'';
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient,public element:ElementRef,private shareService: ShareService,
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
       this.taskId=params['taskId'];
       this.HK_id=params['HK_id'];
       this.activity_id=params['activity_id'];
       this.is_share=params['is_share'];
       this.id=params['id'];
       this.is_share=params['is_share'];
    });
    if(this.id==undefined||this.is_share=='siiva'){
      window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb0c9caded7e8fc8d&redirect_uri=https%3a%2f%2fiva.siiva.com%2fwechat%2fget_payid&response_type=code&scope=snsapi_base&state=SiivaPage,GYMHorizontal_result,'+this.taskId+','+this.activity_id+','+this.HK_id+'&connect_redirect=1#wechat_redirect';
    }else{
      localStorage.setItem('id',this.id)
      // 统计IP量
      this.shareService.count_activity_ip_number(this.activity_id,localStorage.getItem('id'))
    }

    console.log(this.id)

      this.videourl='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+this.taskId+'.mp4';
      this.img_url='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+this.taskId+'.jpg';
      // if(localStorage.getItem('id')=='oaRK30ccp8vKWaGpJdJMnHWqy65Y'){
      //       this.isshow_del=true;
      // }
    //  分享微信朋友圈和好友自定义内容
     this.shareService.onWechatSharePay(window.location.href,this.taskId,this.activity_id);
  }





  // 统计视频播放量
  count_play_number() {
    this.isText=false;
    const task_play_count = {
      'taskId': this.taskId,
      'mode': 'play'
    };
    this.http
      .post(`${environment.apiServer}datareport/statistics`, task_play_count)
      .subscribe(data => {
        console.log(data)
      });
    this.isPlay_number = false;
    this.isPlay = false;
    var myVideo = document.getElementsByTagName('video')[0];
    if (myVideo.paused) {
      myVideo.play();
      this.isPlay = false;
    } else {
      myVideo.pause();
      this.isPlay = true;
    }
  }
  // 控制video播放与暂停
  playPause() {
    // this.isShow = false;
    this.isPlay_number=false;
    var myVideo = document.getElementsByTagName('video')[0];
    if (myVideo.paused) {
      myVideo.play();
      this.isPlay = false;
    } else {
      myVideo.pause();
      this.isPlay = true;
    }
  }
  // 分享提示
  share() {
    this.isShareimg = true;
  }
  // 取消分享提示
  cancelShare() {
    this.isShareimg = false;
  }


  download() {
    window.location.href='https://ui.siiva.com/SiivaPage/#/download?taskId='+this.taskId;
  }
  GoParter(){
    this.http 
      .get(`${environment.apiServer}activity/flow`,{ params: { 'openid': this.id,'activity_id':this.activity_id} })
      .subscribe(data => {
        console.log(data)
        if(data['code']==0){
        }
      });
       // 跳转到客户链接
      window.location.href='http://camp.thelittlegym.com.cn/order_mome'
    }




    goback_home(){
      if(this.is_share=='siiva'|| (this.activity_id!==localStorage.getItem('activity_id'))){
        this.router.navigate(['/GYM_homepage'],{queryParams:{activity_id:this.activity_id,id:this.HK_id}})
      }else{
        this.router.navigate(['/GYM_homepage'],{queryParams:{activity_id:this.activity_id,getScrollTop:1,id:this.HK_id}})
      }
    }

    //删除该只视频(管理员权限)
    task_del(){
      this.isshowTaskDelInfo=true;
    }
    // 取消删除提醒
    task_del_cancel(){
      this.isshowTaskDelInfo=false;
    }
    // 确认删除
    task_del_confirm(){
      this.http
      .get(`${environment.apiServer}task/del`,{ params: { 'taskId': this.taskId} })
      .subscribe(data => {
        console.log(data)
        if(data['code']==0){
          this.router.navigate(['/homepage'],{queryParams:{activity_id:this.activity_id,getScrollTop:2}})
        }else{
          alert('删除失败')
        }
      });
    }

 






}