import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import{ShareService}from '../share/share.service';
@Component({
  selector: 'app-Local_homepage',
  templateUrl: './Local_homepage.component.html',
  styleUrls: ['./Local_homepage.component.css']
})
@Injectable()
export class Local_HomePageComponent implements OnInit { 
  HK_videolist=[];
  tasklist:any;
 activity_id:any;
 HK_id:any;
 isshowVideolist_hellokitty:boolean=true;
 isshow_csd:boolean=false;
//  isshowVideolist_car:boolean=false;
//  isshowVideolist_bullettime:boolean=false;
 border1_width:string='';
//  isclicked_hellokitty:boolean=true;
//  isclicked_car:boolean=false;
//  isclicked_bullettime:boolean=false;
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
   .get(`${environment.downloadServer}activity/my_scan_task`,{ params: {'openid': this.HK_id}})
   .subscribe(data => {
     console.log(data)
     if(data['code']==0){
          this.HK_videolist.splice(0,this.HK_videolist.length);
          this.tasklist=data['result'][0]['tasks'];
          for(let i=this.tasklist.length-1;i>=0;i--){
                this.HK_videolist.push(this.tasklist[i])        
          }
          console.log(this.HK_videolist.length)
          if(this.HK_videolist.length<=2){
            this.element.nativeElement.querySelector('.videolist').style.height='64%';
          }else{
            this.element.nativeElement.querySelector('.videolist').style.height='auto';
          }

     }else{
       // 未付费、未拍摄
       this.isshowVideolist_hellokitty=false;
     }             
   })

// 调用微信SDK实现分享和支付
   this.shareService.onWechatSharePay(window.location.href,null,'1541382417');
  }

  goVideo(activity_id,taskId){
    console.log(activity_id)
    if(activity_id=='1541382418'){
      this.router.navigate(['HK_result'],{queryParams:{activity_id:activity_id,taskId:taskId,id:this.HK_id,isPay:true}});
    }else{
      this.router.navigate(['Horizontal_result'],{queryParams:{activity_id:activity_id,taskId:taskId,HK_id:this.HK_id}});
    }
  }

  // checkAddress(address){
  //   switch(address)
  //   {
  //     case 'hellokitty':
  //       console.log('hellokitty')
  //       this.isclicked_hellokitty=true;
  //       this.isclicked_car=false;
  //       this.isclicked_bullettime=false;
  //       break;
  //     case 'car':
  //       console.log('car')
  //       this.isclicked_hellokitty=false;
  //       this.isclicked_car=true;
  //       this.isclicked_bullettime=false;
  //       break;
  //     case 'bullettime':
  //       console.log('bullettime')
  //       this.isclicked_hellokitty=false;
  //       this.isclicked_car=false;
  //       this.isclicked_bullettime=true;
  //       break;
  //   }
  // }
  show_csd(){
    this.isshow_csd=true;
  }
  cancle_csd(){
    this.isshow_csd=false;
  }

}
