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
  styleUrls: ['./download.component.css'],
  animations:[
    trigger('signal',[
      state('go',style({
        transform:'translateX(0px)'
      })),
      state('stop',style({
        transform:'translateX(10px)'
      })),
      transition('*=>*',animate('1000ms ease-out'))
    ])
  ]
})
@Injectable()
export class DownloadComponent implements OnInit {

  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
  ) { }

  ngOnInit() {


  }

}