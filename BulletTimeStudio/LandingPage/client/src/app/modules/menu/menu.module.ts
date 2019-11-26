import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu.routing';
import { MenuComponent } from './menu.component';
import { LogoutComponent } from './logout/logout.component';
import { LayoutModule } from '@angular/cdk/layout';
import { PhotoManagerComponent } from './photomanager/photomanager.component';
import { QRCodeModule } from 'angularx-qrcode';
import { MakeshootComponent } from './makeshoot/makeshoot.component';
import { ShowphotoComponent } from './showphoto/showphoto.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DevicemanagerComponent } from './devicemanager/devicemanager.component';
import { GatherboxComponent } from './gatherbox/gatherbox.component';
import { SocketService } from '../../shared/socket.service';
import { NguiInViewComponent } from './photomanager/ngui-in-view.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
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
const config: SocketIoConfig = { url: 'https://iva.siiva.com', options: {} };
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
    QRCodeModule,
    ReactiveFormsModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [SocketService],
  declarations: [
    LogoutComponent,
    ShowphotoComponent,
    PhotoManagerComponent,
    MakeshootComponent,
    MenuComponent,
    NguiInViewComponent,
    GatherboxComponent,
    DevicemanagerComponent
  ]
})
export class MenuModule { }
