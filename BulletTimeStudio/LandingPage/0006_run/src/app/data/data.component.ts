import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import 'rxjs/add/operator/map'; 

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.css']
})
export class DataComponent implements OnInit {
  isShow1:boolean=true;
  isShow2:boolean=false;
  isShow3:boolean=false;
  isShow4:boolean=false;
  isHoussein1:boolean=true;
  isHoussein2:boolean=false;
  isHoussein3:boolean=false;
  isHoussein4:boolean=false;
  ret:string[] = [];
  index_num:any;
  urlnumber1:any;
  playnumber1:any;
  sharenumber1:any;
  likenumber1:any;
  urlnumber2:any;
  playnumber2:any;
  sharenumber2:any;
  likenumber2:any;
  time:any;
    constructor(private activatedRoute: ActivatedRoute,
      private router: Router,private http: HttpClient) { }

    ngOnInit() {
      var timestamp=new Date().getTime();
      this.time=this.getTime(timestamp);
      this.http
      .get(environment.apiServer+'wechat/get_data')
      .subscribe(data => {
        console.log(data);
        // if(data['code']===1){   
          // let r = JSON.parse(JSON.stringify(data['result']));
          // for(let i = r.length-1; i>=0; i--){
            this.urlnumber1=data['result']['005'].urlnumber;
            this.playnumber1=data['result']['005'].urlnumber;
            this.sharenumber1=data['result']['005'].sharenumber;
            this.likenumber1=data['result']['like_number'];

            this.urlnumber2=data['result']['006'].urlnumber;
            this.playnumber2=data['result']['006'].urlnumber;
            this.sharenumber2=data['result']['006'].sharenumber;
            this.likenumber2=data['result']['like_number'];
  
           
           
        //    this.ret.push(data['result'][i]);
            // console.log(data['result'][i]['info'])
          // }
        // }
      }); 
    }
    Click1(){
      this.isShow1=true;
      this.isShow2=false;
      this.isShow3=false;
      this.isShow4=false;
      this.isHoussein1=true;
      this.isHoussein2=false;
      this.isHoussein3=false;
      this.isHoussein4=false;
    }
    Click2(){
      this.isShow1=false;
      this.isShow2=true;
      this.isHoussein2=true;
      this.isHoussein1=false;
    }
    getTime(nS) {  
      var date=new Date(parseInt(nS));  
      var year=date.getFullYear(); 
      var mon = date.getMonth()+1; 
      var day = date.getDate(); 
      var hours = date.getHours(); 
      var minu = date.getMinutes(); 
      var sec = date.getSeconds(); 
      // return year+'/'+mon+'/'+day+' '+hours+':'+minu+':'+sec; 
      return year+'/'+mon+'/'+day; 
    } 
}