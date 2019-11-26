import * as mongoose from 'mongoose';

export const PartnerSchema = new mongoose.Schema({
    gid: String,
    uid: String,
    fid: String,
    action: String,
    activity_id: String,
    timestamp: String,
    type: String,
    param: Object,
    create_time: String,
});
