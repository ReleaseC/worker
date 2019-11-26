import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent } from './login/login.component';
import { LogoutComponent} from './modules/menu/logout/logout.component';
import { MoreComponent} from './modules/menu/more/more.component';
import { MenuComponent } from './modules/menu/menu.component';
import { DeviceManagerComponent } from './modules/menu/devicemanager/devicemanager.component';
import { PhotoManagerComponent } from './modules/menu/photomanager/photomanager.component';
import { InstallationComponent } from './modules/menu/installation/installation.component';
import { SystemsettingComponent } from './modules/menu/systemsetting/systemsetting.component';
const routes: Routes = [
    {
        path: '',
        redirectTo: '/login',
        pathMatch: 'full',
    },
    { path: 'login', component: LoginComponent},
    {
        path: 'menu',
        component: MenuComponent,
        children: [
            {
                path: 'installation',
                component: InstallationComponent,
            },
            {
                path: 'devicemanager',
                component: DeviceManagerComponent,
            },
            {
                path: 'photomanager',
                component: PhotoManagerComponent,
            },
            {
                path: 'systemsetting',
                component: SystemsettingComponent,
            },
            {
                path: 'logout',
                component: LogoutComponent,
            },
            {
                path: 'more',
                component: MoreComponent,
            }
            // {
            //     path: 'camera',
            //     component: CameraComponent,
            // },
            // {
            //     path: 'task',
            //     component: TaskComponent,
            // },
            // {
            //     path: 'test',
            //     component: TestComponent,
            // }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forRoot(routes,{ useHash: true })],
    exports: [RouterModule]
})

export class AppRoutingModule {}
