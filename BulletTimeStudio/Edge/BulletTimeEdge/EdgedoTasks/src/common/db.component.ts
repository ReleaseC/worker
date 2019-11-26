const mongoose = require("mongoose");

const db = mongoose.createConnection('mongodb://localhost/bt_local_server_tasks');

export const taskMonSchema = new mongoose.Schema({
    status: String,
    site_id: String,
    task_id: String,
    user_id: String,
    video_path: Object,
    node: String,
    date: String,
    msg: String,
    retryCount: Number
});

export const frameUploadTask = db.model('frame_upload_tasks', taskMonSchema);

// Sync TASK_STATE with Cloud/server
export enum TASK_STATE {
    CREATE = 'create',
    UPLOADING = 'uploading',
    DATA_READY = 'data.ready',
    START = 'start',
    ABORT = 'abort',
    COMPLETE = 'complete',
    DELETE = 'delete'
}