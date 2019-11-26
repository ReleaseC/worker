import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Buffer} from 'buffer'

import menu from 'src/app/@core/data/menu';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  activitylist:any;
  menuList: Array<Object>;
  curMenuList: Array<Object>;
    
  switchFirstPage: object = {
    'pr_1539766931': 'profit',
    "pr_1539766932": 'profitvideo',
    "pr_1561621296": 'profitvideo',  //西安华夏项目ID
    "pr_1562132613":'profitvideo'  //微山湖项目ID
  }
 
  constructor(
    private router: Router,
    private http: HttpClient,
  ) { }

  ngOnInit() {
    const id = localStorage.getItem('user_id');

    if(id){
      let acc = localStorage.getItem('acc');
      let newpwd = localStorage.getItem('pwd');
      var pwd = (Buffer.from(newpwd, 'base64')).toString('ascii');
      (<HTMLInputElement>document.getElementById('acc')).value = acc;
      (<HTMLInputElement>document.getElementById('pwd')).value = pwd;
      this.loginConfirm();
    }

  }
  

  async loginConfirm() {
    const acc = (<HTMLInputElement>document.getElementById('acc')).value;
    const pwd = (<HTMLInputElement>document.getElementById('pwd')).value;

    let body = {"phone": acc, "passwd": pwd}

    let res = await this.http.post(environment.apiServer + '/login_get_user_id', body).toPromise();

    
    if (res["user_id"]) {
      if (res['project_id']){
        this.getSettingActivityListPro(res["project_id"])
        localStorage['project_id']=res["project_id"];
      } else {
        this.getSettingActivityList(res["user_id"])
      }
      this.curMenuList = this.getMenuList(res["project_id"]);
      localStorage.setItem('menuList', JSON.stringify(this.getMenuList(res["project_id"])));
      console.log(JSON.stringify(this.getMenuList(res["project_id"])))
      let newpwd = Buffer.from(pwd, 'ascii').toString('base64')
      localStorage['user_id']=res["user_id"];
      localStorage['acc']=acc
      localStorage['pwd']=newpwd;
    } else {
      alert('账号或密码错误')
    }

  }

  getMenuList(project_id) {
    return menu.menuList.filter(item => (item.projectArray as Array<string>).includes(project_id));
  }

  async getSettingActivityListPro(project_id) {

    let res = await this.http.get(environment.apiServer + '/activity/list?project_id=' +project_id).toPromise();

    if(res){
      this.activitylist=res;
      localStorage.setItem('activitylist', JSON.stringify(this.activitylist));
      if(this.activitylist.length > 0){
        
        let route = this.switchFirstPage[project_id];
        console.log(route)
        
        route = route || this.activitylist[0]['route']
        this.router.navigate([`/menu/${route}`])
      } else {
        alert('请加入一个项目')
      }
    } 
  }
  
  async getSettingActivityList(user_id) {

    let res = await this.http.get(environment.apiServer + '/activity/list?user_id=' +user_id).toPromise();

    if(res){
      this.activitylist=res;
      localStorage.setItem('activitylist', JSON.stringify(this.activitylist));
      if(this.curMenuList.length > 0){

        let route = this.curMenuList[0]['route']
        this.router.navigate([`/menu/${route}`])
      } else {
        alert('请加入一个项目')
      }
    } 
  }

}
