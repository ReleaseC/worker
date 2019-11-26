import { NgModule } from '@angular/core';
import { RouterModule, Routes, CanActivate} from '@angular/router';
import { APP_BASE_HREF, LocationStrategy, PathLocationStrategy, HashLocationStrategy } from '@angular/common';
import {TreadmillComponent } from './treadmill/treadmill.component';
import {VideoListComponent } from './videolist/videolist.component';
import {ResultComponent } from './result/result.component';
import {DownloadComponent } from './download/download.component';
const routes: Routes = [
  { path: '', redirectTo: '/treadmill', pathMatch:'full'},
  { path: 'treadmill', component: TreadmillComponent},
  { path: 'videolist', component: VideoListComponent},
  { path: 'result', component: ResultComponent},
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