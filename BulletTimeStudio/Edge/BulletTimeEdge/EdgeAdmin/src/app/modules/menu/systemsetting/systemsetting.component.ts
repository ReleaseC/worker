import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { SocketService } from '../../../shared/socket.service';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Socket } from 'ng-socket-io';
@Component({
    selector: 'app-systemsetting',
    templateUrl: './systemsetting.component.html',
    styleUrls: ['./systemsetting.component.css']
})
export class SystemsettingComponent implements OnInit {
    color:any;
    similarity:any;
    blend:any;
    selected_iso:any;
    selected_size:any;
    selected_shutter:any;
    constructor( private http: HttpClient,private socket: Socket ) {}
 

 ngOnInit() {
    
    }
    update_camera_config(){
        console.log(this.selected_iso)
        console.log(this.selected_shutter)
        console.log(this.selected_size)
        this.sendMessage('123')
        {
            this.socket.emit("set_camera_config",{"siteId":"0014","setting":[["iq_photo_iso",this.selected_iso],["iq_photo_shutter",this.selected_shutter],["photo_size",this.selected_size]]});
        };
    }

    sendMessage(msg: string){
        console.log(msg);
        this.socket.emit("msg", msg);
      }
    
      getMessage() {
        return this.socket
          .fromEvent<any>("camera_config")
          .map(data => data);
      }
}
