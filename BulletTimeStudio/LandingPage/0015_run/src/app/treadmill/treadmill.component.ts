import { Component, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params,Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-treadmill',
  templateUrl: './treadmill.component.html',
  styleUrls: ['./treadmill.component.css']
})
export class TreadmillComponent implements OnInit {
  treadmills=[];
  treadmillNumber:any;
  isText:boolean=true;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,private http: HttpClient
) { }



  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {  
  });
  this.treadmills = ['1', '2', '3', '4', '5', '6'];
  }
  

   
  selectTreadmill(){
    console.log(this.treadmillNumber);
    this.isText=false;
  }

  search(){
    this.router.navigate(['/videolist'])
    // console.log(this.treadmillNumber)
    // if(this.treadmillNumber==undefined){
    //   alert('请选择您的跑步机位')
    // }else{
    //   this.router.navigate(['/videolist'],{queryParams:{treadmillNumber:this.treadmillNumber}})
    // }
  }


  




}