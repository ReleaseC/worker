import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate} from '@angular/router';
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import {LoginComponent } from './login/login.component';
import {ResultComponent } from './result/result.component';
import {WppComponent } from './wpp/wpp.component';
import {DataComponent } from './data/data.component';
import {PayComponent } from './pay/pay.component';
import {WaitingComponent } from './waiting/waiting.component';
import {FailComponent } from './fail/fail.component';
const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch:'full'},
  { path: 'login', component: LoginComponent},
  { path: 'result', component: ResultComponent},
  { path: 'wpp', component: WppComponent},
  { path: 'data', component: DataComponent},
  { path: 'pay', component: PayComponent},
  { path: 'waiting', component: WaitingComponent},
  { path: 'fail', component: FailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppRoutingModule { }
