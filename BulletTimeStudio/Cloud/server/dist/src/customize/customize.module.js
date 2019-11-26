"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const customize_service_1 = require("./customize.service");
const customize_controller_1 = require("./customize.controller");
let CustomizeModule = class CustomizeModule {
};
CustomizeModule = __decorate([
    common_1.Module({
        controllers: [
            customize_controller_1.CustomizeController,
        ],
        components: [
            customize_service_1.CustomizeService,
        ],
    })
], CustomizeModule);
exports.CustomizeModule = CustomizeModule;
//# sourceMappingURL=customize.module.js.map