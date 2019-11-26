import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TimeComponent } from './time/time.component';
import { StartComponent } from './start/start.component';
import { EndComponent } from './end/end.component';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
// import { WebCamComponent } from 'ack-angular-webcam';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {trigger, state, style, animate, transition} from '@angular/animations';
const config: SocketIoConfig = { url: 'http://localhost:3001', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    TimeComponent,
    StartComponent,
    EndComponent
    // WebCamComponent
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
