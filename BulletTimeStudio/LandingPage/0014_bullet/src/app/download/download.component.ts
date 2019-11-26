import { Component, OnInit, ViewChild, ElementRef, trigger,state,style,transition,animate,keyframes} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css'],
  animations:[
    trigger('signal',[
      state('go',style({
        transform:'translateX(0px)'
      })),
      state('stop',style({
        transform:'translateX(10px)'
      })),
      transition('*=>*',animate('1000ms ease-out'))
    ])
  ]
})
@Injectable()
export class DownloadComponent implements OnInit {
  id: '';
  img_code:any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.id = params['id'];
      console.log(this.id);
      // this.http
      // .get('http://10.20.30.171:8005/qrcode?siteId=0014&openId='+this.id)
      // .subscribe(data=>{
      //   console.log(data)
      // })
      // request({
      //   url:`http://10.20.30.171:8005/qrcode?siteId=0014&openId=`+this.id,
      //   method:"GET",
      // },(error,response,body)=>{

      // })
      this.http
      .get(`http://47.96.233.153:7777/qrcode`,{params:{'siteId':'0014','openId':this.id}})
      .subscribe(data => {
        console.log(data)
        console.log(data['img'])
        this.img_code='http://47.96.233.153:7777'+data['img'];
      });

  });

  }

}