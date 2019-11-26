import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing';
import { MenuModule } from './modules/menu/menu.module';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
import { MyDateRangePickerModule } from 'mydaterangepicker';
import { FormsModule } from '@angular/forms';

import { NZ_I18N, zh_CN } from 'ng-zorro-antd';

/** 配置 angular i18n **/
import { registerLocaleData } from '@angular/common';
import zh from '@angular/common/locales/zh';
registerLocaleData(zh);
const config: SocketIoConfig = { url: 'https://iva.siiva.com/', options: {} };
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MenuModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    MyDateRangePickerModule,
    FormsModule,
  ],
  /** 配置 ng-zorro-antd 国际化（文案 及 日期） **/
  providers   : [
    { provide: NZ_I18N, useValue: zh_CN }
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule { }
