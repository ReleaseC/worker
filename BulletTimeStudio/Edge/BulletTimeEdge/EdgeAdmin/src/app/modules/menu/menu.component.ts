import { Component, OnInit, ViewChildren, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SwPush } from '@angular/service-worker';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { ArrayType } from '@angular/compiler/src/output/output_ast';
import { DeviceManagerComponent } from './devicemanager/devicemanager.component';
declare var $: any;
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  selAction: any;
  menu: string = '设备管理';
  value: any;
  id: any;
  siteId: any; //列表
  group: any;
  idMatchName=[];
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);

  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    private swPush: SwPush) { }

  ngOnInit() {
    this.getIds();    
    //console.log(this.selAction)
  }

  getIds(){
    let token = localStorage.getItem("token");
    console.log(token)
    this.http
    .get(`${environment.apiServer}account/v2/get_siteIds?accessToken=`+token )
    // .post(environment.apiServer + 'device/get_device_status',body)
    .subscribe((data:any) => {
      console.log(data)
      this.siteId = data.result
      console.log(this.siteId);

      for(let i=0;i<this.siteId.length;i++){
        if(this.siteId[i]=="0014"){
          this.idMatchName.push({"siteId":"0014","siteName":"HelloKitty"})
        }else if(this.siteId[i]=="0015"){
          this.idMatchName.push({"siteId":"0015","siteName":"中港海影城"})
        }else{
          this.idMatchName.push({"siteId":this.siteId[i],"siteName":"未命名"})
        }
      }
      console.log(this.idMatchName)
      this.make()

    })
  }

  //貌似是用js生成option节点们，有ngfor为啥不用？？？
  make(){
    // this.activatedRoute.queryParams.subscribe((params: Params) => {
    //     // this.siteId = localStorage.getItem('siteIds').split('-')
        
    //     this.selAction = this.siteId[0];
    //     localStorage.setItem('select_siteId',this.selAction);
    //     //console.log(typeof(this.siteId));
    //   ;  if(typeof(this.siteId)=='object'){
    //       var objSelect = (<HTMLSelectElement>document.getElementById('site'))
    //       //objSelect.innerHTML = "<option value='0013' selected>0013</option>";<option value=" + this.siteId[i] + ">" + this.siteId[i] + "< /option>
    //       objSelect
    //       for(let i = 0;i<this.siteId.length;i++){
    //         let option = document.createElement("option")
    //         option.setAttribute('value',this.siteId[i])
    //         option.innerText = this.siteId[i]
    //         objSelect.append(option)
    //       }
    //       document.getElementById('site').getElementsByTagName('option')[0].selected = true
    //     }
    //     // }else{
  
    //     // }
        
    //   })
  }

  subscribeToNotifications() {
    const type = 'device_alert';
    this.swPush.requestSubscription({
      serverPublicKey: 'BLnVk1MBGFBW4UxL44fuoM2xxQ4o9CuxocVzKn9UVmnXZEyPCTEFjI4sALMB8qN5ee67yZ6MeQWjd5iyS8lINAg'
    })
      .then(sub => {
        console.log('Notification Subscription: ', sub);
        this.http.post(`${environment.cloudServer}notification/alert/?siteId=${this.siteId}&type=${type}`, sub)
          .subscribe(
            (res) => console.log('Sent push subscription object to server. response: ' + JSON.stringify(res)),
            (err) => console.log('Could not send subscription object to server, reason: ', err)
          );
      })
  }

  selectAction() {
    console.log(this.selAction)
    localStorage.setItem('select_siteId',this.selAction)
    this.router.navigate(['/menu/devicemanager'])
  }
  // getS(){
  //   console.log(this.selAction)
  // }


  closeAndUpdateTitle(drawer, data) {
    //this.menu = data;
    if(data=='installation'){
      this.menu = '安装指南'
    }else if(data=='devicemanager'){
      this.menu = '设备管理'
    }else if(data=='photomanager'){
      this.menu = '视频管理'
    }else if(data=='systemsetting'){
      this.menu = '系统设定'
    }else if(data=='calibration'){
      this.menu = '校正指南'
    }
    console.log(this.menu)
    let siteid_id = window.location.href.split('=')[1]
    //this.router.navigate(['/menu/installation'],{ queryParams: {siteId:siteid_id,t:this.menu}})
    //this.router.navigate(['/menu/'+ this.menu],{ queryParams: {siteId:siteid_id}})
    //window.location.href = window.location.href
    drawer.close();
    // var objSelect = (<HTMLSelectElement>document.getElementById('site'))
    // objSelect.innerHTML = "<option value='0013' selected>" + siteid + "</option>";
  }

}
