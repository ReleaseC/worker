import { NgModule } from '@angular/core';


import { ThemeModule } from '../../@theme/theme.module';
import { DataComponent } from './data.component';


@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    DataComponent,
  ],
})
export class DataModule { }
