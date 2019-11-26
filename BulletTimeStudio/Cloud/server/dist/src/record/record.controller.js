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
const record_service_1 = require("./record.service");
let RecordController = class RecordController {
    constructor(recordService) {
        this.recordService = recordService;
    }
    Post_test(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.recordService.post_test(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    Get_test(res, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.recordService.get_test(id);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    Start_record(res, file_name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.recordService.start_record(file_name, id);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
};
__decorate([
    common_1.Post('post_test'),
    __param(0, common_1.Res()),
    __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], RecordController.prototype, "Post_test", null);
__decorate([
    common_1.Get('get_test'),
    __param(0, common_1.Res()),
    __param(1, common_1.Query('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], RecordController.prototype, "Get_test", null);
__decorate([
    common_1.Get('start_record'),
    __param(0, common_1.Res()), __param(1, common_1.Query('file_name')), __param(2, common_1.Query('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], RecordController.prototype, "Start_record", null);
RecordController = __decorate([
    common_1.Controller('record'),
    __metadata("design:paramtypes", [record_service_1.RecordService])
], RecordController);
exports.RecordController = RecordController;
//# sourceMappingURL=record.controller.js.map