import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteManagementComponent } from './site-management.component';
import { SiteManagementRoutingModule } from './site-management-routing.module';
import { ManagementSettingModule } from './management-setting/management-setting.module';
import { ManagementUpdateModule } from './management-update/management-update.module';
import { ManagementMatchModule } from './management-match/management-match.module';

@NgModule({
  imports: [
    CommonModule,
    SiteManagementRoutingModule,
    ManagementSettingModule,
    ManagementUpdateModule,
    ManagementMatchModule,
  ],
  declarations: [
    SiteManagementComponent,
  ],
})
export class SiteManagementModule { }
