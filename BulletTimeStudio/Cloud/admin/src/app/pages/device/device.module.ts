import {NgModule} from '@angular/core';

import {DeviceComponent} from './device.component';
import {DeviceAddModule} from './device-add/device-add.module';
import {DeviceStatusModule} from './device-status/device-status.module';
import {DeviceSettingModule} from './device-setting/device-setting.module';
import {DeviceRoutingModule} from './device-routing.module';

@NgModule({
  imports: [
    DeviceRoutingModule,
    DeviceAddModule,
    DeviceStatusModule,
    DeviceSettingModule
  ],
  declarations: [
    DeviceComponent,
  ],
})
export class DeviceModule {
}
