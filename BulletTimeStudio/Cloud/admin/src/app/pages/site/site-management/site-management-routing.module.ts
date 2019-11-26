import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SiteManagementComponent } from './site-management.component';
import { ManagementSettingComponent } from './management-setting/management-setting.component';
import { ManagementUpdateComponent } from './management-update/management-update.component';
import { ManagementMatchComponent } from './management-match/management-match.component';
import { AuthGuard } from '../../auth/authguard/authguard.AuthGuard';

const routes: Routes = [{
  path: '',
  component: SiteManagementComponent,
  children: [
    {
      path: 'management-setting',
      component: ManagementSettingComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'management-update',
      component: ManagementUpdateComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'management-match',
      component: ManagementMatchComponent,
      canActivate: [AuthGuard],
    },
    {
      path: '',
      redirectTo: 'management-setting',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteManagementRoutingModule {
}
