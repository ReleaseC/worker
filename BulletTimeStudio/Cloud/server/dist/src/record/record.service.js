"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
const ret_component_1 = require("../common/ret.component");
const global_component_1 = require("../common/global.component");
let RecordService = class RecordService {
    post_test(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret.code = 1;
            ret.result = data;
            return ret;
        });
    }
    get_test(id) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(global_component_1.Global.getSocket());
            let ret = new ret_component_1.RetObject;
            ret.code = 1;
            ret.description = id;
            return ret;
        });
    }
    start_record(file_name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            var key = id;
            global_component_1.Global.getSocket()[key].emit('start_record', id);
        });
    }
};
RecordService = __decorate([
    common_1.Component()
], RecordService);
exports.RecordService = RecordService;
//# sourceMappingURL=record.service.js.map