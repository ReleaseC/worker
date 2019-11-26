import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SiteSoccerComponent } from './site-soccer.component';
import { SoccerAddSiteComponent } from './soccer-add-site/soccer-add-site.component';
import { SoccerQuerySiteComponent } from './soccer-query-site/soccer-query-site.component';
import { SoccerManageSiteComponent } from './soccer-manage-site/soccer-manage-site.component';
import { SoccerMatchSiteComponent } from './soccer-match-site/soccer-match-site.component';
import { AuthGuard } from '../../auth/authguard/authguard.AuthGuard';

const routes: Routes = [{
  path: '',
  component: SiteSoccerComponent,
  children: [
    {
      path: 'soccer-manage-site',
      component: SoccerManageSiteComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'soccer-query-site',
      component: SoccerQuerySiteComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'soccer-add-site',
      component: SoccerAddSiteComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'soccer-match-site',
      component: SoccerMatchSiteComponent,
      canActivate: [AuthGuard],
    },
    {
      path: '',
      redirectTo: 'soccer-manage-site',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteSoccerRoutingModule {
}
