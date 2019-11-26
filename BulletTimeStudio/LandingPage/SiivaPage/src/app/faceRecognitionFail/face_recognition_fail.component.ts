import { Component, OnInit} from '@angular/core';
import { Router } from '@angular/router';
// import { environment } from '../../environments/environment';
import { ActivatedRoute, Params } from '@angular/router';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
@Component({
  selector: 'app-face_recognition_fail',
  templateUrl: './face_recognition_fail.component.html',
  styleUrls: ['./face_recognition_fail.component.css']
})
@Injectable()
export class FaceRecognitionFailComponent implements OnInit {
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router, private http: HttpClient
  ) { }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
  });

  }

}