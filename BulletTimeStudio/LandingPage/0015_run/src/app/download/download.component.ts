import { Component, OnInit, ViewChild, ElementRef, trigger,state,style,transition,animate,keyframes} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
@Injectable()
export class DownloadComponent implements OnInit {
  taskId: '';
  img_code:any;
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.taskId = params['taskId'];
      console.log(this.taskId);
      this.http
      .get(`${environment.downloadServer}marathon/qrcode`, {params:{'videoname':this.taskId}})
      .subscribe(data => {
        console.log(data)
        console.log(data['img']);
        this.img_code='https://api.siiva.com'+data['img'];
      });
  });

  }

}