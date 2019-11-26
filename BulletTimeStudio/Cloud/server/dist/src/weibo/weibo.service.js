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
const axios_1 = require("../../node_modules/axios");
let WeiboService = class WeiboService {
    getWeibo(query) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject();
            try {
                if (!query.code) {
                    throw new Error("code 无效");
                }
                let retContainsAccessToken = yield axios_1.default.post("https://api.weibo.com/oauth2/access_token?client_id=2812607071&client_secret=1e49605e4675d26a3a97e2ff4a8f24e7&grant_type=authorization_code&redirect_uri=https://bt.siiva.com/weibo/get_weibo&code=" + query.code);
                if (!retContainsAccessToken || !retContainsAccessToken.data) {
                    throw new Error("获取access token 无效");
                }
                console.log(retContainsAccessToken);
                ret.code = 0;
                ret.result = retContainsAccessToken.data;
                console.log(ret);
            }
            catch (e) {
                ret.code = 2;
                ret.description = e;
            }
            return ret;
        });
    }
};
WeiboService = __decorate([
    common_1.Component()
], WeiboService);
exports.WeiboService = WeiboService;
//# sourceMappingURL=weibo.service.js.map