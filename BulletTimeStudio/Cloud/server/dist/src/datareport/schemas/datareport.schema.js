"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.DatareportSchema = new mongoose.Schema({
    taskId: String,
    siteId: String,
    templateId: String,
    time: String,
    visit: Number,
    download: Number,
    play: Number,
    like: Number,
    share: Number
});
//# sourceMappingURL=datareport.schema.js.map