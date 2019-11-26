import { ModuleWithProviders, NgModule } from '@angular/core';
import { ThemeModule } from '../../../@theme/theme.module';
import { DeviceAddComponent } from './device-add.component';

@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    DeviceAddComponent,
  ],
})
export class DeviceAddModule {
}
