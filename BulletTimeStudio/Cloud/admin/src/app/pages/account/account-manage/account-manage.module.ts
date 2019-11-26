import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../../@theme/theme.module';
import { AccountManageComponent } from './account-manage.component';
import { AccountManageRoutingModule } from './account-manage-routing.module';
import { AccountManageRegisterModule } from './account-manage-register/account-manage-register.module';
import { AccountManageUserlistsModule } from './account-manage-userlists/account-manage-userlists.module';

@NgModule({
  imports: [
    CommonModule,
    AccountManageRoutingModule,
    AccountManageRegisterModule,
    AccountManageUserlistsModule,
    ThemeModule,
  ],
  declarations: [
    AccountManageComponent,
  ],
})
export class AccountManageModule { }
