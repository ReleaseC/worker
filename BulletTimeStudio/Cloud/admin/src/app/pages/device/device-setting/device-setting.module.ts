import { ModuleWithProviders, NgModule } from '@angular/core';
import { ThemeModule } from '../../../@theme/theme.module';
import { DeviceSettingComponent } from './device-setting.component';

@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    DeviceSettingComponent,
  ],
})
export class DeviceSettingModule {
}
