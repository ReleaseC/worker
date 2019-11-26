import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app.routing';
import { ServiceWorkerModule } from '@angular/service-worker';
import { MenuModule } from './modules/menu/menu.module';
import { environment } from '../environments/environment';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login/login.component';
// import { MenuComponent } from './modules/menu/menu.component';
// import { LogoutComponent} from './modules/menu/logout/logout.component';
// import { MoreComponent} from './modules/menu/more/more.component';
// import { DeviceManagerComponent } from './modules/menu/devicemanager/devicemanager.component';
// import { PhotoManagerComponent } from './modules/menu/photomanager/photomanager.component';
// import { InstallationComponent } from './modules/menu/installation/installation.component';
// import { SystemsettingComponent } from './modules/menu/systemsetting/systemsetting.component';
const config: SocketIoConfig = { url: 'https://bt-dev-1.siiva.com/', options: {"site":"0014"} };
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    // MenuComponent,
    // LogoutComponent,
    // MoreComponent,
    // DeviceManagerComponent,
    // PhotoManagerComponent,
    // InstallationComponent,
    // SystemsettingComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ServiceWorkerModule.register('/ngsw-worker.js', { enabled: environment.production }),
    MenuModule,
    AppRoutingModule,
    HttpClientModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
