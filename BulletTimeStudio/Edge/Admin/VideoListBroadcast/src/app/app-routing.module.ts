import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate} from '@angular/router';
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import {ResultComponent } from './result/result.component';

const routes: Routes = [
  { path: '', redirectTo: '/result', pathMatch:'full'},
  { path: 'result', component: ResultComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppRoutingModule { }
