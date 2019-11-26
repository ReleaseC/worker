import { NgModule } from '@angular/core';
import { PagesComponent } from './pages.component';
import { TasklistModule } from './tasklist/tasklist.module';
import { ProfitModule } from './profit/profit.module';
import { ActivityModule } from './activity/activity.module';
import { FileServerModule } from './fileServer/fileServer.module';
import { CustomerModule } from './customer/customer.module';
import { DataModule } from './data/data.module';
import { PagesRoutingModule } from './pages-routing.module';
import { ThemeModule } from '../@theme/theme.module';
import { SiteModule } from './site/site.module';
import { DeviceModule } from './device/device.module';
import { DeviceSettingModule } from './device/device-setting/device-setting.module';
import { AuthModule } from './auth/auth.module';
import { ReportModule } from './report/report.module';
import { AccountModule } from './account/account.module';
import { SocketIoModule, SocketIoConfig } from 'ng-socket-io';
import { environment } from '../../environments/environment';
import { SocketService } from './common/socket.service';
import { UploadImageService } from './share/upload-image.service';
import { TestServerModule} from './test/test.module'

// import { ActivityModule } from './activity-routing.module';

const PAGES_COMPONENTS = [
  PagesComponent,
];
const config: SocketIoConfig = { url: environment.apiServer, options: {} };

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    TasklistModule,
    ActivityModule,
    ProfitModule,
    FileServerModule,
    CustomerModule,
    DataModule,
    SiteModule,
    DeviceModule,
    DeviceSettingModule,
    AuthModule,
    ReportModule,
    AccountModule,
    SocketIoModule.forRoot(config),
    TestServerModule,
  ],
  providers: [SocketService,UploadImageService],
  declarations: [
    ...PAGES_COMPONENTS,
  ],
})
export class PagesModule {
}
