import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate} from '@angular/router';
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import { SearchComponent } from './search/search.component';
import { ResultComponent } from './result/result.component';
import { FailComponent } from './fail/fail.component';
import { WaitingComponent } from './waiting/waiting.component';


const routes: Routes = [
  { path: '', redirectTo: '/search', pathMatch:'full'},
  { path: 'search', component: SearchComponent},
  { path: 'result', component: ResultComponent},
  { path: 'fail', component: FailComponent},
  { path: 'waiting', component: WaitingComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppRoutingModule { }
