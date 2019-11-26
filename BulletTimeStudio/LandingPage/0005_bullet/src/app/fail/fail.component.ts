import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import * as $ from 'jquery';
@Component({
  selector: 'app-fail',
  templateUrl: './fail.component.html',
  styleUrls: ['./fail.component.css']
})
export class FailComponent implements OnInit {
  supportedLangs: {display: string; value: string; }[];
  translatedTitle: string;
  translatedNoVideoMsg1: string;
  translatedNoVideoMsg2: string;
  translatedNoVideoMsg3: string;
  
 

  constructor( public activeRoute:ActivatedRoute,private router: Router,private http: HttpClient,) { }
  ngOnInit() {

   
  }


}
