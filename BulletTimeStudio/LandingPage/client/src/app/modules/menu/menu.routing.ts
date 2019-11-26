import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu.component';
import { DevicemanagerComponent } from './devicemanager/devicemanager.component';
import { LogoutComponent} from './logout/logout.component';
import { PhotoManagerComponent } from './photomanager/photomanager.component';
import { MakeshootComponent } from './makeshoot/makeshoot.component';
import{ShowphotoComponent} from './showphoto/showphoto.component';
import{GatherboxComponent} from './gatherbox/gatherbox.component';
const routes: Routes = [
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
                path: 'logout',
                component: LogoutComponent,
            },
            {
                path: 'devicemanager',
                component: DevicemanagerComponent,
            },
            {
                path: 'showphoto',
                component: ShowphotoComponent,
            },
            {
                path: 'gatherbox',
                component: GatherboxComponent,
            },
        ]
    }
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MenuRoutingModule {}
