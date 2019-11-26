"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const database_module_1 = require("../database/database.module");
const users_module_1 = require("../users/users.module");
const weibo_controller_1 = require("./weibo.controller");
const weibo_service_1 = require("./weibo.service");
let WeiboModule = class WeiboModule {
};
WeiboModule = __decorate([
    common_1.Module({
        imports: [database_module_1.DatabaseModule, users_module_1.UsersModule],
        controllers: [weibo_controller_1.WeiboController],
        components: [weibo_service_1.WeiboService],
        exports: [weibo_service_1.WeiboService]
    })
], WeiboModule);
exports.WeiboModule = WeiboModule;
//# sourceMappingURL=weibo.module.js.map