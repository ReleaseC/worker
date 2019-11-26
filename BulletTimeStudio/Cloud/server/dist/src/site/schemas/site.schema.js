"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.SitesSchema = new mongoose.Schema({
    siteId: String,
    name: String,
    type: String,
    param: Object,
    source: Object,
    output: Object,
    workerId: String,
    accessToken: String,
    expireTime: String,
    template: Object
});
//# sourceMappingURL=site.schema.js.map