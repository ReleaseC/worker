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
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
