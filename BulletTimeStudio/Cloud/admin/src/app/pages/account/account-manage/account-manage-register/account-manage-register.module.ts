import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountManageRegisterComponent } from './account-manage-register.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ThemeModule } from '../../../../@theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [AccountManageRegisterComponent],
})
export class AccountManageRegisterModule { }
