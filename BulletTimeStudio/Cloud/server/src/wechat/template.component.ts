import { WeChatInfo } from '../common/wechat.component';
import axios from 'axios';
var JsonDB = require('node-json-db');

export class Template {

    static get_time() {
        var now = new Date();
        var year = now.getFullYear();       //年  
        var month = now.getMonth() + 1;     //月  
        var day = now.getDate();            //日   
        var clock = year + "-";
        if (month < 10)
            clock += "0";
        clock += month + "-";
        if (day < 10)
            clock += "0";
        clock += day;
        return clock;
    }
    //通知用户已预约
    static async  reserve(data) {
        var clock = this.get_time()
        let access_DB = new JsonDB('./db/access_token.json', true, false);
        var wechat = access_DB.getData('/access');
        var body = {
            "touser": data.openid,
            "template_id": WeChatInfo['0001'].template.appointment,
            "url": "",
            "miniprogram": {
                "appid": "",
                "pagepath": ""
            },
            "data": {
                "first": {
                    "value": data.nickname + "，你好，欢迎您来到hello Kitty主题公园，您已经成功预约并拍摄时光子弹纪念视频。",
                    "color": "#173177"
                },
                "productType": {
                    "value": 'hello Kitty纪念视频',
                    "color": "#173177"
                },
                "name": {
                    "value": "时光子弹特色视频拍摄",
                    "color": "#173177"
                },
                "number": {
                    "value": "1",
                    "color": "#173177"
                },
                "expDate": {
                    "value": clock,
                    "color": "#173177"
                },
                "remark": {
                    "value": "定格瞬间，我们将尽快将时光子弹纪念视频发送给您。",
                    "color": "#173177"
                }
            }
        };
        var access_token = wechat.access_token;
        let response = await axios.post("https://api.weixin.qq.com/cgi-bin/message/template/send?access_token=" + access_token, body);
        if (response.data) {

        }
        console.log(response.data)
        return body;
    }

    //得到优惠券通知
    static async get_tickets(data, ticket) {
        var clock = this.get_time()
        var body = {
            "touser": data.wechat.openid,
            "template_id": WeChatInfo['0001'].template.get_tickets,
            "url": "",
            "miniprogram": {
                "appid": "",
                "pagepath": ""
            },
            "data": {
                "first": {
                    "value": data.info.nickname + ",你好,感谢你领取门店消费优惠券。",
                    "color": "#173177"
                },
                "keyword1": {
                    "value": ticket.tickets[0],
                    "color": "#173177"
                },
                "keyword2": {
                    "value": clock,
                    "color": "#173177"
                },
                "remark": {
                    "value": "点击详情，查看你的优惠券使用门店及使用规则，优惠券30天内有效，请注意使用。",
                    "color": "#173177"
                }
            }
        };
        return body;
    }

}
