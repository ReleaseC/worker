import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-scancode',
  templateUrl: './scancode.component.html',
  styleUrls: ['./scancode.component.css']
})
@Injectable()
export class ScancodeComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
  ) { }

  ngOnInit() {
   
  }

}