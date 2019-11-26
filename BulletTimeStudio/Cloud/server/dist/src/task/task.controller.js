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
const task_service_1 = require("./task.service");
const roles_guard_1 = require("../common/guards/roles.guard");
const roles_decorator_1 = require("../common/decorators/roles.decorator");
let TaskController = class TaskController {
    constructor(taskService) {
        this.taskService = taskService;
    }
    task_create(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.createTask(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    task_update(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.updateTask(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    update_task_to_ready(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.taskService.updateTaskToDataReady(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    task_get(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.getTask(query);
            res.status(common_1.HttpStatus.OK).json({ task: ret });
        });
    }
    effect_task_get(res, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.getEffectTask(type);
            res.status(common_1.HttpStatus.OK).json({ task: ret });
        });
    }
    task_finish(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.finishTask(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    effect_task_finish(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.finishEffectTask(data);
            res.status(common_1.HttpStatus.OK).json({ task: ret });
        });
    }
    task_abort(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.onAbortTask(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    task_list_get(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.getTaskList(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_task_file_lists(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.get_task_file_lists(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    task_cancel(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.onCancelTask(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_bt_single_task_status(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.getBtSingleTaskStatus(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    update_status(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.taskService.updateStatus(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    get_status(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.taskService.getStatus(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    task_get_by_type(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.getTaskStatusByDataType(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    del(res, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.delTask(data);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    like(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.taskLike(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    if_like(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.taskIfLike(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    likeList(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.taskLikeList(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    collect(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.taskCollect(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    if_collect(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.taskIfCollect(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    collectList(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.taskCollectList(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    visit(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.taskVisit(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
    task_info(res, query) {
        return __awaiter(this, void 0, void 0, function* () {
            const ret = yield this.taskService.taskInfo(query);
            res.status(common_1.HttpStatus.OK).json(ret);
        });
    }
};
__decorate([
    roles_decorator_1.Roles('customer'),
    common_1.Post('task_create'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "task_create", null);
__decorate([
    roles_decorator_1.Roles('customer'),
    common_1.Post('task_update'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "task_update", null);
__decorate([
    common_1.Post('update_task_to_ready'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "update_task_to_ready", null);
__decorate([
    common_1.Get('task_get'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "task_get", null);
__decorate([
    common_1.Get('effect_task_get'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "effect_task_get", null);
__decorate([
    common_1.Post('task_finish'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "task_finish", null);
__decorate([
    common_1.Post('effect_task_finish'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "effect_task_finish", null);
__decorate([
    common_1.Post('task_abort'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "task_abort", null);
__decorate([
    common_1.Get('task_list_get'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "task_list_get", null);
__decorate([
    common_1.Post('get_task_file_lists'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "get_task_file_lists", null);
__decorate([
    common_1.Post('task_cancel'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "task_cancel", null);
__decorate([
    common_1.Post('get_bt_single_task_status'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "get_bt_single_task_status", null);
__decorate([
    common_1.Post('update_status'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "update_status", null);
__decorate([
    common_1.Post('get_status'),
    __param(0, common_1.Res()), __param(1, common_1.Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "get_status", null);
__decorate([
    common_1.Get('task_get_by_type'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "task_get_by_type", null);
__decorate([
    roles_decorator_1.Roles('customer'),
    common_1.Get('del'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "del", null);
__decorate([
    common_1.Get('like'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "like", null);
__decorate([
    common_1.Get('if_like'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "if_like", null);
__decorate([
    common_1.Get('like_list'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "likeList", null);
__decorate([
    common_1.Get('collect'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "collect", null);
__decorate([
    common_1.Get('if_collect'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "if_collect", null);
__decorate([
    common_1.Get('collect_list'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "collectList", null);
__decorate([
    common_1.Get('visit'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "visit", null);
__decorate([
    common_1.Get('task_info'),
    __param(0, common_1.Res()), __param(1, common_1.Query()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], TaskController.prototype, "task_info", null);
TaskController = __decorate([
    common_1.Controller('task'),
    common_1.UseGuards(roles_guard_1.RolesGuard),
    __metadata("design:paramtypes", [task_service_1.TaskService])
], TaskController);
exports.TaskController = TaskController;
//# sourceMappingURL=task.controller.js.map