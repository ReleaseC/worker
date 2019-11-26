import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu.routing';
import { CameraComponent } from './camera/camera.component';
import { TaskComponent } from './task/task.component';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { MenuComponent } from './menu.component';
import { LogoutComponent} from './logout/logout.component';
import { MoreComponent} from './more/more.component';
import { DeviceManagerComponent } from './devicemanager/devicemanager.component';
import { LayoutModule } from '@angular/cdk/layout';
import { PhotoManagerComponent } from './photomanager/photomanager.component';
import { InstallationComponent } from './installation/installation.component';
import { SystemsettingComponent } from './systemsetting/systemsetting.component';
import { CalibrationComponent } from './calibration/calibration.component';
import {
  MatToolbarModule,
  MatButtonModule,
  MatSidenavModule,
  MatIconModule,
  MatListModule,
  MatGridListModule,
  MatCardModule,
  MatMenuModule,
  MatSelectModule,
  MatTableModule,
  MatFormFieldModule,
  MatInputModule,
  MatTabsModule
} from '@angular/material';
import { TestComponent } from './test/test.component';
import { SocketService } from '../../shared/socket.service';
import { FormsModule } from '@angular/forms';
const config: SocketIoConfig = { url: 'https://bt-dev-1.siiva.com', options: {"site":"0014"} };
@NgModule({
  imports: [
    CommonModule,
    MenuRoutingModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatGridListModule,
    MatCardModule,
    MatMenuModule,
    MatSelectModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatTabsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [SocketService],
  declarations: [CameraComponent,MoreComponent,LogoutComponent,CalibrationComponent,PhotoManagerComponent,InstallationComponent,SystemsettingComponent, TaskComponent, MenuComponent, TestComponent,DeviceManagerComponent]
})
export class MenuModule { }
