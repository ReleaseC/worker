import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { SiteComponent } from './site.component';
import { SiteManagementModule } from './site-management/site-management.module';
import { SiteSoccerModule } from './site-soccer/site-soccer.module'
import { SiteRoutingModule } from './site-routing.module';
import { SiteBullettimeModule } from './site-bullettime/site-bullettime.module';
import { SiteBasketballModule } from './site-basketball/site-basketball.module';
@NgModule({
  imports: [
    ThemeModule,
    SiteRoutingModule,
    SiteManagementModule,
    SiteSoccerModule,
    SiteBullettimeModule,
    SiteBasketballModule,
  ],
  declarations: [
    SiteComponent
  ],
})
export class SiteModule { }
