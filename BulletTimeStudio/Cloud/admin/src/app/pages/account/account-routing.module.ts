import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { AccountComponent } from './account.component';
import { AccountManageModule } from './account-manage/account-manage.module';
import { AuthGuard } from '../auth/authguard/authguard.AuthGuard';

const routes: Routes = [{
  path: '',
  component: AccountComponent,
  children: [
    {
      path: 'account-manage',
      loadChildren: 'app/pages/account/account-manage/account-manage.module#AccountManageModule',
    },
    {
      path: '',
      redirectTo: 'account-manage',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccountRoutingModule {
}
