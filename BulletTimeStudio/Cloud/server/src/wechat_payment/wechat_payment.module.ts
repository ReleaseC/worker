import { Module } from '@nestjs/common';
import { WechatPaymentController } from './wechat_payment.controller';
import { WechatPaymentService } from './wechat_payment.service';

@Module({
  modules: [],
  controllers: [WechatPaymentController],
  components: [
    WechatPaymentService
  ],
})
export class WechatPaymentModule {}