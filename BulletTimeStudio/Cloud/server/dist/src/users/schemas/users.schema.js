"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.UsersSchema = new mongoose.Schema({
    wechat: Object,
    game_id: String,
    name: String,
    game_time: String,
    is_video: Number,
    source: String,
    likes: Number
});
//# sourceMappingURL=users.schema.js.map