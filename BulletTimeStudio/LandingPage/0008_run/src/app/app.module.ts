import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//import { WebCamComponent } from 'ack-angular-webcam';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import {FormsModule, ReactiveFormsModule } from '@angular/forms';
import {CustomFormsModule} from 'ng2-validation';
import {Location} from '@angular/common';
import { LoginComponent } from './login/login.component';
import { FailComponent } from './fail/fail.component';
import { ResultComponent } from './result/result.component';
import { AppRoutingModule } from './app-routing.module';
import { ReserveComponent } from './reserve/reserve.component';
import { DataComponent } from './data/data.component';
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    FailComponent,
    ResultComponent,
    ReserveComponent,
    DataComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    CustomFormsModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
