import axios from 'axios';
//微信的access_token
var JsonDB = require('node-json-db');
export const WeChatInfo = {
    siteId: ['0001','0002', '0011','0012','0013','0014','SiivaPage','hellokitty','Local_hellokitty'],
    //siiva的微信公众号
    // appid: 'wxb0c9caded7e8fc8d',
    // secret: 'f79b5b819f550b874b6592ef93b217d4',
    //之炜的微信
    '0001': {
        appid: 'wxb0c9caded7e8fc8d',
        secret: 'f79b5b819f550b874b6592ef93b217d4',
        template: {
            //预约成功的模板消息id
            appointment: 'j8xDuKL6PYfaG3q7ZPDubEZm5NYkn1MTW3PxqGCWFAc',
            //获得优惠券的通知
            get_tickets: 'iaTSW-61u8PPBnYIoqFAV7BAr94yzaIcrdeB6TjsPOU',
            //获得视频的通知
            get_video: 'd8MajaWKAkVCU8WZb4vPCyy90sC5On3T5rQTn8h6u5s',
        }
    },
    // //金东文体的微信公众号
    // '0005': {
    //     appid: 'wxbf59726268c9d7d0',
    //     secret: 'dc60706d9fc630cd07fae34e17476a88',

    // },
    // '0007': {
    //     appid: 'wxb0c9caded7e8fc8d',
    //     secret: 'f79b5b819f550b874b6592ef93b217d4',
    // },
    // '0008': {
    //     appid: 'wxb0c9caded7e8fc8d',
    //     secret: 'f79b5b819f550b874b6592ef93b217d4',
    // },
    // '0009': {
    //     appid: 'wxb0c9caded7e8fc8d',
    //     secret: 'f79b5b819f550b874b6592ef93b217d4',
    // },
    // '0010': {
    //     appid: 'wxb0c9caded7e8fc8d',
    //     secret: 'f79b5b819f550b874b6592ef93b217d4',
    // },
    '0002': {
        appid: 'wx71f94faa986aa53b', // 智能云影音appid
        secret: '2a56906128104e8b8f47b07147ba02b3' // 智能云影音app秘钥
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
        appid: 'wx71f94faa986aa53b', // 智能云影音appid
        secret: '2a56906128104e8b8f47b07147ba02b3' // 智能云影音app秘钥
    },
    'SiivaPage': {
        appid: 'wxb0c9caded7e8fc8d',
        secret: 'f79b5b819f550b874b6592ef93b217d4'
    },
    'hellokitty': {
        // appid: 'wxb0c9caded7e8fc8d',
        // secret: 'f79b5b819f550b874b6592ef93b217d4'
        appid: 'wx71f94faa986aa53b',
        secret: '2a56906128104e8b8f47b07147ba02b3'
    },
    'Local_hellokitty': {
        // appid: 'wxb0c9caded7e8fc8d',
        // secret: 'f79b5b819f550b874b6592ef93b217d4'
        appid: 'wx71f94faa986aa53b',
        secret: '2a56906128104e8b8f47b07147ba02b3'
    },
}

export class WechatWeb {

    static async  get_wechat(code, state) {
        let access_DB = new JsonDB('./db/access_token.json', true, false);
        var wechat = access_DB.getData("/" + state + "/access");
        if (code.length > 0) {
            var response = await axios.post('https://api.weixin.qq.com/sns/oauth2/access_token?appid=' + WeChatInfo[state].appid + '&secret=' + WeChatInfo[state].secret + '&code=' + code + '&grant_type=authorization_code', {});
            //获取用户基本信息
            var is_access = await axios.get('https://api.weixin.qq.com/sns/auth?access_token=' + response.data.access_token + '&openid=' + response.data.openid);
            console.log(is_access.data)
            if (is_access.data.errcode == 0) {
                console.log(is_access.data)
                var response_info = await axios.get('https://api.weixin.qq.com/sns/userinfo?access_token=' + response.data.access_token + '&openid=' + response.data.openid + '&lang=zh_CN');
                //var response_info = await axios.get('https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + wechat.access_token + '&openid=' + response.data.openid + '&lang=zh_CN');
                if (response_info.data.openid == null || response_info.data.openid == undefined) {
                    var response_info = await axios.get('https://api.weixin.qq.com/sns/userinfo?access_token=' + response.data.access_token + '&openid=' + response.data.openid + '&lang=zh_CN');
                    //var response_info = await axios.get('https://api.weixin.qq.com/cgi-bin/user/info?access_token=' + wechat.access_token + '&openid=' + response.data.openid + '&lang=zh_CN');
                }
            }


        }
        var WechatUserInfo = {};
        WechatUserInfo['wechat'] = response.data;
        WechatUserInfo['info'] = response_info.data;
        return WechatUserInfo;
    }

}