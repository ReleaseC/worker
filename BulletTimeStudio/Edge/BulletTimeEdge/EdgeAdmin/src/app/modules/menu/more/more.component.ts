import { Component, OnInit } from '@angular/core';
import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map'; 
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Injectable()
@Component({
    selector: 'app-more',
    templateUrl: './more.component.html',
    styleUrls: ['./more.component.css']
})
export class MoreComponent implements OnInit {
    ret: string[] = [];
    ret_top_offsetX:number[]=[];
    ret_top_offsetY:number[]=[];
    ret_center_offsetX:number[]=[];
    ret_center_offsetY:number[]=[];
     top_offsetX:any;
     top_offsetY:any;
     center_offsetX:any;
     center_offsetY:any;
     top_diffX:any;
     top_diffY:any;
    center_diffX:any;
    center_diffY:any;
     top_left:any;
     top_top:any;
     center_left:any;
     center_top:any;
     image_url:any;
     num:number=1;
     isRevise:boolean=false;
     image_width:any;
     image_height:any;
    i:number=0;
    selected:any;
    photo_shutter:any;
    photo_size:any;
    iso:any;
    constructor(private activatedRoute: ActivatedRoute,
        private router: Router,private socket: Socket,private http: HttpClient
    ) { }

    ngOnInit() {
    //   for(var i=1;i<=15;i++){
    //     this.ret.push("http://siiva.cn-sh2.ufileos.com/0013/siiva/"+i+".jpg")
    // }
    // this.image_url=this.ret[0]
    // var flag=false;
    // var self=this;
    //   //  top移动框
    // setTimeout(() => {
    //   var obj=<HTMLInputElement>document.getElementById('border')
    //   obj.addEventListener('touchstart', function(e){
    //     flag=true;
    //     self.top_diffX=e.touches[0].clientX-obj.offsetLeft;
    //     self.top_diffY=e.touches[0].clientY-obj.offsetTop;
    //   });
    //   obj.addEventListener('touchmove', function(e){
    //     if(flag){
    //       self.top_left=e.touches[0].clientX-self.top_diffX
    //       self.top_top=e.touches[0].clientY-self.top_diffY;
    //      obj.style.left=self.top_left+'px';
    //      obj.style.top=self.top_top+'px';
    //     }
    //   });
    //   obj.addEventListener('touchend', function(e){
    //     obj.style.cursor='auto';
    //     flag=false;
    //     console.log('left:'+self.top_left)
    //     console.log('top:'+self.top_top)
    //     self.top_offsetX=self.top_left;
    //     self.top_offsetY=self.top_top;
    //   });
    // //  center移动框
    //   var obj1=document.getElementById('border1');
    //   obj1.addEventListener('touchstart', function(e){
    //     flag=true;
    //     self.center_diffX=e.touches[0].clientX-obj1.offsetLeft;
    //     self.center_diffY=e.touches[0].clientY-obj1.offsetTop;
    //   });
    //   obj1.addEventListener('touchmove', function(e){
    //     if(flag){
    //       self.center_left=e.touches[0].clientX-self.center_diffX
    //       self.center_top=e.touches[0].clientY-self.center_diffY;
    //      obj1.style.left=self.center_left+'px';
    //      obj1.style.top=self.center_top+'px';
    //     }
    //   });
    //   obj1.addEventListener('touchend', function(e){
    //     obj1.style.cursor='auto';
    //     flag=false;
    //     console.log('left:'+self.center_left)
    //     console.log('top:'+self.center_top)
    //     self.center_offsetX=self.center_left;
    //     self.center_offsetY=self.center_top;
    //   });
    // }, 5000);
    }
    TakePhoto(){
        this.isRevise=true;
        this.sendMessage('123')
        {
            this.socket.emit("ask_local_adjust_photo",{'siteId': '0014'});
        };
        this.getMessage1()
        .subscribe(msg => { 
          console.log(msg+">>>>>>>>>>>>");
          console.log(msg.type+">>>>>>>>>>>>"); 
          alert('试拍完成')
        })
        var flag=false;
        var self=this;
          //  top移动框
        setTimeout(() => {
          for(var i=1;i<=15;i++){
            self.ret.push("http://siiva.cn-sh2.ufileos.com/0013/siiva/"+i+".jpg")
          }
          self.image_url=this.ret[0]
          var obj=<HTMLInputElement>document.getElementById('border')
          obj.addEventListener('touchstart', function(e){
            flag=true;
            self.top_diffX=e.touches[0].clientX-obj.offsetLeft;
            self.top_diffY=e.touches[0].clientY-obj.offsetTop;
          });
          obj.addEventListener('touchmove', function(e){
            if(flag){
              self.top_left=e.touches[0].clientX-self.top_diffX
              self.top_top=e.touches[0].clientY-self.top_diffY;
             obj.style.left=self.top_left+'px';
             obj.style.top=self.top_top+'px';
            }
          });
          obj.addEventListener('touchend', function(e){
            obj.style.cursor='auto';
            flag=false;
            console.log('left:'+self.top_left)
            console.log('top:'+self.top_top)
            self.top_offsetX=self.top_left;
            self.top_offsetY=self.top_top;
          });
        //  center移动框
          var obj1=document.getElementById('border1');
          obj1.addEventListener('touchstart', function(e){
            flag=true;
            self.center_diffX=e.touches[0].clientX-obj1.offsetLeft;
            self.center_diffY=e.touches[0].clientY-obj1.offsetTop;
          });
          obj1.addEventListener('touchmove', function(e){
            if(flag){
              self.center_left=e.touches[0].clientX-self.center_diffX
              self.center_top=e.touches[0].clientY-self.center_diffY;
             obj1.style.left=self.center_left+'px';
             obj1.style.top=self.center_top+'px';
            }
          });
          obj1.addEventListener('touchend', function(e){
            obj1.style.cursor='auto';
            flag=false;
            console.log('left:'+self.center_left)
            console.log('top:'+self.center_top)
            self.center_offsetX=self.center_left;
            self.center_offsetY=self.center_top;
          });
        }, 30000);
 

    }
    confirm(){
        // console.log(this.num)
        var image_left=(<HTMLInputElement>document.getElementById('img1')).offsetLeft;
        var image_top=(<HTMLInputElement>document.getElementById('img1')).offsetTop;
        this.image_width=(<HTMLInputElement>document.getElementById('img1')).width;
       this.image_height=(<HTMLInputElement>document.getElementById('img1')).height;
        console.log(image_left)
        console.log(image_top)
        console.log(this.image_width)
        console.log(this.image_height)
        var offsetX_top=Math.round(2560/this.image_width*(this.top_offsetX-image_left));
        var offsetY_top=Math.round(1920/this.image_height*(this.top_offsetY-image_top));
        var offsetX_center=Math.round(2560/this.image_width*(this.center_offsetX-image_left));
        var offsetY_center=Math.round(1920/this.image_height*(this.center_offsetY-image_top));
        console.log(offsetX_top+"???????????")
        console.log(offsetY_top+"???????????")
        this.ret_top_offsetX[this.num-1]=offsetX_top;
        this.ret_top_offsetY[this.num-1]=offsetY_top;
        this.ret_center_offsetX[this.num-1]=offsetX_center;
        this.ret_center_offsetY[this.num-1]=offsetY_center;
        this.center_offsetX='';
        this.center_offsetY='';
        this.top_offsetX='';
        this.top_offsetY='';
        console.log(this.ret_top_offsetX)
        console.log(this.ret_top_offsetY)
        console.log(this.ret_center_offsetX)
        console.log(this.ret_center_offsetY)
        if(this.ret_top_offsetX.length==15){
          alert('已经是最后一张图片')
        }
      }
      previous(){
        if(this.i===0){
          alert('已经是第一张')
        }else{
        this.num--;
        this.i--;
        this.image_url=this.ret[this.i]
        }
      }
      next(){
        this.num++;
        this.i++;
        this.image_url=this.ret[this.i]
      }
      push(){
        var b={}
        for(var i=0;i<15;i++){
          var a =[]
          a[0]=[this.ret_top_offsetX[i],this.ret_top_offsetY[i]];
          a[1]=[this.ret_center_offsetX[i],this.ret_center_offsetY[i]];
          b[i]=a;    
        }
        console.log(b)
        this.http
        .post(`${environment.apiServer}edgeadmin/adjust_data`,b)
        .subscribe(data => {
          console.log(data)
        });
        
      }


      get_camera_config(){
      console.log(this.selected)
      this.sendMessage('get_camera_config')
      {
          this.socket.emit("get_camera_config",{"siteId":"0014"});
      };
      this.getMessage()
      .subscribe(msg => { 
        console.log(msg)
        this.iso=msg['devicesetting'][this.selected].iq_photo_iso;
        this.photo_shutter=msg['devicesetting'][this.selected].iq_photo_shutter;
        this.photo_size=msg['devicesetting'][this.selected].photo_size;
      })
      }



    sendMessage(msg: string){
        console.log(msg);
        this.socket.emit("msg", msg);
      }
    
      getMessage1() {
        return this.socket
          .fromEvent<any>("adjust_photo_success_edge_admin")
          .map(data => data);
      }

      getMessage() {
        return this.socket
          .fromEvent<any>("get_camera_config_admin")
          .map(data => data);
      }

}
