import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from '../authguard/authguard.service';

@Component({
  selector: 'ngx-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {

  constructor(
    private router: Router,
    private cookieService: CookieService,
    private authService: AuthService,
  ) { }

  ngOnInit() {
  }

  logoutConfirm() {
    this.authService.isConfirm = false;
    this.cookieService.delete('CloudAdminUser');
    this.cookieService.delete('CloudAdminExpire');
    this.cookieService.delete('CloudAdminToken');
    this.router.navigate(['/']);
  }

}
