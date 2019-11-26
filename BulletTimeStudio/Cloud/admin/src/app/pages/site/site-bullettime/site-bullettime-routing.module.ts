import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SiteBullettimeComponent } from './site-bullettime.component';
import { BullettimeManageSiteComponent } from './bullettime-manage-site/bullettime-manage-site.component'
import { AuthGuard } from '../../auth/authguard/authguard.AuthGuard';

const routes: Routes = [{
  path: '',
  component: SiteBullettimeComponent,
  children: [
    {
      path: 'bullettime-manage-site',
      component: BullettimeManageSiteComponent,
      canActivate: [AuthGuard],
    },
    {
      path: '',
      redirectTo: 'bullettime-manage-site',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteBullettimeRoutingModule {
}
