import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent implements OnInit {
  
 

  constructor( public activeRoute:ActivatedRoute,private router: Router,private http: HttpClient,) { }
  ngOnInit() {

   
  }


}