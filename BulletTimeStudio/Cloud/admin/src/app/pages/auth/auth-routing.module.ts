import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { AuthComponent } from './auth.component';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { AuthGuard } from './authguard/authguard.AuthGuard';

const routes: Routes = [{
  path: '',
  component: AuthComponent,
  children: [
    {
      path: 'login',
      component: LoginComponent,
    },
    {
      path: 'logout',
      component: LogoutComponent,
      canActivate: [AuthGuard],
    },
    {
      path: '',
      redirectTo: 'login',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {
}
