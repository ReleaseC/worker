"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.ActivitySchema = new mongoose.Schema({
    activityId: String,
    activityName: String,
    group: String,
    address: String,
    mark: String,
    createdAt: String,
    visits: Array
});
//# sourceMappingURL=activity.schema.js.map