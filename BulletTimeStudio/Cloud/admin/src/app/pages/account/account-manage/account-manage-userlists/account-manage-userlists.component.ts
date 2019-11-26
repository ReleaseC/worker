import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../environments/environment';
import { CookieService } from 'ngx-cookie-service';

enum ACCOUNT_ROLE {
  GROUP_ADMIN,
  GROUP_CUSTOMER,
}

@Component({
  selector: 'ngx-account-manage-userlists',
  templateUrl: './account-manage-userlists.component.html',
  styleUrls: ['./account-manage-userlists.component.scss'],
})
export class AccountManageUserlistsComponent implements OnInit {
  server = environment.apiServer;
  accountListArr = [];
  errorMsg = '';

  constructor(
    private http: HttpClient,
    private cookieService: CookieService,
  ) { }

  roleToString(role) {
    switch (role) {
      case 0:
        return 'ADMIN';
      case 1:
        return 'CUSTOMER';
    }
    return 'UNDEFINED';
  }

  ngOnInit() {
    this.getlist();
  }

  getlist() {
    this.accountListArr = [];
    this.http.get(this.server + 'account/v2/account_getlists?access_token=' + this.cookieService.get( 'CloudAdminToken' ))
    .subscribe(data => {
      console.log('data=' + JSON.stringify(data));
      if (data['code'] === 0) {
        const dataLen = Object.keys(data['result']).length;
        for (let i = 0; i < dataLen; i++) {
          this.accountListArr.push({
            'account': data['result'][i].account,
            'role': this.roleToString(data['result'][i].role),
            'description': data['result'][i].description,
          });
        }
      }else {
        console.log('Error description=' + data['description']);
        this.errorMsg = data['description'];
      }
    }, err => {
      this.errorMsg = err.toString();
    });
  }

  delect_account(account) {
    console.log('Delete account=' + account);
    const body = {
      'account': account,
      'access_token': this.cookieService.get( 'CloudAdminToken' ),
    };
    this.http.post(this.server + 'account/v2/account_delete', body)
    .subscribe(data => {
      if (data['code'] === 0) {
        this.errorMsg = data['description'];
        this.getlist();
      }else {
        this.errorMsg = data['description'];
      }
    }, err => {
      this.errorMsg = err.toString();
    });
  }

}
