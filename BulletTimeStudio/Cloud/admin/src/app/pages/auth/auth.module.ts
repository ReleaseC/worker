import { ModuleWithProviders, NgModule } from '@angular/core';
import { AuthComponent } from './auth.component';
import { LoginModule } from './login/login.module';
import { AuthRoutingModule } from './auth-routing.module';
import { LogoutModule } from './logout/logout.module';

const AUTH_COMPONENTS = [
  AuthComponent,
];

@NgModule({
  imports: [
    AuthRoutingModule,
    LoginModule,
    LogoutModule,
  ],
  declarations: [
    ...AUTH_COMPONENTS,
  ],
})
export class AuthModule {
}
