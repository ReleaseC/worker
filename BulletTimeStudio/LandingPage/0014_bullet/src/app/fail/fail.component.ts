import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { Location } from '@angular/common';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map'; 
@Injectable()
@Component({
  selector: 'app-fail',
  templateUrl: './fail.component.html',
  styleUrls: ['./fail.component.css']
})
export class FailComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router
) { }



  ngOnInit() {
    

  }

}