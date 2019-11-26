"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const site_controller_1 = require("./site.controller");
const database_module_1 = require("../database/database.module");
const site_service_1 = require("./site.service");
const site_provider_1 = require("./site.provider");
let SiteModule = class SiteModule {
};
SiteModule = __decorate([
    common_1.Module({
        imports: [database_module_1.DatabaseModule],
        controllers: [site_controller_1.SiteController],
        components: [
            site_service_1.SiteService,
            ...site_provider_1.SitesProviders
        ],
    })
], SiteModule);
exports.SiteModule = SiteModule;
//# sourceMappingURL=site.module.js.map