import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { TasklistComponent } from './tasklist/tasklist.component';
import { ProfitComponent } from './profit/profit.component';
import { ActivityComponent } from './activity/activity.component';

import { FileServerComponent } from './fileServer/fileServer.component';
import { SoccerListComponent } from './tasklist/soccer/soccer.component';
import { BullettimeListComponent } from './tasklist/bullettime/bullettime.component';
import { CustomerComponent } from './customer/customer.component';
import { DataComponent } from './data/data.component';
import { SiteComponent } from './site/site.component';
import { ReportComponent } from './report/report.component';
import { AccountComponent } from './account/account.component';
import { AuthGuard } from './auth/authguard/authguard.AuthGuard';
import {TestComponent} from './test/test.component';


const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'tasklist',
      component: TasklistComponent,
      canActivate: [AuthGuard],
      // children: [{
      //   path: '',
      //   redirectTo: 'soccer',
      //   pathMatch: 'full',
      // }, {
      //   path: 'soccer',
      //   component: SoccerListComponent,
      // }, {
      //   path: 'bullettime',
      //   component: BullettimeListComponent,
      // }],
    },
    {
      path: 'profit',
      component: ProfitComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'activity',
      component: ActivityComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'fileServer',
      component: FileServerComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'test',
      component: TestComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'customer',
      component: CustomerComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'device',
      loadChildren: 'app/pages/device/device.module#DeviceModule',
    },
    {
      path: 'data',
      component: DataComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'site',
      loadChildren: 'app/pages/site/site.module#SiteModule',
    },
    {
      path: 'report',
      component: ReportComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'account',
      loadChildren: 'app/pages/account/account.module#AccountModule',
    },
    {
      path: 'auth',
      loadChildren: 'app/pages/auth/auth.module#AuthModule',
    },
    {
      path: '',
      redirectTo: 'tasklist',
      pathMatch: 'full',
    },
    { path: '**', redirectTo: 'tasklist' },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
