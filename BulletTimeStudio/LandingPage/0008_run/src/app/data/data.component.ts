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
  isHoussein1:boolean=true;
  isHoussein2:boolean=false;
  ret1:string[] = [];
  ret2:string[] = [];
  point_sum_bullet:number=0;
  play_sum_bullet:number=0;
  share_sum_bullet:number=0;
  like_sum_bullet:number=0;
  point_sum_marathon:number=0;
 play_sum_marathon:number=0;
  like_sum_marathon:number=0;
 share_sum_marathon:number=0;
    constructor(private activatedRoute: ActivatedRoute,
      private router: Router,private http: HttpClient) { }

    ngOnInit() {
 
      this.http
      .get(environment.apiServer+'datareport/get_data?siteId=0007')
      .subscribe(data => {
        console.log(data);
        // if(data['code']===1){   
          let r1 = JSON.parse(JSON.stringify(data['result']));
          for(let i = r1.length-1; i>=0; i--){
              
           this.point_sum_bullet+=data['result'][i]['point'];
           this.like_sum_bullet+=data['result'][i]['like'];
           this.share_sum_bullet+=data['result'][i]['share'];
           this.play_sum_bullet+=data['result'][i]['play'];
           
           this.ret1.push(data['result'][i]);
            // console.log(data['result'][i]['info'])
    
        }
      }); 


      this.http
      .get(environment.apiServer+'datareport/get_data?siteId=0008')
      .subscribe(data => {
        console.log(data);
        // if(data['code']===1){   
          let r2 = JSON.parse(JSON.stringify(data['result']));
          for(let i = r2.length-1; i>=0; i--){
              
            this.point_sum_marathon+=data['result'][i]['point'];
            this.like_sum_marathon+=data['result'][i]['like'];
            this.share_sum_marathon+=data['result'][i]['share'];
            this.play_sum_marathon+=data['result'][i]['play'];
           
           this.ret2.push(data['result'][i]);
            // console.log(data['result'][i]['info'])
    
        }
      }); 

    }
    Click1(){
      this.isShow1=true;
      this.isShow2=false;
      this.isHoussein1=true;
      this.isHoussein2=false;
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