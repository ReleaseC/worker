import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-templet',
  templateUrl: './templet.component.html',
  styleUrls: ['./templet.component.css']
})
export class TempletComponent implements OnInit {
  templets:string[] = [];
  templets_pay:string[] = [];
  id:any;
  videonames:any;
  templet1_video_url:any;
  templet2_video_url:any;
  templet3_video_url:any;
  templet4_video_url:any;
  templet5_video_url:any;
  templet6_video_url:any;
  ispay2:boolean=false;
  ispay3:boolean=false; 
  ispay4:boolean=false;
  ispay5:boolean=false;
  ispay6:boolean=false;
  template1_pay:boolean=false;
  template2_pay:boolean=false;
  template3_pay:boolean=false;
  template4_pay:boolean=false;
  template5_pay:boolean=false;
  template6_pay:boolean=false;
  taskId:'';
  isLimit:boolean=true;
  isTicket:boolean=false;
  Ticket:any;
  t:any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,private http: HttpClient
) { }



  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.id =  params['id'];
      this.videonames = params['videonames'];
      this.Ticket=params['Ticket'];
      console.log(typeof this.Ticket)
  });
  var templet1=(<HTMLInputElement>document.getElementById("muban1"));
  var templet2=(<HTMLInputElement>document.getElementById("muban2"));
  // var templet3=(<HTMLInputElement>document.getElementById("muban3"));
  // var templet4=(<HTMLInputElement>document.getElementById("muban4"));
  // var templet5=(<HTMLInputElement>document.getElementById("muban5"));
  // var templet6=(<HTMLInputElement>document.getElementById("muban6"));
  var total=(<HTMLInputElement>document.getElementById("total"));
  this.http
  .get(`${environment.apiServer}wechat/get_video_name`, { params: { 'siteId': '0014', 'openid': this.id } })
  .subscribe(data => {
    console.log(data)
    console.log(data['description'])
    console.log(data['name'])
    if(data['description']!==undefined&&data['name']!==undefined){
      this.templet1_video_url='0012_1_0014_'+data['name']+'_'+data['description'];
      this.templet2_video_url='0012_2_0014_'+data['name']+'_'+data['description'];
      // this.templet3_video_url='0012_3_0014_'+data['name']+'_'+data['description'];
      // this.templet4_video_url='0012_4_0014_'+data['name']+'_'+data['description'];
      // this.templet5_video_url='0012_5_0014_'+data['name']+'_'+data['description'];
      // this.templet6_video_url='0012_6_0014_'+data['name']+'_'+data['description'];
      // console.log(this.templet1_video_url)
      this.taskId=data['description'];
      console.log(this.taskId)
    }
    console.log(this.taskId)

   // 判断是否为包票用户
      if(this.Ticket==='true'){
        this.isLimit=false;
        this.isTicket=true;
      }
      
    this.http
    .get(`${environment.apiServer}wechat_payment/get_users_order`, { params: { 'siteId': '0014', 'openid': this.id,'taskId':this.taskId } })
    .subscribe(data => {
      console.log(data)
      if(data['result'].length!==0){
        this.templets_pay.splice(0,this.templets_pay.length)
        for(var j=0;j<=data['result'].length-1;j++){
          //  console.log(data['result'][j])
          // this.templets_pay.splice(0,this.templets_pay.length)
          //  this.templets_pay=data['result'][j]['templates'];
          if(data['result'][j]['is_pay']===1){
           for(var i=0;i<=data['result'][j]['templates'].length-1;i++){
             this.templets_pay.push(data['result'][j]['templates'][i])
           }
          }
          }
          for(var k=0;k<=this.templets_pay.length-1;k++){
           if(this.templets_pay[k]==='2.mov'){
              this.ispay2=true;
              templet2.disabled=true;
            }
            // if(this.templets_pay[k]==='3.mov'){
            //   this.ispay3=true;
            //   templet3.disabled=true;
            // }
            // if(this.templets_pay[k]==='4.mov'){
            //   this.ispay4=true;
            //   templet4.disabled=true;
            // }
            // if(this.templets_pay[k]==='5.mov'){
            //   this.ispay5=true;
            //   templet5.disabled=true;
            // }
            // if(this.templets_pay[k]==='6.mov'){
            //   this.ispay6=true;
            //   templet6.disabled=true;
            // }
          }
        }
    })
  // }
  })

  templet1.disabled=true;
    this.t=setInterval(function(){
      var templet2=(<HTMLInputElement>document.getElementById("muban2"));
      var templet3=(<HTMLInputElement>document.getElementById("muban3"));
      // var templet4=(<HTMLInputElement>document.getElementById("muban4"));
      // var templet5=(<HTMLInputElement>document.getElementById("muban5"));
      // var templet6=(<HTMLInputElement>document.getElementById("muban6"));
      var total=(<HTMLInputElement>document.getElementById("total"));
      if(total.checked){
        // templet1.checked=true;
        if(templet2.disabled===false){ templet2.checked=true;}
        // if(templet3.disabled===false){templet3.checked=true;}
        // if(templet4.disabled===false){templet4.checked=true;}
        // if(templet5.disabled===false){templet5.checked=true;}
        // if(templet6.disabled===false){templet6.checked=true;}
    }
    if((templet2.checked||templet2.disabled)&&!total.checked){
      templet1.checked=false;
        templet2.checked=false;
        // templet3.checked=false;
        // templet4.checked=false;
        // templet5.checked=false;
        // templet6.checked=false;
    }
    },500)

    if(this.templets_pay.length==0){
      this.templets_pay=['null']
    }

    //获取模板列表
    // const body={
    //   'type':'bullettime',
    //   'siteId':'0013'
    // }
    // this.http
    // .post(`${environment.apiServer}site/get_site_detail`, body)
    // .subscribe(data => {
    //   console.log(data)
    //   console.log(data['result']['template']['name']['0013_1'])
    // })

    //   this.http
    // .get(`${environment.apiServer}wechat_payment/get_users_order`, { params: { 'siteId': '0013', 'openid': this.id,'taskId':this.taskId } })
    // .subscribe(data => {
    //   console.log(data)
    //   if(data['result'].length!==0){
    //     this.templets_pay.splice(0,this.templets_pay.length)
    //     for(var j=0;j<=data['result'].length-1;j++){
    //       //  console.log(data['result'][j])
    //       // this.templets_pay.splice(0,this.templets_pay.length)
    //       //  this.templets_pay=data['result'][j]['templates'];
    //       if(data['result'][j]['is_pay']===1){
    //        for(var i=0;i<=data['result'][j]['templates'].length-1;i++){
    //          this.templets_pay.push(data['result'][j]['templates'][i])
    //        }
    //       }
    //       }
    //       for(var k=0;k<=this.templets_pay.length-1;k++){
    //        if(this.templets_pay[k]==='2.mov'){
    //           this.ispay2=true;
    //           templet2.disabled=true;
    //         }
    //         if(this.templets_pay[k]==='3.mov'){
    //           this.ispay3=true;
    //           templet3.disabled=true;
    //         }
    //         if(this.templets_pay[k]==='4.mov'){
    //           this.ispay4=true;
    //           templet4.disabled=true;
    //         }
    //         if(this.templets_pay[k]==='5.mov'){
    //           this.ispay5=true;
    //           templet5.disabled=true;
    //         }
    //         if(this.templets_pay[k]==='6.mov'){
    //           this.ispay6=true;
    //           templet6.disabled=true;
    //         }
    //       }
    //     }
    // })
  }

  gototemplet1(){
    clearInterval(this.t)
    this.router.navigate(['/result'],{queryParams:{id:this.id,videonames:this.templet1_video_url,template_number:'1',isTicket:this.Ticket}})
  }
  gototemplet2(){
    clearInterval(this.t)
    this.router.navigate(['/result_templet'],{queryParams:{id:this.id,videonames:this.templet2_video_url,templets_pay:this.templets_pay,template_number:'2',Ticket:this.Ticket}})
  }
  gototemplet3(){
    clearInterval(this.t)
    this.router.navigate(['/result_templet'],{queryParams:{id:this.id,videonames:this.templet3_video_url,templets_pay:this.templets_pay,template_number:'3',Ticket:this.Ticket}})
  }
  gototemplet4(){
    clearInterval(this.t)
    this.router.navigate(['/result_templet'],{queryParams:{id:this.id,videonames:this.templet4_video_url,templets_pay:this.templets_pay,template_number:'4',Ticket:this.Ticket}})
  }
  gototemplet5(){
    clearInterval(this.t)
    this.router.navigate(['/result_templet'],{queryParams:{id:this.id,videonames:this.templet5_video_url,templets_pay:this.templets_pay,template_number:'5',Ticket:this.Ticket}})
  }
  gototemplet6(){
    clearInterval(this.t)
    this.router.navigate(['/result_templet'],{queryParams:{id:this.id,videonames:this.templet6_video_url,templets_pay:this.templets_pay,template_number:'6',Ticket:this.Ticket}})
  }

  
  purchase(){
    clearInterval(this.t)
    var templet1=(<HTMLInputElement>document.getElementById("muban1"));
    // var templet1=document.getElementById('muban1')
    var templet2=(<HTMLInputElement>document.getElementById("muban2"));
    // var templet3=(<HTMLInputElement>document.getElementById("muban3"));
    // var templet4=(<HTMLInputElement>document.getElementById("muban4"));
    // var templet5=(<HTMLInputElement>document.getElementById("muban5"));
    // var templet6=(<HTMLInputElement>document.getElementById("muban6"));
    // if(!templet2.checked&&!templet3.checked&&!templet4.checked&&!templet5.checked&&!templet6.checked){
      if(!templet2.checked){
      alert('请选择付费模板进行购买')
    }else{
          if(templet2.checked){
            this.templets.push('2.mov');
        }
        //   if(templet3.checked){
        //     this.templets.push('3.mov');
        // }
        //   if(templet4.checked){
        //     this.templets.push('4.mov');
        //   }
        //   if(templet5.checked){
        //     this.templets.push('5.mov');
        //   }
        //   if(templet6.checked){
        //     this.templets.push('6.mov');
        //   }
          // var json=JSON.stringify(this.templets)
          this.router.navigate(['/shoppingcar'],{queryParams:{templets:this.templets,id:this.id,taskId:this.taskId}})
          // console.log(this.templets)
        }
  }





}