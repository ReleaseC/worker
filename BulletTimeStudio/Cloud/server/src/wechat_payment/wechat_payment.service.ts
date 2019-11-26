import { Component, Inject, Controller, Get, Post, Res, Body, Response, Param, Query, HttpStatus, HttpException, Req } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { RetObject } from '../common/ret.component';
import { order, dbSiteSetting } from '../common/db.service';
import { dbTools } from '../common/db.tools';

var sd = require('silly-datetime');
const tenpay = require('tenpay');
const config = {
    appid: 'wxb0c9caded7e8fc8d',
    mchid: '1493786962',
    partnerKey: 'D0A3F589989F8C38226A177A2BF6BB82',
    pfx: require('fs').readFileSync('./src/wechat_payment/apiclient_cert.p12'),
    // notify_url: 'https://bt.siiva.com/wechat_payment/notify_wechatpay',
    // spbill_create_ip: '106.75.216.70'
    notify_url: 'https://api.siiva.com/wxpay/notify',
    spbill_create_ip: '101.37.151.52'
};
// 方式一
let Tenpay = new tenpay(config);
@Component()
export class WechatPaymentService {
    // server: any;

    async create_wechatpay(data) {
        let ret: RetObject = new RetObject;
        // 沙盒模式(用于微信支付验收)
        // const sandboxAPI = await tenpay.sandbox(config);
        // console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>")
        var paytime = sd.format(new Date(), 'YYYYMMDDHHmm');
        var nowtime = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss')
        var out_trade_no = paytime + Math.random().toString().substr(2, 10);
        var total_fee = data.total_fee * 100;
        var body = '子弹时间短视频';
        var openid = data.openid;
        var templates = data.templates;
        var siteId = data.siteId;
        var taskId = data.taskId;
        var uid = data.uid;
        var seller = data.seller;
        var activity_id = data.activity_id;
        ret.code = 0
        try {
            await order.findOne({ 'openid': data.openid, "out_trade_no": out_trade_no, 'is_pay': 1 }, async function (err, res) {
                console.log('order_data:', res)
                if (err) {
                    console.log(err);
                }
                if (res) {
                    ret.code = 0;
                    console.log('进来了-------------->')
                } else {
                    ret.code = 0; // 原来是1
                    console.log('没有记录，需要存一下');
                    var Order = new order({ 'openid': openid, 'order_id': out_trade_no, 'is_pay': 0, 'total_fee': total_fee, "templates": templates, "siteId": siteId, 'time': nowtime, "taskId": taskId, "uid":uid, "seller":seller, "activity_id": activity_id});
                    let saveRes = await Order.save();
                    // ret.code = 0;
                }

            })

        }
        catch (error) {
            console.log(error)
        }
        console.log(total_fee)
        console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<")
        if (ret.code === 0) {

            let dbSite = await dbSiteSetting.findOne({ siteId: data.siteId });
            // 如果wechatPaymentConfig字段被配置了，则使用该字段，否则使用默认的配置
            // console.log(`如果PaymentConfig字段被配置了，则使用该字段，否则使用默认的配置`);
            // console.log(`dbSite = `);
            // console.log(dbSite);
            // console.log(`dbSite.PaymentConfig = `);
            // console.log(dbSite.paymentConfig);
            // console.log(`dbSite.paymentConfig.wechat = `);
            // console.log(dbSite.paymentConfig.wechat);
            if (dbSite && dbSite.paymentConfig && dbSite.paymentConfig.wechat) {
                dbSite.paymentConfig.wechat.pfx = require('fs').readFileSync('./src/wechat_payment/apiclient_cert_hellokitty.p12');
                Tenpay = new tenpay(dbSite.paymentConfig.wechat);
                // console.log(`dbSite.wechatPaymentConfig = ${dbSite.paymentConfig.wechat}`);
            }
            // console.log('Tenpay 中间层 = ');
            // console.log(Tenpay.middlewareForExpress('pay'));
            // console.log(`Tenpay = ${Tenpay}`);
            // console.log(Tenpay);
            let result = await Tenpay.getPayParams({
                out_trade_no: out_trade_no,
                body: body,
                total_fee: total_fee,
                openid: openid
            });
            // console.log(result)
            result['orderid'] = out_trade_no;
            ret.result = result;

        }
        console.log('到外面的return')
        return ret;
    }


    /**
     * @param data { siteId: String, openId: String, taskId: String }
     */
    async create_ticket_order(data) {
        let ret: RetObject = new RetObject;

        try {
            let orderId = sd.format(new Date(), 'YYYYMMDDHHmm') + Math.random().toString().substr(2, 10);
            let time = sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');

            await order.update({taskId: data.taskId, openid: data.openId, siteId: data.siteId}, {
                order_id: orderId,
                is_pay: 1,
                templates: ["2.mov"],
                total_fee: 0,
                time
            }, {upsert: true},(err, raw) => ret = dbTools.execSQLCallback({
                method: 'create',
                err,
                raw,
                fileName: "wechat_payment.service.ts",
                funcName: "create_ticket_order"
            }));
            ret.code = 0;
        } catch (error) {
            ret.code = 2;
            ret.description = `模拟创建包票用户订单失败: ${error}`;
        }

        return ret;
    }

    async is_pay(data) {
        let ret: RetObject = new RetObject;
        try {
            await order.findOne({ 'openid': data.openid, 'is_pay': 1 }, function (err, data) {
                if (err) {
                    ret.code = 1;
                }
                if (data) {
                    ret.code = 0;
                } else {
                    ret.code = 1;
                }
            });
        }
        catch (error) {
            ret.code = 1;
        }

        return ret;
    }

    async update_pay_state(data) {
        try {
            console.log(`data.openid = ${data.openid}, data.orderid = ${data.orderid}`);
            await order.update({ 'openid': data.openid, 'order_id': data.orderid, 'is_pay': 0 }, { $set: { 'is_pay': 1 } });
            return { code: 0 }
        }
        catch (error) {
            console.log(error)
            return { code: 1, msg: error.toString() }
        }
    }

    //订单相关接口
    async get_order_list(siteId) {
        let ret: RetObject = new RetObject;
        var orders = await order.find({siteId, is_pay: 1});
        if (orders !== null) {
            ret.code = 0;
            ret.result = orders;
        } else {
            ret.code = 1;
            ret.description = "no this siteId'orders";
        }
        return ret;

    }

    //订单相关接口
    async get_users_order(siteId, openid, taskId) {
        let ret: RetObject = new RetObject;
        var orders = await order.find({ "siteId": siteId, "openid": openid, "taskId": taskId });
        if (orders !== null) {
            ret.code = 0;
            ret.result = orders;
        } else {
            ret.code = 1;
            ret.description = "no this siteId'orders";
        }
        return ret;

    }
}