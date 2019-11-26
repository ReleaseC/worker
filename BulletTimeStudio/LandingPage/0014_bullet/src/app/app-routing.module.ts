import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate} from '@angular/router';
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import {TempletComponent } from './templet/templet.component';
import {ShoppingcarComponent } from './shoppingcar/shoppingcar.component';
import {ResultComponent } from './result/result.component';
import {Result_templetComponent } from './result_templet/result_templet.component';
import {DownloadComponent } from './download/download.component';
import {FailComponent } from './fail/fail.component';
import {WaitingComponent } from './waiting/waiting.component';
import {LoginComponent } from './login/login.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch:'full'},
  { path: 'login', component: LoginComponent},
  { path: 'fail', component: FailComponent},
  { path: 'waiting', component: WaitingComponent},
  { path: 'templet', component: TempletComponent},
  { path: 'shoppingcar', component: ShoppingcarComponent},
  { path: 'result', component: ResultComponent},
  { path: 'result_templet', component: Result_templetComponent},
  { path: 'download', component: DownloadComponent}
//   { path: 'waiting', component: WaitingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppRoutingModule { }