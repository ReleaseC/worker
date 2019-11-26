import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountManageComponent } from './account-manage.component';
import { AccountManageRegisterComponent } from './account-manage-register/account-manage-register.component';
import { AccountManageUserlistsComponent } from './account-manage-userlists/account-manage-userlists.component';
import { AuthGuard } from '../../auth/authguard/authguard.AuthGuard';

const routes: Routes = [{
  path: '',
  component: AccountManageComponent,
  children: [
    {
      path: 'account-manage-register',
      component: AccountManageRegisterComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'account-manage-userlists',
      component: AccountManageUserlistsComponent,
      canActivate: [AuthGuard],
    },
    {
      path: '',
      redirectTo: 'account-manage-userlists',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountManageRoutingModule {
}
