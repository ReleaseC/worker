import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Md5 } from 'ts-md5/dist/md5';
import { tokenKey } from '@angular/core/src/view';


@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  server = environment.apiServer;
  loginMsg = '';
  siteId:'';
  token="";
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    localStorage.removeItem('token');
    localStorage.removeItem('account');
    localStorage.removeItem('select_siteId');
    localStorage.removeItem('siteIds');
    localStorage.removeItem("siiva")
  }

  loginConfirm() {
    this.loginMsg = '';
    // const acc = (<HTMLInputElement>document.getElementById('acc')).value;
    // const pwd = Md5.hashStr((<HTMLInputElement>document.getElementById('pwd')).value);
    //               //const pwd = (<HTMLInputElement>document.getElementById('pwd')).value;
    //               // const pwd = (<HTMLInputElement>document.getElementById('pwd')).value;
    //               // console.log('loginConfirm acc=' + acc + ', pwd=' + pwd);
    //               // if(acc==='siiva'&&pwd==='7a05d1a0a575f7df313f4597e4d608f1'){
    //               //   // alert(1234)
    //               //   this.router.navigate(['/menu/installation'])
    //               // }
    // const body={
    //   "account":acc,
    //   "password":pwd
    // }
    // console.log(body)
    // this.http
    // .post(`${environment.cloudServer}account/login`,body)
    // .subscribe(data => {
    //   if(data!='undifined'){
    //     console.log(data)     //siteID列表
    //     localStorage.setItem('siteIds',data["siteId"].join('-'));
    //     this.router.navigate(['/menu/installation'])
    //   }
    const acc = (<HTMLInputElement>document.getElementById('acc')).value;
    // const pwd = Md5.hashStr((<HTMLInputElement>document.getElementById('pwd')).value);
    const pwd = (<HTMLInputElement>document.getElementById('pwd')).value;
    console.log('pwd'+(<HTMLInputElement>document.getElementById('pwd')).value)
    const body = { 'account': acc, 'password': pwd };
    console.log(body)
    this.http
    .post(this.server + 'account/login', body)
    .subscribe((data:any) => {
      if(data!='undifined'){
        console.log(data)     //siteID列表
        // localStorage.setItem('siteIds',data["siteId"].join('-'));
        localStorage.setItem('account',acc);
        localStorage.setItem('token',data.access_token);
        this.token = data.access_token;
        this.router.navigate(['/menu'])

        
      }
      
      // console.log('data=' + JSON.stringify(data))
      // console.log(data);
      
      // if(data["group"]!=='undefined'){
      //   this.router.navigate(['/menu/installation'],{ queryParams: {siteId:data["siteId"],group:data["group"]}})
      // }
      
      
    })
  }

}
