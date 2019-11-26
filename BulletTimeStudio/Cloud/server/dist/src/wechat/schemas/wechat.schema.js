"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.WechatSchema = new mongoose.Schema({
    wechat: Object,
    info: Object,
    source: String,
    time: String,
    videoNames: Object,
    gameInfo: Object,
    likes: Object
});
//# sourceMappingURL=wechat.schema.js.map