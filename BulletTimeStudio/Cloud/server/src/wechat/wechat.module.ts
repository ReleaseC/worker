import { Module } from '@nestjs/common';
import { WechatController } from './wechat.controller';
import { WechatService } from './wechat.service';
import { DatabaseModule } from '../database/database.module';
import { WechatProviders } from './wechat.provider';
import { UsersModule } from '../users/users.module';


@Module({
  imports: [DatabaseModule,UsersModule],
  controllers: [WechatController],
  components: [WechatService,
    ...WechatProviders,],
  exports:[WechatService]
})
export class WechatModule {}