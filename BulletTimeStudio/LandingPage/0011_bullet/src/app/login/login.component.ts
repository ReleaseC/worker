import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'; 
@Injectable()
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  code:'';
  siiva:string='';
  id:string = '';
  nickname:string = '';
  text1:string='请根据语音提示操作';
  text5:string='温馨提示';
  text2:string='';
  text3:string='';
  text4:string='';
  istext3:boolean=false;
  isSelfie:boolean = false;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,private socket: Socket
) { }



  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.code = params['code'];
      this.siiva = params['siiva']; 
      this.id = params['user_id'];
      this.nickname = params['nickname'];  
      console.log(this.code);
      console.log(this.siiva);
      if(this.siiva==='wechat'){
         console.log(666)
         this.sendMessage('123')
         {
           this.socket.emit("prepare_to_record",{'id': this.id ,'nickname':'siiva'});
         };
      }
    });


      var self=this;
    setTimeout(() => {
        self.text5='拍摄完成';
        self.text1='扫一扫';
        self.istext3=true;
        self.isSelfie=true;

    }, 14000);


    

  }

  sendMessage(msg: string){
    console.log(msg);
    this.socket.emit("msg", msg);
  }

  getMessage() {
     return this.socket
         .fromEvent<any>("msg")
         .map( data => data.msg );
  }


}