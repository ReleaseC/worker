import { NgModule } from '@angular/core';
import { ReportComponent } from './report.component';
import { ThemeModule } from '../../@theme/theme.module';

@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    ReportComponent,
  ],
})
export class ReportModule { }
