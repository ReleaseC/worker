import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import {TempletComponent } from './templet/templet.component';
import { AppRoutingModule } from './app-routing.module';
import {ShoppingcarComponent } from './shoppingcar/shoppingcar.component';
import {ResultComponent } from './result/result.component';
import {Result_templetComponent } from './result_templet/result_templet.component';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import {DownloadComponent } from './download/download.component';
import {LoginComponent } from './login/login.component';
import {FailComponent } from './fail/fail.component';
import {WaitingComponent } from './waiting/waiting.component';
const config: SocketIoConfig = { url: 'https://bt.siiva.com', options: {"site":"0013"} };
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    TempletComponent,
    ShoppingcarComponent,
    ResultComponent,
    Result_templetComponent,
    DownloadComponent,
    FailComponent,
    WaitingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
