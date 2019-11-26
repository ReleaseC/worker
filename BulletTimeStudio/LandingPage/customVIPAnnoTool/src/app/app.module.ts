import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { PanelComponent } from './panel/panel.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgMaterialModule } from './ngMaterialModule/ngMaterialModule.module';
import { environment } from '../environments/environment';
import { SocketService } from './socket/socket.service';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';

const config: SocketIoConfig = { url: environment.apiServer, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgMaterialModule,
    SocketIoModule.forRoot(config),
  ],
  providers: [SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
