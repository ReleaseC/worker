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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require("jsonwebtoken");
const common_1 = require("@nestjs/common");
const redis_service_1 = require("../common/redis.service");
const ret_component_1 = require("../common/ret.component");
var uuidv1 = require('uuid/v1');
let AuthService = class AuthService {
    constructor() { }
    formatDate(time) {
        const Dates = new Date(time);
        const year = Dates.getFullYear();
        const month = (Dates.getMonth() + 1) < 10 ? '0' + (Dates.getMonth() + 1) : (Dates.getMonth() + 1);
        const day = Dates.getDate() < 10 ? '0' + Dates.getDate() : Dates.getDate();
        return year + '-' + month + '-' + day;
    }
    ;
    createToken(account) {
        return __awaiter(this, void 0, void 0, function* () {
            let uuid = uuidv1().replace(/-/g, '');
            const expiresIn = 60 * 60, secretOrKey = uuid;
            const payload = { account: account, role: 'admin' };
            const token = jwt.sign(payload, secretOrKey, { expiresIn });
            const expire = this.formatDate(new Date().getTime() + (1000 * 24 * expiresIn));
            console.log('expire=' + expire);
            const cacheData = {
                'account': account,
                'token': token,
                'expireTime': expire
            };
            redis_service_1.RedisService.setCache(token, JSON.stringify(cacheData));
            return {
                expires_in: expiresIn,
                access_token: token,
            };
        });
    }
    authAccessToken(token) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            ret.code = 0;
            ret.description = "access token pass";
            return ret;
        });
    }
};
AuthService = __decorate([
    common_1.Component(),
    __metadata("design:paramtypes", [])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map