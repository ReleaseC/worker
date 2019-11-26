import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { OrderComponent } from './order/order.component';
import { FormsModule } from '@angular/forms';
import { MyDateRangePickerModule } from 'mydaterangepicker';
@NgModule({
  declarations: [
    AppComponent,
    OrderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    MyDateRangePickerModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }


