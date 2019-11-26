import { NgModule } from '@angular/core';
import { ThemeModule } from '../../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { SiteSoccerComponent } from './site-soccer.component';
import { SoccerAddSiteModule } from './soccer-add-site/soccer-add-site.module';
import { SoccerQuerySiteModule } from './soccer-query-site/soccer-query-site.module';
import { SoccerManageSiteModule } from './soccer-manage-site/soccer-manage-site.module';
import { SiteSoccerRoutingModule } from './site-soccer-routing.module';
import { SoccerMatchSiteModule } from './soccer-match-site/soccer-match-site.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
    SiteSoccerRoutingModule,
    SoccerAddSiteModule,
    SoccerQuerySiteModule,
    SoccerManageSiteModule,
    SoccerMatchSiteModule,
  ],
  declarations: [SiteSoccerComponent],
})
export class SiteSoccerModule { }
