import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementUpdateComponent } from './management-update.component';
import { ThemeModule } from '../../../../@theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [ManagementUpdateComponent],
})
export class ManagementUpdateModule { }
