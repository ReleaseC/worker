import { NgModule } from '@angular/core';


import { ThemeModule } from '../../@theme/theme.module';
import { CustomerComponent } from './customer.component';


@NgModule({
  imports: [
    ThemeModule,
  ],
  declarations: [
    CustomerComponent,
  ],
})
export class CustomerModule { }
