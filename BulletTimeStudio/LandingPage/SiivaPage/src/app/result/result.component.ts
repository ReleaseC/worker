import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{ShareService}from '../share/share.service';
import{LoggerService}from '../share/logger.service';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.css'],
})
@Injectable()
export class ResultComponent implements OnInit {
  id: '';
  taskId: string = '';
  videourl: string = '';
  isLove: boolean = false;
  isnoLove:boolean=true;
  isCollect:boolean=false;
  isnoCollect:boolean=true;
  isPlay: boolean = false;
  isShare: boolean = false;
  isShareimg: boolean = false;
  isClick: boolean = false;
  isResult: boolean = true;
  isShow: boolean = true;
  isPay: boolean = false;
  ismengban: boolean = true;
  isText:boolean=true;
  love_number: number = 0;
  i: any;
  value: number = 0;
  is_share: any;
  baseUrl: any;
  number: any;
  // payid:any;
  img_url:string='';
  activity_id:any;
  createdAt:any;
  activityName:any;
  author:string='当当老师';
  isshowInfo:boolean=false;
  isshowTaskDelInfo:boolean=false;
  index:number;
  videolist=[];
  tasklist=[];
  isshow:boolean=true;
  video_url:any;
  isPlay_number:boolean=false;
  isshowTask_del_icon:boolean=false;
  isshowlogo:boolean=false   //小课堂logo显示与否
  flag:number=1  //标记解决循环播放多次初始化
  isshow_Collect:boolean=true;  
  isshow_Pay:boolean=true;
  isshow_Love:boolean=true;
  isshow_Info:boolean=true;
  video_index:number=0;
  getScrollTop:number=1;
  page_index:number=Number(localStorage.getItem('page_index'))||0;
  page_number:number=20;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient,public element:ElementRef,private shareService: ShareService,private loggerService:LoggerService
  ) { }

  async ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.taskId=params['taskId'];
      this.id=params['id'];
      this.activity_id=params['activity_id'];
      this.is_share=params['is_share'];
      this.index=params['index'];
    });
    // 只有don的openid有删除权限
    if(localStorage.getItem('id')=='oaRK30VC18ngzWZWC7stFXooiVTE'||localStorage.getItem('id')=='oaRK30beEIx6jKcm21cgZV6O-uv8'||localStorage.getItem('id')=='oaRK30ccp8vKWaGpJdJMnHWqy65Y'||localStorage.getItem('id')=='oaRK30ZptoM8JrJyuxQVduO3oAZE'||localStorage.getItem('id')=='oaRK30YsfqOv0w2AjlmHG-8Kjwns'||localStorage.getItem('id')=='oaRK30Z1T5QmylKx7Z_pdSEdOQxI'||localStorage.getItem('id')=='oaRK30ccp8vKWaGpJdJMnHWqy65Y'||localStorage.getItem('id')=='oaRK30WDDbUEmjQ8xgyxjCBJDgUc'||localStorage.getItem('id')=='oaRK30RwrAQ1B_BVjYJTiFxCCZPw'){
       this.isshowTask_del_icon=true;
    }

    // 如果是小小运动馆显示跳转logo  小小运动馆活动处理(不需要底部导航栏、详情icon、点赞icon、收藏icon、打赏icon)
    if(this.activity_id=='1545000008gx'||'1545000008ll'||'1545000008mm'||'1545000008nn'){this.IsGYM_Setting(); }

    // 去掉ios分享带来的?from=singlemessage&isappinstalled=0
    if(this.is_share=='siiva'){
      var u = navigator.userAgent;
      var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if(isiOS){
        window.location.href='https://ui.siiva.com/SiivaPage/#/result?activity_id='+this.activity_id+'&taskId='+this.taskId+'&is_share=siiva123'
      }
    }
   await this.getVideolistAndIndex();

  
  
    //  分享微信朋友圈和好友自定义内容
     this.shareService.onWechatGetSDK(window.location.href,this.taskId,this.activity_id);
  }

  getVideolistAndIndex(){
    if(this.index!==undefined){
      this.updateVideolist(this.index)
      // this.videolist=JSON.parse((localStorage.getItem('videolist')));
     }else{
      //  分享出去的链接(通过taskId找到对应index值)
      this.videolist.splice(0,this.videolist.length);
      this.http
      .get(`${environment.apiServer}activity`,{ params: { 'activity_id': this.activity_id} })
      .subscribe(data => {
        this.loggerService.log(data);
        this.tasklist=data['tasks'];
        for(let i=this.tasklist.length-1;i>=0;i--){
          if(this.tasklist[i]['state']==='complete'){
             this.videolist.push(this.tasklist[i])
          }
        }
        this.loggerService.log(this.videolist);
        for(let i=0;i<=this.videolist.length-1;i++){
          if(this.videolist[i]['task']['taskId']==this.taskId){
            this.index=i;
          }
        }
       this.swiper(this.index);
       if(!this.is_weixn()){this.IsNotInWechat();}
     })
    }
  }

  updateVideolist(index){
    this.loggerService.log(index+'>>>>>>>>>>');
    var num=Number(index)
      this.tasklist=JSON.parse((localStorage.getItem('videolist')));
      this.videolist.splice(0,this.videolist.length);
      if(this.tasklist.length<=100){
        for(let i=0;i<=this.tasklist.length-1;i++){
           if(this.tasklist[i]['state']==='complete'){this.videolist.push(this.tasklist[i])}
        }
        this.swiper(num);
      }else{
        if(num<=50){
          for(let i=0;i<=100;i++){
            if(this.tasklist[i]['state']==='complete'){this.videolist.push(this.tasklist[i])}
         }
         this.swiper(num);
        }else{
          if(num<this.tasklist.length-50){
            this.loggerService.log(this.tasklist);
            for(let i=num-50; i<=num+50; i++){
              if(this.tasklist[i]['state']==='complete'){this.videolist.push(this.tasklist[i])}
           }
           this.loggerService.log(this.videolist)
           this.swiper(50);
          }else{
            for(let i=num-50;i<=this.tasklist.length-1;i++){
              if(this.tasklist[i]['state']==='complete'){this.videolist.push(this.tasklist[i])}
           }
           this.swiper(50);
          }
          
        }


      }
      // console.log(this.videolist)
  }

 swiper(index){
   this.loggerService.log(index);
    var self=this;
    const swiper = new Swiper('.swiper-container', {
     direction: 'vertical',
     initialSlide :index,
     pagination: {
       el:'.swiper-pagination',
     },
     dynamicBullets:true,
     paginationClickable: true,
     preloadImages:false,
     lazy:true,
    //  lazyLoadingInPrevNextAmount : 2,
     // hashNavigation: true,  //锚导航
     longSwipesRatio: 0.3, //触发swiper所需要的最小拖动距离比例
     touchRatio: 1,  //滑动的拖放的，如果是1表示滑动之后换下一个界面是一整块，如果是0.5就表示才能滑一半。
     observer: true, // 修改swiper自己或子元素时，自动初始化swiper
     observeParents: true, // 修改swiper的父元素时，自动初始化swiper
     on:{
       init:function(event){
         self.video_index=index;
         self.loggerService.log('当前视频taskId是:'+self.videolist[index]['task']['taskId']);
        //  self.isLoveVideo(self.id,self.videolist[self.index]['task']['taskId']);
         self.video_url='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+self.videolist[index]['task']['taskId']+'.mp4';
         self.shareService.onMenuShare(window.location.href,self.videolist[index]['task']['taskId'],self.activity_id);
         var u = navigator.userAgent;
         var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
         if(isiOS){
            self.count_play_number('true',self.videolist[index]['task']['taskId'])
         }else{
          self.img_url='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+self.videolist[index]['task']['taskId']+'.jpg'
            self.element.nativeElement.querySelector("video").addEventListener("canplaythrough", function(){
              if(self.flag==1){    //video loop第二次不在触发count_play_number
                  self.flag=2;
                  self.count_play_number('true',self.videolist[index]['task']['taskId'])
                }
              })
            }
      },
       touchStart:function(event){
        //  console.log('当前索引是:'+swiper.realIndex)
       },
       touchMove:function(event){
        self.count_play_number('paused','')
         self.video_url='';
         self.isLove= false;
         self.isnoLove=true;
         self.isCollect=false;
         self.isnoCollect=true;
         self.isshow=true;
         self.isPlay=false;
         self.flag=2;
         self.img_url='';
         self.isPlay_number=false;
       },
       touchEnd:function(event){
                // console.log(swiper.realIndex)
       },
       slideChangeTransitionEnd:function(){
        //  console.log(this.activeIndex+'>>？？？？？？')
        //  console.log('目前页数是：'+self.page_index)
         if(this.activeIndex>=(self.page_index+1)*20-2){
           console.log('快到最后一个了哟')
           self.page_index++;
            self.NextPage(self.activity_id,self.page_index*self.page_number,self.page_number);
            localStorage.setItem('page_index',String(self.page_index))
         }
         self.video_index=this.activeIndex
        //  console.log('aaaaaa当前视频taskId是:'+self.videolist[this.activeIndex]['task']['taskId'])
         self.isLoveVideo(self.id,self.videolist[this.activeIndex]['task']['taskId']);
         self.isCollectVideo(self.id,self.videolist[this.activeIndex]['task']['taskId']);
         self.getTask_loveNumber(self.videolist[this.activeIndex]['task']['taskId']);
         self.video_url='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+self.videolist[this.activeIndex]['task']['taskId']+'.mp4'
         self.shareService.onMenuShare(window.location.href,self.videolist[this.activeIndex]['task']['taskId'],self.activity_id);
        self.taskId=self.videolist[this.activeIndex]['task']['taskId']
        // 目前ios无法自动播放，暂定手动播放
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        self.taskId=self.videolist[this.activeIndex]['task']['taskId']
        if(isiOS){
          self.count_play_number('true',self.taskId)
        }else{
          self.img_url='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+self.videolist[this.activeIndex]['task']['taskId']+'.jpg'
            if(index!==this.activeIndex){
            self.element.nativeElement.querySelector("video").addEventListener("canplaythrough", function(){
              self.loggerService.log(self.flag)
              if(self.flag!=3){
                self.flag=3;
                // console.log('移动后播放')
                self.count_play_number('true',self.taskId)   //改为false  android可自动播放
              }
            })
          }
        }
        },
       slideChange: function(){
        //  console.log(this.activeIndex+'???')
       },
       click: function(){
       },
     }
   });
  }

 NextPage(activity_id,start,limit){
    this.http
    .get(`${environment.downloadServer}activity`,{ params: { 'activity_id': activity_id,'state':'complete','start':start,'limit':limit} })
    .subscribe(data => {
      this.loggerService.log(data);
      console.log(data)
      this.tasklist=data['tasks'];
      for(let i=0;i<=this.tasklist.length-1;i++){
        if(this.tasklist[i]['state']==='complete'){
           this.videolist.push(this.tasklist[i])
        }
      }
      // console.log(this.videolist)
      // 每一次唠叨新增的videolist都需要更新下缓存FOR视频页
      localStorage.setItem('videolist',JSON.stringify(this.videolist));
    })
  }
   //判断该用户是否点赞该视频
   isLoveVideo(openid,taskId){
    if(openid!==undefined){
      this.http
     .get(`${environment.apiServer}task/if_like`,{ params: { 'taskId': taskId,'openid':openid} })
     .subscribe(data => {
       // console.log(data)
       if(data['code']==0){
         this.isLove = true;
        this.isnoLove=false;
       }else{
         this.isLove = false;
         this.isnoLove=true;
       }
     });
    }
  }

    //判断该用户是否收藏该视频
 isCollectVideo(openid,taskId){
  if(openid!==undefined){
    this.http
    .get(`${environment.apiServer}task/if_collect`,{ params: { 'taskId': taskId,'openid':openid} })
    .subscribe(data => {
      // console.log(data)
      if(data['code']==0){
        this.isCollect = true;
        this.isnoCollect=false;
      }else{
        this.isCollect = false;
        this.isnoCollect=true;
      }
    });
  }
}

  // 获取该只视频的点赞量
  getTask_loveNumber(taskId){
    this.http
        .get(`${environment.apiServer}datareport/get_statistics`,{ params: { 'taskId':taskId} })
        .subscribe(data => {
          // console.log(data)
          if(data['code']==0&&data['result'].length!=0){
          this.love_number=data['result'][0]['like'];
          }
        });
  }


  Love(i,taskId) {
    this.isLove = true;
    this.isnoLove=false;
    this.love_number++;
    // 统计该只视频点赞量
    const task_like_count = {
      'taskId': taskId,
      'mode': 'like'
    };
    this.http
      .post(`${environment.apiServer}datareport/statistics`, task_like_count)
      .subscribe(data => {
        this.loggerService.log(data)
      });
    //统计该用户点赞该视频
    this.http
    .get(`${environment.apiServer}task/like`,{ params: { 'taskId': taskId,'openid':this.id} })
    .subscribe(data => {
      this.loggerService.log(data)
    });
  }
// 取消点赞
  Cancel_Love(i,taskId){
    this.isLove = false;
    this.isnoLove=true;
    this.love_number--;
    // 统计该只视频点赞量
    const task_like_decrease = {
      'taskId': taskId,
      'mode': 'like'
    };
    this.http
      .post(`${environment.apiServer}datareport/cancel_statistics`, task_like_decrease)
      .subscribe(data => {
        this.loggerService.log(data)
      });
    //取消该用户点赞该视频
    this.http
    .get(`${environment.apiServer}task/like`,{ params: { 'taskId': taskId,'openid':this.id} })
    .subscribe(data => {
      this.loggerService.log(data)
    });
  }

  Collect(i,taskId){
    this.isCollect = true;
    this.isnoCollect=false;
    // 统计该只视频收藏量
    const task_collect_count = {
      'taskId': taskId,
      'mode': 'collect'
    };
    this.http
      .post(`${environment.apiServer}datareport/statistics`, task_collect_count)
      .subscribe(data => {
        this.loggerService.log(data)
      });
    //统计该用户收藏该视频
    this.http
    .get(`${environment.apiServer}task/collect`,{ params: { 'taskId': taskId,'openid':this.id} })
    .subscribe(data => {
      this.loggerService.log(data)
    });
  }
// 取消收藏
  Cancel_collect(i,taskId){
    this.isCollect = false;
    this.isnoCollect=true;
    // 取消该只视频收藏量-1
    const task_collect_decrease = {
      'taskId': taskId,
      'mode': 'collect'
    };
    this.http
      .post(`${environment.apiServer}datareport/cancel_statistics`, task_collect_decrease)
      .subscribe(data => {
        this.loggerService.log(data)
      });
    //取消该用户收藏该视频
    this.http
    .get(`${environment.apiServer}task/collect`,{ params: { 'taskId': taskId,'openid':this.id} })
    .subscribe(data => {
      this.loggerService.log(data)
    });
  }

  FirstPlay(taskId){
    this.isshow=false;
    this.isPlay_number=false;
    this.isPlay=false;
    var myVideo = document.getElementsByTagName('video')[0];
    myVideo.play();
    const task_play_count = {
      'taskId': taskId,
      'mode': 'play'
    };
    this.http
      .post(`${environment.apiServer}datareport/statistics`, task_play_count)
      .subscribe(data => {
        this.loggerService.log(data)
      }); 
  }

  // 统计视频播放量
  count_play_number(value,taskId) {
    switch(value){
      case 'true':
         this.isPlay_number=true;
         break;
      case 'paused':    
      // this.loggerService.log('暂停')
          var myVideo = document.getElementsByTagName('video')[0];
          myVideo.pause();
          break;
      case 'false':
          this.isPlay_number=false;
          this.isshow=false;
          var myVideo = document.getElementsByTagName('video')[0];
          myVideo.play();
          const task_play_count = {
            'taskId': taskId,
            'mode': 'play'
          };
          this.http
            .post(`${environment.apiServer}datareport/statistics`, task_play_count)
            .subscribe(data => {
              this.loggerService.log(data)
            })
          break;
      default:
      this.loggerService.log('没有该值')
    }
  }
  // 控制video播放与暂停
  playPause(i,taskId) {
    this.isShow = false;
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
  share(i,taskId) {
    this.isShare = true;
    this.isShareimg = true;
    this.isPlay = false;
    this.shareService.onMenuShare(window.location.href,taskId,this.activity_id);
  }
  // 取消分享提示
  cancelShare() {
    this.isShare = false;
    this.isShareimg = false;
  }

  download(i,taskId) {
    // this.router.navigate(['/download'],{queryParams:{taskId:this.taskId}});
    window.location.href='https://ui.siiva.com/SiivaPage/#/download?taskId='+taskId;
  }

  pay(taskId){
        let that=this;
     const body = {
       'openid': localStorage.getItem('id'),
       'total_fee':5,
       'templates':'',
       'siteId':'SiivaPage',
       'taskId':taskId,
       'uid':localStorage.getItem('id'),
       'seller':'之炜新生活'
       };
       that.loggerService.log(body)
       that.http
       .post(`${environment.apiServer}wechat_payment/create_wechatpay`, body)
       .subscribe(data => {
      //  console.log(data['code'])
      //  console.log(data['result'])
       let that=this;
       that.loggerService.log(data)
       wx.chooseWXPay({
         timestamp: data['result'].timestamp, // 支付签名时间戳，注意微信jssdk中的所有使用timestamp字段均为小写。但最新版的支付后台生成签名使用的timeStamp字段名需大写其中的S字符
         nonceStr: data['result'].nonceStr, // 支付签名随机串，不长于 32 位
         package: data['result'].package, // 统一支付接口返回的prepay_id参数值，提交格式如：prepay_id=\*\*\*）
         signType: 'MD5', // 签名方式，默认为'SHA1'，使用新版支付需传入'MD5'
         paySign: data['result'].paySign, // 支付签名
         success: function (res) {
         // 支付成功后的回调函数
             const body_order = {
              'openid':localStorage.getItem('id'),
              'orderid':data['result'].orderid
             }
              that.http
              .post(`${environment.apiServer}wechat_payment/update_pay_state`, body_order)
              .subscribe(data => {
                  that.loggerService.log(data)
                  if(data['code']==0){
                      // window.location.href='https://ui.siiva.com/SiivaPage/#/download?taskId='+that.taskId;
                  }
              })
          }
        });
      })
    }

    goback_home(taskId){
      console.log('返回至'+taskId+'处')
      // android分享链接而来siiva  ios分享链接而来siiva123
      if(this.is_share=='siiva'||this.is_share=='siiva123'|| (this.activity_id!==localStorage.getItem('activity_id'))){
        this.router.navigate(['/homepage'],{queryParams:{activity_id:this.activity_id,taskId:taskId}})
      }else{
        this.router.navigate(['/homepage'],{queryParams:{activity_id:this.activity_id,taskId:taskId,getScrollTop:this.getScrollTop}})
      }
    }

    show_info(taskId){
    //  获取该只视频属性
    this.http
    .get(`${environment.apiServer}task/task_info`,{ params: { 'taskId':taskId} })
    .subscribe(data => {
      this.activityName=data['activity_name'];
      this.createdAt=data['createdAt'];
    });
      if(this.isshowInfo){
        this.isshowInfo=false;
      }else{
        this.isshowInfo=true;
      }
    }
    cancel_showinfo(){
      this.isshowInfo=false;
    }

   //删除该只视频(管理员权限)
    task_del(){
      this.isshowTaskDelInfo=true;
      this.count_play_number('paused','')
      this.isLove= false;
      this.isnoLove=true;
      this.isCollect=false;
      this.isnoCollect=true;
      this.isshow=true;
      this.isPlay=false;
      this.flag=2;
      this.img_url='';
      this.isPlay_number=true;
    }
    // 取消删除提醒
    task_del_cancel(){
      this.isshowTaskDelInfo=false;
    }
    // 确认删除
    task_del_confirm(taskId,index){
      this.loggerService.log('删除的taskId：'+taskId)
      this.loggerService.log(index+'+'+this.video_index)
      this.videolist.splice(index,1)
      // console.log(this.videolist)
      this.video_url='https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_'+this.videolist[this.video_index]['task']['taskId']+'.mp4'    
      this.http
      .get(`${environment.apiServer}task/del`,{ params: { 'taskId': taskId} })
      .subscribe(data => {
        this.loggerService.log(data)
        if(data['code']==0){
          this.isshowTaskDelInfo=false;
          this.getScrollTop=2;
          // PLAN_A
            //  const swiper = new Swiper('.swiper-container', {
            //      direction: 'vertical',
            //  })
            //   swiper.slideTo(this.video_index+1, 1000, false);
            //   this.video_index++;
        }else{
          alert('删除失败')
        }
      });

    }

   // 判断微信浏览器
   is_weixn() {
    var ua = navigator.userAgent.toLowerCase();
    if (ua.indexOf('micromessenger') != -1) {
      return true;
    } else {
      return false;
    }
  }

  GoParter(){
  this.http 
    .get(`${environment.apiServer}activity/flow`,{ params: { 'openid': localStorage.getItem('id'),'activity_id':this.activity_id} })
    .subscribe(data => {
      this.loggerService.log(data)
      if(data['code']==0){
        // 跳转到客户链接
        // window.location.href='http://camp.thelittlegym.com.cn/order_mome'
      }
    });
     // 跳转到客户链接
    window.location.href='http://camp.thelittlegym.com.cn/order_mome'
  }

  IsNotInWechat(){
    this.element.nativeElement.querySelector("video").style.width='100%';
    this.element.nativeElement.querySelector("video").style.height='100%';
    this.element.nativeElement.querySelector("video").style.left='0%';
    this.element.nativeElement.querySelector("video").style.top='0%';
    this.element.nativeElement.querySelector("video").style.transform='';
    this.element.nativeElement.querySelector(".video_top").style.width='100%';
    this.element.nativeElement.querySelector(".video_top").style.height='100%';
    this.element.nativeElement.querySelector(".video_top").style.left='0%';
    this.element.nativeElement.querySelector(".video_top").style.top='0%';
    this.element.nativeElement.querySelector(".video_top").style.transform='';
  }

  // 小小运动馆首页的设定需求
  IsGYM_Setting(){
    this.isshowlogo=true;
    this.isshow_Collect=false;  
    this.isshow_Pay=false;
    this.isshow_Love=false;
    this.isshow_Info=false
  }

}