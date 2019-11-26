import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'; 
@Injectable()
@Component({
  selector: 'app-wpp',
  templateUrl: './wpp.component.html',
  styleUrls: ['./wpp.component.css']
})
export class WppComponent implements OnInit {
  id:any;
  isShow1:boolean = false;
  isShow2:boolean = false;
  isShow3:boolean = false;
  isShow4:boolean=false;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,private http: HttpClient
) { }



  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.id = params['user_id'];  
      console.log(this.id); 
  });


  }
  click1(){
    this.isShow1=true;
    const body = {
      'openid': this.id,
      'tags':['chocolate'],
      'tickets':['满78减10元巧克力抵用券']
    };
    console.log(body);
    this.http
    .post(`${environment.apiServer}wechat/wpp_get_tickets`,body )
    .subscribe(data => {
      console.log(data);
    })
  }

  click2(){
    this.isShow2=true;
    const body = {
      'openid': this.id,
      'tags':['coarse'],
      'tickets':['满108减20元五谷杂粮抵用券']
    };
    console.log(body);
    this.http
    .post(`${environment.apiServer}wechat/wpp_get_tickets`,body )
    .subscribe(data => {
      console.log(data);
    })
  }

  click3(){
    this.isShow3=true;
    const body = {
      'openid': this.id,
      'tags':['tyre'],
      'tickets':['满99减5元轮胎保养抵用券']
    };
    console.log(body);
    this.http
    .post(`${environment.apiServer}wechat/wpp_get_tickets`,body )
    .subscribe(data => {
      console.log(data);
    })
  }
  
  click4(){
    this.isShow4=true;
    const body = {
      'openid': this.id,
      'tags':['plane'],
      'tickets':['满600减50元无人机抵用券']
    };
    console.log(body);
    this.http
    .post(`${environment.apiServer}wechat/wpp_get_tickets`,body )
    .subscribe(data => {
      console.log(data);
    })
  }



}