"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const edgeadmin_controller_1 = require("./edgeadmin.controller");
const edgeadmin_service_1 = require("./edgeadmin.service");
const database_module_1 = require("../database/database.module");
let EdgeadminModule = class EdgeadminModule {
};
EdgeadminModule = __decorate([
    common_1.Module({
        imports: [database_module_1.DatabaseModule],
        controllers: [edgeadmin_controller_1.EdgeadminController],
        components: [
            edgeadmin_service_1.EdgeadminService
        ],
        exports: [edgeadmin_service_1.EdgeadminService]
    })
], EdgeadminModule);
exports.EdgeadminModule = EdgeadminModule;
//# sourceMappingURL=edgeadmin.module.js.map