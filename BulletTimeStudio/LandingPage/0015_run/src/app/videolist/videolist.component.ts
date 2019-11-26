import { Component, OnInit, ViewChild, ElementRef, trigger,state,style,transition,animate,keyframes} from '@angular/core';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params ,Router} from '@angular/router';
import { setTimeout ,setInterval} from 'core-js/library/web/timers';
@Component({
  selector: 'app-videolist',
  templateUrl: './videolist.component.html',
  styleUrls: ['./videolist.component.css']
})
export class VideoListComponent implements OnInit {
  treadmillNumber:any;
    limit: number;
    time: string;
    videolist=[];
    videolist1=[];
    tasklist:any;
    server = environment.apiServer;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,private http: HttpClient
) { }



  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
        // this.treadmillNumber=params['treadmillNumber']  
    });
    this.getTasklist()
    var self=this;
    setInterval(()=>{
      self.getTasklist()
    },300000)
  }




  goback(){
      this.router.navigate(['/treadmill'])
  }
  goVideo(data){
    console.log(data)
    this.router.navigate(['result'],{queryParams:{taskId:data}});
  }

  async getTasklist() {
    this.videolist.splice(0,this.videolist.length)
    // this.limit = limit;
    this.time='2018-9-22';
    // this.time = new Date().toLocaleDateString().replace(/\//g, '-');
    console.log(this.time)
    // const url = `${this.server}task/task_list_get/?time=${this.time}&sort=true`;
    // const response: any = await this.http.get(url).toPromise();
    // console.log(response)
    // const data=response;
    //    for(let i=0;i<data.length-1;i++){
    //     if(data[i]['state']==='complete'){
    //        this.videolist.push(data[i])
    //     }
    //   }
    this.http
    .get(`${environment.apiServer}task/task_list_get`,{ params: { 'time': this.time,'sort':'true'} })
    .subscribe(data => {
      console.log(data)
      this.tasklist=data;
      for(let i=0;i<this.tasklist.length-1;i++){
        if(this.tasklist[i]['state']==='complete'){
           this.videolist.push(this.tasklist[i])
          // console.log(data[i]['createdAt'].split(" ")[1])
          // if(data[i]['createdAt'].split(" ")[1]<='16:20:55'){
          //   this.videolist.push(data[i])
          // }else{
          //   this.videolist1.push(data[i])
          // }
        }
      }
      console.log(this.videolist)
     
    });
  }








}
