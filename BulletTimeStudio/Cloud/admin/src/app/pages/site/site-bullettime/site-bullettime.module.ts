import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SiteBullettimeComponent } from './site-bullettime.component'
import { BullettimeManageSiteModule } from './bullettime-manage-site/bullettime-manage-site.module'
import { SiteBullettimeRoutingModule } from './site-bullettime-routing.module'

@NgModule({
  imports: [
    CommonModule,
    BullettimeManageSiteModule,
    SiteBullettimeRoutingModule,
  ],
  declarations: [SiteBullettimeComponent],
})
export class SiteBullettimeModule { }
