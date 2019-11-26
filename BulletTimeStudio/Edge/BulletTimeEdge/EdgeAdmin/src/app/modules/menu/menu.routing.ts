import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { CameraComponent } from './camera/camera.component';
import { TaskComponent } from './task/task.component';
import { TestComponent } from './test/test.component';
import { LogoutComponent} from './logout/logout.component';
import { MoreComponent} from './more/more.component';
import { DeviceManagerComponent } from './devicemanager/devicemanager.component';
import { PhotoManagerComponent } from './photomanager/photomanager.component';
import { InstallationComponent } from './installation/installation.component';
import { SystemsettingComponent } from './systemsetting/systemsetting.component';
import { CalibrationComponent } from './calibration/calibration.component';
const routes: Routes = [
    {
        path: 'menu',
        component: MenuComponent,
        children: [
            {
                path: 'installation',
                component: InstallationComponent,
            },
            {
                path: 'calibration',
                component: CalibrationComponent,
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
            },
            {
                path: 'camera',
                component: CameraComponent,
            },
            {
                path: 'task',
                component: TaskComponent,
            },
            {
                path: 'test',
                component: TestComponent,
            }
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MenuRoutingModule {}
