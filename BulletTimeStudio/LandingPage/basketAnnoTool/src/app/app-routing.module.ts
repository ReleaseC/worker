import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PanelComponent } from './panel/panel.component';
import { PanelRunnerComponent } from './panel-runner/panel-runner.component';
import { ActivityComponent } from './activity/activity.component';
import { AuthGuard } from './authguard/authguard.AuthGuard';

const routes: Routes = [
  { path: '', redirectTo: '/panel', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'activity',
    component: ActivityComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'panel',
    component: PanelComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'panel-runner',
    component: PanelRunnerComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/panel' },
];
@NgModule({
  imports: [ RouterModule.forRoot(routes, { useHash: true }) ],
  exports: [ RouterModule ]
})

export class AppRoutingModule {}
