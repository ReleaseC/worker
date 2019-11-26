import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { DeviceComponent } from './device.component';
import { DeviceStatusComponent } from './device-status/device-status.component';
import { DeviceSettingComponent } from './device-setting/device-setting.component';
import { DeviceAddComponent } from './device-add/device-add.component';
import { AuthGuard } from '../auth/authguard/authguard.AuthGuard';

const routes: Routes = [{
  path: '',
  component: DeviceComponent,
  children: [
    {
      path: 'add',
      component: DeviceAddComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'status',
      component: DeviceStatusComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'setting',
      component: DeviceSettingComponent,
      canActivate: [AuthGuard],
    },
    {
      path: '',
      redirectTo: 'status',
      pathMatch: 'full',
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DeviceRoutingModule {
}
