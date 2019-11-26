import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { PanelComponent } from './panel/panel.component';

const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: PanelComponent,
    // canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
