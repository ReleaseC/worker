import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-HK_download',
  templateUrl: './HK_download.component.html',
  styleUrls: ['./HK_download.component.css']
})
@Injectable()
export class HK_DownloadComponent implements OnInit {
  taskId: '';
  img_code:any;
  activity_id:'';
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.taskId = params['taskId'];
      this.activity_id=params=params['activity_id']
      console.log(this.taskId);
  });
  this.http
  .get(`${environment.downloadServer}marathon/qrcode`, {params:{'videoname':this.taskId}})
  .subscribe(data => {
    console.log(data)
    console.log(data['img']);
    this.img_code='https://api.siiva.com'+data['img'];
  });

  }

}