import { Component, OnInit ,Input,OnChanges} from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Socket } from 'ng-socket-io';
import { setTimeout } from 'core-js/library/web/timers';

@Component({
    selector: 'app-calibration',
    templateUrl: './calibration.component.html',
    styleUrls: ['./calibration.component.css']
})
export class CalibrationComponent implements OnInit {
    // @Input() data:string;
    siteId:any;
    select:any;
group:any;
isStep1:boolean=true;
isStep2:boolean=false;

    constructor(private activatedRoute: ActivatedRoute, 
        private http: HttpClient,private socket: Socket ) { }

    ngOnInit() {
        this.activatedRoute.queryParams.subscribe((params: Params) => {
            // this.select = params['id'];
            // console.log(this.select)
        }) 
        
    }
    TakePhoto(){
        this.sendMessage('123')
        {
            this.socket.emit("ask_local_adjust_photo",{'siteId': '0014'});
        };
        this.getMessage1()
        .subscribe(msg => { 
          console.log(msg+">>>>>>>>>>>>");
          console.log(msg.type+">>>>>>>>>>>>"); 
          alert('拍摄完成')
        })

        setTimeout(()=>{
            alert('拍摄完成')
        },3000);

        var btn=(<HTMLButtonElement>document.getElementById('btn_photo'));
        btn.disabled=true;
        var t=setTimeout(()=>{
             btn.disabled=false;
        },10000);
      

    }
    Next(){
       this.isStep1=false;
       this.isStep2=true;
    }
    Prev(){
        this.isStep1=true;
        this.isStep2=false;
    }

    sendMessage(msg: string){
        console.log(msg);
        this.socket.emit("msg", msg);
      }
    
      getMessage1() {
        return this.socket
          .fromEvent<any>("adjust_photo_success_edge_admin")
          .map(data => data);
      }

      getMessage() {
        return this.socket
          .fromEvent<any>("get_camera_config_admin")
          .map(data => data);
      }

}
