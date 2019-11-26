import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { UsersModule } from '../users/users.module';
import { WeiboController } from "./weibo.controller";
import { WeiboService } from "./weibo.service";


@Module({
  imports: [DatabaseModule,UsersModule],
  controllers: [WeiboController],
  components: [WeiboService],
  exports:[WeiboService]
})
export class WeiboModule {}