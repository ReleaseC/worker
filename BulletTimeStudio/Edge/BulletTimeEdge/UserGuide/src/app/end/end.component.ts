import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Socket } from 'ng-socket-io';

@Component({
  selector: 'app-end',
  templateUrl: './end.component.html',
  styleUrls: ['./end.component.css']
})
export class EndComponent implements OnInit {
  // qrcode_data:string='';

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,private socket: Socket

) { }



  ngOnInit() {
   var self=this;
   setTimeout(function(){
    self.router.navigate( ['/time']);
  },2000)
//   var self=this;
//   var t = setInterval(function () {

 
//   self.sendMessage('123')
//   {
//     self.socket.emit("is_camera_free");
//   };
//   self.getMessage()
//   .subscribe(msg => { 
//     console.log(msg); 
//     if(msg.code!==400){
//       clearInterval(t);
//       self.router.navigate(['/start']);
//     }
// })
// },100000)

}

  sendMessage(msg: string) {
    console.log(msg);
    this.socket.emit("msg", msg);
  }

  getMessage() {
    return this.socket
      .fromEvent<any>("bad_request")
      .map(data => data.msg);
  }

}