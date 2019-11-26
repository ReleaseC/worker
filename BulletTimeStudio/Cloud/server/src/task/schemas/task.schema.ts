import * as mongoose from 'mongoose';
import { TASK_STATE } from '../interface/task.interface';

export const TaskSchema = new mongoose.Schema({
    task: Object,
    state: String,
    workerId: String,
    createdAt: String,
    updatedAt: String,
    msg: String
});
