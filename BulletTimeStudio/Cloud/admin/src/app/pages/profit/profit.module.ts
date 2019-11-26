
import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ProfitComponent } from './profit.component';
import { FormsModule } from '@angular/forms';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    ThemeModule,
    HttpClientModule,
    FormsModule,
    MyDateRangePickerModule
  ],
  declarations: [
    ProfitComponent,
  ],
})
export class ProfitModule { }
