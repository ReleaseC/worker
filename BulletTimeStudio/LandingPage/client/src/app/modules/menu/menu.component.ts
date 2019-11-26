import { Component, OnInit, ViewChildren, EventEmitter } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit {
  selAction: any;
  menu: string = '管理界面';
  value: any;
  id: any;
  siteId: any; //列表
  group: any;
  idMatchName = [];
  isHandset: Observable<BreakpointState> = this.breakpointObserver.observe(Breakpoints.Handset);
  data: string;
  acc: string;
  menuList: Array<object>;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  ) { }

  ngOnInit() {
    
    let user_id = localStorage.getItem('user_id');
    this.acc = localStorage.getItem('acc');
    this.menuList = JSON.parse(localStorage.getItem('menuList'))
    // 寻找路由对应标题名
    this.data = window.location.hash.split('/')[2];
    let menuIndex = this.menuList.findIndex(item => item['route'] === this.data)
    if(menuIndex !== -1){
      this.menu = this.menuList[menuIndex]['name']
    }
    if(user_id === null){
      this.router.navigate(['/login'])
    }
  }







  closeAndUpdateTitle(drawer, menuItem) {
    this.menu = menuItem.name
    console.log(this.menu)
    drawer.close();
  }
  loginout(drawer) {
    // localStorage.removeItem('user_id');
    localStorage.clear();
    drawer.close()
  }

}
