import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SiteComponent } from './site.component';
import { SiteManagementComponent } from './site-management/site-management.component';
import { AuthGuard } from '../auth/authguard/authguard.AuthGuard';

const routes: Routes = [{
  path: '',
  component: SiteComponent,
  children: [
    {
      path: 'site-management',
      loadChildren: 'app/pages/site/site-management/site-management.module#SiteManagementModule',
    },
    {
      path: 'site-soccer',
      loadChildren: 'app/pages/site/site-soccer/site-soccer.module#SiteSoccerModule',
    },
    {
      path: 'site-bullettime',
      loadChildren: 'app/pages/site/site-bullettime/site-bullettime.module#SiteBullettimeModule',
    },
    {
      path: '',
      redirectTo: 'site-management',
      pathMatch: 'full',
    },
    {
      path: 'site-basketball',
      loadChildren: 'app/pages/site/site-basketball/site-basketball.module#SiteBasketballModule',
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteRoutingModule {
}
