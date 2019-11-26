import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Md5 } from 'ts-md5';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../authguard/authguard.service';
import { LoggerService } from '../loggerservice/logger.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  server = environment.apiServer;
  loginMsg = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService,
    private logger: LoggerService
  ) { }

  ngOnInit() {
    const currentCookie = this.cookieService.get('AnnoToolExpire');
    const checkCookie = this.authService.formatDate(new Date().getTime());
    if (currentCookie !== checkCookie) {
      this.router.navigate(['/']);
    }
  }

  loginConfirm() {
    this.loginMsg = '';
    const acc = (<HTMLInputElement>document.getElementById('acc')).value;
    const pwd = Md5.hashStr((<HTMLInputElement>document.getElementById('pwd')).value);
    // this.logger.info('pwd' + (<HTMLInputElement>document.getElementById('pwd')).value);
    const body = { 'account': acc, 'password': pwd };
    this.http
    .post(this.server + 'account/login', body)
    .subscribe(data => {
      this.authService.isConfirm = true;
      // this.logger.info('data=' + JSON.stringify(data))
      const expire = this.authService.formatDate(new Date().getTime() + ( 1000 * 24 * data['expires_in'] )); // 3600
      const token = data['access_token'];
      this.cookieService.set( 'AnnoToolUser', acc );
      this.cookieService.set( 'AnnoToolExpire', expire );
      this.cookieService.set( 'AnnoToolToken', token );
      // this.logger.info('AnnoToolExpire=' + this.cookieService.get('AnnoToolExpire'));
      // this.logger.info('AnnoToolToken=' + this.cookieService.get('AnnoToolToken'));
      this.router.navigate(['/' + this.authService.returnURL]);
    }, err => {
      this.logger.error('err=' + JSON.stringify(err));
      if (err.status === 403) {
        this.loginMsg = 'Login error';
      }
    });
  }

}
