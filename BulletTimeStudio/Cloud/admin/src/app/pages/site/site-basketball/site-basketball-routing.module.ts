import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { SiteBasketballComponent } from './site-basketball.component';
import { BasketballManageSiteComponent } from './basketball-manage-site/basketball-manage-site.component'
import { AuthGuard } from '../../auth/authguard/authguard.AuthGuard';

const routes: Routes = [{
  path: '',
  component: SiteBasketballComponent,
  children: [
    {
      path: 'basketball-manage-site',
      component: BasketballManageSiteComponent,
      canActivate: [AuthGuard],
    },
    {
      path: '',
      redirectTo: 'basketball-manage-site',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SiteBasketballRoutingModule {
}
