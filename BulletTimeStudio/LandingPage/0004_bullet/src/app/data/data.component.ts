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
    ret:string[] = [];
    vip:any;
    age:any;
    isLabel:boolean=false;
    label:any;
    idx:any;
    length:any;
    num:any;
    tags:any;
    index_num:any;
    constructor(private activatedRoute: ActivatedRoute,
      private router: Router,private http: HttpClient) { }

    ngOnInit() {
        this.http
          .get(environment.apiServer+'wechat/get_wechatuser')
          .subscribe(data => {
            console.log(data);
            if(data['code']===1){
       
              let r = JSON.parse(JSON.stringify(data['result']));
              for(let i = r.length-1; i>=0; i--){ 

                if(data['result'][i].info.sex===1){
                  data['result'][i].info.sex='男';
                }else{
                  data['result'][i].info.sex='女';
                }
               
                if(data['result'][i].time!==undefined){
                  data['result'][i].time=this.getTime(data['result'][i].time);
                  data['result'][i].info.remark='是';
                }else{
                  data['result'][i].info.remark='否';
                }
               this.ret.push(data['result'][i]);
                // console.log(data['result'][i]['info'])
              }
            }
          }); 
        }



    getTime(nS) {  
      var date=new Date(parseInt(nS));  
      var year=date.getFullYear(); 
      var mon = date.getMonth()+1; 
      var day = date.getDate(); 
      var hours = date.getHours(); 
      var minu = date.getMinutes(); 
      var sec = date.getSeconds(); 
      return year+'/'+mon+'/'+day+' '+hours+':'+minu+':'+sec; 
    } 
   
    AddLabel(i){
     this.isLabel=true; 
    console.log(i);
    this.num=i;
    }
    SaveLabel(){
      this.isLabel=false;
      this.label=(<HTMLInputElement>document.getElementById("text")).value;
      this.http
      .get(environment.apiServer+'wechat/get_wechatuser')
      .subscribe(data => {
        console.log(data);
          let r = JSON.parse(JSON.stringify(data['result']));
          this.length=r.length-1;
          this.index_num=this.length-this.num;
      
          if(data['result'][this.index_num].info.sex===1){
            data['result'][this.index_num].info.sex='男';
          }else{
            data['result'][this.index_num].info.sex='女';
          } 

            if(data['result'][this.index_num].time!==undefined){
              data['result'][this.index_num].time=this.getTime(data['result'][this.index_num].time);
              data['result'][this.index_num].info.remark='是';
            }else{
              data['result'][this.index_num].info.remark='否';
            }    
           data['result'][this.index_num].tags=data['result'][this.index_num].tags+' '+this.label;                     
            this.ret.push(data['result'][this.index_num]);
            // console.log(data['result'][i]['info'])
      }); 
    }
}