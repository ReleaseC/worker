import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './modules/menu/logout/logout.component';
import { MenuComponent } from './modules/menu/menu.component';
import { PhotoManagerComponent } from './modules/menu/photomanager/photomanager.component';
import { MakeshootComponent } from './modules/menu/makeshoot/makeshoot.component';
import { DevicemanagerComponent } from './modules/menu/devicemanager/devicemanager.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    { path: 'login', component: LoginComponent },
    {
        path: 'menu',
        component: MenuComponent,
        children: [
            {
                path: 'makeshoot',
                component: MakeshootComponent,
            },
            {
                path: 'photomanager',
                component: PhotoManagerComponent,
            },
            {
                path: 'devicemanager',
                component: DevicemanagerComponent,
            },
            {
                path: 'logout',
                component: LogoutComponent,
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, { useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule { }
