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
const httpclient_interface_1 = require("./httpclient.interface");
const HttpClientConfig = require('./config.json');
const OSS = require('ali-oss');
class HttpClient {
    constructor() {
        this.client = new OSS(HttpClientConfig);
    }
    static getInstance() {
        return HttpClient.INSTANCE || (HttpClient.INSTANCE = new HttpClient());
    }
    useBucket(bucket) {
        this.bucket != bucket && (this.bucket = bucket) && this.client.useBucket(bucket);
    }
    list(options, callback, bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            this.useBucket(bucket || httpclient_interface_1.HttpClientBuckets.PRIVATE_BUCKET);
            yield this.client.list(options)
                .then(callback.onSuccess)
                .catch(callback.onError);
        });
    }
    put(originFileName, localFileName, callback, bucket) {
        this.useBucket(bucket || httpclient_interface_1.HttpClientBuckets.PUBLIC_BUCKET);
        this.client.put(originFileName, localFileName)
            .then(callback.onSuccess)
            .catch(callback.onError);
    }
    breakPointUpload(originFileName, localFileName, callback, times, bucket) {
        this.useBucket(bucket || httpclient_interface_1.HttpClientBuckets.PUBLIC_BUCKET);
        times = (times != undefined ? times : 5);
        let checkpoint;
        this.client.multipartUpload(originFileName, localFileName, {
            checkpoint,
            progress(percentage, cpt) {
                return __awaiter(this, void 0, void 0, function* () {
                    checkpoint = cpt;
                    callback.onProgress && callback.onProgress(percentage);
                });
            }
        }).then(callback.onSuccess).catch(err => {
            if (times-- > 0) {
                console.log(`上传失败，正在重试第${5 - times}次: ${localFileName}`);
                this.breakPointUpload(originFileName, localFileName, callback, times);
            }
            else {
                callback.onError(err);
            }
        });
    }
    get(originFileName, localFileName, callback, times, bucket) {
        return __awaiter(this, void 0, void 0, function* () {
            this.useBucket(bucket || httpclient_interface_1.HttpClientBuckets.PRIVATE_BUCKET);
            times = times == undefined ? 5 : times;
            console.log(`正在下载： ${originFileName}`);
            yield this.client.get(originFileName, localFileName)
                .then(callback.onSuccess)
                .catch(err => {
                if (times-- > 0) {
                    console.log(`下载失败，正在重试第${5 - times}次: ${originFileName}`);
                    this.get(originFileName, localFileName, callback, times);
                }
                else {
                    callback.onError(err);
                }
            });
        });
    }
    delete(originFileName, callback, bucket) {
        this.useBucket(bucket || httpclient_interface_1.HttpClientBuckets.PUBLIC_BUCKET);
        this.client.delete(originFileName)
            .then(callback.onSuccess)
            .catch(callback.onError);
    }
}
HttpClient.INSTANCE = null;
exports.default = HttpClient.getInstance();
//# sourceMappingURL=httpclient.js.map