
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
// import { ThemeModule } from '../../@theme/theme.module';
import { CommonModule } from '@angular/common';
import { ProfitComponent } from './profit.component';
import { FormsModule } from '@angular/forms';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { HttpClientModule } from '@angular/common/http';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker'
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzMessageModule } from 'ng-zorro-antd/message';


@NgModule({
  providers:[
  ],
  imports: [
    // ThemeModule,
    HttpClientModule,
    FormsModule,
    MyDateRangePickerModule,
    CommonModule,
    NzDatePickerModule,
    NzPopconfirmModule,
    NzMessageModule

  ],
  declarations: [
    ProfitComponent

  ],
})
export class ProfitModule { }
