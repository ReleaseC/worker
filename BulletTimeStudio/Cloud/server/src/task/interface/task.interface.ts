import { Document } from 'mongoose';

export enum TASK_STATE {
  CREATE = 'create',
  UPLOADING = 'uploading',
  DATA_READY = 'data.ready',
  START = 'start',
  ABORT = 'abort',
  COMPLETE = 'complete',
  EFFECT = 'effect',
  EFFECT_FINISH = 'effect.finish',
  CANCELLED = 'cancel'
}

export interface Task extends Document {
  readonly task: Object;
  readonly state: TASK_STATE;
  readonly workerId: String;
  readonly createdAt: String;
  updatedAt: String;
  msg: String
}
