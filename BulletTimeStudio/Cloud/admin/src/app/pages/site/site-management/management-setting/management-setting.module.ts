import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementSettingComponent } from './management-setting.component';
import { ThemeModule } from '../../../../@theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [ManagementSettingComponent],
})
export class ManagementSettingModule { }
