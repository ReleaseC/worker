import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-advertise',
  templateUrl: './advertise.component.html',
  styleUrls: ['./advertise.component.css']
})
export class AdvertiseComponent implements OnInit {
videolist:any;
video_src_list:any;
video_src:'';
t1:any;
t2:any;
isAnimate:boolean=false;
  constructor(private activatedRoute: ActivatedRoute,public element:ElementRef,private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
    
  });

    // this.videolist=['video_1','video_2','video_3','video_4','video_5','video_6'];
    var that=this;
    that.http
  .get(`http://localhost:22222/video/list`, {params:{activity_id:'1541382418',limit:'9'}})
  .subscribe(data => {
    console.log(data)
    that.videolist=data["result"];
    console.log(that.videolist)

      // that.VideoAnimate()

  });
  setInterval(()=>{
    location.reload()
  },60000)
    // this.videolist=['video_1'];
    // var myVideo=document.getElementsByClassName('video_2')
    // var myVideo=this.element.nativeElement.querySelector('.video').src;
    // var myVideo = document.getElementsByTagName('video')[0];
    // console.log(myVideo)

    // 多机位视频播放
    // this.video_src_list=['assets/videos/video_1.mp4','assets/videos/video_2.mp4','assets/videos/video_3.mp4'];
    // this.video_src=this.video_src_list[0];
    //   var i=0;
    //   var self=this;
    //   setInterval(()=>{
    //     if(i<self.video_src_list.length-1){
    //       i++;
    //       self.video_src=this.video_src_list[i];
    //     }else{
    //       i=0;
    //       self.video_src=this.video_src_list[0];
    //     }
    //   },10000)
    
  }

  VideoAnimate(){
    var that=this;
    that.t2=setInterval(()=>{
      this.isAnimate=true;
    },5000)
    that.t1=setInterval(()=>{
      that.isAnimate=false;
    },10000)
  }

  
}