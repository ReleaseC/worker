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
const users_service_1 = require("./users.service");
const environment_1 = require("../environment/environment");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    find(res, name, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.usersService.find(name, game_id);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_video(res, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.usersService.get_video(game_id);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    auto_push(res, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.usersService.auto_push(game_id);
            console.log(ret);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    auto_update(res, game_id, game_time) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.usersService.auto_update(game_id, game_time);
            console.log(ret);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    is_reservate(res, code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.usersService.is_reservate(code, state);
            if (ret.code == 1) {
                res.redirect(environment_1.environment.apiServer + '0008/#/login?openid=' + ret.description + '&is_reservate=' + ret.code + '&is_video=' + ret.result['is_video'] + "&game_id=" + ret.result['game_id'] + "&name=" + ret.result['name'] + "&game_time=" + ret.result['game_time']);
            }
            else {
                var wechat = JSON.stringify(ret.result);
                res.redirect(environment_1.environment.apiServer + '0008/#/login?openid=' + ret.description + '&is_reservate=' + ret.code + '&wechat=' + wechat);
            }
        });
    }
    add_user(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.usersService.add_user(data);
            console.log(ret);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_users(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.usersService.get_users(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    give_like(res, game_id) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.usersService.give_like(game_id);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    user_test(res) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.usersService.userTest();
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
};
__decorate([
    common_1.Get('find'),
    __param(0, common_1.Res()),
    __param(1, common_1.Query('name')),
    __param(2, common_1.Query('game_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "find", null);
__decorate([
    common_1.Get('get_video'),
    __param(0, common_1.Res()), __param(1, common_1.Query('game_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "get_video", null);
__decorate([
    common_1.Get('auto_push'),
    __param(0, common_1.Res()), __param(1, common_1.Query('game_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "auto_push", null);
__decorate([
    common_1.Get('auto_update'),
    __param(0, common_1.Res()), __param(1, common_1.Query('game_id')), __param(2, common_1.Query('game_time')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "auto_update", null);
__decorate([
    common_1.Get('is_reservate'),
    __param(0, common_1.Res()), __param(1, common_1.Query('code')), __param(2, common_1.Query('state')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "is_reservate", null);
__decorate([
    common_1.Post('add_user'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "add_user", null);
__decorate([
    common_1.Post('get_users'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "get_users", null);
__decorate([
    common_1.Get('give_like'),
    __param(0, common_1.Res()), __param(1, common_1.Query('game_id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "give_like", null);
__decorate([
    common_1.Get('user_test'),
    __param(0, common_1.Res()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "user_test", null);
UsersController = __decorate([
    common_1.Controller('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
exports.UsersController = UsersController;
//# sourceMappingURL=users.controller.js.map