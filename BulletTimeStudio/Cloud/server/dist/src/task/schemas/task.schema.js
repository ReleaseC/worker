"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.TaskSchema = new mongoose.Schema({
    task: Object,
    state: String,
    workerId: String,
    createdAt: String,
    updatedAt: String,
    msg: String
});
//# sourceMappingURL=task.schema.js.map