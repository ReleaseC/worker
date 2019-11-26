import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-advertise_car',
  templateUrl: './advertise_car.component.html',
  styleUrls: ['./advertise_car.component.css']
})
export class Advertise_carComponent implements OnInit {
  address:string='总统山'
  // isAnimate:boolean=false;
  // isRotate:boolean=false;
  videolist:any;
  constructor(private activatedRoute: ActivatedRoute,public element:ElementRef,private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
    
  });

  var that=this;
  that.http
.get(`http://localhost:22222/video/list`, {params:{activity_id:'1541732870qz',limit:'9'}})
.subscribe(data => {
  console.log(data)
  that.videolist=data["result"];
  console.log(that.videolist)
  // setTimeout(()=>{
  //   // for(var i=0;i<=that.videolist.length-1;i++){
  //     that.Video_play()
  //   // }
  // },1000)
});
setInterval(()=>{
  location.reload() 
  // that.http
  // .get(`http://localhost:22222/video/list`, {params:{activity_id:'1541732870qz',limit:'9'}})
  // .subscribe(data => {
  //   console.log(data)
  //   that.videolist=data["result"];
  //   console.log(that.videolist)
  //   // setTimeout(()=>{
  //   //   // for(var i=0;i<=that.videolist.length-1;i++){
  //   //     that.Video_play()
  //   //   // }
  //   // },1000)
  // });
},60000)


    
  }

  // Video_play(){
  //   // console.log(taskId)
  //   var self=this; 
  //   var myVideo = document.getElementsByTagName('video')[0]; 
  //   console.log(myVideo)
  //   // myVideo.play(); 
  //   myVideo.addEventListener('timeupdate',function(){
  //     var timeDisplay;                
  //     //用秒数来显示当前播放进度                
  //     timeDisplay = Math.floor(myVideo.currentTime);               
  //     // console.log(Math.floor(myVideo.currentTime))               
  //     switch(timeDisplay)
  //     {
  //       case 1:
  //          self.address="总统山";
  //         //  self.isAnimate=true;   
  //          self.isRotate=false;
  //          setTimeout(()=>{
  //           self.isAnimate=false;
  //           self.isRotate=true;
  //         },2000)       
  //          break;
  //       case 9:
  //          self.address="金字塔";
  //          self.isAnimate=true;   
  //          self.isRotate=false;
  //          setTimeout(()=>{
  //           self.isAnimate=false;
  //           self.isRotate=true;
  //         },2000)       
  //          break;
  //       case 19:
  //          self.address="巴黎铁塔";
  //          self.isAnimate=true;   
  //          self.isRotate=false;
  //          setTimeout(()=>{
  //           self.isAnimate=false;
  //           self.isRotate=true;
  //         },2000)       
  //          break;
  //       case 29:
  //          self.address="自由女神像";
  //          self.isAnimate=true;   
  //          self.isRotate=false;
  //          setTimeout(()=>{
  //           self.isAnimate=false;
  //           self.isRotate=true;
  //         },2000)       
  //          break;
  //     }       
  // },false);  
  //   // myVideo.addEventListener('ended', function(){ 
  //   //   self.isAnimate=true;   
  //   //   self.isRotate=false;
  //   //   var myVideo = document.getElementsByTagName('video')[i];        
  //   //   console.log(self.curr)      
  //   //   if (curr >= 3){          
  //   //     curr = 0; 
  //   //     // 播放完了，重新播放     
  //   //    }else{
  //   //     curr++; 
  //   //    }
  //   //    switch(curr){
  //   //      case 0:
  //   //        self.address="总统山";
  //   //        myVideo.src='http://192.168.1.114:22222?file_name=1541732870qz/'+taskId+'/'+taskId+'_1.mp4'
  //   //        console.log(myVideo.src)
  //   //        break;
  //   //     case 1:
  //   //       self.address="金字塔";
  //   //       myVideo.src='http://192.168.1.114:22222?file_name=1541732870qz/'+taskId+'/'+taskId+'_2.mp4'
  //   //       console.log(myVideo.src) 
  //   //       break;
  //   //     case 2:
  //   //        self.address="巴黎铁塔";
  //   //        myVideo.src='http://192.168.1.114:22222?file_name=1541732870qz/'+taskId+'/'+taskId+'_3.mp4'
  //   //        console.log(myVideo.src)
  //   //        break;
  //   //     default:
  //   //         self.address="自由女神像";
  //   //         myVideo.src='http://192.168.1.114:22222?file_name=1541732870qz/'+taskId+'/'+taskId+'_4.mp4'
  //   //         console.log(myVideo.src)
  //   //    }      
  //   //   //  self.video_url = self.ret[self.curr];      
  //   //    myVideo.load(); 
  //   //    setTimeout(()=>{
  //   //      self.isAnimate=false;
  //   //      self.isRotate=true;
  //   //    },2000)
  //   //   });
  // }



  
}