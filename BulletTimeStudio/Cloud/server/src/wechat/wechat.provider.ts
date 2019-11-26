import { Connection } from 'mongoose';
import { WechatSchema } from './schemas/wechat.schema';

export const WechatProviders = [
  {
    provide: 'WechatModelToken',
    useFactory: (mongoose) => mongoose.connection.model('wechatusers', WechatSchema),
    inject: ['DbToken'],
  },
];