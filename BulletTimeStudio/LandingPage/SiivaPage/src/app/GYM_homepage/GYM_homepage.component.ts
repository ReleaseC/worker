import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ShareService}from '../share/share.service';
@Component({
  selector: 'app-GYM_homepage',
  templateUrl: './GYM_homepage.component.html',
  styleUrls: ['./GYM_homepage.component.css']
})
@Injectable()
export class GYM_HomePageComponent implements OnInit { 
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
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient,public element:ElementRef,private shareService: ShareService
  ) { }

 ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.HK_id=params['id'];
      this.activity_id=params['activity_id'];
   });
   



   this.http
   .get(`${environment.downloadServer}activity_info`,{ params: {'openid': this.HK_id}})
   .subscribe(data => {
     console.log(data)
     this.HK_videolist.splice(0,this.HK_videolist.length);
     this.tasklist=data['result'][0]['tasks'];
         for(let i=this.tasklist.length-1;i>=0;i--){
           if(this.tasklist[i]['state']==='complete'){
               this.HK_videolist.push(this.tasklist[i])
           }
         }
         console.log(this.HK_videolist)
   
    //  if(this.HK_videolist.length<=3){
    //   this.element.nativeElement.querySelector('.videolist').style.height='60%';
    // }else{
    //   this.element.nativeElement.querySelector('.videolist').style.height='auto';
    // }          
   })

// 调用微信SDK实现分享和支付
   this.shareService.onWechatSharePay(window.location.href,null,'1545000008gx');
  }

  goVideo(activity_id:string,taskId:string,horizontal:boolean){
    if(horizontal){
      this.router.navigate(['GYMHorizontal_result'],{queryParams:{activity_id:activity_id,taskId:taskId,HK_id:this.HK_id}});
    }else{
      this.router.navigate(['GYMVertical_result'],{queryParams:{activity_id:activity_id,taskId:taskId,HK_id:this.HK_id}});
    }
  }


}
