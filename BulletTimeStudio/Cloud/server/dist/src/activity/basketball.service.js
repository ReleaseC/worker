"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const socket_interface_1 = require("../common/socket.interface");
let BasketballService = class BasketballService {
    constructor() { }
    initService(io, socket) {
        socket.on(socket_interface_1.SOCKET_EVENT.EVENT_BINDING, (data) => {
            socket.join(socket_interface_1.SOCKET_EVENT.EVENT_BINDING);
        });
        socket.on(socket_interface_1.SOCKET_EVENT.EVENT_BINDING_SUCCESS, (data) => {
            io.to(socket_interface_1.SOCKET_EVENT.EVENT_BINDING).emit(socket_interface_1.SOCKET_EVENT.EVENT_BINDING_SUCCESS, data);
        });
    }
};
BasketballService = __decorate([
    common_1.Component(),
    __metadata("design:paramtypes", [])
], BasketballService);
exports.BasketballService = BasketballService;
//# sourceMappingURL=basketball.service.js.map