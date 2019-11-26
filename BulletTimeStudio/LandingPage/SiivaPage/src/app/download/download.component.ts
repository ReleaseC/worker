import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
// import { saveAs } from 'file-saver/dist/FileSaver';
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
  });
  this.http
  .get(`${environment.downloadServer}marathon/qrcode`, {params:{'videoname':this.taskId}})
  .subscribe(data => {
    console.log(data)
    console.log(data['img']);
    this.img_code='https://api.siiva.com'+data['img'];
  });

  }

  // download(){
  //   const headers = new HttpHeaders({ 'Content-Type': 'video/mp4' });
  //   return this.http.get(
  //     'https://siiva-video-public.oss-cn-hangzhou.aliyuncs.com/soccer_1541382417zs_1543729878399.mp4?mp.wexin.qq.com',
  //     {
  //       headers: headers,
  //       responseType: 'blob' //這邊要選 `blob`
  //     }).toPromise().then((response) => {
  //       saveAs(response, '123456.mp4');
  //     }).catch(e => {
  //       console.log('error=' + e);
  //     });
  // }

}