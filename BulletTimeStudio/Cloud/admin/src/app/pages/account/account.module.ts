import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeModule } from '../../@theme/theme.module';
import { AccountComponent } from './account.component';
import { AccountManageModule } from './account-manage/account-manage.module';
import { AccountRoutingModule } from './account-routing.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    AccountRoutingModule,
    AccountManageModule,
  ],
  declarations: [AccountComponent],
})
export class AccountModule { }
