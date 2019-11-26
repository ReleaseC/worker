import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuRoutingModule } from './menu.routing';
import { MenuComponent } from './menu.component';
import { LayoutModule } from '@angular/cdk/layout';
import { SocketService } from '../../shared/socket.service';
import { ProfitModule } from './profit/profit.module';
import { ProfitVideoModule } from './profitvideo/profitvideo.module';
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
import { FormsModule } from '@angular/forms';
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
    ProfitModule,
    ProfitVideoModule,
    SocketIoModule.forRoot(config)
  ],
  providers: [SocketService],
  declarations: [
    MenuComponent,
  ]
})
export class MenuModule { }
