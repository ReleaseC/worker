"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const wechat_controller_1 = require("./wechat.controller");
const wechat_service_1 = require("./wechat.service");
const database_module_1 = require("../database/database.module");
const wechat_provider_1 = require("./wechat.provider");
const users_module_1 = require("../users/users.module");
let WechatModule = class WechatModule {
};
WechatModule = __decorate([
    common_1.Module({
        imports: [database_module_1.DatabaseModule, users_module_1.UsersModule],
        controllers: [wechat_controller_1.WechatController],
        components: [wechat_service_1.WechatService,
            ...wechat_provider_1.WechatProviders,],
        exports: [wechat_service_1.WechatService]
    })
], WechatModule);
exports.WechatModule = WechatModule;
//# sourceMappingURL=wechat.module.js.map