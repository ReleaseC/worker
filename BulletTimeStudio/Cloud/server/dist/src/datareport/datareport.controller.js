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
const datareport_service_1 = require("./datareport.service");
let DatareportController = class DatareportController {
    constructor(datareportService) {
        this.datareportService = datareportService;
    }
    point_page(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.datareportService.point_page(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    statistics(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.datareportService.statistics(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    cancel_statistics(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.datareportService.cancel_statistics(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_data(res, siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.datareportService.get_data(siteId);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_statistics(res, siteId, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = taskId ? yield this.datareportService.getTaskStatistics(taskId) :
                yield this.datareportService.get_statistics(siteId);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    download_file(res, method, bucket, key, content_md5, content_type, date) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.datareportService.download_file(method, bucket, key, content_md5, content_type, date);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    import_data(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.datareportService.import_data();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
};
__decorate([
    common_1.Post("point_page"),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DatareportController.prototype, "point_page", null);
__decorate([
    common_1.Post("statistics"),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DatareportController.prototype, "statistics", null);
__decorate([
    common_1.Post("cancel_statistics"),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DatareportController.prototype, "cancel_statistics", null);
__decorate([
    common_1.Get("get_data"),
    __param(0, common_1.Res()), __param(1, common_1.Query("siteId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], DatareportController.prototype, "get_data", null);
__decorate([
    common_1.Get("get_statistics"),
    __param(0, common_1.Res()), __param(1, common_1.Query("siteId")), __param(2, common_1.Query("taskId")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DatareportController.prototype, "get_statistics", null);
__decorate([
    common_1.Get("download_file"),
    __param(0, common_1.Res()), __param(1, common_1.Query("method")), __param(2, common_1.Query("bucket")), __param(3, common_1.Query("key")), __param(4, common_1.Query("content_md5")), __param(5, common_1.Query("content_type")), __param(6, common_1.Query("date")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], DatareportController.prototype, "download_file", null);
__decorate([
    common_1.Get("import_data"),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], DatareportController.prototype, "import_data", null);
DatareportController = __decorate([
    common_1.Controller("datareport"),
    __metadata("design:paramtypes", [datareport_service_1.DatareportService])
], DatareportController);
exports.DatareportController = DatareportController;
//# sourceMappingURL=datareport.controller.js.map