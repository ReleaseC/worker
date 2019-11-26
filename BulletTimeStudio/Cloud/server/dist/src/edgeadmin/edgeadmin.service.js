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
const HttpRequest = require('ufile').HttpRequest;
const AuthClient = require('ufile').AuthClient;
var JsonDB = require('node-json-db');
var mongoose = require("mongoose");
let EdgeadminService = class EdgeadminService {
    adjust_data(data) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = new ret_component_1.RetObject;
            console.log(data);
            var fs = require('fs');
            var xlsx = require('node-xlsx');
            var datas = [];
            var data0 = ["", "center", "top"];
            var data1 = [16, "", ""];
            for (var i = 0; i < 17; i++) {
                if (i == 0) {
                    datas.push(data0);
                }
                else if (i == 16) {
                    console.log(16);
                    datas.push(data1);
                }
                else {
                    let a = data[i - 1];
                    datas.push([i, a[0][0] + ', ' + a[0][1], a[1][0] + ', ' + a[1][1]]);
                }
            }
            writeXls(datas);
            function writeXls(datas) {
                var buffer = xlsx.build([
                    {
                        name: 'sheet1',
                        data: datas
                    }
                ]);
                fs.writeFileSync("./excel/1.xlsx", buffer, { 'flag': 'w' });
            }
            const bucket = 'eee', key = "0013/adjust.xlsx", file_path = "./excel/1.xlsx", method = 'PUT', url_path_params = '/' + key;
            const req = new HttpRequest(method, url_path_params, bucket, key, file_path);
            const client = new AuthClient(req);
            client.SendRequest(callback);
            function callback(res) {
                if (res instanceof Error) {
                    console.log(res);
                }
                else {
                    console.log("上传成功");
                }
            }
            ret.code = 1;
            return ret;
        });
    }
};
EdgeadminService = __decorate([
    common_1.Component()
], EdgeadminService);
exports.EdgeadminService = EdgeadminService;
//# sourceMappingURL=edgeadmin.service.js.map