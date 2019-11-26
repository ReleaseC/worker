"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const system_module_1 = require("./system/system.module");
const account_module_1 = require("./account/account.module");
const activity_module_1 = require("./activity/activity.module");
const task_module_1 = require("./task/task.module");
const wechat_module_1 = require("./wechat/wechat.module");
const wechat_payment_module_1 = require("./wechat_payment/wechat_payment.module");
const users_module_1 = require("./users/users.module");
const datareport_module_1 = require("./datareport/datareport.module");
const site_module_1 = require("./site/site.module");
const device_module_1 = require("./device/device.module");
const edgeadmin_module_1 = require("./edgeadmin/edgeadmin.module");
const notification_module_1 = require("./notification/notification.module");
const customize_module_1 = require("./customize/customize.module");
const weibo_module_1 = require("./weibo/weibo.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [],
        controllers: [app_controller_1.AppController],
        components: [],
        modules: [
            system_module_1.SystemModule,
            activity_module_1.ActivityModule,
            task_module_1.TaskModule,
            account_module_1.AccountModule,
            wechat_module_1.WechatModule,
            weibo_module_1.WeiboModule,
            wechat_payment_module_1.WechatPaymentModule,
            users_module_1.UsersModule,
            datareport_module_1.DatareportModule,
            site_module_1.SiteModule,
            device_module_1.DeviceModule,
            edgeadmin_module_1.EdgeadminModule,
            notification_module_1.NotificationModule,
            customize_module_1.CustomizeModule,
        ]
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map