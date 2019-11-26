/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, Inject, InjectionToken } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { ThemeModule } from './@theme/theme.module';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { Md5 } from 'ts-md5';
import { AuthGuard } from './pages/auth/authguard/authguard.AuthGuard';
import { AuthService } from './pages/auth/authguard/authguard.service';
import { environment } from '../environments/environment';

export const EnvironmentToken = new InjectionToken('ENVIRONMENT');
declare let gtag: Function;

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    NgbModule.forRoot(),
    ThemeModule.forRoot(),
    CoreModule.forRoot(),
  ],
  bootstrap: [AppComponent],
  providers: [
    { provide: APP_BASE_HREF, useValue: '/' },
    AuthGuard,
    AuthService,
    CookieService,
    Md5,
    { provide: EnvironmentToken, useValue: environment },
  ],
})
export class AppModule {
  constructor(@Inject(EnvironmentToken) private env: any) {
    // 步驟 3
    gtag('config', this.env.google.GA_TRACKING_ID);
  }
}
