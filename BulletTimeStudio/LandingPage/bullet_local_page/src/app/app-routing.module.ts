import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate} from '@angular/router';
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import { TimeComponent } from './time/time.component';
import { StartComponent } from './start/start.component';
import { EndComponent } from './end/end.component';
import { WebCamComponent } from 'ack-angular-webcam';

const routes: Routes = [
  { path: '', redirectTo: '/time', pathMatch:'full'},
  { path: 'start', component: StartComponent},
  { path: 'time', component: TimeComponent},
  { path: 'end', component: EndComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [ RouterModule ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    { provide: APP_BASE_HREF, useValue: '/' }],
})
export class AppRoutingModule { }
