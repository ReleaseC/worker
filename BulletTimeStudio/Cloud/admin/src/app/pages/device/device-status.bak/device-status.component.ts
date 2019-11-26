import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { SocketService } from '../../common/socket.service';

@Component({
  selector: 'ngx-device-status',
  templateUrl: './device-status.component.html',
  styleUrls: ['./device-status.component.scss'],
})
export class DeviceStatusComponent implements OnInit {
  siteListArr = [];
  selSite :string;
  addSiteMsg = '';
  updateTime = '';
  cameraDataSource = [];
  typeList=[];
  type='';

  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) { }

  ngOnInit() {
    this.typeList = ['basketball','bt','soccor'];
    this.type = this.typeList[0];

    this.makeSiteIdList();
    
  }

  makeSiteIdList(){
    this.siteListArr=[];
    let account = localStorage.getItem('account');
    let token = localStorage.getItem('token');
    console.log(this.type)
    this.http
    .get(environment.apiServer + 'account/v2/getGroupArray?account='+account + "&token=" + token + "&type=" + this.type)
    .subscribe(data => {
      console.log(data)
      let length = Object.keys(data).length;
      for(let i = 0;i<length;i++){
        this.siteListArr.push({siteId: data[i].siteId, name: data[i].siteName||data[i].name});
      }
    console.log(this.siteListArr);
    //this.selSite = this.siteListArr[0].siteId;

    this.selectSite()
    });

    
  }

  selectSite() {
    this.cameraDataSource = [];

    const body = {
      siteId: '0013',
    };
    this.socketService.getStatus(body, (ret) => {
      console.log('ret=' + JSON.stringify(ret));
      ret.status.data.forEach(camera => {
        // tslint:disable-next-line:radix
        const battery = parseInt(camera.battery);
        if (battery < 100) {
            if (battery < 50) {
                camera['icon'] = 'warn';
            }
        } else {
            camera['icon'] = 'primary';
        }
      });
      this.cameraDataSource = ret.status.data;
      this.updateTime = ret.status.updateTime;
    });
  }

  // async TestEdgeSocket() {
  //   console.log('TestEdgeSocket');
  //   const body = {
  //       siteId: '0005',
  //   };
  //   this.socketService.getStatus(body, (ret) => {
  //       console.log('ret=' + JSON.stringify(ret));
  //   });
  // }

}
