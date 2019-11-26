import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Md5 } from 'ts-md5';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../authguard/authguard.service';

@Component({
  selector: 'ngx-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  server = environment.apiServer;
  loginMsg = '';

  constructor(
    private router: Router,
    private http: HttpClient,
    private cookieService: CookieService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    localStorage.removeItem("account");
    localStorage.removeItem("token");
    const currentCookie = this.cookieService.get('CloudAdminExpire');
    const checkCookie = this.authService.formatDate(new Date().getTime());
    if (currentCookie !== checkCookie) {
      // console.log('ngOnInit returnURL=' + this.authService.returnURL);
      this.router.navigate(['/']);
    }
  }

  loginConfirm() {
    this.loginMsg = '';
    const acc = (<HTMLInputElement>document.getElementById('acc')).value;
    const pwd = Md5.hashStr((<HTMLInputElement>document.getElementById('pwd')).value);
    // console.log('pwd'+(<HTMLInputElement>document.getElementById('pwd')).value)
    const body = { 'account': acc, 'password': pwd };
    this.http
    .post(this.server + '/account/login', body)
    .subscribe(data => {
      this.authService.isConfirm = true;
      // console.log('data=' + JSON.stringify(data))
      console.log(data);
      const expire = this.authService.formatDate(new Date().getTime() + ( 1000 * 24 * data['expires_in'] )); // 3600
      console.log('expire=' + expire);
      const token = data['access_token'];
      console.log('token=' + token);
      this.cookieService.set( 'CloudAdminUser', acc );
      this.cookieService.set( 'CloudAdminExpire', expire );
      this.cookieService.set( 'CloudAdminToken', token );
      localStorage['account'] = acc;
      localStorage['token'] = token;
      // console.log('CloudAdminExpire=' + this.cookieService.get('CloudAdminExpire'));
      // console.log('CloudAdminToken=' + this.cookieService.get('CloudAdminToken'));
      this.router.navigate(['/pages/' + this.authService.returnURL]);
    }, err => {
      console.log('err=' + JSON.stringify(err));
      if (err.status === 403) {
        this.loginMsg = 'Login error';
      }
    })
  }

  onLoginKeyDown(e) {
    window.alert(e);
  }

}
