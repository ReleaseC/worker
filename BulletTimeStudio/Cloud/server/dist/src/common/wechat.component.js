"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = require("axios");
var JsonDB = require('node-json-db');
exports.WeChatInfo = {
    siteId: ['0001', '0002', '0011', '0012', '0013', '0014', 'SiivaPage'],
    '0001': {
        appid: 'wxb0c9caded7e8fc8d',
        secret: 'f79b5b819f550b874b6592ef93b217d4',
        template: {
            appointment: 'j8xDuKL6PYfaG3q7ZPDubEZm5NYkn1MTW3PxqGCWFAc',
            get_tickets: 'iaTSW-61u8PPBnYIoqFAV7BAr94yzaIcrdeB6TjsPOU',
            get_video: 'd8MajaWKAkVCU8WZb4vPCyy90sC5On3T5rQTn8h6u5s',
        }
    },
    '0002': {
        appid: 'wx71f94faa986aa53b',
        secret: '2a56906128104e8b8f47b07147ba02b3'
    },
    '0011': {
        appid: 'wxb0c9caded7e8fc8d',
        secret: 'f79b5b819f550b874b6592ef93b217d4',
    },
    '0012': {
        appid: 'wxb0c9caded7e8fc8d',
        secret: 'f79b5b819f550b874b6592ef93b217d4',
    },
    '0013': {
        appid: 'wxb0c9caded7e8fc8d',
        secret: 'f79b5b819f550b874b6592ef93b217d4',
    },
    '0014': {
        appid: 'wx71f94faa986aa53b',
        secret: '2a56906128104e8b8f47b07147ba02b3'
    },
    'SiivaPage': {
        appid: 'wxb0c9caded7e8fc8d',
        secret: 'f79b5b819f550b874b6592ef93b217d4'
    },
};
class WechatWeb {
    static get_wechat(code, state) {
        return __awaiter(this, void 0, void 0, function* () {
            let access_DB = new JsonDB('./db/access_token.json', true, false);
            var wechat = access_DB.getData("/" + state + "/access");
            if (code.length > 0) {
                var response = yield axios_1.default.post('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + exports.WeChatInfo[state].appid + '&secret=' + exports.WeChatInfo[state].secret + '&code=' + code + '&grant_type=authorization_code', {});
                var is_access = yield axios_1.default.get('https://api.weixin.qq.com/sns/auth?access_token=' + response.data.access_token + '&openid=' + response.data.openid);
                console.log(is_access.data);
                if (is_access.data.errcode == 0) {
                    console.log(is_access.data);
                    var response_info = yield axios_1.default.get('https://api.weixin.qq.com/sns/userinfo?access_token=' + response.data.access_token + '&openid=' + response.data.openid + '&lang=zh_CN');
                    if (response_info.data.openid == null || response_info.data.openid == undefined) {
                        var response_info = yield axios_1.default.get('https://api.weixin.qq.com/sns/userinfo?access_token=' + response.data.access_token + '&openid=' + response.data.openid + '&lang=zh_CN');
                    }
                }
            }
            var WechatUserInfo = {};
            WechatUserInfo['wechat'] = response.data;
            WechatUserInfo['info'] = response_info.data;
            return WechatUserInfo;
        });
    }
}
exports.WechatWeb = WechatWeb;
//# sourceMappingURL=wechat.component.js.map