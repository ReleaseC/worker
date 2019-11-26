import { ModuleWithProviders, NgModule } from '@angular/core';
import { ThemeModule } from '../../../@theme/theme.module';
import { DeviceStatusComponent } from './device-status.component';

@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    DeviceStatusComponent,
  ],
})
export class DeviceStatusModule {
}
