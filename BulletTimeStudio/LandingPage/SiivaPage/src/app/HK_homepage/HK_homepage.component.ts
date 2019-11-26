import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ShareService}from '../share/share.service';
@Component({
  selector: 'app-HK_homepage',
  templateUrl: './HK_homepage.component.html',
  styleUrls: ['./HK_homepage.component.css']
})
@Injectable()
export class HK_HomePageComponent implements OnInit { 
  HK_videolist=[];
  tasklist:any;
  time:any;
  isShow_firstpage:boolean=true;
 activity_list:any;
 activityTime:any;
 activity_id:any;
 HK_id:any;
 scrollTop:any;
 isshowVideolist:boolean=true;
 border1_width:string='';
 LatestpayTime:string='';
 isshowText:boolean=false;  //视频过期提醒语
 isshowText_unfinish:boolean=false;   //视频还未生成提醒
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient,public element:ElementRef,private shareService: ShareService
  ) { }

 ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.HK_id=params['id'];
      this.activity_id=params['activity_id'];
      console.log(this.HK_id)
   });

   this.http
   .get(`${environment.downloadServer}activity_info`,{ params: {'openid': this.HK_id}})
   .subscribe(data => {
     console.log(data)
     if(data['code']==1){
      //  console.log('您没有拍摄过')
       this.isshowVideolist=false;
       if(this.HK_videolist.length<=3){
        this.element.nativeElement.querySelector('.videolist').style.height='60%';
      }else{
        this.element.nativeElement.querySelector('.videolist').style.height='auto';
      }
     }else{
       if(data['code']==2){
          var self=this;
          self.isshowText=true
           setTimeout(()=>{
             self.isshowText=false;
             this.isshowVideolist=false;
           },3000)
       }else{   
          this.HK_videolist.splice(0,this.HK_videolist.length);
          this.tasklist=data['result'][0]['tasks'];
              for(let i=this.tasklist.length-1;i>=0;i--){
                if(this.tasklist[i]['state']==='complete'){
                    this.HK_videolist.push(this.tasklist[i])
                }
              }
            }
            if(this.HK_videolist.length==0){
              this.isshowText_unfinish=true;
            }
              if(this.HK_videolist.length<=3){
                this.element.nativeElement.querySelector('.videolist').style.height='60%';
              }else{
                this.element.nativeElement.querySelector('.videolist').style.height='auto';
              }

              console.log(this.HK_videolist)
              localStorage.setItem('HK_videolist',JSON.stringify(this.HK_videolist));

              // 判断付费时间内免费视频
              this.http
              .get(`${environment.downloadServer}pay_info`,{ params: {'openid': this.HK_id}})
              .subscribe(data => {
                console.log(data['code'])
                if(data['code']==0){
                  this.LatestpayTime=data['time']
                }
              })
            }
            
   })

// 调用微信SDK实现分享和支付
   this.shareService.onWechatSharePay(window.location.href,null,'1541382417');
  }

  goVideo(activity_id,taskId,createdAt){
    if(createdAt=='demo'){   //案例视频进入
      this.router.navigate(['HK_result'],{queryParams:{activity_id:activity_id,taskId:taskId,id:this.HK_id,isDemo:true}});
    }else{
        if(createdAt<this.LatestpayTime){
          this.router.navigate(['HK_result'],{queryParams:{activity_id:activity_id,taskId:taskId,id:this.HK_id,isPay:true}});
        }else{
          this.router.navigate(['HK_result'],{queryParams:{activity_id:activity_id,taskId:taskId,id:this.HK_id,isPay:false}});
        }
    }
  }

}
