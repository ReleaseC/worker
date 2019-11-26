import { Component, OnInit,ElementRef} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient} from '@angular/common/http';
@Component({
  selector: 'app-advertise_bullettime',
  templateUrl: './advertise_bullettime.component.html',
  styleUrls: ['./advertise_bullettime.component.css']
})
export class Advertise_bullettimeComponent implements OnInit {
  videolist:any;
  constructor(private activatedRoute: ActivatedRoute,public element:ElementRef,private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
    
  });

  var that=this;
  that.http
.get(`http://localhost:22222/video/list`, {params:{activity_id:'1541820638qq',limit:'9'}})
.subscribe(data => {
  console.log(data)
  that.videolist=data["result"];
  console.log(that.videolist)
  // var myVideo = document.getElementsByTagName('video')[0]; 
  // //   console.log(myVideo)
  //   myVideo.play(); 
  // setTimeout(()=>{
  //   // for(var i=0;i<=that.videolist.length-1;i++){
  //     that.Video_play()
  //   // }
  // },1000)
});
setInterval(()=>{
  location.reload() 
},60000)


    
  }



  
}