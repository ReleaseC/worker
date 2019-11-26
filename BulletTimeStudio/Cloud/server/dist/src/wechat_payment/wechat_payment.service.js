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
const db_service_1 = require("../common/db.service");
const db_tools_1 = require("../common/db.tools");
var sd = require('silly-datetime');
const tenpay = require('tenpay');
const config = {
    appid: 'wxb0c9caded7e8fc8d',
    mchid: '1493786962',
    partnerKey: 'D0A3F589989F8C38226A177A2BF6BB82',
    pfx: require('fs').readFileSync('./src/wechat_payment/apiclient_cert.p12'),
    notify_url: 'https://bt.siiva.com/wechat_payment/notify_wechatpay',
    spbill_create_ip: '106.75.216.70'
};
let Tenpay = new tenpay(config);
let WechatPaymentService = class WechatPaymentService {
    create_wechatpay(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            console.log(data);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            var paytime = sd.format(new Date(), 'YYYYMMDDHHmm');
            var nowtime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
            var out_trade_no = paytime + Math.random().toString().substr(2, 10);
            var total_fee = data.total_fee * 100;
            var body = '子弹时间短视频';
            var openid = data.openid;
            var templates = data.templates;
            var siteId = data.siteId;
            var taskId = data.taskId;
            try {
                yield db_service_1.order.findOne({ 'openid': data.openid, "out_trade_no": out_trade_no, 'is_pay': 1 }, function (err, data) {
                    if (err) {
                        console.log(err);
                    }
                    if (data) {
                        ret.code = 0;
                        console.log(data);
                    }
                    else {
                        ret.code = 1;
                        console.log('没有记录，需要存一下');
                        var Order = new db_service_1.order({ 'openid': openid, 'order_id': out_trade_no, 'is_pay': 0, 'total_fee': total_fee, "templates": templates, "siteId": siteId, 'time': nowtime, "taskId": taskId });
                        Order.save();
                        ret.code = 0;
                    }
                });
            }
            catch (error) {
                console.log(error);
            }
            console.log(total_fee);
            console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
            if (ret.code === 0) {
                let dbSite = yield db_service_1.dbSiteSetting.findOne({ siteId: data.siteId });
                console.log(`如果PaymentConfig字段被配置了，则使用该字段，否则使用默认的配置`);
                console.log(`dbSite = `);
                console.log(dbSite);
                console.log(`dbSite.PaymentConfig = `);
                console.log(dbSite.paymentConfig);
                console.log(`dbSite.paymentConfig.wechat = `);
                console.log(dbSite.paymentConfig.wechat);
                if (dbSite && dbSite.paymentConfig && dbSite.paymentConfig.wechat) {
                    dbSite.paymentConfig.wechat.pfx = require('fs').readFileSync('./src/wechat_payment/apiclient_cert_hellokitty.p12');
                    Tenpay = new tenpay(dbSite.paymentConfig.wechat);
                    console.log(`dbSite.wechatPaymentConfig = ${dbSite.paymentConfig.wechat}`);
                }
                console.log('Tenpay 中间层 = ');
                console.log(Tenpay.middlewareForExpress('pay'));
                console.log(`Tenpay = ${Tenpay}`);
                console.log(Tenpay);
                let result = yield Tenpay.getPayParams({
                    out_trade_no: out_trade_no,
                    body: body,
                    total_fee: total_fee,
                    openid: openid
                });
                console.log(result);
                result['orderid'] = out_trade_no;
                ret.result = result;
            }
            return ret;
        });
    }
    create_ticket_order(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                let orderId = sd.format(new Date(), 'YYYYMMDDHHmm') + Math.random().toString().substr(2, 10);
                let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
                yield db_service_1.order.update({ taskId: data.taskId, openid: data.openId, siteId: data.siteId }, {
                    order_id: orderId,
                    is_pay: 1,
                    templates: ["2.mov"],
                    total_fee: 0,
                    time
                }, { upsert: true }, (err, raw) => ret = db_tools_1.dbTools.execSQLCallback({
                    method: 'create',
                    err,
                    raw,
                    fileName: "wechat_payment.service.ts",
                    funcName: "create_ticket_order"
                }));
                ret.code = 0;
            }
            catch (error) {
                ret.code = 2;
                ret.description = `模拟创建包票用户订单失败: ${error}`;
            }
            return ret;
        });
    }
    is_pay(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            try {
                yield db_service_1.order.findOne({ 'openid': data.openid, 'is_pay': 1 }, function (err, data) {
                    if (err) {
                        ret.code = 1;
                    }
                    if (data) {
                        ret.code = 0;
                    }
                    else {
                        ret.code = 1;
                    }
                });
            }
            catch (error) {
                ret.code = 1;
            }
            return ret;
        });
    }
    update_pay_state(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(`data.openid = ${data.openid}, data.orderid = ${data.orderid}`);
                yield db_service_1.order.update({ 'openid': data.openid, 'order_id': data.orderid, 'is_pay': 0 }, { $set: { 'is_pay': 1 } });
                return { code: 0 };
            }
            catch (error) {
                console.log(error);
                return { code: 1, msg: error.toString() };
            }
        });
    }
    get_order_list(siteId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var orders = yield db_service_1.order.find({ siteId, is_pay: 1 });
            if (orders !== null) {
                ret.code = 0;
                ret.result = orders;
            }
            else {
                ret.code = 1;
                ret.description = "no this siteId'orders";
            }
            return ret;
        });
    }
    get_users_order(siteId, openid, taskId) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            var orders = yield db_service_1.order.find({ "siteId": siteId, "openid": openid, "taskId": taskId });
            if (orders !== null) {
                ret.code = 0;
                ret.result = orders;
            }
            else {
                ret.code = 1;
                ret.description = "no this siteId'orders";
            }
            return ret;
        });
    }
};
WechatPaymentService = __decorate([
    common_1.Component()
], WechatPaymentService);
exports.WechatPaymentService = WechatPaymentService;
//# sourceMappingURL=wechat_payment.service.js.map