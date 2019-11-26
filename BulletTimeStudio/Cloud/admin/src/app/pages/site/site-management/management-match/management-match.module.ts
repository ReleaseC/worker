import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManagementMatchComponent } from './management-match.component';
import { ThemeModule } from '../../../../@theme/theme.module';

@NgModule({
  imports: [
    CommonModule,
    ThemeModule,
  ],
  declarations: [ManagementMatchComponent],
})
export class ManagementMatchModule { }
