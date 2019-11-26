import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { SocketService } from '../../../shared/socket.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { setTimeout ,setInterval} from 'core-js/library/web/timers';
import { clearTimeout } from 'timers';
@Component({
    selector: 'app-devicemanager',
    templateUrl: './devicemanager.component.html',
    styleUrls: ['./devicemanager.component.css']
})
export class DeviceManagerComponent implements OnInit {
    isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
    // statusCollection: any;
    ret1: string[] = [];
    input: string[] = [];
    updateTime: string;
    photoTime: string;
    cameraDataSource: any;
    test: string;
    menu:any;
    selAction;any;
    t:any;
    isinput:boolean=false;
    mac_array:string[]=[];
    name_array:string[]=[];
    r1:any;
    siteid_id:string = "";
    i:number=0;

    firstButton:any;
    secondButton:any;

    constructor(private activatedRoute: ActivatedRoute,
        private router: Router, private breakpointObserver: BreakpointObserver,
        private socketService: SocketService,private http: HttpClient,private socket: Socket) { }

    ngOnInit() {
        this.siteid_id = localStorage.getItem('select_siteId')  //选择的id
        console.log(this.siteid_id);
        this.getdevice();
    }

    
    getdevice(){
        this.firstButton=(<HTMLButtonElement>document.getElementById('FirstButton'));
        this.secondButton=(<HTMLButtonElement>document.getElementById('SecondButton'));
        this.firstButton.disabled=false;
        this.secondButton.disabled=true;
        this.siteid_id = localStorage.getItem('select_siteId')
        console.log(this.siteid_id)
        this.ret1.splice(0,this.ret1.length);
            this.http
            .get(`${environment.cloudServer1}device/get_device_status`,{ params: { 'siteId':this.siteid_id} })
            // .post(environment.apiServer + 'device/get_device_status',body)
            .subscribe(data => {
                console.log(data)
                this.r1 = data['device'].result[0].status.data
                console.log(this.r1)

            for (let i = 0; i <=this.r1.length-1; i++) {
            // console.log(data['device'].result[0].status.data[i].isalive)
                if(data['device'].result[0].status.data[i].battery>50){
                    data['device'].result[0].status.data[i].iscolor=true;
                }else{
                    data['device'].result[0].status.data[i].iscolor=false;
                }
                if(data['device'].result[0].status.data[i].battery>50 && data['device'].result[0].status.data[i].isalive){
                    data['device'].result[0].status.data[i].state='ok';
                }else{
                    data['device'].result[0].status.data[i].state='no';
                } 
            this.ret1.push(data['device'].result[0].status.data[i]);
            }
            
            })

        var self=this;
        self.t=setTimeout(() => {
            self.getdevice();
        }, 10000);
    }
    clearTimer(){
        clearTimeout(this.t)
    }
    update_sort(){
        var device_config={
            "siteId":'0014',
            "deviceConfig": {
            "camera": [{
                "name": "sh_xiaoyi-1",
                "mac": "04:E6:76:2F:77:9C"
            }, {
                "name": "sh_xiaoyi-2",
                "mac": "04:E6:76:12:84:DA"
            }, {
                "name": "sh_xiaoyi-3",
                "mac": "04:E6:76:00:9A:62"
            }, {
                "name": "sh_xiaoyi-4",
                "mac": "04:E6:76:10:44:BC"
            }, {
                "name": "sh_xiaoyi-5",
                "mac": "04:E6:76:24:36:05"
            }, {
                "name": "sh_xiaoyi-6",
                "mac": "04:E6:76:45:95:58"
            }, {
                "name": "sh_xiaoyi-7",
                "mac": "04:E6:76:11:37:0D"
            }, {
                "name": "sh_xiaoyi-8",
                "mac": "04:E6:76:05:39:93"
            }, {
                "name": "sh_xiaoyi-9",
                "mac": "04:E6:76:10:1E:F4"
            }, {
                "name": "sh_xiaoyi-10",
                "mac": "04:E6:76:28:09:92"
            }, {
                "name": "sh_xiaoyi-11",
                "mac": "04:E6:76:13:CC:7D"
            }, {
                "name": "sh_xiaoyi-12",
                "mac": "04:E6:76:40:C5:9F"
            }, {
                "name": "sh_xiaoyi-13",
                "mac": "04:E6:76:08:3E:83"
            }, {
                "name": "sh_xiaoyi-14",
                "mac": "04:E6:76:09:BD:A9"
            }, {
                "name": "sh_xiaoyi-15",
                "mac": "04:E6:76:2B:C6:88"
            }]
        },
        "sparedeviceConfig":{
            "camera":
            [{
                "name":"beiyong_xiaoyi_1",
                "mac":"04:E6:76:35:B8:F8"
            }]
        }
      }
     var a=document.getElementsByTagName('input');
        this.input.splice(0,this.input.length)
        for(var i=0;i<a.length;i++){
            // console.log(input[i].value);
           this.input.push(a[i].value)
        }
        console.log(this.input)
          this.mac_array.splice(0,this.mac_array.length)
          this.name_array.splice(0,this.name_array.length)
          for(var i=0;i<this.input.length;i++){
            this.name_array.push(this.r1[Number(this.input[i])-1].name)
              this.mac_array.push(this.r1[Number(this.input[i])-1].mac)
          }
        for(var j=0;j<this.name_array.length;j++){
            device_config.deviceConfig.camera[j].name=this.name_array[j];
            device_config.deviceConfig.camera[j].mac=this.mac_array[j];
        }
        console.log(device_config)
        this.http
        .post(`${environment.apiServer}site/change_DeviceConfig`,device_config)
        .subscribe(data => {
            console.log(data['code'])
            if(data['code']===1){
                alert('更换成功，点击左上角“重新扫描”即可')
            }
        });
    }
    scan(){
        var self=this;
        // console.log('scan')
        clearInterval(self.t);
        self.sendMessage('123')
        {
            self.socket.emit("re_scan",{'siteId': self.siteid_id});
        };
        self.firstButton.disabled=true;
        setTimeout(()=>{alert('扫描1成功，请继续点击“扫描2”按钮');self.secondButton.disabled=false;},5000);
    }
    re_scan(){
        var self=this;
        // console.log('re_scan')
        self.sendMessage('123')
        {
            self.socket.emit("rescan_YIAgent",{'siteId': self.siteid_id});
        };
        self.secondButton.disabled=true;
        setTimeout(()=>{
            alert('扫描2成功,耐心等待页面刷新查看设备连接状态是否ok');
            self.firstButton.disabled=false;
            self.getdevice();
        },5000);
    }
    sendMessage(msg: string){
        console.log(msg);
        this.socket.emit("msg", msg);
      }
  
}
