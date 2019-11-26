import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SystemModule } from './system/system.module';
import { AccountModule } from './account/account.module';
import { ActivityModule } from './activity/activity.module';
import { TaskModule } from './task/task.module';
// 微信
import { WechatModule } from './wechat/wechat.module';
// 微信支付
import { WechatPaymentModule } from './wechat_payment/wechat_payment.module';
// 路跑用户
import { UsersModule } from './users/users.module';
// 数据统计
import { DatareportModule } from './datareport/datareport.module';
import { SiteModule } from './site/site.module';
import { DeviceModule } from './device/device.module';
//edge的后台控制端
import { EdgeadminModule } from './edgeadmin/edgeadmin.module';
// import { WechatService } from './wechat/wechat.service';
import { NotificationModule } from './notification/notification.module';
import { CustomizeModule } from './customize/customize.module';
import { WeiboModule } from "./weibo/weibo.module";
import { WeparkModule } from "./wepark/wepark.module";
import { PartnerModule } from "./partner/partner.module";

@Module({
  imports: [],
  controllers: [AppController],
  components: [],
  modules: [
    SystemModule,
    ActivityModule,
    TaskModule,
    AccountModule,
    WechatModule,
    WeiboModule,
    WechatPaymentModule,
    UsersModule,
    DatareportModule,
    SiteModule,
    DeviceModule,
    EdgeadminModule,
    NotificationModule,
    CustomizeModule,
    WeparkModule,
    PartnerModule
  ]
})
export class AppModule { }
