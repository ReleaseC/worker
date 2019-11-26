import { Component, OnInit, ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import{ShareService}from '../share/share.service';
import{LoggerService}from '../share/logger.service';
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.css']
})
@Injectable()
export class HomePageComponent implements OnInit  {
  isShow_iconall_L:boolean=false;
  isShow_iconme_L:boolean=true;
  isShow_icondown_H:boolean=false;
  isShow_icondown_L:boolean=true;
  isShow_iconup_L:boolean=false;
  isShow_iconup_H:boolean=false;
  play_number:any;
  ip_number:any;
  video_number:any;
  videolist=[];
  likeVideolist=[];
  collectVideolist=[];
  tasklist=[];
  time:any;
  isShow_firstpage:boolean=true;
  // isShow_mypage:boolean=true;
  myvideos_number:number=0;
 likevideos_number:number=0;
 collectvideos_number:number=0;
 isclicked_myvideos:boolean=true;
 isclicked_likevideos:boolean=false;
//  nikeName:string='未知';
 activity_list:any;
 isshow_navleft:boolean=false;
 activityPlace:string='北京市';
 activity_address_list=[];
 activity_name_list=[];
 activityTime:any;
 activity_id:any;
 id:any;
 banner_img:any;
 activityName:any;
 description:any;
 isshowMark:boolean=true;
 isshowTitle:boolean=true;
 getScrollTop:any;
 headimgurl:string='assets/images/pic_border.png';
 scrollTop:any;
 height_value:string='300px'
 border1_width:string='';
 taskId:'';
 is_share:any;
 isshow_homepage_bottom:boolean=true;   //显示底部导航栏
 flag:boolean=false;
 page_index:number=0
 page_number:number=20;
 fresh_flag:boolean=true;
 isshow_findme:boolean=false;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient,public element:ElementRef,private shareService: ShareService,private loggerService:LoggerService
  ) { }

 ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.id=params['id'];
      this.activity_id=params['activity_id'];
      this.getScrollTop=params['getScrollTop'];
      this.taskId=params['taskId'];
      this.is_share=params['is_share']
      this.loggerService.log(this.activity_id+'>>>>>>>>>>>>>>>>>');
      localStorage.setItem('activity_id',this.activity_id)


          // // 隐藏微信分享接口
          // document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
          //   wx.hideOptionMenu();
          //   });

      // 小小运动馆活动处理(不需要底部导航栏、详情icon、点赞icon、收藏icon、打赏icon)
      if(this.activity_id=='1545000008gx'||localStorage.getItem('activity_id')=='1545000008gx'||this.activity_id=='1545000008ll'||localStorage.getItem('activity_id')=='1545000008ll'||this.activity_id=='1545000008mm'||localStorage.getItem('activity_id')=='1545000008mm'||this.activity_id=='1545000008nn'||localStorage.getItem('activity_id')=='1545000008nn'){
        this.isshow_homepage_bottom=false;
        this.element.nativeElement.querySelector(".home_body").style.height='100%';
        this.height_value='200px'
      }

      // 去掉ios分享带来的?from=singlemessage&isappinstalled=0
      if(this.is_share=='siiva'){    
        var u = navigator.userAgent;
        var isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
        if(isiOS){
          window.location.href='https://ui.siiva.com/SiivaPage/#/homepage?activity_id='+this.activity_id
        }
      }
      if(localStorage.getItem('id')!=null){               //缓存读取头像昵称等资讯
        this.id=localStorage.getItem('id');
      }else{
        if(this.id==undefined&&this.is_weixn()){                           //确认微信浏览器后进入授权
            window.location.href='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wxb0c9caded7e8fc8d&redirect_uri=https%3a%2f%2fiva.siiva.com%2fwechat%2fget_code&response_type=code&scope=snsapi_base&state=SiivaPage,'+this.activity_id+'&connect_redirect=1#wechat_redirect';
        }else{                                           //授权后读取url上资讯并写入缓存
          localStorage.setItem('id',this.id);
        }
      }
   });

   if(localStorage.getItem('id')=='oaRK30ccp8vKWaGpJdJMnHWqy65Y'||this.activity_id=='1540537062'){
    this.isshow_findme=true;
 }
     //  进入指定活动页面
    if(this.activity_id!==undefined&&this.getScrollTop==undefined){
      this.loggerService.log(this.activity_id);
      localStorage.setItem('page_index',String(this.page_index));
      this.getTasklist(this.activity_id,this.page_number*this.page_index,this.page_number);
    }else{
      // 删除视频进来
      if(this.getScrollTop==2&&this.taskId!==undefined){
        this.videolist.splice(0,this.videolist.length)
        this.getTasklist(this.activity_id,'0',this.page_number*this.page_index+this.page_number);  //刷新到目前page_index位置
      }else{
        //  从缓存读取活动资讯
        if(localStorage.getItem('activity_id')!=null){
          this.page_index=Number(localStorage.getItem('page_index'));
          this.activity_id=localStorage.getItem('activity_id')
          this.ip_number=Number(localStorage.getItem('ip_number'));
          this.video_number=Number(localStorage.getItem('video_number'));
          this.play_number=Number(localStorage.getItem('play_number'))
          this.activityName=localStorage.getItem('activityName');
          this.description=localStorage.getItem('description');
          this.banner_img=localStorage.getItem('banner_img');
          if(this.banner_img=='http://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/banner.png'){
            this.isshowTitle=true;
            this.isshowMark=true;
          } else {
            this.isshowTitle=false;
            this.isshowMark=false;
          }
          // this.loggerService.log(this.videolist);
          // console.log(this.page_index)
          if(this.getScrollTop==1&&this.taskId!==undefined){
            this.videolist.splice(0,this.videolist.length)
            this.videolist=JSON.parse(localStorage.getItem('videolist'));
            console.log(this.videolist)
            this.fresh_flag=false
            // console.log('加载好了哟')
            var self=this;
            setTimeout(()=>{
              self.fresh_flag=true;
              console.log(self.fresh_flag)
            },3000)
            this.scrollIntoView(this.taskId)
          }
          this.shareService.onWechatShare(window.location.href,null,this.activity_id);
      }
    }
    }

  }



  



  scrollToLastPosition(){
    setTimeout(()=>{
      this.element.nativeElement.querySelector("#firstpage").scrollTop=Number(localStorage.getItem('scrollTop'));
    },500)
  }

  // // 选择活动名称
  // selectName(activity_id,i){
  //   $('#btn_name_'+i).css("background","rgb(106,127,230)").siblings().css("background","rgba(50,56,108,0.35)");
  //   this.activity_id=activity_id;
  //   console.log('选中的活动ID:'+this.activity_id)
  // }

  // // 选择活动地点
  // selectPlace(address,i){
  //   this.activity_id=undefined;
  //   this.activityPlace=address;
  //   this.activity_name_list.splice(0,this.activity_name_list.length);
  //   $('#btn_place_'+i).css("background","rgb(106,127,230)").siblings().css("background","rgba(50,56,108,0.35)");
  //   for(let i=0;i<=this.activity_list.length-1;i++){
  //      if(this.activity_list[i].address==address){
  //        this.activity_name_list.push(this.activity_list[i])
  //      }
  //   }
  //   console.log(this.activity_name_list)
  // }

  // // 重置筛选
  // reset(){
  //   $('.btn_single').css('background','rgba(50,56,108,0.35)');
  //   // this.activityTime='';
  // }

//   // 确认筛选
//  async confirm(){
//     if(this.activity_id==undefined){
//       alert('请选择活动名称')
//     }else{
//       // this.activityTime = typeof this.activityTime === 'undefined' ?  new Date().toLocaleDateString().replace(/\//g, '/') : this.activityTime.replace(/\-0/g, '-');
//       console.log(this.activity_id)
//       // console.log(this.activityTime)   
//       $('.nav_right').animate({left:"100%"},500);
//       this.isshow_navleft=false;
//       // // 统计活动ip量
//       // if(localStorage.getItem('id')!=null){
//       //  await this.shareService.count_activity_ip_number(this.activity_id,localStorage.getItem('id'))
//       // }
//       this.getTasklist(this.activity_id)
//     }
//   }



  // // 筛选方法
  // select(){
  //   $('.nav_right').animate({left:"25%"},500)
  //    this.isshow_navleft=true;
  //    this.reset();
  //    console.log(this.activityPlace)
  //    console.log(this.activityTime)
  // }

  // // 重新定位
  // refresh_position(){
  //   var self=this;
  //   $('.refresh_pic').addClass('translate_rotate_act');
  //     // 百度地图API功能
  //   var map = new BMap.Map("allmap");
  //   var point = new BMap.Point(121.48789949,31.24916171);
  //   map.centerAndZoom(point,12);

  //   // // 根据IP定位
  //   // function myFun(result){
  //   //   var cityName = result.name;
  //   //   map.setCenter(cityName);
  //   //   console.log("当前定位城市:"+cityName);
  //   // }
  //   // var myCity = new BMap.LocalCity();
  //   // myCity.get(myFun); 

  //   // 浏览器定位
  //   var geolocation = new BMap.Geolocation();
  //   //开启SDK辅助定位
  //   geolocation.enableSDKLocation();
  //   geolocation.getCurrentPosition(function(r){console.log(r.point)
  //     console.log(this.getStatus()+'>>>>>>>>>>>>>')
  //       if(this.getStatus() == 0){
  //           var mk = new BMap.Marker(r.point);
  //           map.addOverlay(mk);//标出所在地
  //           map.panTo(r.point);//地图中心移动
  //           var point = new BMap.Point(r.point.lng,r.point.lat);//用所定位的经纬度查找所在地省市街道等信息
  //           var gc = new BMap.Geocoder();
  //           gc.getLocation(point, function(rs){
  //              var addComp = rs.addressComponents; 
  //              console.log(rs.addressComponents.city)
  //              self.activityPlace=rs.addressComponents.city;
  //              setTimeout(()=>{
  //               self.activity_name_list.splice(0,self.activity_name_list.length);
  //               for(let i=0;i<=self.activity_list.length-1;i++){
  //                 if(self.activity_list[i].address==self.activityPlace){
  //                   self.activity_name_list.push(self.activity_list[i])
  //                 }
  //               }
  //              },1000)
  //              $('.refresh_pic').removeClass('translate_rotate_act');
  //             //  console.log(rs.address);//地址信息
  //           });
  //       }else {
  //           alert('failed'+this.getStatus());
  //       }        
  //   },{enableHighAccuracy: true})

  // }
  // // 取消筛选方法
  // cancel_selection(){
  //   $('.nav_right').animate({left:"100%"})
  //   this.isshow_navleft=false;
  //   this.reset();
  // }

  

  // 滑动方法
  scroll(id){
    var height= this.element.nativeElement.querySelector('.banner').offsetHeight;
    var top= this.element.nativeElement.querySelector("#"+id).scrollTop;
    this.scrollTop=top;
    if(id=='firstpage'){
      if(this.videolist.length<=2){
        this.element.nativeElement.querySelector('.videolist').style.height='60%'
      }else{
        this.element.nativeElement.querySelector('.videolist').style.height='auto'
      }
    }
    if(top>=height){
      this.element.nativeElement.querySelector('.middle-col').style.position='fixed';
      this.element.nativeElement.querySelector('.middle-col').style.background='rgba(12,9,27,0.86)';
    }else{
      this.element.nativeElement.querySelector('.middle-col').style.position='relative';
      this.element.nativeElement.querySelector('.middle-col').style.background='#0c091b';
    }

    var clientHeight=this.element.nativeElement.querySelector("#"+id).clientHeight
    var scrollHeight=this.element.nativeElement.querySelector("#"+id).scrollHeight
    if(this.fresh_flag){
    if(top+clientHeight>scrollHeight-100){
      if(!this.flag){
        this.flag=true;
        this.page_index++;
        localStorage.setItem('page_index',String(this.page_index));
        this.NextPage(this.activity_id,this.page_number*this.page_index,this.page_number);
      }
    }
   }
  }

  // 去捞取下一页的资料
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
      this.flag = this.tasklist.length==this.page_number?false:true
      // console.log(this.tasklist.length+'======>'+this.flag)
      console.log(this.videolist)
      // 每一次唠叨新增的videolist都需要更新下缓存FOR视频页
      localStorage.setItem('videolist',JSON.stringify(this.videolist));
    })
  }

  // 获取视频列表方法
  getTasklist(activity_id,start,limit){
    localStorage.setItem('activity_id',activity_id)  
    if(start==0){
      this.videolist.splice(0,this.videolist.length)
    }
    
    this.http
    .get(`${environment.downloadServer}activity`,{ params: { 'activity_id': activity_id,'state':'complete','start':start,'limit':limit} })
    .subscribe(data => {
      var self=this;
      console.log(data)
      self.loggerService.log(data);
      console.log(typeof data['play'])
      self.play_number=data['play'];
      self.ip_number=data['ipvisit'];
      if(data['banner']==''){
        self.banner_img='http://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/banner.png';
      }else{
        self.banner_img=data['banner'];   //若banner不为空则不显示活动名称和描述
        self.isshowTitle=false;
        self.isshowMark=false;
      }
      self.activityName=data['activity_name'];
      self.description=data['mark'];
      self.tasklist=data['tasks'];
      // api.siiva.com是从后往前排序
      for(let i=0;i<=self.tasklist.length-1;i++){
        if(self.tasklist[i]['state']==='complete'){
          self.videolist.push(self.tasklist[i])
        }
      }
      if(self.videolist.length<=2){
        if(activity_id=='1545000008nn'||'1545000008mm'||'1545000008ll'){
          self.element.nativeElement.querySelector('.videolist').style.height='61%'
        }else{
          self.element.nativeElement.querySelector('.videolist').style.height='60%'
        }
      }else{
        self.element.nativeElement.querySelector('.videolist').style.height='auto'
      }
      self.video_number=data['count'];
      localStorage.setItem('ip_number',String(self.ip_number));
      localStorage.setItem('play_number',String(self.play_number));
      localStorage.setItem('activityName',String(self.activityName));
      localStorage.setItem('description',String(self.description));
      localStorage.setItem('banner_img',String(self.banner_img));
      localStorage.setItem('video_number',String(self.video_number));
      self.loggerService.log(self.videolist)
      localStorage.setItem('videolist',JSON.stringify(self.videolist));
      // 统计活动ip量
      if(localStorage.getItem('id')!=null){
        self.shareService.count_activity_ip_number(self.activity_id,localStorage.getItem('id'))
       }
        //  分享微信朋友圈和好友自定义内容
        self.shareService.onWechatShare(window.location.href,null,self.activity_id);

        if(self.getScrollTop==2&&self.taskId!==undefined){   //删除视频进来回到taskId处
          setTimeout(()=>{
            self.scrollIntoView(self.taskId)
          },2000)
        }

    })
  }

  
  // 进入视频页面
  goVideo(activity_id,taskId,i){
   if(activity_id==undefined){
     activity_id=localStorage.getItem('activity_id');
   }
      localStorage.setItem('scrollTop',this.scrollTop);         // 设定“浏览位置”进缓存
      if(activity_id=="1541820638qq"){                            //时光子弹横屏项目
        this.router.navigate(['Horizontal_result'],{queryParams:{activity_id:activity_id,taskId:taskId}});
      }else{
        this.router.navigate(['result'],{queryParams:{index:i,activity_id:activity_id,taskId:taskId,id:localStorage.getItem('id')}});
      }
  }
 
  // 进入上传照片页面
  goUploadPhoto(){
    this.router.navigate(['uploadphoto']);
  }

  //点击“全部” 
  getallvideos(){
    this.isShow_iconme_L=true;
    this.isShow_iconall_L=false;
    this.isShow_firstpage=true;
    if(this.isShow_icondown_H){
      this.isShow_icondown_L=true;
      this.isShow_icondown_H=false;
    }
    if(this.isShow_iconup_H){
      this.isShow_iconup_L=true;
      this.isShow_iconup_H=false;
    }
  }
  
  // 点击“升序”
  sortByASC(){
    this.isShow_iconall_L=true;
    this.isShow_iconme_L=true;
    this.isShow_iconup_L=false;
    this.isShow_iconup_H=true;
    this.isShow_firstpage=true;
  }
  // 点击“降序”
  sortByDESC(){
    this.isShow_iconall_L=true;
    this.isShow_iconme_L=true;
    this.isShow_iconup_L=false;
    this.isShow_iconup_H=false;
    this.isShow_icondown_H=true;
    this.isShow_icondown_L=false;
    this.isShow_firstpage=true;
  }
  // 升序变降序
  sortByASCtoDESC(){
    this.isShow_icondown_H=true;
    this.isShow_icondown_L=false;
    this.isShow_iconup_H=false;
    this.isShow_iconup_L=false;
    this.videolist.reverse();
  }
  // 降序变升序
  sortByDESCtoASC(){
    this.isShow_icondown_H=false;
    this.isShow_icondown_L=false;
    this.isShow_iconup_H=true;
    this.isShow_iconup_L=false;
    this.videolist.reverse();
  }
  // 点击“我的”
  getmyvideo(){
        //获取该用户赞过视频列表
        this.likeVideolist.splice(0,this.likeVideolist.length);
        this.collectVideolist.splice(0,this.collectVideolist.length);
        this.http
        .get(`${environment.apiServer}task/like_list`,{ params: {'openid':this.id} })
        .subscribe(data => {
          this.loggerService.log(data);
          this.likeVideolist=JSON.parse(JSON.stringify(data));
          this.likevideos_number=this.likeVideolist.length;
        }); 
         //获取该用户收藏过视频列表
         this.collectVideolist.splice(0,this.collectVideolist.length);
         this.http
         .get(`${environment.apiServer}task/collect_list`,{ params: {'openid':this.id} })
         .subscribe(data => {
           this.loggerService.log(data);
           this.collectVideolist=JSON.parse(JSON.stringify(data));
           this.collectvideos_number=this.collectVideolist.length;
         }); 
          this.isShow_firstpage=false;
          this.isShow_iconme_L=false;
          this.isShow_iconall_L=true;
          if(this.isShow_icondown_H){
            this.isShow_icondown_L=true;
            this.isShow_icondown_H=false;
          }
          if(this.isShow_iconup_H){
            this.isShow_iconup_L=true;
            this.isShow_iconup_H=false;
          }
          // // 设定“浏览位置”进缓存
          // localStorage.setItem('scrollTop',this.scrollTop);
  }
  // 点击“我的视频”
  getmyvideos(){
    this.isclicked_myvideos=true;
    this.isclicked_likevideos=false;
  }
  // 点击“赞过”
  getlikevideos(){
    this.isclicked_myvideos=false;
    this.isclicked_likevideos=true;
  }

  Fresh(){
    this.fresh_flag=false
    this.videolist.splice(0,this.videolist.length)
    this.page_index=0;
    localStorage.setItem('page_index',String(this.page_index));
    this.loggerService.log(this.page_number*this.page_index);
    this.getTasklist(this.activity_id,this.page_number*this.page_index,this.page_number);
    var self=this;
    setTimeout(()=>{
      self.fresh_flag=true
    },3000)
  }
  
  scrollToTop(){
    this.element.nativeElement.querySelector('#firstpage').scrollTop=0;
    // document.getElementById("1544100998nl_1544239008591").scrollIntoView();
    
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
    scrollIntoView(taskId){
      // console.log('移动的taskId是：'+taskId)
      setTimeout(()=>{
        document.getElementById(taskId).scrollIntoView();
      },1000)
    }

}
