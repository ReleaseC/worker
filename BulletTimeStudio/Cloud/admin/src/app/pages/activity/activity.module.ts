import { NgModule } from '@angular/core';
import { ThemeModule } from '../../@theme/theme.module';
import { ActivityComponent } from './activity.component';
import { FormsModule } from '@angular/forms';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { HttpClientModule } from '@angular/common/http';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';




@NgModule({
  imports: [
    ThemeModule,
    HttpClientModule,
    FormsModule,
    MyDateRangePickerModule,
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    // BrowserAnimationsModule
  ],
  declarations: [
    ActivityComponent,
  ],
})
export class ActivityModule { }