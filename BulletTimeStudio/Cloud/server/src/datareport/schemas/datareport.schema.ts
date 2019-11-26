import * as mongoose from "mongoose";

export const DatareportSchema = new mongoose.Schema({
    activity_id: String,
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

