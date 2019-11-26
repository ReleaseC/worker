import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Params } from '@angular/router';
declare var Swiper: any ;
@Component({
  selector: 'app-firstpage',
  templateUrl: './firstpage.component.html',
  styleUrls: ['./firstpage.component.css']
})
export class FirstPageComponent implements OnInit {
  activity_list:any;
  activity_name_list:any;
  banner_list=[];
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,private http: HttpClient
) { }



  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
 
    });
    // 获取线上活动列表 
  this.http
  .get(`${environment.apiServer}activity/list`,{ params: { 'wonderful': '1'} })
  .subscribe(data => {
    // console.log(data)
    this.activity_list=data
    console.log(this.activity_list)
    for(let i=0;i<=this.activity_list.length-1;i++){
      if(this.activity_list[i]['banner']!==''){
        this.banner_list.push(this.activity_list[i]['banner']);
      }
    }
    console.log(this.banner_list)
  
  })
setTimeout(()=>{
  var mySwiper = new Swiper('.swiper-container', {
    autoplay:true,
    loop : true,
    pagination: {
      el: '.swiper-pagination',
      clickable :true,
    },
    // navigation: {
    //   nextEl: '.swiper-button-next',
    //   prevEl: '.swiper-button-prev',
    // },
  });
},1000)
  

   
   
 
  }

  goActivity(activity_id){
    this.router.navigate(['/homepage'],{queryParams:{activity_id:activity_id}})
  }




}