import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import{ShareService}from '../share/share.service';
@Component({
  selector: 'app-Horizontal_result',
  templateUrl: './Horizontal_result.component.html',
  styleUrls: ['./Horizontal_result.component.css'],
})
@Injectable()
export class Horizontal_ResultComponent implements OnInit {
  activity_id:any;
  HK_id:'';
  taskId:'';
  videourl:string='';
  img_url:string='';
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

  isPay: boolean = false;
  ismengban: boolean = true;
  isText:boolean=true;
  is_share: any;

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient,public element:ElementRef,private shareService: ShareService,
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.taskId=params['taskId'];
      this.HK_id=params['HK_id'];
      this.activity_id=params['activity_id'];
   });


     this.videourl='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+this.taskId+'.mp4';
     this.img_url='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+this.taskId+'.jpg';
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
    goback_home(){
        this.router.navigate(['/Local_homepage'],{queryParams:{activity_id:this.activity_id,id:this.HK_id}})
    }

}