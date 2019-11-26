"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const wechat_schema_1 = require("./schemas/wechat.schema");
exports.WechatProviders = [
    {
        provide: 'WechatModelToken',
        useFactory: (mongoose) => mongoose.connection.model('wechatusers', wechat_schema_1.WechatSchema),
        inject: ['DbToken'],
    },
];
//# sourceMappingURL=wechat.provider.js.map