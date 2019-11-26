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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const wechat_payment_service_1 = require("./wechat_payment.service");
let WechatPaymentController = class WechatPaymentController {
    constructor(WechatPaymentService) {
        this.WechatPaymentService = WechatPaymentService;
    }
    create_wechatpay(req, res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.WechatPaymentService.create_wechatpay(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    create_ticket_order(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.WechatPaymentService.create_ticket_order(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    is_pay(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.WechatPaymentService.is_pay(data);
            console.log(ret);
            res.status(common_1.HttpStatus.OK).send(ret);
        });
    }
    update_pay_state(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.WechatPaymentService.update_pay_state(data);
            console.log(ret);
            res.status(common_1.HttpStatus.OK).send(ret);
        });
    }
    get_order_list(res, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.WechatPaymentService.get_order_list(siteId);
            res.status(common_1.HttpStatus.OK).send(ret);
        });
    }
    get_users_order(res, siteId, openid, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.WechatPaymentService.get_users_order(siteId, openid, taskId);
            res.status(common_1.HttpStatus.OK).send(ret);
        });
    }
};
__decorate([
    common_1.Post('create_wechatpay'),
    __param(0, common_1.Req()), __param(1, common_1.Res()), __param(2, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], WechatPaymentController.prototype, "create_wechatpay", null);
__decorate([
    common_1.Post('create_ticket_order'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatPaymentController.prototype, "create_ticket_order", null);
__decorate([
    common_1.Post('is_pay'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatPaymentController.prototype, "is_pay", null);
__decorate([
    common_1.Post('update_pay_state'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], WechatPaymentController.prototype, "update_pay_state", null);
__decorate([
    common_1.Get('get_order_list'),
    __param(0, common_1.Res()), __param(1, common_1.Query('siteId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], WechatPaymentController.prototype, "get_order_list", null);
__decorate([
    common_1.Get('get_users_order'),
    __param(0, common_1.Res()), __param(1, common_1.Query('siteId')), __param(2, common_1.Query('openid')), __param(3, common_1.Query('taskId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String, String]),
    __metadata("design:returntype", Promise)
], WechatPaymentController.prototype, "get_users_order", null);
WechatPaymentController = __decorate([
    common_1.Controller('wechat_payment'),
    __metadata("design:paramtypes", [wechat_payment_service_1.WechatPaymentService])
], WechatPaymentController);
exports.WechatPaymentController = WechatPaymentController;
//# sourceMappingURL=wechat_payment.controller.js.map