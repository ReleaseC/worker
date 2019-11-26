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
const redis = require('redis');
const bluebird = require("bluebird");
const client = bluebird.promisifyAll(redis.createClient());
class RedisService {
    static setCache(key, data) {
        client.set(key, data);
    }
    static getCache(key) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield client.getAsync(key);
        });
    }
}
exports.RedisService = RedisService;
//# sourceMappingURL=redis.service.js.map