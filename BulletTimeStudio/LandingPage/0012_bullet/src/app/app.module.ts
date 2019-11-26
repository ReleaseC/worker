import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import {ResultComponent } from './result/result.component';
import {LoginComponent } from './login/login.component';
import {FailComponent } from './fail/fail.component';
import {WaitingComponent } from './waiting/waiting.component';
import {DownloadComponent } from './download/download.component';
const config: SocketIoConfig = { url: 'https://bt.siiva.com', options: {"site":"0012"} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ResultComponent,
    FailComponent,
    WaitingComponent,
    DownloadComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
