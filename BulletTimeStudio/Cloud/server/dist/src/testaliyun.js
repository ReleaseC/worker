"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
var request = require('request');
var url = require('url');
var crypto = require('crypto');
var date = new Date().toUTCString();
var express = require('express');
var ak_id = 'LTAIAHvYCJg3q0sp';
var ak_secret = 'EOPCMRjjW3mDC8MFV4LSwAMEiMKVny';
var app = express();
let Aliyun = class Aliyun {
    test123() {
        var signature;
        var stringToSign = "123abc";
        let res = crypto.createHmac('sha1', "234").update(stringToSign).digest().toString('base64');
        console.log("res:", res);
    }
    testAliyun(obj, getMsg) {
        var options = {
            url: 'https://dtplus-cn-shanghai.data.aliyuncs.com/face/attribute',
            method: 'POST',
            body: obj,
            headers: {
                'accept': 'application/json',
                'content-type': 'application/json',
                'date': date,
                'Authorization': ''
            }
        };
        function md5(buffer) {
            var hash;
            hash = crypto.createHash('md5');
            hash.update(buffer);
            return hash.digest('base64');
        }
        ;
        function sha1(stringToSign, secret) {
            var signature;
            return signature = crypto.createHmac('sha1', secret).update(stringToSign).digest().toString('base64');
        }
        ;
        var body = options.body || '';
        var bodymd5;
        if (body === void 0 || body === '') {
            bodymd5 = body;
        }
        else {
            bodymd5 = md5(new Buffer(body));
        }
        console.log(bodymd5);
        var stringToSign = options.method + '\n' + options.headers.accept + '\n' + bodymd5 + '\n' + options.headers['content-type'] + '\n' + options.headers.date + '\n' + url.parse(options.url).path;
        console.log('step1-Sign string:', stringToSign);
        var signature = sha1(stringToSign, ak_secret);
        var authHeader = 'Dataplus ' + ak_id + ':' + signature;
        console.log('step3-authorization Header:', authHeader);
        options.headers.Authorization = authHeader;
        console.log('authHeader', authHeader);
        function callback(error, response, body) {
            getMsg(error, response, body);
        }
        request(options, callback);
    }
};
Aliyun = __decorate([
    common_1.Component()
], Aliyun);
exports.Aliyun = Aliyun;
//# sourceMappingURL=testaliyun.js.map