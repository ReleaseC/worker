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
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  time: any;
  id:any;
  nickname:any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private socket: Socket

  ) { }



  ngOnInit() {
    this.sendMessage('123')
    {
      this.socket.emit("join", { 'id': 'local_page' });

    };

    this.getMessage()
      .subscribe(msg => { 
        console.log(msg);
        this.id=msg.data.id; 
        this.nickname = msg.data.nickname;
        if(msg!==undefined){
          this.router.navigate(['/time'],{queryParams:{id:this.id,nickname:this.nickname}});
        }
    })
    
  }


  next() {
    this.router.navigate(['/time'],{queryParams:{id:this.id,nickname:this.nickname}});
  }

  sendMessage(msg: string) {
    console.log(msg);
    this.socket.emit("msg", msg);
  }

  getMessage() {
    return this.socket
      .fromEvent<any>("countdown")
      .map(data => data);
  }

}