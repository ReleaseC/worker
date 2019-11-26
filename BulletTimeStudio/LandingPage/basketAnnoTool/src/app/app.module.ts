import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PanelComponent } from './panel/panel.component';
import { PanelRunnerComponent } from './panel-runner/panel-runner.component';
import { HttpClientModule } from '@angular/common/http';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { SocketService } from './socket/socket.service';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './authguard/authguard.AuthGuard';
import { CookieService } from 'ngx-cookie-service';
import { AuthService } from './authguard/authguard.service';
import { ActivityComponent } from './activity/activity.component';
import { LoggerService } from './loggerservice/logger.service';
import { ConsoleLoggerService } from './loggerservice/console-logger.service';

const config: SocketIoConfig = { url: environment.mediaServer, options: {} };

@NgModule({
  declarations: [
    AppComponent,
    PanelComponent,
    PanelRunnerComponent,
    LoginComponent,
    ActivityComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config),
    FormsModule,
  ],
  providers: [
    SocketService,
    AuthGuard,
    CookieService,
    AuthService,
    { provide: LoggerService, useClass: ConsoleLoggerService },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
